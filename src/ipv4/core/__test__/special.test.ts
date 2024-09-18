/**
 * @file src/ipv4/special/__tests__/special.test.ts
 * @description Unit tests for IPv4 special-use address utilities
 */

import { expect, describe, it } from 'bun:test';
import {
  isPrivateIP,
  isLoopbackIP,
  isLinkLocalIP,
  isMulticastIP,
  isBroadcastIP,
  isReservedIP,
  isDocumentationIP,
  isBenchmarkingIP,
  isSharedAddressSpaceIP,
  getSpecialIPType,
  isGlobalUnicastIP,
  getSpecialIPRange,
} from '../special'; // Adjust the import path as necessary
import type { IPv4Address } from '@src/types';
import {
  assertIPv4Address,
  assertIPv4Bitflag,
} from '../../util/helper'; // Corrected import path

describe('IPv4 Special-Use Address Utilities', () => {
  
  // Helper function to safely create IPv4Address and handle errors
  const createIPv4Address = (address: string): IPv4Address => {
    try {
      return assertIPv4Address(address);
    } catch (error) {
      throw new Error(`Failed to create IPv4Address for test: ${address}`);
    }
  };

  describe('isPrivateIP', () => {
    it('should identify private IP addresses correctly', () => {
      const privateIPs = [
        '10.0.0.0',
        '10.255.255.255',
        '172.16.0.0',
        '172.31.255.255',
        '192.168.0.0',
        '192.168.255.255',
        '192.168.1.1',
      ];

      privateIPs.forEach((ipStr) => {
        const ip = createIPv4Address(ipStr);
        expect(isPrivateIP(ip)).toBe(true);
      });
    });

    it('should not identify non-private IP addresses as private', () => {
      const nonPrivateIPs = [
        '9.255.255.255',
        '11.0.0.0',
        '172.15.255.255',
        '172.32.0.0',
        '192.167.255.255',
        '192.169.0.0',
        '8.8.8.8',
        '1.1.1.1',
      ];

      nonPrivateIPs.forEach((ipStr) => {
        const ip = createIPv4Address(ipStr);
        expect(isPrivateIP(ip)).toBe(false);
      });
    });
  });

  describe('isLoopbackIP', () => {
    it('should identify loopback IP addresses correctly', () => {
      const loopbackIPs = [
        '127.0.0.0',
        '127.255.255.255',
        '127.0.0.1',
        '127.1.2.3',
      ];

      loopbackIPs.forEach((ipStr) => {
        const ip = createIPv4Address(ipStr);
        expect(isLoopbackIP(ip)).toBe(true);
      });
    });

    it('should not identify non-loopback IP addresses as loopback', () => {
      const nonLoopbackIPs = [
        '126.255.255.255',
        '128.0.0.0',
        '127.0.0.256', // Invalid but assuming it's validated elsewhere
        '192.168.1.1',
      ];

      nonLoopbackIPs.forEach((ipStr) => {
        // Skip invalid IPs since assertIPv4Address would throw
        if (ipStr.split('.').some(octet => parseInt(octet) > 255)) return;

        const ip = createIPv4Address(ipStr);
        expect(isLoopbackIP(ip)).toBe(false);
      });
    });
  });

  describe('isLinkLocalIP', () => {
    it('should identify link-local IP addresses correctly', () => {
      const linkLocalIPs = [
        '169.254.0.0',
        '169.254.255.255',
        '169.254.1.1',
      ];

      linkLocalIPs.forEach((ipStr) => {
        const ip = createIPv4Address(ipStr);
        expect(isLinkLocalIP(ip)).toBe(true);
      });
    });

    it('should not identify non-link-local IP addresses as link-local', () => {
      const nonLinkLocalIPs = [
        '169.253.255.255',
        '169.255.0.0',
        '192.168.1.1',
        '10.0.0.1',
      ];

      nonLinkLocalIPs.forEach((ipStr) => {
        const ip = createIPv4Address(ipStr);
        expect(isLinkLocalIP(ip)).toBe(false);
      });
    });
  });

  describe('isMulticastIP', () => {
    it('should identify multicast IP addresses correctly', () => {
      const multicastIPs = [
        '224.0.0.0',
        '239.255.255.255',
        '224.0.0.1',
        '225.1.2.3',
        '238.255.255.254',
      ];

      multicastIPs.forEach((ipStr) => {
        const ip = createIPv4Address(ipStr);
        expect(isMulticastIP(ip)).toBe(true);
      });
    });

    it('should not identify non-multicast IP addresses as multicast', () => {
      const nonMulticastIPs = [
        '223.255.255.255',
        '240.0.0.0',
        '192.168.1.1',
        '127.0.0.1',
      ];

      nonMulticastIPs.forEach((ipStr) => {
        const ip = createIPv4Address(ipStr);
        expect(isMulticastIP(ip)).toBe(false);
      });
    });
  });

  describe('isBroadcastIP', () => {
    it('should identify the broadcast IP address correctly', () => {
      const broadcastIP = '255.255.255.255';
      const ip = createIPv4Address(broadcastIP);
      expect(isBroadcastIP(ip)).toBe(true);
    });

    it('should not identify other IP addresses as broadcast', () => {
      const nonBroadcastIPs = [
        '255.255.255.254',
        '255.255.255.255', // Should be true, but already tested
        '192.168.1.1',
        '0.0.0.0',
      ];

      nonBroadcastIPs.forEach((ipStr) => {
        if (ipStr === '255.255.255.255') return; // Already tested
        const ip = createIPv4Address(ipStr);
        expect(isBroadcastIP(ip)).toBe(false);
      });
    });
  });

  describe('isReservedIP', () => {
    it('should identify reserved IP addresses correctly', () => {
      const reservedIPs = [
        '0.0.0.0',
        '0.255.255.255',
        '240.0.0.1',
        '255.255.255.254',
      ];
  
      reservedIPs.forEach((ipStr) => {
        const ip = createIPv4Address(ipStr);
        expect(isReservedIP(ip)).toBe(true);
      });
    });
  
    it('should not identify non-reserved IP addresses as reserved', () => {
      const nonReservedIPs = [
        '239.255.255.255',
        '255.255.255.255', // Broadcast, not reserved
        '198.51.99.255',
        '203.0.114.0',
        '192.0.3.0',
        '8.8.8.8',
        '10.0.0.1',         // Private
        '127.0.0.1',        // Loopback
        '169.254.0.1',      // Link-local
        '192.168.1.1',      // Private
        '198.18.0.1',       // Benchmarking
        '198.51.100.1',     // Documentation
        '203.0.113.1',      // Documentation
        '100.64.0.1',       // Shared Address Space
      ];
  
      nonReservedIPs.forEach((ipStr) => {
        const ip = createIPv4Address(ipStr);
        expect(isReservedIP(ip)).toBe(false);
      });
    });
  });

  describe('isDocumentationIP', () => {
    it('should identify documentation IP addresses correctly', () => {
      const documentationIPs = [
        '192.0.2.0',
        '192.0.2.255',
        '198.51.100.0',
        '198.51.100.255',
        '203.0.113.0',
        '203.0.113.255',
      ];

      documentationIPs.forEach((ipStr) => {
        const ip = createIPv4Address(ipStr);
        expect(isDocumentationIP(ip)).toBe(true);
      });
    });

    it('should not identify non-documentation IP addresses as documentation', () => {
      const nonDocumentationIPs = [
        '192.0.1.255',
        '198.51.101.0',
        '203.0.112.255',
        '203.0.114.0',
        '10.0.0.1',
      ];

      nonDocumentationIPs.forEach((ipStr) => {
        const ip = createIPv4Address(ipStr);
        expect(isDocumentationIP(ip)).toBe(false);
      });
    });
  });

  describe('isBenchmarkingIP', () => {
    it('should identify benchmarking IP addresses correctly', () => {
      const benchmarkingIPs = [
        '198.18.0.0',
        '198.19.255.255',
        '198.18.100.100',
        '198.19.0.1',
      ];

      benchmarkingIPs.forEach((ipStr) => {
        const ip = createIPv4Address(ipStr);
        expect(isBenchmarkingIP(ip)).toBe(true);
      });
    });

    it('should not identify non-benchmarking IP addresses as benchmarking', () => {
      const nonBenchmarkingIPs = [
        '198.17.255.255',
        '198.20.0.0',
        '192.168.1.1',
        '224.0.0.1',
      ];

      nonBenchmarkingIPs.forEach((ipStr) => {
        const ip = createIPv4Address(ipStr);
        expect(isBenchmarkingIP(ip)).toBe(false);
      });
    });
  });

  describe('isSharedAddressSpaceIP', () => {
    it('should identify shared address space IP addresses correctly', () => {
      const sharedAddressSpaceIPs = [
        '100.64.0.0',
        '100.127.255.255',
        '100.64.0.1',
        '100.100.100.100',
        '100.127.255.254',
      ];

      sharedAddressSpaceIPs.forEach((ipStr) => {
        const ip = createIPv4Address(ipStr);
        expect(isSharedAddressSpaceIP(ip)).toBe(true);
      });
    });

    it('should not identify non-shared address space IP addresses as shared', () => {
      const nonSharedIPs = [
        '100.63.255.255',
        '100.128.0.0',
        '192.168.1.1',
        '10.0.0.1',
      ];

      nonSharedIPs.forEach((ipStr) => {
        const ip = createIPv4Address(ipStr);
        expect(isSharedAddressSpaceIP(ip)).toBe(false);
      });
    });
  });

  describe('getSpecialIPType', () => {
    it('should return the correct special IP type', () => {
      const testCases: [string, string][] = [
        ['10.0.0.1', 'Private'],
        ['172.16.0.1', 'Private'],
        ['192.168.1.1', 'Private'],
        ['127.0.0.1', 'Loopback'],
        ['169.254.1.1', 'Link-local'],
        ['224.0.0.1', 'Multicast'],
        ['255.255.255.255', 'Broadcast'],
        ['240.0.0.1', 'Reserved'],
        ['198.51.100.1', 'Documentation'], // Changed from 'Reserved' to 'Documentation'
        ['192.0.2.1', 'Documentation'],    // Changed from 'Reserved' to 'Documentation'
        ['198.18.1.1', 'Benchmarking'],
        ['100.64.0.1', 'Shared Address Space'],
        ['8.8.8.8', 'Public'],
        ['1.1.1.1', 'Public'],
      ];
  
      testCases.forEach(([ipStr, expectedType]) => {
        const ip = createIPv4Address(ipStr);
        const result = getSpecialIPType(ip);
        expect(result).toBe(expectedType);
      });
    });
  
    it('should handle edge cases at the boundaries of special ranges', () => {
      const boundaryIPs: [string, string][] = [
        ['10.0.0.0', 'Private'],
        ['10.255.255.255', 'Private'],
        ['172.16.0.0', 'Private'],
        ['172.31.255.255', 'Private'],
        ['192.168.0.0', 'Private'],
        ['192.168.255.255', 'Private'],
        ['127.0.0.0', 'Loopback'],
        ['127.255.255.255', 'Loopback'],
        ['169.254.0.0', 'Link-local'],
        ['169.254.255.255', 'Link-local'],
        ['224.0.0.0', 'Multicast'],
        ['239.255.255.255', 'Multicast'],
        ['240.0.0.0', 'Reserved'],
        ['255.255.255.254', 'Reserved'],
        ['198.51.100.0', 'Documentation'], // Changed from 'Reserved' to 'Documentation'
        ['198.51.100.255', 'Documentation'],
        ['203.0.113.0', 'Documentation'],
        ['203.0.113.255', 'Documentation'],
        ['192.0.2.0', 'Documentation'],
        ['192.0.2.255', 'Documentation'],
        ['198.18.0.0', 'Benchmarking'],
        ['198.19.255.255', 'Benchmarking'],
        ['100.64.0.0', 'Shared Address Space'],
        ['100.127.255.255', 'Shared Address Space'],
        ['255.255.255.255', 'Broadcast'],
      ];
  
      boundaryIPs.forEach(([ipStr, expectedType]) => {
        const ip = createIPv4Address(ipStr);
        const result = getSpecialIPType(ip);
        expect(result).toBe(expectedType);
      });
    });
  });

  describe('isGlobalUnicastIP', () => {
    it('should identify global unicast IP addresses correctly', () => {
      const publicIPs = [
        '8.8.8.8',
        '1.1.1.1',
        '9.9.9.9',
        '198.20.0.1',
        '100.128.0.1',
        '192.0.3.1',
        '203.0.114.1',
      ];

      publicIPs.forEach((ipStr) => {
        const ip = createIPv4Address(ipStr);
        expect(isGlobalUnicastIP(ip)).toBe(true);
      });
    });

    it('should not identify special-use IP addresses as global unicast', () => {
      const specialIPs = [
        '10.0.0.1',
        '172.16.0.1',
        '192.168.1.1',
        '127.0.0.1',
        '169.254.1.1',
        '224.0.0.1',
        '255.255.255.255',
        '240.0.0.1',
        '198.51.100.1',
        '192.0.2.1',
        '198.18.1.1',
        '100.64.0.1',
      ];

      specialIPs.forEach((ipStr) => {
        const ip = createIPv4Address(ipStr);
        expect(isGlobalUnicastIP(ip)).toBe(false);
      });
    });
  });

  describe('getSpecialIPRange', () => {
    it('should return correct ranges for each special IP type', () => {
      const testCases: [string, [string, string][] | null][] = [
        ['Private', [
          ['10.0.0.0', '10.255.255.255'],
          ['172.16.0.0', '172.31.255.255'],
          ['192.168.0.0', '192.168.255.255'],
        ]],
        ['Loopback', [
          ['127.0.0.0', '127.255.255.255'],
        ]],
        ['Link-local', [
          ['169.254.0.0', '169.254.255.255'],
        ]],
        ['Multicast', [
          ['224.0.0.0', '239.255.255.255'],
        ]],
        ['Broadcast', [
          ['255.255.255.255', '255.255.255.255'],
        ]],
        ['Reserved', [
          ['0.0.0.0', '0.255.255.255'],
          ['240.0.0.0', '255.255.255.254'],
        ]],
        ['Documentation', [
          ['192.0.2.0', '192.0.2.255'],
          ['198.51.100.0', '198.51.100.255'],
          ['203.0.113.0', '203.0.113.255'],
        ]],
        ['Benchmarking', [
          ['198.18.0.0', '198.19.255.255'],
        ]],
        ['Shared Address Space', [
          ['100.64.0.0', '100.127.255.255'],
        ]],
        ['NonExistentType', null],
      ];
  
      testCases.forEach(([type, expectedRanges]) => {
        const result = getSpecialIPRange(type);
        if (expectedRanges === null) {
          expect(result).toBeNull();
        } else {
          expect(result).toHaveLength(expectedRanges.length);
          expectedRanges.forEach((range, index) => {
            const [start, end] = range;
            expect(result![index][0]).toBe(assertIPv4Address(start));
            expect(result![index][1]).toBe(assertIPv4Address(end));
          });
        }
      });
    });
  
    it('should handle case sensitivity in type names', () => {
      const testCases: [string, [string, string][] | null][] = [
        ['private', [
          ['10.0.0.0', '10.255.255.255'],
          ['172.16.0.0', '172.31.255.255'],
          ['192.168.0.0', '192.168.255.255'],
        ]],
        ['PRIVATE', [
          ['10.0.0.0', '10.255.255.255'],
          ['172.16.0.0', '172.31.255.255'],
          ['192.168.0.0', '192.168.255.255'],
        ]],
        ['LoopBack', [
          ['127.0.0.0', '127.255.255.255'],
        ]],
        ['Link-Local', [
          ['169.254.0.0', '169.254.255.255'],
        ]],
        ['MULTICAST', [
          ['224.0.0.0', '239.255.255.255'],
        ]],
        ['broadcast', [
          ['255.255.255.255', '255.255.255.255'],
        ]],
        ['Reserved', [
          ['0.0.0.0', '0.255.255.255'],
          ['240.0.0.0', '255.255.255.254'],
        ]],
        ['documentation', [
          ['192.0.2.0', '192.0.2.255'],
          ['198.51.100.0', '198.51.100.255'],
          ['203.0.113.0', '203.0.113.255'],
        ]],
        ['Benchmarking', [
          ['198.18.0.0', '198.19.255.255'],
        ]],
        ['Shared Address Space', [
          ['100.64.0.0', '100.127.255.255'],
        ]],
      ];
  
      testCases.forEach(([type, expectedRanges]) => {
        const result = getSpecialIPRange(type);
        if (expectedRanges === null) {
          expect(result).toBeNull();
        } else {
          expect(result).toHaveLength(expectedRanges.length);
          expectedRanges.forEach((range, index) => {
            const [start, end] = range;
            expect(result![index][0]).toBe(assertIPv4Address(start));
            expect(result![index][1]).toBe(assertIPv4Address(end));
          });
        }
      });
    });
  });
  
  describe('Edge Cases', () => {
    it('should correctly handle overlapping special IP types', () => {
      // Example: '192.0.2.1' is both Reserved and Documentation
      const ipStr = '192.0.2.1';
      const ip = createIPv4Address(ipStr);
      const type = getSpecialIPType(ip);
      // Documentation is now checked before Reserved
      expect(type).toBe('Documentation');
    });

    it('should return "Public" for IP addresses not falling into any special category', () => {
      const publicIPs = [
        '8.8.8.8',
        '1.1.1.1',
        '9.9.9.9',
        '198.20.0.1',
        '100.128.0.1',
        '192.0.3.1',
        '203.0.114.1',
      ];

      publicIPs.forEach((ipStr) => {
        const ip = createIPv4Address(ipStr);
        const type = getSpecialIPType(ip);
        expect(type).toBe('Public');
      });
    });

    it('should handle the minimal and maximal valid IP addresses', () => {
        const testCases: [string, string][] = [
          ['0.0.0.0', 'Reserved'], // Changed expectation from 'Public' to 'Reserved'
          ['255.255.255.255', 'Broadcast'],
        ];
    
        testCases.forEach(([ipStr, expectedType]) => {
          const ip = createIPv4Address(ipStr);
          const type = getSpecialIPType(ip);
          expect(type).toBe(expectedType);
        });
      });

    it('should handle sequential IP addresses correctly', () => {
      const sequentialIPs = [
        '10.0.0.0',
        '10.0.0.1',
        '10.0.0.2',
        '10.0.0.3',
        '10.0.0.4',
        '10.0.0.5',
        '10.0.0.255',
        '10.0.1.0',
        '10.0.1.1',
      ];

      sequentialIPs.forEach((ipStr) => {
        const ip = createIPv4Address(ipStr);
        expect(isPrivateIP(ip)).toBe(true);
        const type = getSpecialIPType(ip);
        expect(type).toBe('Private');
      });
    });
  });

  describe('Invalid Inputs', () => {
    it('should throw an error when creating an invalid IPv4Address', () => {
      const invalidIPs = [
        '256.0.0.1',
        '192.168.1.256',
        '192.168.1',
        '192.168.1.1.1',
        'abc.def.ghi.jkl',
        '123.456.78.90',
        '192.168.01.1', // Leading zero
        '192.168.1.-1',
        '192.168.1.1 ',
        ' 192.168.1.1',
        '',
        '...',
      ];
  
      invalidIPs.forEach((ipStr) => {
        expect(() => createIPv4Address(ipStr)).toThrow();
      });
    });

    it('should handle getSpecialIPType with invalid type names gracefully', () => {
      const validIPs = [
        '8.8.8.8',
        '1.1.1.1',
      ];

      validIPs.forEach((ipStr) => {
        const ip = createIPv4Address(ipStr);
        const type = getSpecialIPType(ip);
        expect(type).toBe('Public');
      });

      // Passing invalid type names to getSpecialIPRange
      const invalidTypes = [
        'privatee',
        'loopbac',
        'nonexistent',
        'unknown',
        '',
        '123',
        'Private ', // Trailing space
      ];

      invalidTypes.forEach((type) => {
        const result = getSpecialIPRange(type);
        expect(result).toBeNull();
      });
    });
  });
});
