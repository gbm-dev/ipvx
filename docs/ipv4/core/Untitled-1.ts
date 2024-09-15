/**
 * @module ipv4/core/base.ts
 * @overview This module provides core functions for bitwise operations, bitmask generation, and manipulation, including IPv4-specific operations.
 */

import type { IPv4Bitflag } from '@src/types';

// Precomputed bitmasks for common values
export const MAX_32BIT_VALUE = 0xFFFFFFFF; // Maximum 32-bit unsigned integer value
export const VALID_IPV4_CHARS = 0x03FF4000; // Bitmask for valid IPv4 characters (0-9 and .)

/**
 * @function generateBitmask
 * @description Generates a bitmask with a specified number of set bits (1s) from the least significant bit.
 *
 * @param {number} numBits - The number of bits to set in the bitmask (0-32).
 * @returns {number} The generated bitmask as a 32-bit unsigned integer.
 *
 * @throws {Error} If numBits is not within the valid range (0-32 inclusive).
 *
 * @example
 * generateBitmask(8); // Returns 0xFF (255), which represents a bitmask with the 8 least significant bits set.
 * generateBitmask(24); // Returns 0xFFFFFF (16777215), which has 24 least significant bits set.
 *
 * @complexity
 * Time complexity: O(1) - The function performs a constant number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function generateBitmask(numBits: number): number {
    if (numBits < 0 || numBits > 32) {
        throw new Error('Invalid number of bits. Must be between 0 and 32 inclusive.');
    }
    // If numBits is 32, return the maximum 32-bit value; otherwise, calculate the mask using bitwise operations.
    return numBits === 32 ? MAX_32BIT_VALUE : (1 << numBits) - 1 >>> 0;
}

/**
 * @function isValidChar
 * @description Checks if a character is valid based on a precomputed bitmask of allowed characters.
 * This function is typically used for validating IPv4 address characters.
 *
 * @param {number} charCode - The character code to check.
 * @param {number} validCharMask - Bitmask of valid characters. For IPv4, this is typically `VALID_IPV4_CHARS`.
 * @returns {boolean} True if the character is valid, false otherwise.
 *
 * @example
 * isValidChar('0'.charCodeAt(0), VALID_IPV4_CHARS); // Returns true
 * isValidChar('9'.charCodeAt(0), VALID_IPV4_CHARS); // Returns true
 * isValidChar('.'.charCodeAt(0), VALID_IPV4_CHARS); // Returns true
 * isValidChar('A'.charCodeAt(0), VALID_IPV4_CHARS); // Returns false
 *
 * @complexity
 * Time complexity: O(1) - The function performs a single bitwise AND operation and a comparison.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function isValidChar(charCode: number, validCharMask: number): boolean {
    // Check if the bit corresponding to the character code is set in the valid character mask.
    return (validCharMask & (1 << charCode)) !== 0;
}

/**
 * @function countSetBits
 * @description Counts the number of set bits (1s) in a 32-bit unsigned integer.
 *
 * @param {number} n - The 32-bit unsigned integer to analyze.
 * @returns {number} The number of set bits.
 *
 * @example
 * countSetBits(0xFF); // Returns 8, as 0xFF (255) has all 8 least significant bits set.
 * countSetBits(0xF0F); // Returns 8, as 0xF0F (3855) has 8 bits set in total.
 *
 * @complexity
 * Time complexity: O(1) - The function performs a fixed number of bitwise operations, regardless of the input value.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function countSetBits(n: number): number {
    // This function uses an efficient bitwise algorithm (Hamming Weight) to count set bits.
    n = n - ((n >>> 1) & 0x55555555);
    n = (n & 0x33333333) + ((n >>> 2) & 0x33333333);
    return (((n + (n >>> 4)) & 0x0F0F0F0F) * 0x01010101) >>> 24;
}

/**
 * @function getBit
 * @description Gets the value (0 or 1) of a specific bit in a 32-bit unsigned integer.
 *
 * @param {number} n - The 32-bit unsigned integer to check.
 * @param {number} position - The bit position to get (0-31, where 0 is the least significant bit).
 * @returns {number} 0 or 1, depending on the bit value at the specified position.
 *
 * @throws {Error} If the position is not within the valid range (0-31 inclusive).
 *
 * @example
 * getBit(0b1010, 0); // Returns 0, as the bit at position 0 is 0.
 * getBit(0b1010, 1); // Returns 1, as the bit at position 1 is 1.
 *
 * @complexity
 * Time complexity: O(1) - The function performs a single bitwise right shift and a bitwise AND operation.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function getBit(n: number, position: number): number {
    if (position < 0 || position > 31) {
        throw new Error('Invalid bit position. Must be between 0 and 31 inclusive.');
    }
    // Right shift the number by the position and mask with 1 to isolate the bit at that position.
    return (n >>> position) & 1;
}

/**
 * @function setBit
 * @description Sets a specific bit in a 32-bit unsigned integer to 1 or 0.
 *
 * @param {number} n - The 32-bit unsigned integer to modify.
 * @param {number} position - The bit position to set (0-31, where 0 is the least significant bit).
 * @param {boolean} value - The value to set the bit to. True sets the bit to 1, false sets it to 0.
 * @returns {number} The modified number with the bit at the specified position set to the given value.
 *
 * @throws {Error} If the position is not within the valid range (0-31 inclusive).
 *
 * @example
 * setBit(0b1010, 0, true); // Returns 0b1011 (11), setting the bit at position 0 to 1.
 * setBit(0b1010, 1, false); // Returns 0b1000 (8), setting the bit at position 1 to 0.
 *
 * @complexity
 * Time complexity: O(1) - The function performs a constant number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function setBit(n: number, position: number, value: boolean): number {
    if (position < 0 || position > 31) {
        throw new Error('Invalid bit position. Must be between 0 and 31 inclusive.');
    }
    // If value is true, set the bit using a bitwise OR. Otherwise, clear the bit using a bitwise AND and NOT.
    return (value ? n | (1 << position) : n & ~(1 << position)) >>> 0;
}


/**
 * @function clearBit
 * @description Clears a specific bit (sets it to 0) in a 32-bit unsigned integer.
 *
 * @param {number} n - The 32-bit unsigned integer to modify.
 * @param {number} position - The bit position to clear (0-31, where 0 is the least significant bit).
 * @returns {number} The modified number with the bit at the specified position cleared.
 *
 * @throws {Error} If the position is not within the valid range (0-31 inclusive).
 *
 * @example
 * clearBit(0b1011, 0); // Returns 0b1010 (10), clearing the bit at position 0.
 *
 * @complexity
 * Time complexity: O(1) - The function performs a constant number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function clearBit(n: number, position: number): number {
    if (position < 0 || position > 31) {
        throw new Error('Invalid bit position. Must be between 0 and 31 inclusive.');
    }
    // Clear the bit using a bitwise AND and NOT operation.
    return n & ~(1 << position);
}

/**
 * @function toggleBit
 * @description Toggles a specific bit in a 32-bit unsigned integer.
 * If the bit is 0, it sets it to 1. If it's 1, it sets it to 0.
 *
 * @param {number} n - The 32-bit unsigned integer to modify.
 * @param {number} position - The bit position to toggle (0-31, where 0 is the least significant bit).
 * @returns {number} The modified number with the bit at the specified position toggled.
 *
 * @throws {Error} If the position is not within the valid range (0-31 inclusive).
 *
 * @example
 * toggleBit(0b1010, 0); // Returns 0b1011 (11), toggling the bit at position 0 from 0 to 1.
 * toggleBit(0b1011, 0); // Returns 0b1010 (10), toggling the bit at position 0 from 1 to 0.
 *
 * @complexity
 * Time complexity: O(1) - The function performs a single bitwise XOR operation.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function toggleBit(n: number, position: number): number {
    if (position < 0 || position > 31) {
        throw new Error('Invalid bit position. Must be between 0 and 31 inclusive.');
    }
    // Toggle the bit using a bitwise XOR operation.
    return n ^ (1 << position);
}

/**
 * @function extractBits
 * @description Extracts a range of bits from a 32-bit unsigned integer.
 *
 * @param {number} n - The 32-bit unsigned integer to extract bits from.
 * @param {number} start - The starting bit position (inclusive, 0-31).
 * @param {number} end - The ending bit position (inclusive, 0-31).
 * @returns {number} The extracted bits as a 32-bit unsigned integer.
 *
 * @throws {Error} If start or end positions are invalid (out of range or start > end).
 *
 * @example
 * extractBits(0b11011001, 2, 5); // Returns 0b110 (6), extracting bits from position 2 to 5.
 * extractBits(0xFFFFFFFF, 0, 31); // Returns 0xFFFFFFFF, extracting all 32 bits.
 *
 * @complexity
 * Time complexity: O(1) - The function performs a fixed number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function extractBits(n: number, start: number, end: number): number {
    if (start < 0 || end > 31 || start > end) {
        throw new Error('Invalid bit range. Start and end positions must be between 0 and 31 inclusive, and start <= end.');
    }
    
    // Special case: extracting all 32 bits
    if (start === 0 && end === 31) {
        return n >>> 0;
    }
    
    // Create a mask with 1s in the range of bits to extract.
    const mask = ((1 << (end - start + 1)) - 1) >>> 0;
    
    // Right shift the number to align the desired bits with the mask, then apply the mask using bitwise AND.
    return (n >>> start) & mask;
}

/**
 * @function rotateBits
 * @description Rotates the bits in a 32-bit unsigned integer to the right (positive positions) or left (negative positions).
 *
 * @param {number} n - The 32-bit unsigned integer to rotate.
 * @param {number} positions - The number of bit positions to rotate. Positive values rotate to the right, negative to the left.
 * @returns {number} The rotated number.
 *
 * @example
 * rotateBits(0b10110011, 2); // Returns 0b11101100 (right rotation by 2 bits)
 * rotateBits(0b10110011, -2); // Returns 0b11001110 (left rotation by 2 bits)
 *
 * @complexity
 * Time complexity: O(1) - The function performs a fixed number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function rotateBits(n: number, positions: number): number {
    // Ensure the number of positions is positive and within the range 0-7 using modulo 8 for 8-bit numbers.
    const uPositions = ((positions % 8) + 8) % 8; 
    // Perform the rotation using bitwise right shift and left shift, then mask with 0xFF to ensure it stays within 8 bits.
    return ((n >>> uPositions) | (n << (8 - uPositions))) & 0xFF;
}

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
 * @function invertBits
 * @description Inverts all the bits in a 32-bit unsigned integer (0s become 1s and vice versa).
 *
 * @param {number} n - The 32-bit unsigned integer to invert.
 * @returns {number} The inverted number.
 *
 * @example
 * invertBits(0b1010); // Returns 0b0101 (5)
 *
 * @complexity
 * Time complexity: O(1) - The function performs a single bitwise NOT operation.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function invertBits(n: number): number {
    return (~n) >>> 0;
}

/**
 * @function leadingZeros
 * @description Counts the number of leading zeros in a 32-bit unsigned integer.
 *
 * @param {number} n - The 32-bit unsigned integer to analyze.
 * @returns {number} The number of leading zeros.
 *
 * @example
 * leadingZeros(0x00000001); // Returns 31
 * leadingZeros(0x00FF0000); // Returns 8
 * 
 * @complexity
 * Time complexity: O(log n) - The number of iterations in the while loop is proportional to the number of leading zeros, 
 * which is at most 32 (log2(32) = 5). In the worst case, the loop iterates a logarithmic number of times with respect to the input value.
 * Space complexity: O(1) - The function uses a constant amount of extra space.
 */
export function leadingZeros(n: number): number {
    n = n >>> 0; // Ensure n is treated as unsigned
    if (n === 0) return 32;
    let count = 0;
    while ((n & 0x80000000) === 0) {
        n = n << 1;
        count++;
    }
    return count;
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
 * @function trailingZeros
 * @description Counts the number of trailing zeros in a 32-bit unsigned integer.
 *
 * @param {number} n - The 32-bit unsigned integer to analyze.
 * @returns {number} The number of trailing zeros.
 *
 * @example
 * trailingZeros(0x80000000); // Returns 31
 * trailingZeros(0xFF000000); // Returns 24
 * 
 * @complexity
 * Time complexity: O(log n) - In the worst case, the while loop iterates up to 31 times 
 * (when the input is 0x00000001), which is logarithmic with respect to the maximum possible input value (2^32).
 * Space complexity: O(1) - The function uses a constant amount of extra space.
 */
export function trailingZeros(n: number): number {
    n = n >>> 0; // Ensure n is treated as unsigned
    if (n === 0) return 32;
    let count = 0;
    while ((n & 1) === 0) {
        n = n >>> 1;
        count++;
    }
    return count;
}

/**
 * @function findFirstSetBit
 * @description Finds the position of the least significant set bit (1) in a 32-bit unsigned integer.
 *
 * @param {number} n - The 32-bit unsigned integer to analyze.
 * @returns {number} The position of the least significant set bit (0-31), or -1 if no bit is set.
 *
 * @example
 * findFirstSetBit(0x80000000); // Returns 31
 * findFirstSetBit(0); // Returns -1
 * 
 * @complexity
 * Time complexity: O(log n) - This function calls `trailingZeros`, which has a time complexity of O(log n).
 * Space complexity: O(1) - The function uses a constant amount of extra space.
 */
export function findFirstSetBit(n: number): number {
    n = n >>> 0; // Ensure n is treated as unsigned
    if (n === 0) return -1;
    return trailingZeros(n);
}