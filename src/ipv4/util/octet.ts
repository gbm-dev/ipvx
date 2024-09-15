/**
 * @module src/ipv4/utils/octet.ts
 * @overview This module provides utility functions for IPv4 octet manipulation
 */

import type { IPv4Address, IPv4Bitflag } from '@src/types';

/**
 * @function extractOctet
 * @description Extracts a specific octet from an IPv4 address represented as a bitflag.
 * Octets are numbered from 0 to 3, where 0 is the most significant octet.
 *
 * @param {IPv4Bitflag} ip - The IPv4 address in bitflag format (a 32-bit unsigned integer).
 * @param {number} octetPosition - The position of the octet to extract (0-3).
 * @returns {number} The value of the specified octet (0-255).
 *
 * @throws {Error} If an invalid octet position is specified (not within the range 0-3).
 *
 * @example
 * const ip = 0xC0A80101; // 192.168.1.1 in bitflag format
 * extractOctet(ip, 0); // Returns 192 (the first octet)
 * extractOctet(ip, 3); // Returns 1 (the last octet)
 *
 * @complexity
 * Time complexity: O(1) - The function performs a fixed number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function extractOctet(ip: IPv4Bitflag, octetPosition: number): number {
    if (octetPosition < 0 || octetPosition > 3) {
        throw new Error('Invalid octet position. Must be between 0 and 3 inclusive.');
    }
    // Calculate the starting and ending bit positions of the octet based on its position.
    return extractBits(ip, (3 - octetPosition) * 8, (3 - octetPosition) * 8 + 7);
}

/**
 * @function setOctet
 * @description Sets the value of a specific octet in an IPv4 address represented as a bitflag.
 * Octets are numbered from 0 to 3, where 0 is the most significant octet.
 *
 * @param {IPv4Bitflag} ip - The IPv4 address in bitflag format (a 32-bit unsigned integer).
 * @param {number} octetPosition - The position of the octet to set (0-3).
 * @param {number} value - The value to set for the octet (0-255).
 * @returns {IPv4Bitflag} The modified IPv4 address in bitflag format.
 *
 * @throws {Error} If an invalid octet position (not within the range 0-3) or an invalid octet value (not within the range 0-255) is specified.
 *
 * @example
 * const ip = 0xC0A80101; // 192.168.1.1 in bitflag format
 * setOctet(ip, 3, 10); // Returns 0xC0A8010A (192.168.1.10), setting the last octet to 10.
 *
 * @complexity
 * Time complexity: O(1) - The function performs a fixed number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */

export function setOctet(ip: IPv4Bitflag, octetPosition: number, value: number): IPv4Bitflag {
    if (octetPosition < 0 || octetPosition > 3) {
        throw new Error('Invalid octet position. Must be between 0 and 3 inclusive.');
    }
    if (value < 0 || value > 255) {
        throw new Error('Invalid octet value. Must be between 0 and 255 inclusive.');
    }
    // Calculate the shift amount based on the octet position.
    const shiftAmount = (3 - octetPosition) * 8;
    // Create a mask to clear the bits of the target octet.
    const mask = ~(0xFF << shiftAmount);
    // Clear the target octet bits, then set the new value using bitwise OR and left shift.
    return ((ip & mask) | (value << shiftAmount)) >>> 0 as IPv4Bitflag;
}

/**
 * @function bitflagToOctets
 * @description Converts an IPv4 address in bitflag format to an array of octets.
 *
 * @param {IPv4Bitflag} ip - The IPv4 address in bitflag format.
 * @returns {[number, number, number, number]} An array containing the four octets of the IPv4 address.
 *
 * @example
 * bitflagToOctets(0xC0A80101); // Returns [192, 168, 1, 1]
 *
 * @complexity
 * Time complexity: O(1) - The function performs a fixed number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function bitflagToOctets(ip: IPv4Bitflag): [number, number, number, number] {
    return [
        (ip >>> 24) & 0xFF,
        (ip >>> 16) & 0xFF,
        (ip >>> 8) & 0xFF,
        ip & 0xFF
    ];
}

/**
 * @function octetsToBitflag
 * @description Converts an array of four octets to an IPv4 address in bitflag format.
 *
 * @param {[number, number, number, number]} octets - An array containing the four octets of the IPv4 address.
 * @returns {IPv4Bitflag} The IPv4 address in bitflag format.
 *
 * @example
 * octetsToBitflag([192, 168, 1, 1]); // Returns 0xC0A80101
 *
 * @complexity
 * Time complexity: O(1) - The function performs a fixed number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function octetsToBitflag(octets: [number, number, number, number]): IPv4Bitflag {
    return (((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0) as IPv4Bitflag;
}

/**
 * @function setOctetInIP
 * @description Sets the value of a specific octet in an IPv4 address.
 *
 * @param {IPv4Address} ip - The original IPv4 address.
 * @param {number} octetPosition - The position of the octet to set (0-3, where 0 is the leftmost octet).
 * @param {number} value - The new value for the octet (0-255).
 * @returns {IPv4Address} The modified IPv4 address.
 * @throws {Error} If the octet position or value is invalid.
 *
 * @complexity
 * Time complexity: O(1) - Fixed number of operations.
 * Space complexity: O(1) - Uses constant extra space.
 */
export function setOctetInIP(ip: IPv4Address, octetPosition: number, value: number): IPv4Address {
    if (octetPosition < 0 || octetPosition > 3) {
      throw new Error('Invalid octet position. Must be between 0 and 3 inclusive.');
    }
    if (value < 0 || value > 255) {
      throw new Error('Invalid octet value. Must be between 0 and 255 inclusive.');
    }
    
    const ipBitflag = ipToBitflag(ip);
    const newIpBitflag = setOctet(ipBitflag, octetPosition, value);
    return bitflagToIP(newIpBitflag);
  }
  
  /**
   * @function getOctetFromIP
   * @description Extracts the value of a specific octet from an IPv4 address.
   *
   * @param {IPv4Address} ip - The IPv4 address.
   * @param {number} octetPosition - The position of the octet to extract (0-3, where 0 is the leftmost octet).
   * @returns {number} The value of the specified octet (0-255).
   * @throws {Error} If the octet position is invalid.
   *
   * @complexity
   * Time complexity: O(1) - Fixed number of operations.
   * Space complexity: O(1) - Uses constant extra space.
   */
  export function getOctetFromIP(ip: IPv4Address, octetPosition: number): number {
    if (octetPosition < 0 || octetPosition > 3) {
      throw new Error('Invalid octet position. Must be between 0 and 3 inclusive.');
    }
    
    const ipBitflag = ipToBitflag(ip);
    return extractOctet(ipBitflag, octetPosition);
  }
  
  /**
   * @function replaceOctetRange
   * @description Replaces a range of octets in an IPv4 address with new values.
   *
   * @param {IPv4Address} ip - The original IPv4 address.
   * @param {number} startOctet - The starting octet position (0-3, inclusive).
   * @param {number} endOctet - The ending octet position (0-3, inclusive).
   * @param {number[]} newValues - The new values for the octets.
   * @returns {IPv4Address} The modified IPv4 address.
   * @throws {Error} If the octet positions are invalid or if the number of new values doesn't match the range.
   *
   * @complexity
   * Time complexity: O(n), where n is the number of octets being replaced (1 to 4).
   * Space complexity: O(1) - Uses constant extra space.
   */
  export function replaceOctetRange(ip: IPv4Address, startOctet: number, endOctet: number, newValues: number[]): IPv4Address {
    if (startOctet < 0 || startOctet > 3 || endOctet < 0 || endOctet > 3 || startOctet > endOctet) {
      throw new Error('Invalid octet range');
    }
    if (newValues.length !== (endOctet - startOctet + 1)) {
      throw new Error('Number of new values does not match the specified range');
    }
    
    let ipBitflag = ipToBitflag(ip);
    for (let i = startOctet; i <= endOctet; i++) {
      const value = newValues[i - startOctet];
      if (value < 0 || value > 255) {
        throw new Error(`Invalid octet value at position ${i}: ${value}`);
      }
      ipBitflag = setOctet(ipBitflag, i, value);
    }
    return bitflagToIP(ipBitflag);
  }
  
  /**
   * @function swapOctets
   * @description Swaps two octets in an IPv4 address.
   *
   * @param {IPv4Address} ip - The original IPv4 address.
   * @param {number} position1 - The position of the first octet to swap (0-3).
   * @param {number} position2 - The position of the second octet to swap (0-3).
   * @returns {IPv4Address} The modified IPv4 address with swapped octets.
   * @throws {Error} If either octet position is invalid.
   *
   * @complexity
   * Time complexity: O(1) - Fixed number of operations.
   * Space complexity: O(1) - Uses constant extra space.
   */
  export function swapOctets(ip: IPv4Address, position1: number, position2: number): IPv4Address {
    if (position1 < 0 || position1 > 3 || position2 < 0 || position2 > 3) {
      throw new Error('Invalid octet position. Must be between 0 and 3 inclusive.');
    }
    
    let ipBitflag = ipToBitflag(ip);
    const octet1 = extractOctet(ipBitflag, position1);
    const octet2 = extractOctet(ipBitflag, position2);
    
    ipBitflag = setOctet(ipBitflag, position1, octet2);
    ipBitflag = setOctet(ipBitflag, position2, octet1);
    
    return bitflagToIP(ipBitflag);
  }