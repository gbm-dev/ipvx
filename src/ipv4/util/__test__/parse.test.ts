/**
 * @file tests/ipv4/parse.test.ts
 * @description Unit tests for IPv4 address parsing and formatting functions with detailed logging.
 */

import { expect, describe, it } from 'bun:test';
import { parseIPv4, formatIPv4, isValidChar, validateIPv4, ipToNumber, numberToIP, ipToBinary, binaryToIP } from '../parse';
import { validAddresses, invalidAddresses } from '@test/ipv4-dataset';
import type { IPv4Address, IPv4Bitflag } from '@src/types';
import { writeResultsToFile } from '@test/utils';
import { VALID_IPV4_CHARS } from '@src/ipv4/constants';
import { IPv4ValidationError } from '@src/ipv4/errors';

// Function to log detailed results
function logDetailedResults(title: string, results: { ip: string; result: boolean; reason?: string }[]) {
  console.log(`\n${title}:`);
  results.forEach(({ ip, result, reason }) => {
    console.log(`  ${ip}: ${result ? 'PASS' : 'FAIL'}${reason ? ` (${reason})` : ''}`);
  });
}

// Utility function for assertions
function assertNoFailures(failedTests: any[], errorMessage: string) {
  expect(failedTests.length).toBe(0);
  if (failedTests.length > 0) {
    console.error(errorMessage);
  }
}

describe('IPv4::Parse', () => {
  describe('IPv4::Parse::validateIPv4', () => {
    it('should validate correct IP addresses', () => {
      const results = validAddresses.map(ip => {
        const validationResult = validateIPv4(ip);
        return { ip, result: validationResult.isValid, reason: validationResult.reason };
      });

      logDetailedResults('Valid IP Address Test Results', results);
      writeResultsToFile('valid_ip_test_results.csv', results, __filename);

      const failedTests = results.filter(r => !r.result);
      assertNoFailures(failedTests, `${failedTests.length} valid IP addresses failed validation`);
    });

    it('should invalidate incorrect IP addresses', () => {
      const results = invalidAddresses.map(ip => {
        const validationResult = validateIPv4(ip);
        return { ip, result: !validationResult.isValid, reason: validationResult.reason };
      });

      logDetailedResults('Invalid IP Address Test Results', results);
      writeResultsToFile('invalid_ip_test_results.csv', results, __filename);

      const failedTests = results.filter(r => !r.result);
      assertNoFailures(failedTests, `${failedTests.length} invalid IP addresses were incorrectly validated`);
    });

    // Additional edge case tests
    it('should invalidate IP addresses with invalid characters', () => {
      const testIPs = ['192.168.1.a', '192.168.1.@', '192.168.1.1!', '192.168.1.#', '192.168.1.%'];
      testIPs.forEach(ip => {
        const validationResult = validateIPv4(ip);
        expect(validationResult.isValid).toBe(false);
        expect(validationResult.reason).toContain('Invalid character');
      });
    });

    it('should invalidate IP addresses with incorrect number of octets', () => {
      const testIPs = ['192.168.1', '192.168.1.1.1', '192.168', '192.168.1.1.1.1', '192.168.1.1.1.1.1'];
      testIPs.forEach(ip => {
        const validationResult = validateIPv4(ip);
        expect(validationResult.isValid).toBe(false);
        expect(validationResult.reason).toBe('IPv4 address must have exactly 4 octets');
      });
    });

    it('should invalidate IP addresses with empty octets', () => {
      const testIPs = ['192..1.1', '192.168..1', '192.168.1.', '.168.1.1', '...'];
      testIPs.forEach(ip => {
        const validationResult = validateIPv4(ip);
        expect(validationResult.isValid).toBe(false);
        expect(validationResult.reason).toContain('Invalid octet');
      });
    });

    it('should invalidate IP addresses with non-numeric octets', () => {
      const testIPs = ['192.168.one.1', '192.one.1.1', 'one.two.three.four'];
      testIPs.forEach(ip => {
        const validationResult = validateIPv4(ip);
        expect(validationResult.isValid).toBe(false);
        // Updated expectation to 'Invalid character' as per the implementation
        expect(validationResult.reason).toContain('Invalid character');
      });
    });

    it('should invalidate IP addresses with octets out of range', () => {
      const testIPs = ['192.168.256.1', '192.168.1.300', '192.168.-1.1', '192.168.1.-20'];
      testIPs.forEach(ip => {
        const validationResult = validateIPv4(ip);
        expect(validationResult.isValid).toBe(false);
        // Updated expectation to 'Invalid character' for negative signs
        if (ip.includes('-')) {
          expect(validationResult.reason).toContain('Invalid character');
        } else {
          expect(validationResult.reason).toContain('Octet out of range');
        }
      });
    });

    it('should invalidate IP addresses with leading zeros', () => {
      const testIPs = ['192.168.01.1', '192.168.1.001', '192.0168.1.1', '0192.168.1.1'];
      testIPs.forEach(ip => {
        const validationResult = validateIPv4(ip);
        expect(validationResult.isValid).toBe(false);
        expect(validationResult.reason).toContain('Leading zeros are not allowed');
      });
    });

    it('should validate IP addresses with single zero octets', () => {
      const testIPs = ['0.0.0.0', '192.0.2.1', '0.168.1.1', '192.168.0.1'];
      testIPs.forEach(ip => {
        const validationResult = validateIPv4(ip);
        expect(validationResult.isValid).toBe(true);
      });
    });

    it('should validate IP addresses with maximum octet values', () => {
      const testIPs = ['255.255.255.255', '255.0.0.0', '0.255.0.0', '0.0.255.0', '0.0.0.255'];
      testIPs.forEach(ip => {
        const validationResult = validateIPv4(ip);
        expect(validationResult.isValid).toBe(true);
      });
    });
  });

  describe('IPv4::Parse::parseIPv4', () => {
    it('should convert valid IP addresses to correct bitflags', () => {
      const testCases: [IPv4Address, IPv4Bitflag][] = [
        ['192.168.1.1' as IPv4Address, 0xC0A80101 as IPv4Bitflag],
        ['10.0.0.1' as IPv4Address, 0x0A000001 as IPv4Bitflag],
        ['172.16.0.1' as IPv4Address, 0xAC100001 as IPv4Bitflag],
        ['8.8.8.8' as IPv4Address, 0x08080808 as IPv4Bitflag],
        ['255.255.255.255' as IPv4Address, 0xFFFFFFFF as IPv4Bitflag],
        ['0.0.0.0' as IPv4Address, 0x00000000 as IPv4Bitflag],
      ];

      const results = testCases.map(([ip, expected]) => {
        try {
          const result = parseIPv4(ip);
          return {
            ip,
            result: result === expected,
            reason: result !== expected ? `Expected ${expected.toString(16)}, got ${result.toString(16)}` : undefined,
          };
        } catch (error) {
          return { ip, result: false, reason: (error as Error).message };
        }
      });

      logDetailedResults('IP to Bitflag Parsing Test Results', results);
      writeResultsToFile('ip_to_bitflag_parsing_test_results.csv', results, __filename);

      const failedTests = results.filter(r => !r.result);
      assertNoFailures(failedTests, `${failedTests.length} IP to bitflag parsing operations failed`);
    });

    it('should throw error for invalid IP addresses', () => {
      const testIPs = [
        '192.168.256.1',
        '192.168.1.300',
        '192.168.-1.1',
        '192.168.1.-20',
        '192.168.1.a',
        '192.168.1.1!',
        '192.168.1',
        '192.168.1.1.1',
        '192..1.1',
        '192.168..1',
        '192.168.01.1',
      ];

      testIPs.forEach(ip => {
        expect(() => parseIPv4(ip as IPv4Address)).toThrow(IPv4ValidationError);
      });
    });
  });

  describe('IPv4::Parse::formatIPv4', () => {
    it('should convert valid bitflags to correct IP addresses', () => {
      const testCases: [IPv4Bitflag, IPv4Address][] = [
        [0xC0A80101 as IPv4Bitflag, '192.168.1.1' as IPv4Address],
        [0x0A000001 as IPv4Bitflag, '10.0.0.1' as IPv4Address],
        [0xAC100001 as IPv4Bitflag, '172.16.0.1' as IPv4Address],
        [0x08080808 as IPv4Bitflag, '8.8.8.8' as IPv4Address],
        [0xFFFFFFFF as IPv4Bitflag, '255.255.255.255' as IPv4Address],
        [0x00000000 as IPv4Bitflag, '0.0.0.0' as IPv4Address],
      ];

      const results = testCases.map(([bitflag, expected]) => {
        const result = formatIPv4(bitflag);
        return {
          ip: expected,
          result: result === expected,
          reason: result !== expected ? `Expected ${expected}, got ${result}` : undefined,
        };
      });

      logDetailedResults('Bitflag to IP Formatting Test Results', results);
      writeResultsToFile('bitflag_to_ip_formatting_test_results.csv', results, __filename);

      const failedTests = results.filter(r => !r.result);
      assertNoFailures(failedTests, `${failedTests.length} bitflag to IP formatting operations failed`);
    });
  });

  describe('IPv4::Parse::RoundTripConversion', () => {
    it('should correctly round-trip convert between IP address and bitflag', () => {
      const results = validAddresses.map(ip => {
        try {
          const bitflag = parseIPv4(ip as IPv4Address);
          const roundTrip = formatIPv4(bitflag);
          return {
            ip,
            result: roundTrip === ip,
            reason: roundTrip !== ip ? `Round-trip resulted in ${roundTrip}` : undefined,
          };
        } catch (error) {
          return { ip, result: false, reason: (error as Error).message };
        }
      });

      logDetailedResults('Round-trip Conversion Test Results', results);
      writeResultsToFile('round_trip_conversion_test_results.csv', results, __filename);

      const failedTests = results.filter(r => !r.result);
      assertNoFailures(failedTests, `${failedTests.length} round-trip conversions failed`);
    });
  });

  describe('Bitwise::Basic::isValidChar', () => {
    it('should return true for valid IPv4 characters', () => {
      // Test for digits 0-9 and the dot character
      for (let i = 48; i <= 57; i++) {
        expect(isValidChar(i, VALID_IPV4_CHARS)).toBe(true);
      }
      expect(isValidChar(46, VALID_IPV4_CHARS)).toBe(true); // ASCII code for '.'
    });

    it('should return false for invalid characters', () => {
      expect(isValidChar('A'.charCodeAt(0), VALID_IPV4_CHARS)).toBe(false);
      expect(isValidChar('!'.charCodeAt(0), VALID_IPV4_CHARS)).toBe(false);
      expect(isValidChar(' '.charCodeAt(0), VALID_IPV4_CHARS)).toBe(false);
    });

    it('should correctly use VALID_IPV4_CHARS constant', () => {
      for (let i = 0; i < 256; i++) {
        const isValid = (VALID_IPV4_CHARS & (1 << i)) !== 0;
        expect(isValidChar(i, VALID_IPV4_CHARS)).toBe(isValid);
      }
    });
  });

  // Additional tests for ipToNumber and numberToIP
  describe('IPv4::Parse::ipToNumber and numberToIP', () => {
    it('should convert IP address to number and back', () => {
      const testIPs: IPv4Address[] = [
        '192.168.1.1' as IPv4Address,
        '0.0.0.0' as IPv4Address,
        '255.255.255.255' as IPv4Address,
        '127.0.0.1' as IPv4Address,
        '8.8.8.8' as IPv4Address,
      ];

      testIPs.forEach(ip => {
        const num = ipToNumber(ip);
        const ipBack = numberToIP(num);
        expect(ipBack).toBe(ip);
      });
    });

    it('should throw error for invalid IP address in ipToNumber', () => {
      const invalidIPs = ['256.0.0.1', '192.168.1', 'abc.def.ghi.jkl', '192.168.1.1.1'];
      invalidIPs.forEach(ip => {
        expect(() => ipToNumber(ip as IPv4Address)).toThrow(IPv4ValidationError);
      });
    });

    it('should throw error for invalid numbers in numberToIP', () => {
      const invalidNumbers = [-1, 0x100000000, NaN, Infinity, -Infinity];
      invalidNumbers.forEach(num => {
        expect(() => numberToIP(num)).toThrow('Invalid IPv4 numeric representation');
      });
    });
  });

  // Additional tests for ipToBinary and binaryToIP
  describe('IPv4::Parse::ipToBinary and binaryToIP', () => {
    it('should convert IP address to binary string and back', () => {
      const testIPs: IPv4Address[] = [
        '192.168.1.1' as IPv4Address,
        '0.0.0.0' as IPv4Address,
        '255.255.255.255' as IPv4Address,
        '127.0.0.1' as IPv4Address,
        '8.8.8.8' as IPv4Address,
      ];

      testIPs.forEach(ip => {
        const binary = ipToBinary(ip);
        expect(binary.length).toBe(32);
        const ipBack = binaryToIP(binary);
        expect(ipBack).toBe(ip);
      });
    });

    it('should throw error for invalid IP address in ipToBinary', () => {
      const invalidIPs = ['256.0.0.1', '192.168.1', 'abc.def.ghi.jkl', '192.168.1.1.1'];
      invalidIPs.forEach(ip => {
        expect(() => ipToBinary(ip as IPv4Address)).toThrow(IPv4ValidationError);
      });
    });

    it('should throw error for invalid binary strings in binaryToIP', () => {
      const invalidBinaries = [
        '1010101', // too short
        '1'.repeat(33), // too long
        'abcdefghij1234567890abcdefghij12', // invalid characters
        '1'.repeat(31) + '2', // invalid character '2'
      ];
      invalidBinaries.forEach(binary => {
        expect(() => binaryToIP(binary)).toThrow();
      });
    });
  });

  // Additional edge case tests
  describe('IPv4::Parse::Edge Cases', () => {
    it('should handle maximum and minimum numbers in numberToIP', () => {
      const testCases: [number, IPv4Address][] = [
        [0, '0.0.0.0' as IPv4Address],
        [0xFFFFFFFF, '255.255.255.255' as IPv4Address],
      ];
      testCases.forEach(([num, expectedIp]) => {
        const ip = numberToIP(num);
        expect(ip).toBe(expectedIp);
        const numBack = ipToNumber(ip);
        expect(numBack).toBe(num);
      });
    });

    it('should handle leading zeros in octets during parsing', () => {
      const testIPs = ['192.168.001.1', '192.168.1.001', '192.168.0001.1'];
      testIPs.forEach(ip => {
        expect(() => parseIPv4(ip as IPv4Address)).toThrow(IPv4ValidationError);
      });
    });

    it('should handle non-integer numbers in numberToIP', () => {
      const testNumbers = [1.5, 1234567890.123, -0.1];
      testNumbers.forEach(num => {
        expect(() => numberToIP(num)).toThrow('Invalid IPv4 numeric representation');
      });
    });

    it('should handle binary strings with invalid length in binaryToIP', () => {
      const testBinaries = ['1'.repeat(31), '1'.repeat(33)];
      testBinaries.forEach(binary => {
        expect(() => binaryToIP(binary)).toThrow('Invalid binary string length for IPv4 address');
      });
    });

    it('should handle binary strings with invalid characters in binaryToIP', () => {
      const testBinaries = ['1'.repeat(30) + '2' + '0', '1'.repeat(32).replace('1', 'x')];
      testBinaries.forEach(binary => {
        expect(() => binaryToIP(binary)).toThrow('Invalid character in binary string');
      });
    });
  });
});
