/**
 * @file tests/ipv4/parse.test.ts
 * @description Unit tests for IPv4 address parsing and formatting functions with detailed logging.
 */

import { expect, describe, it } from 'bun:test';
import { parseIPv4, formatIPv4, isValidChar, validateIPv4 } from '../parse';
import { validAddresses, invalidAddresses } from '@test/ipv4-dataset';
import type { IPv4Address, IPv4Bitflag } from '@src/types';
import { writeResultsToFile } from '@test/utils';
import { VALID_IPV4_CHARS } from '@src/ipv4/constants';

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
  });

  describe('IPv4::Parse::parseIPv4', () => {
    it('should convert valid IP addresses to correct bitflags', () => {
      const testCases: [IPv4Address, IPv4Bitflag][] = [
        ['192.168.1.1' as IPv4Address, 0xC0A80101 as IPv4Bitflag],
        ['10.0.0.1' as IPv4Address, 0x0A000001 as IPv4Bitflag],
        ['172.16.0.1' as IPv4Address, 0xAC100001 as IPv4Bitflag],
        ['8.8.8.8' as IPv4Address, 0x08080808 as IPv4Bitflag],
      ];

      const results = testCases.map(([ip, expected]) => {
        try {
          const result = parseIPv4(ip);
          return { 
            ip, 
            result: result === expected, 
            reason: result !== expected ? `Expected ${expected.toString(16)}, got ${result.toString(16)}` : undefined
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
      invalidAddresses.forEach(ip => {
        expect(() => parseIPv4(ip as IPv4Address)).toThrow();
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
      ];

      const results = testCases.map(([bitflag, expected]) => {
        const result = formatIPv4(bitflag);
        return { 
          ip: expected, 
          result: result === expected, 
          reason: result !== expected ? `Expected ${expected}, got ${result}` : undefined
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
            reason: roundTrip !== ip ? `Round-trip resulted in ${roundTrip}` : undefined
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
});