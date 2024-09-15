/**
 * @module ipv4/operations.ts
 * @overview This module provides higher-level operations for IPv4 addresses, built upon the core functions in base.ts.
 */

import type { IPv4Address, IPv4Bitflag } from '@src/types';
import {
  octetsToBitflag,
  bitflagToOctets,
  extractOctet,
  setOctet,
  countSetBits,
  generateBitmask,
} from '@src/ipv4/core/base';

/**
 * Custom error class for IPv4 arithmetic operations.
 */
class IPv4ArithmeticError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IPv4ArithmeticError';
  }
}

/**
 * @function ipToBitflag
 * @description Converts an IPv4 address string to its bitflag representation.
 *
 * @param {IPv4Address} ip - The IPv4 address as a string.
 * @returns {IPv4Bitflag} The IPv4 address as a bitflag.
 *
 * @complexity
 * Time complexity: O(1) - Fixed number of operations.
 * Space complexity: O(1) - Uses constant extra space.
 */
function ipToBitflag(ip: IPv4Address): IPv4Bitflag {
  const octets = ip.split('.').map(Number);
  return octetsToBitflag(octets as [number, number, number, number]);
}

/**
 * @function bitflagToIP
 * @description Converts an IPv4 bitflag to its string representation.
 *
 * @param {IPv4Bitflag} bitflag - The IPv4 address as a bitflag.
 * @returns {IPv4Address} The IPv4 address as a string.
 *
 * @complexity
 * Time complexity: O(1) - Fixed number of operations.
 * Space complexity: O(1) - Uses constant extra space.
 */
function bitflagToIP(bitflag: IPv4Bitflag): IPv4Address {
  const octets = bitflagToOctets(bitflag);
  return octets.join('.') as IPv4Address;
}

/**
 * @function incrementIP
 * @description Increments an IPv4 address by a specified amount.
 *
 * @param {IPv4Address} ip - The IPv4 address to increment.
 * @param {number} [amount=1] - The amount to increment by (default: 1).
 * @returns {IPv4Address} The incremented IPv4 address.
 * @throws {IPv4ArithmeticError} If the operation would result in an invalid IPv4 address.
 *
 * @complexity
 * Time complexity: O(1) - Fixed number of operations.
 * Space complexity: O(1) - Uses constant extra space.
 */
export function incrementIP(ip: IPv4Address, amount: number = 1): IPv4Address {
  const bitflag = ipToBitflag(ip);
  const result = (bitflag + amount) >>> 0;
  if (result > 0xFFFFFFFF) {
    throw new IPv4ArithmeticError('Increment operation results in an invalid IPv4 address');
  }
  return bitflagToIP(result as IPv4Bitflag);
}

/**
 * @function decrementIP
 * @description Decrements an IPv4 address by a specified amount.
 *
 * @param {IPv4Address} ip - The IPv4 address to decrement.
 * @param {number} [amount=1] - The amount to decrement by (default: 1).
 * @returns {IPv4Address} The decremented IPv4 address.
 * @throws {IPv4ArithmeticError} If the operation would result in an invalid IPv4 address.
 *
 * @complexity
 * Time complexity: O(1) - Fixed number of operations.
 * Space complexity: O(1) - Uses constant extra space.
 */
export function decrementIP(ip: IPv4Address, amount: number = 1): IPv4Address {
  const bitflag = ipToBitflag(ip);
  const result = (bitflag - amount) >>> 0;
  if (bitflag < amount) {
    throw new IPv4ArithmeticError('Decrement operation results in an invalid IPv4 address');
  }
  return bitflagToIP(result as IPv4Bitflag);
}

/**
 * @function ipDifference
 * @description Calculates the difference between two IPv4 addresses.
 *
 * @param {IPv4Address} ip1 - The first IPv4 address.
 * @param {IPv4Address} ip2 - The second IPv4 address.
 * @returns {number} The difference between the two addresses as a number.
 *
 * @complexity
 * Time complexity: O(1) - Fixed number of operations.
 * Space complexity: O(1) - Uses constant extra space.
 */
export function ipDifference(ip1: IPv4Address, ip2: IPv4Address): number {
  const bitflag1 = ipToBitflag(ip1);
  const bitflag2 = ipToBitflag(ip2);
  return Math.abs((bitflag1 as number) - (bitflag2 as number));
}

/**
 * @function isIPInRange
 * @description Determines if an IPv4 address is within a given range.
 *
 * @param {IPv4Address} ip - The IPv4 address to check.
 * @param {IPv4Address} startIP - The start of the IP range.
 * @param {IPv4Address} endIP - The end of the IP range.
 * @returns {boolean} True if the IP is within the range, false otherwise.
 *
 * @complexity
 * Time complexity: O(1) - Fixed number of operations.
 * Space complexity: O(1) - Uses constant extra space.
 */
export function isIPInRange(ip: IPv4Address, startIP: IPv4Address, endIP: IPv4Address): boolean {
  const ipBitflag = ipToBitflag(ip);
  const startBitflag = ipToBitflag(startIP);
  const endBitflag = ipToBitflag(endIP);
  return (ipBitflag >= startBitflag) && (ipBitflag <= endBitflag);
}

/**
 * @function compareIPs
 * @description Compares two IPv4 addresses.
 *
 * @param {IPv4Address} ip1 - The first IPv4 address.
 * @param {IPv4Address} ip2 - The second IPv4 address.
 * @returns {-1 | 0 | 1} -1 if ip1 < ip2, 0 if ip1 === ip2, 1 if ip1 > ip2.
 *
 * @complexity
 * Time complexity: O(1) - Fixed number of operations.
 * Space complexity: O(1) - Uses constant extra space.
 */
export function compareIPs(ip1: IPv4Address, ip2: IPv4Address): -1 | 0 | 1 {
  const bitflag1 = ipToBitflag(ip1);
  const bitflag2 = ipToBitflag(ip2);
  if (bitflag1 < bitflag2) return -1;
  if (bitflag1 > bitflag2) return 1;
  return 0;
}
  
  /**
   * @function isClassfulNetwork
   * @description Determines if an IPv4 address belongs to a classful network (A, B, C, D, or E).
   *
   * @param {IPv4Address} ip - The IPv4 address to check.
   * @returns {string} The network class ('A', 'B', 'C', 'D', 'E') or 'Unknown' if not classful.
   *
   * @complexity
   * Time complexity: O(1) - Fixed number of operations.
   * Space complexity: O(1) - Uses constant extra space.
   */
  export function isClassfulNetwork(ip: IPv4Address): string {
    const firstOctet = getOctetFromIP(ip, 0);
    
    if (firstOctet >= 0 && firstOctet <= 127) return 'A';
    if (firstOctet >= 128 && firstOctet <= 191) return 'B';
    if (firstOctet >= 192 && firstOctet <= 223) return 'C';
    if (firstOctet >= 224 && firstOctet <= 239) return 'D';
    if (firstOctet >= 240 && firstOctet <= 255) return 'E';
    
    return 'Unknown';
  }
  
  /**
   * @function getDefaultSubnetMask
   * @description Returns the default subnet mask for a given classful IPv4 address.
   *
   * @param {IPv4Address} ip - The IPv4 address.
   * @returns {IPv4Address} The default subnet mask for the given IP's class.
   * @throws {IPv4ArithmeticError} If the IP does not belong to a classful network (A, B, or C).
   *
   * @complexity
   * Time complexity: O(1) - Fixed number of operations.
   * Space complexity: O(1) - Uses constant extra space.
   */
  export function getDefaultSubnetMask(ip: IPv4Address): IPv4Address {
    const networkClass = isClassfulNetwork(ip);
    
    switch (networkClass) {
      case 'A':
        return '255.0.0.0' as IPv4Address;
      case 'B':
        return '255.255.0.0' as IPv4Address;
      case 'C':
        return '255.255.255.0' as IPv4Address;
      default:
        throw new IPv4ArithmeticError('No default subnet mask for this IP class');
    }
  }