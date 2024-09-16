/**
 * @file tests/ipv4/validation.test.ts
 * @description Unit tests for the IPv4 address validation function with detailed logging.
 */

import { expect, describe, it } from 'bun:test';
import { validateIPv4, ipv4ToBitflag, bitflagToIPv4 } from '@src/ipv4/util/validate';
import { validAddresses, invalidAddresses } from '@test/ip-dataset';
import type { IPv4Address } from '@src/types';
import fs from 'fs';

// Function to log detailed results
function logDetailedResults(title: string, results: { ip: string; result: boolean; reason?: string }[]) {
  console.log(`\n${title}:`);
  results.forEach(({ ip, result, reason }) => {
    console.log(`  ${ip}: ${result ? 'PASS' : 'FAIL'}${reason ? ` (${reason})` : ''}`);
  });
}

// Function to write results to a file
function writeResultsToFile(filename: string, results: { ip: string; result: boolean; reason?: string }[]) {
  const content = results.map(({ ip, result, reason }) => 
    `${ip},${result ? 'PASS' : 'FAIL'}${reason ? `,${reason}` : ''}`
  ).join('\n');
  fs.writeFileSync(filename, content);
}

describe('IPv4::Validation', () => {
  describe('IPv4::Validation::validateIPv4', () => {
    it('should validate correct IP addresses', () => {
      const results = validAddresses.map(ip => {
        const validationResult = validateIPv4(ip);
        return { ip, result: validationResult.isValid, reason: validationResult.reason };
      });

      logDetailedResults('Valid IP Address Test Results', results);
      writeResultsToFile('valid_ip_test_results.csv', results);

      const failedTests = results.filter(r => !r.result);
      expect(failedTests.length).toBe(0, `${failedTests.length} valid IP addresses failed validation`);
    });

    it('should invalidate incorrect IP addresses', () => {
      const results = invalidAddresses.map(ip => {
        const validationResult = validateIPv4(ip);
        return { ip, result: !validationResult.isValid, reason: validationResult.reason };
      });

      logDetailedResults('Invalid IP Address Test Results', results);
      writeResultsToFile('invalid_ip_test_results.csv', results);

      const failedTests = results.filter(r => !r.result);
      expect(failedTests.length).toBe(0, `${failedTests.length} invalid IP addresses were incorrectly validated`);
    });

    // ... (rest of the individual tests remain the same)

  });

  describe('IPv4::Validation::ipv4ToBitflag', () => {
    it('should convert valid IP addresses to correct bitflags', () => {
      const testCases: [IPv4Address, number][] = [
        ['192.168.1.1' as IPv4Address, 0xC0A80101],
        ['10.0.0.1' as IPv4Address, 0x0A000001],
        ['172.16.0.1' as IPv4Address, 0xAC100001],
        ['8.8.8.8' as IPv4Address, 0x08080808],
      ];

      const results = testCases.map(([ip, expected]) => {
        const result = ipv4ToBitflag(ip);
        return { 
          ip, 
          result: result === expected, 
          reason: result !== expected ? `Expected ${expected.toString(16)}, got ${result.toString(16)}` : undefined
        };
      });

      logDetailedResults('IP to Bitflag Conversion Test Results', results);
      writeResultsToFile('ip_to_bitflag_test_results.csv', results);

      const failedTests = results.filter(r => !r.result);
      expect(failedTests.length).toBe(0, `${failedTests.length} IP to bitflag conversions failed`);
    });
  });

  describe('IPv4::Validation::bitflagToIPv4', () => {
    it('should convert valid bitflags to correct IP addresses', () => {
      const testCases: [number, IPv4Address][] = [
        [0xC0A80101, '192.168.1.1' as IPv4Address],
        [0x0A000001, '10.0.0.1' as IPv4Address],
        [0xAC100001, '172.16.0.1' as IPv4Address],
        [0x08080808, '8.8.8.8' as IPv4Address],
      ];

      testCases.forEach(([bitflag, expected]) => {
        const result = bitflagToIPv4(bitflag);
        expect(result).toBe(expected, `Expected ${bitflag.toString(16)} to convert to ${expected}`);
      });
    });
  });

  describe('IPv4::Validation::RoundTripConversion', () => {
    it('should correctly round-trip convert between IP address and bitflag', () => {
      validAddresses.forEach(ip => {
        const bitflag = ipv4ToBitflag(ip as IPv4Address);
        const roundTrip = bitflagToIPv4(bitflag);
        expect(roundTrip).toBe(ip, `Round-trip conversion failed for ${ip}`);
      });
    });
  });

  describe('Bitwise::Basic::isValidChar', () => {
    const VALID_IPV4_CHARS = ['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
    it('should return true for valid IPv4 characters', () => {
      VALID_IPV4_CHARS.forEach(char => {
        expect(isValidChar(char.charCodeAt(0), VALID_IPV4_CHARS)).toBe(true);
      });
    });
  
    it('should return false for invalid characters', () => {
      expect(isValidChar('A'.charCodeAt(0), VALID_IPV4_CHARS)).toBe(false);
      expect(isValidChar('!'.charCodeAt(0), VALID_IPV4_CHARS)).toBe(false);
      expect(isValidChar(' '.charCodeAt(0), VALID_IPV4_CHARS)).toBe(false);
    });
  });
  
});