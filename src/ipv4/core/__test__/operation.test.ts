/**
 * @file src/ipv4/utils/__tests__/operations.test.ts
 * @description Unit tests for IPv4 operations utilities
 */

import { expect, describe, it } from 'bun:test';
import {
  ipToBitflag,
  bitflagToIP,
  incrementIP,
  decrementIP,
  ipDifference,
  isIPInRange,
  compareIPs,
  isClassfulNetwork,
  getDefaultSubnetMask,
} from '../operation';
import type { IPv4Address, IPv4Bitflag } from '@src/types';
import { IPv4OperationError } from '@src/ipv4/error';
import {
  assertIPv4Address,
  assertIPv4Bitflag,
  convertIPv4AddressToString,
  convertIPv4BitflagToNumber, // Import the new helper function
} from '../../util/helper'; // Corrected import path

describe('IPv4 Operations Utilities', () => {
  describe('ipToBitflag', () => {
    it('should correctly convert IP addresses to bitflags', () => {
      const testCases: [string, number][] = [
        ['0.0.0.0', 0x00000000],
        ['255.255.255.255', 0xFFFFFFFF],
        ['192.168.1.1', 0xC0A80101],
        ['10.0.0.1', 0x0A000001],
        ['172.16.0.1', 0xAC100001],
      ];

      testCases.forEach(([address, expected]) => {
        const ip = assertIPv4Address(address);
        const result = ipToBitflag(ip);
        const resultNumber = convertIPv4BitflagToNumber(result); // Convert to number
        expect(resultNumber).toBe(expected); // Compare numbers
      });
    });

    it('should handle IP addresses with leading zeros', () => {
      const testCases: [string, number][] = [
        ['192.168.001.001', 0xC0A80101],
        ['010.000.000.001', 0x0A000001],
      ];

      testCases.forEach(([address, expected]) => {
        const ip = assertIPv4Address(address);
        const result = ipToBitflag(ip);
        const resultNumber = convertIPv4BitflagToNumber(result); // Convert to number
        expect(resultNumber).toBe(expected); // Compare numbers
      });
    });

    it('should throw an error for invalid IP addresses', () => {
      const invalidIPs = ['256.256.256.256', '192.168.1', 'abc.def.ghi.jkl'];
      invalidIPs.forEach((address) => {
        expect(() => assertIPv4Address(address)).toThrow('Invalid IPv4 address');
      });
    });
  });

  describe('bitflagToIP', () => {
    it('should correctly convert bitflags to IP addresses', () => {
      const testCases: [number, string][] = [
        [0x00000000, '0.0.0.0'],
        [0xFFFFFFFF, '255.255.255.255'],
        [0xC0A80101, '192.168.1.1'],
        [0x0A000001, '10.0.0.1'],
        [0xAC100001, '172.16.0.1'],
      ];

      testCases.forEach(([flag, expected]) => {
        const bitflag = assertIPv4Bitflag(flag);
        const result = bitflagToIP(bitflag);
        const resultString = convertIPv4AddressToString(result); // Convert to string
        expect(resultString).toBe(expected); // Compare strings
      });
    });

    it('should handle boundary bitflags', () => {
      const testCases: [number, string][] = [
        [0x00000000, '0.0.0.0'],
        [0xFFFFFFFF, '255.255.255.255'],
      ];

      testCases.forEach(([flag, expected]) => {
        const bitflag = assertIPv4Bitflag(flag);
        const result = bitflagToIP(bitflag);
        const resultString = convertIPv4AddressToString(result); // Convert to string
        expect(resultString).toBe(expected); // Compare strings
      });
    });

    it('should throw an error for invalid bitflags', () => {
      const invalidBitflags = [-1, 0x100000000, NaN, Infinity];
      invalidBitflags.forEach((flag) => {
        expect(() => assertIPv4Bitflag(flag)).toThrow('Invalid IPv4 bitflag');
      });
    });
  });

  describe('incrementIP', () => {
    it('should increment IP addresses by the default amount (1)', () => {
      const testCases: [string, string][] = [
        ['192.168.1.1', '192.168.1.2'],
        ['255.255.255.254', '255.255.255.255'],
        ['0.0.0.0', '0.0.0.1'],
        ['10.0.0.1', '10.0.0.2'],
      ];

      testCases.forEach(([address, expected]) => {
        const ip = assertIPv4Address(address);
        const result = incrementIP(ip);
        const resultString = convertIPv4AddressToString(result); // Convert to string
        expect(resultString).toBe(expected); // Compare strings
      });
    });

    it('should increment IP addresses by a specified amount', () => {
      const testCases: [string, number, string][] = [
        ['192.168.1.1', 5, '192.168.1.6'],
        ['10.0.0.250', 10, '10.0.1.4'],
        ['172.16.0.1', 255, '172.16.1.0'],
      ];

      testCases.forEach(([address, amount, expected]) => {
        const ip = assertIPv4Address(address);
        const result = incrementIP(ip, amount);
        const resultString = convertIPv4AddressToString(result); // Convert to string
        expect(resultString).toBe(expected); // Compare strings
      });
    });

    it('should throw IPv4OperationError when incrementing beyond 255.255.255.255', () => {
      const ip = assertIPv4Address('255.255.255.255');
      expect(() => incrementIP(ip)).toThrow(
        'Increment operation results in an invalid IPv4 address'
      );
    });

    it('should handle large increment amounts correctly', () => {
      const testCases: [string, number, string][] = [
        ['192.168.1.1', 1000, '192.168.4.233'], // Corrected expected value
        ['10.0.0.1', 65535, '10.1.0.0'],        // Corrected expected value
      ];

      testCases.forEach(([address, amount, expected]) => {
        const ip = assertIPv4Address(address);
        const result = incrementIP(ip, amount);
        const resultString = convertIPv4AddressToString(result); // Convert to string
        expect(resultString).toBe(expected); // Compare strings
      });
    });

    it('should handle incrementing by zero correctly', () => {
      const ip = assertIPv4Address('192.168.1.1');
      const result = incrementIP(ip, 0);
      const resultString = convertIPv4AddressToString(result); // Convert to string
      expect(resultString).toBe('192.168.1.1'); // Compare strings
    });

    it('should handle negative increment amounts as decrements', () => {
      const testCases: [string, number, string][] = [
        ['192.168.1.1', -1, '192.168.1.0'],
        ['10.0.0.1', -1, '10.0.0.0'],
      ];

      testCases.forEach(([address, amount, expected]) => {
        const ip = assertIPv4Address(address);
        const result = incrementIP(ip, amount);
        const resultString = convertIPv4AddressToString(result); // Convert to string
        expect(resultString).toBe(expected); // Compare strings
      });
    });

    it('should throw IPv4OperationError when incrementing by a negative amount that causes underflow', () => {
      const ip = assertIPv4Address('0.0.0.0');
      expect(() => incrementIP(ip, -1)).toThrow(
        'Increment operation results in an invalid IPv4 address'
      );
    });
  });

  describe('decrementIP', () => {
    it('should decrement IP addresses by the default amount (1)', () => {
      const testCases: [string, string][] = [
        ['192.168.1.2', '192.168.1.1'],
        ['255.255.255.255', '255.255.255.254'],
        ['0.0.0.1', '0.0.0.0'],
        ['10.0.0.2', '10.0.0.1'],
      ];

      testCases.forEach(([address, expected]) => {
        const ip = assertIPv4Address(address);
        const result = decrementIP(ip);
        const resultString = convertIPv4AddressToString(result); // Convert to string
        expect(resultString).toBe(expected); // Compare strings
      });
    });

    it('should decrement IP addresses by a specified amount', () => {
      const testCases: [string, number, string][] = [
        ['192.168.1.10', 5, '192.168.1.5'],
        ['10.0.1.4', 10, '10.0.0.250'],
        ['172.16.1.0', 256, '172.16.0.0'],
      ];

      testCases.forEach(([address, amount, expected]) => {
        const ip = assertIPv4Address(address);
        const result = decrementIP(ip, amount);
        const resultString = convertIPv4AddressToString(result); // Convert to string
        expect(resultString).toBe(expected); // Compare strings
      });
    });

    it('should throw IPv4OperationError when decrementing below 0.0.0.0', () => {
      const ip = assertIPv4Address('0.0.0.0');
      expect(() => decrementIP(ip)).toThrow(
        'Decrement operation results in an invalid IPv4 address'
      );
    });

    it('should handle large decrement amounts correctly', () => {
      const testCases: [string, number, string][] = [
        ['192.168.5.233', 1000, '192.168.2.1'],      // Corrected expected value
        ['10.0.255.255', 65535, '10.0.0.0'],        // Corrected expected value
      ];

      testCases.forEach(([address, amount, expected]) => {
        const ip = assertIPv4Address(address);
        const result = decrementIP(ip, amount);
        const resultString = convertIPv4AddressToString(result); // Convert to string
        expect(resultString).toBe(expected); // Compare strings
      });
    });

    it('should handle decrementing by zero correctly', () => {
      const ip = assertIPv4Address('192.168.1.1');
      const result = decrementIP(ip, 0);
      const resultString = convertIPv4AddressToString(result); // Convert to string
      expect(resultString).toBe('192.168.1.1'); // Compare strings
    });

    it('should handle negative decrement amounts as increments', () => {
      const testCases: [string, number, string][] = [
        ['192.168.1.0', -1, '192.168.1.1'],
        ['10.0.0.0', -1, '10.0.0.1'],
      ];

      testCases.forEach(([address, amount, expected]) => {
        const ip = assertIPv4Address(address);
        const result = decrementIP(ip, amount);
        const resultString = convertIPv4AddressToString(result); // Convert to string
        expect(resultString).toBe(expected); // Compare strings
      });
    });

    it('should throw IPv4OperationError when decrementing by a negative amount that causes overflow', () => {
      const ip = assertIPv4Address('255.255.255.255');
      expect(() => decrementIP(ip, -1)).toThrow(
        'Decrement operation results in an invalid IPv4 address'
      );
    });
  });

  describe('ipDifference', () => {
    it('should correctly calculate the difference between two IP addresses', () => {
      const testCases: [string, string, number][] = [
        ['192.168.1.1', '192.168.1.2', 1],
        ['10.0.0.1', '10.0.0.1', 0],
        ['172.16.0.1', '172.16.0.5', 4],
        ['0.0.0.0', '255.255.255.255', 4294967295],
        ['255.255.255.255', '0.0.0.0', 4294967295],
      ];

      testCases.forEach(([address1, address2, expected]) => {
        const ip1 = assertIPv4Address(address1);
        const ip2 = assertIPv4Address(address2);
        const result = ipDifference(ip1, ip2);
        expect(result).toBe(expected);
      });
    });

    it('should correctly calculate differences involving large jumps', () => {
      const testCases: [string, string, number][] = [
        ['10.0.0.1', '10.0.1.1', 256],
        ['192.168.1.1', '192.168.2.1', 256],
      ];

      testCases.forEach(([address1, address2, expected]) => {
        const ip1 = assertIPv4Address(address1);
        const ip2 = assertIPv4Address(address2);
        const result = ipDifference(ip1, ip2);
        expect(result).toBe(expected);
      });
    });
  });

  describe('isIPInRange', () => {
    it('should correctly identify IP addresses within the range', () => {
      const testCases: [string, string, string, boolean][] = [
        ['192.168.1.5', '192.168.1.1', '192.168.1.10', true],
        ['10.0.0.1', '10.0.0.1', '10.0.0.1', true],
        ['172.16.5.10', '172.16.0.0', '172.31.255.255', true],
        ['8.8.8.8', '8.8.8.0', '8.8.8.255', true],
      ];

      testCases.forEach(([ip, start, end, expected]) => {
        const ipAddress = assertIPv4Address(ip);
        const startAddress = assertIPv4Address(start);
        const endAddress = assertIPv4Address(end);
        const result = isIPInRange(ipAddress, startAddress, endAddress);
        expect(result).toBe(expected);
      });
    });

    it('should correctly identify IP addresses outside the range', () => {
      const testCases: [string, string, string, boolean][] = [
        ['192.168.1.11', '192.168.1.1', '192.168.1.10', false],
        ['10.0.0.0', '10.0.0.1', '10.0.0.10', false],
        ['172.15.255.255', '172.16.0.0', '172.31.255.255', false],
        ['8.8.9.0', '8.8.8.0', '8.8.8.255', false],
      ];

      testCases.forEach(([ip, start, end, expected]) => {
        const ipAddress = assertIPv4Address(ip);
        const startAddress = assertIPv4Address(start);
        const endAddress = assertIPv4Address(end);
        const result = isIPInRange(ipAddress, startAddress, endAddress);
        expect(result).toBe(expected);
      });
    });

    it('should handle IP addresses equal to the start or end of the range', () => {
      const testCases: [string, string, string, boolean][] = [
        ['192.168.1.1', '192.168.1.1', '192.168.1.10', true],
        ['192.168.1.10', '192.168.1.1', '192.168.1.10', true],
        ['10.0.0.1', '10.0.0.1', '10.0.0.1', true],
      ];

      testCases.forEach(([ip, start, end, expected]) => {
        const ipAddress = assertIPv4Address(ip);
        const startAddress = assertIPv4Address(start);
        const endAddress = assertIPv4Address(end);
        const result = isIPInRange(ipAddress, startAddress, endAddress);
        expect(result).toBe(expected);
      });
    });

    it('should handle invalid ranges where start > end', () => {
      const testCases: [string, string, string, boolean][] = [
        ['192.168.1.5', '192.168.1.10', '192.168.1.1', false],
        ['10.0.0.5', '10.0.0.10', '10.0.0.1', false],
      ];

      testCases.forEach(([ip, start, end, expected]) => {
        const ipAddress = assertIPv4Address(ip);
        const startAddress = assertIPv4Address(start);
        const endAddress = assertIPv4Address(end);
        const result = isIPInRange(ipAddress, startAddress, endAddress);
        expect(result).toBe(expected);
      });
    });

    it('should handle large ranges correctly', () => {
      const testCases: [string, string, string, boolean][] = [
        ['255.255.255.255', '0.0.0.0', '255.255.255.255', true],
        ['0.0.0.0', '0.0.0.0', '255.255.255.255', true],
      ];

      testCases.forEach(([ip, start, end, expected]) => {
        const ipAddress = assertIPv4Address(ip);
        const startAddress = assertIPv4Address(start);
        const endAddress = assertIPv4Address(end);
        const result = isIPInRange(ipAddress, startAddress, endAddress);
        expect(result).toBe(expected);
      });
    });
  });

  describe('compareIPs', () => {
    it('should return -1 when ip1 < ip2', () => {
      const testCases: [string, string, -1 | 0 | 1][] = [
        ['192.168.1.1', '192.168.1.2', -1],
        ['10.0.0.1', '10.0.0.2', -1],
        ['0.0.0.0', '0.0.0.1', -1],
      ];

      testCases.forEach(([ip1, ip2, expected]) => {
        const address1 = assertIPv4Address(ip1);
        const address2 = assertIPv4Address(ip2);
        const result = compareIPs(address1, address2);
        expect(result).toBe(expected);
      });
    });

    it('should return 1 when ip1 > ip2', () => {
      const testCases: [string, string, 1][] = [
        ['192.168.1.2', '192.168.1.1', 1],
        ['10.0.0.2', '10.0.0.1', 1],
        ['255.255.255.255', '255.255.255.254', 1],
      ];

      testCases.forEach(([ip1, ip2, expected]) => {
        const address1 = assertIPv4Address(ip1);
        const address2 = assertIPv4Address(ip2);
        const result = compareIPs(address1, address2);
        expect(result).toBe(expected);
      });
    });

    it('should return 0 when ip1 === ip2', () => {
      const testCases: [string, string, 0][] = [
        ['192.168.1.1', '192.168.1.1', 0],
        ['10.0.0.1', '10.0.0.1', 0],
        ['0.0.0.0', '0.0.0.0', 0],
      ];

      testCases.forEach(([ip1, ip2, expected]) => {
        const address1 = assertIPv4Address(ip1);
        const address2 = assertIPv4Address(ip2);
        const result = compareIPs(address1, address2);
        expect(result).toBe(expected);
      });
    });
  });

  describe('isClassfulNetwork', () => {
    it('should correctly identify Class A networks', () => {
      const testCases: [string, 'A'][] = [
        ['10.0.0.1', 'A'],
        ['0.0.0.0', 'A'],
        ['127.255.255.255', 'A'],
      ];

      testCases.forEach(([ip, expected]) => {
        const address = assertIPv4Address(ip);
        const result = isClassfulNetwork(address);
        expect(result).toBe(expected);
      });
    });

    it('should correctly identify Class B networks', () => {
      const testCases: [string, 'B'][] = [
        ['128.0.0.1', 'B'],
        ['150.0.0.0', 'B'],
        ['191.255.255.255', 'B'],
      ];

      testCases.forEach(([ip, expected]) => {
        const address = assertIPv4Address(ip);
        const result = isClassfulNetwork(address);
        expect(result).toBe(expected);
      });
    });

    it('should correctly identify Class C networks', () => {
      const testCases: [string, 'C'][] = [
        ['192.0.0.1', 'C'],
        ['200.100.50.25', 'C'],
        ['223.255.255.255', 'C'],
      ];

      testCases.forEach(([ip, expected]) => {
        const address = assertIPv4Address(ip);
        const result = isClassfulNetwork(address);
        expect(result).toBe(expected);
      });
    });

    it('should correctly identify Class D networks', () => {
      const testCases: [string, 'D'][] = [
        ['224.0.0.1', 'D'],
        ['230.0.0.0', 'D'],
        ['239.255.255.255', 'D'],
      ];

      testCases.forEach(([ip, expected]) => {
        const address = assertIPv4Address(ip);
        const result = isClassfulNetwork(address);
        expect(result).toBe(expected);
      });
    });

    it('should correctly identify Class E networks', () => {
      const testCases: [string, 'E'][] = [
        ['240.0.0.1', 'E'],
        ['250.100.50.25', 'E'],
        ['255.255.255.255', 'E'],
      ];

      testCases.forEach(([ip, expected]) => {
        const address = assertIPv4Address(ip);
        const result = isClassfulNetwork(address);
        expect(result).toBe(expected);
      });
    });
  });

  describe('getDefaultSubnetMask', () => {
    it('should return correct default subnet mask for Class A networks', () => {
      const testCases: [string, string][] = [
        ['10.0.0.1', '255.0.0.0'],
        ['0.0.0.0', '255.0.0.0'],
        ['127.255.255.255', '255.0.0.0'],
      ];

      testCases.forEach(([ip, expected]) => {
        const address = assertIPv4Address(ip);
        const result = getDefaultSubnetMask(address);
        const resultString = convertIPv4AddressToString(result);
        expect(resultString).toBe(expected);
      });
    });

    it('should return correct default subnet mask for Class B networks', () => {
      const testCases: [string, string][] = [
        ['128.0.0.1', '255.255.0.0'],
        ['150.0.0.0', '255.255.0.0'],
        ['191.255.255.255', '255.255.0.0'],
      ];

      testCases.forEach(([ip, expected]) => {
        const address = assertIPv4Address(ip);
        const result = getDefaultSubnetMask(address);
        const resultString = convertIPv4AddressToString(result);
        expect(resultString).toBe(expected);
      });
    });

    it('should return correct default subnet mask for Class C networks', () => {
      const testCases: [string, string][] = [
        ['192.0.0.1', '255.255.255.0'],
        ['200.100.50.25', '255.255.255.0'],
        ['223.255.255.255', '255.255.255.0'],
      ];

      testCases.forEach(([ip, expected]) => {
        const address = assertIPv4Address(ip);
        const result = getDefaultSubnetMask(address);
        const resultString = convertIPv4AddressToString(result);
        expect(resultString).toBe(expected);
      });
    });

    it('should throw IPv4OperationError for Class D networks', () => {
      const testCases: string[] = ['224.0.0.1', '230.0.0.0', '239.255.255.255'];

      testCases.forEach((ip) => {
        const address = assertIPv4Address(ip);
        expect(() => getDefaultSubnetMask(address)).toThrow(
          'No default subnet mask for this IP class'
        );
      });
    });

    it('should throw IPv4OperationError for Class E networks', () => {
      const testCases: string[] = ['240.0.0.1', '250.100.50.25', '255.255.255.255'];

      testCases.forEach((ip) => {
        const address = assertIPv4Address(ip);
        expect(() => getDefaultSubnetMask(address)).toThrow(
          'No default subnet mask for this IP class'
        );
      });
    });
  });
});
