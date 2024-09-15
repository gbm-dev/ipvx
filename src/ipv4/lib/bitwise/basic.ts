/**
 * @file basic.ts
 * @module lib/bitwise/basic
 * @description Provides a comprehensive set of fundamental bitwise operations including shifting, counting, logical operations, and other common bit manipulations.
 */

// Shifting operations

/**
 * @function leftShift
 * @description Performs a left bitwise shift on a 32-bit integer.
 *
 * @param {number} n - The integer to shift.
 * @param {number} positions - The number of positions to shift to the left.
 * @returns {number} The result of the left shift as a 32-bit unsigned integer.
 *
 * @throws {Error} If the number of positions is not a safe integer between 0 and 31 inclusive.
 *
 * @example
 * leftShift(0b1010, 2); // Returns 0b101000 (40)
 * leftShift(-10, 1);    // Returns 4294967276 (equivalent to 0xFFFFFFF6 in 32-bit unsigned representation)
 *
 * @complexity
 * Time complexity: O(1)
 * Space complexity: O(1)
 */
export function leftShift(n: number, positions: number): number {
    if (!Number.isInteger(positions) || positions < 0 || positions > 31) {
        throw new Error('Invalid number of positions for left shift. Must be an integer between 0 and 31 inclusive.');
    }
    
    // Ensure n is treated as a 32-bit integer
    n = n | 0;
    
    return (n << positions) >>> 0; // Ensure the result is a 32-bit unsigned integer
}

/**
 * @function rightShift
 * @description Performs a right bitwise shift on a 32-bit integer.
 * Handles both logical (unsigned) and arithmetic (signed) shifts based on the `isArithmetic` parameter.
 *
 * @param {number} n - The integer to shift.
 * @param {number} positions - The number of positions to shift to the right.
 * @param {boolean} [isArithmetic=false] - If true, performs an arithmetic shift (signed); otherwise, performs a logical shift (unsigned). Defaults to false (logical shift).
 * @returns {number} The result of the right shift.
 *
 * @throws {Error} If the number of positions is not a safe integer between 0 and 31 inclusive.
 *
 * @example
 * rightShift(0b1010, 1); // Returns 0b0101 (5) - Logical shift
 * rightShift(-10, 1, true); // Returns -5 - Arithmetic shift
 *
 * @complexity
 * Time complexity: O(1)
 * Space complexity: O(1)
 */
export function rightShift(n: number, positions: number, isArithmetic: boolean = false): number {
    if (!Number.isInteger(positions) || positions < 0 || positions > 31) {
        throw new Error('Invalid number of positions for right shift. Must be an integer between 0 and 31 inclusive.');
    }
    
    // Ensure n is treated as a 32-bit integer
    n = n | 0;
    
    return isArithmetic ? n >> positions : n >>> positions;
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

export function rotateLeft(n: number, positions: number): number {
    positions = positions % 32;
    return ((n << positions) | (n >>> (32 - positions))) >>> 0;
}

export function rotateRight(n: number, positions: number): number {
    positions = positions % 32;
    return ((n >>> positions) | (n << (32 - positions))) >>> 0;
}

/**
 * @function leadingZeros
 * @description Counts the number of leading zeros in a 32-bit unsigned integer.
 *
 * @param {number} n - The 32-bit unsigned integer to analyze.
 * @returns {number} The number of leading zeros.
 *
 * @example
 * leadingZeros(0b10000000000000000000000000000000); // Returns 0
 * leadingZeros(0b00000000000000000000000000001000); // Returns 28
 *
 * @complexity
 * Time complexity: O(1) - The function performs a fixed number of bitwise operations regardless of input.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function leadingZeros(n: number): number {
    n = n >>> 0; // Ensure n is treated as unsigned
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    return 32 - countSetBits(n);
}

// De Bruijn sequence and table for 32-bit integers
const DeBruijnSequence = 0x077CB531;
const DeBruijnTable = [
    0, 1, 28, 2, 29, 14, 24, 3, 30, 22, 20, 15, 25, 17, 4, 8, 
    31, 27, 13, 23, 21, 19, 16, 7, 26, 12, 18, 6, 11, 5, 10, 9
];

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
 * Time complexity: O(1) - The function performs a fixed number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space (lookup table).
 */
export function trailingZeros(n: number): number {
    n = n >>> 0; // Ensure n is treated as unsigned
    if (n === 0) return 32;
    return DeBruijnTable[((n & -n) * DeBruijnSequence) >>> 27];
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
 * Time complexity: O(1) - The function performs a fixed number of operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function findFirstSetBit(n: number): number {
    n = n >>> 0; // Ensure n is treated as unsigned
    if (n === 0) return -1;
    return trailingZeros(n);
}

// Basic logical operations
export function and(a: number, b: number): number { return a & b; }
export function or(a: number, b: number): number { return a | b; }
export function xor(a: number, b: number): number { return a ^ b; }
export function not(n: number): number { return ~n >>> 0; }

// Individual bit manipulation

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


// Other fundamental bitwise operations
export function isPowerOfTwo(n: number): boolean {
    return n > 0 && (n & (n - 1)) === 0;
}

export function hasAlternatingBits(n: number): boolean {
    return ((n ^ (n >> 1)) & ((1 << 31) - 1)) === ((1 << 31) - 1);
}

export function reverseBits(n: number): number {
    n = ((n >>> 1) & 0x55555555) | ((n & 0x55555555) << 1);
    n = ((n >>> 2) & 0x33333333) | ((n & 0x33333333) << 2);
    n = ((n >>> 4) & 0x0F0F0F0F) | ((n & 0x0F0F0F0F) << 4);
    n = ((n >>> 8) & 0x00FF00FF) | ((n & 0x00FF00FF) << 8);
    return ((n >>> 16) | (n << 16)) >>> 0;
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

export function parity(n: number): number {
    return countSetBits(n) & 1;
}

export function signExtend(n: number, bits: number): number {
    const shift = 32 - bits;
    return (n << shift) >> shift;
}

// Bitwise arithmetic operations
export function abs(n: number): number {
    const mask = n >> 31;
    return (n ^ mask) - mask;
}

export function min(a: number, b: number): number {
    return b ^ ((a ^ b) & -(a < b ? 1 : 0));
}

export function max(a: number, b: number): number {
    return a ^ ((a ^ b) & -(a < b ? 1 : 0));
}