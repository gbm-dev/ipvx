/**
 * @file bitmask.ts
 * @module lib/bitwise/bitmask
 * @description Provides a comprehensive set of bitmask operations with utility for various applications, including networking.
 */

// Precomputed bitmasks for common values
export const MAX_32BIT_VALUE = 0xFFFFFFFF; // Maximum 32-bit unsigned integer value

/**
 * @function generateBitmask
 * @description Generates a bitmask with a specified number of set bits (1s) from the most significant bit.
 *
 * @param {number} numBits - The number of bits to set in the bitmask (0-32).
 * @returns {number} The generated bitmask as a 32-bit unsigned integer.
 *
 * @throws {Error} If numBits is not within the valid range (0-32 inclusive).
 *
 * @example
 * generateBitmask(24); // Returns 0xFFFFFF00
 * generateBitmask(16); // Returns 0xFFFF0000
 *
 * @complexity
 * Time complexity: O(1) - The function performs a constant number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function generateBitmask(numBits: number): number {
    if (numBits < 0 || numBits > 32) {
        throw new Error('Invalid number of bits. Must be between 0 and 32 inclusive.');
    }
    return numBits === 0 ? 0 : ((MAX_32BIT_VALUE << (32 - numBits)) >>> 0);
}

/**
 * @function applyMask
 * @description Applies a bitmask to a value using bitwise AND operation.
 *
 * @param {number} value - The value to apply the mask to.
 * @param {number} mask - The bitmask to apply.
 * @returns {number} The result of applying the mask to the value.
 *
 * @example
 * applyMask(0xC0A80105, 0xFFFFFF00); // Returns 0xC0A80100
 *
 * @complexity
 * Time complexity: O(1) - The function performs a single bitwise operation.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function applyMask(value: number, mask: number): number {
    return (value & mask) >>> 0;
}

/**
 * @function invertMask
 * @description Inverts a bitmask, flipping all 0s to 1s and vice versa.
 *
 * @param {number} mask - The bitmask to invert.
 * @returns {number} The inverted bitmask.
 *
 * @example
 * invertMask(0xFFFFFF00); // Returns 0x000000FF
 *
 * @complexity
 * Time complexity: O(1) - The function performs a single bitwise operation.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function invertMask(mask: number): number {
    return (~mask) >>> 0;
}

/**
 * Extracts a range of bits from a 32-bit integer.
 * 
 * @param {number} n - The 32-bit integer to extract bits from.
 * @param {number} start - The starting bit position (0-31, inclusive).
 * @param {number} end - The ending bit position (0-31, inclusive).
 * @returns {number} The extracted bits as an unsigned 32-bit integer.
 * 
 * @throws {Error} If start or end are out of range, or if start > end.
 */
/**
 * Extracts a range of bits from a 32-bit integer, handling both positive and negative numbers correctly.
 * 
 * @param {number} n - The 32-bit integer to extract bits from.
 * @param {number} start - The starting bit position (0-31, inclusive).
 * @param {number} end - The ending bit position (0-31, inclusive).
 * @returns {number} The extracted bits as an unsigned 32-bit integer.
 * 
 * @throws {Error} If start or end are out of range, or if start > end.
 */
export function extractBits(n: number, start: number, end: number): number {
    if (start < 0 || end > 31 || start > end) {
        throw new Error('Invalid bit range. Start and end positions must be between 0 and 31 inclusive, and start <= end.');
    }
    
    // Ensure n is treated as an unsigned 32-bit integer
    n = n >>> 0;
    
    // For full 32-bit extraction, return n directly
    if (start === 0 && end === 31) {
        return n;
    }
    
    // Create a mask for the desired bits
    const mask = ((1 << (end - start + 1)) - 1) << start;
    
    // Extract the bits and shift right
    return ((n & mask) >>> start) >>> 0;
}

/**
 * @function isSubsetMask
 * @description Checks if one bitmask is a subset of another.
 *
 * @param {number} subset - The potential subset mask.
 * @param {number} set - The set mask to check against.
 * @returns {boolean} True if subset is indeed a subset of set, false otherwise.
 *
 * @example
 * isSubsetMask(0xFFFF0000, 0xFFFFFF00); // Returns true
 *
 * @complexity
 * Time complexity: O(1) - The function performs a constant number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function isSubsetMask(subset: number, set: number): boolean {
    return ((subset & set) >>> 0) === (subset >>> 0);
}

/**
 * @function countLeadingOnes
 * @description Counts the number of leading ones in a 32-bit unsigned integer using a more efficient binary search method.
 *
 * @param {number} n - The 32-bit unsigned integer to analyze.
 * @returns {number} The number of leading ones.
 *
 * @example
 * countLeadingOnes(0xFFFF0000); // Returns 16
 * countLeadingOnes(0xFFFFFFFF); // Returns 32
 *
 * @complexity
 * Time complexity: O(log n) - The function performs a logarithmic number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function countLeadingOnes(n: number): number {
    // Flip the bits to count leading zeros of the flipped number
    n = ~n >>> 0;
    let count = 0;
    
    // Binary search steps
    if ((n & 0xFFFF0000) === 0) {
        count += 16;
        n <<= 16;
    }
    if ((n & 0xFF000000) === 0) {
        count += 8;
        n <<= 8;
    }
    if ((n & 0xF0000000) === 0) {
        count += 4;
        n <<= 4;
    }
    if ((n & 0xC0000000) === 0) {
        count += 2;
        n <<= 2;
    }
    if ((n & 0x80000000) === 0) {
        count += 1;
    }

    // Special case: Check if all 32 bits are ones
    if (n === 0) {
        count = 32;
    }
    
    return count;
}

/**
 * @function mergeBitmasks
 * @description Merges two bitmasks using bitwise OR operation.
 *
 * @param {number} mask1 - The first bitmask.
 * @param {number} mask2 - The second bitmask.
 * @returns {number} The merged bitmask.
 *
 * @example
 * mergeBitmasks(0xFF00FF00, 0x00FF00FF); // Returns 0xFFFFFFFF
 *
 * @complexity
 * Time complexity: O(1) - The function performs a single bitwise operation.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function mergeBitmasks(mask1: number, mask2: number): number {
    return (mask1 | mask2) >>> 0;
}

/**
 * @function intersectBitmasks
 * @description Intersects two bitmasks using bitwise AND operation.
 *
 * @param {number} mask1 - The first bitmask.
 * @param {number} mask2 - The second bitmask.
 * @returns {number} The intersected bitmask.
 *
 * @example
 * intersectBitmasks(0xFF00FF00, 0xFFFF0000); // Returns 0xFF000000
 *
 * @complexity
 * Time complexity: O(1) - The function performs a single bitwise operation.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function intersectBitmasks(mask1: number, mask2: number): number {
    return (mask1 & mask2) >>> 0;
}

/**
 * @function isolateRightmostSetBit
 * @description Isolates the rightmost set bit in a number, turning off all other bits.
 *
 * @param {number} n - The number to process.
 * @returns {number} A number with only the rightmost set bit of the input.
 *
 * @example
 * isolateRightmostSetBit(0b10100); // Returns 0b100 (4)
 *
 * @complexity
 * Time complexity: O(1) - The function performs a constant number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function isolateRightmostSetBit(n: number): number {
    return (n & (-n)) >>> 0;
}

/**
 * @function removeRightmostSetBit
 * @description Removes the rightmost set bit from a number.
 *
 * @param {number} n - The number to process.
 * @returns {number} The input number with its rightmost set bit removed.
 *
 * @example
 * removeRightmostSetBit(0b10100); // Returns 0b10000 (16)
 *
 * @complexity
 * Time complexity: O(1) - The function performs a constant number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function removeRightmostSetBit(n: number): number {
    return (n & (n - 1)) >>> 0;
}

/**
 * @function nextLexicographicalMask
 * @description Generates the next lexicographical permutation of a bitmask.
 *              For 0xFFFFFFFF or 0, it returns 0, indicating no next permutation or a wrap-around.
 *
 * @param {number} mask - The current bitmask (32-bit unsigned integer).
 * @returns {number} The next lexicographical permutation of the input mask.
 *                   Returns 0 for 0xFFFFFFFF or 0, indicating no next permutation or wrap-around.
 *
 * @example
 * nextLexicographicalMask(0b0011); // Returns 0b0101
 * nextLexicographicalMask(0b0101); // Returns 0b0110
 * nextLexicographicalMask(0xFFFFFFFF); // Returns 0
 * nextLexicographicalMask(0); // Returns 0
 *
 * @complexity
 * Time complexity: O(1) - The function performs a constant number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 *
 * @algorithm
 * 1. Handle special cases: return 0 for input 0 or 0xFFFFFFFF.
 * 2. Find the rightmost non-trailing zero.
 * 3. Add 1 to the bits up to and including this zero.
 * 4. Clear all bits to the right of the original position.
 * 5. Add back the correct number of trailing 1s.
 */
export function nextLexicographicalMask(mask: number): number {
    mask = mask >>> 0;
    if (mask === 0 || mask === 0xFFFFFFFF) return 0;
    const smallest = mask & -mask;
    const ripple = mask + smallest;
    const ones = ((mask ^ ripple) >>> 2) / smallest;
    const result = ripple | ones;
    return result >>> 0;
}


/**
 * @function getLowestNBits
 * @description Creates a mask with the lowest N bits set to 1 and the rest to 0.
 *
 * @param {number} n - The number of lowest bits to set.
 * @returns {number} A bitmask with the lowest N bits set to 1.
 *
 * @throws {Error} If n is not within the valid range (0-32 inclusive).
 *
 * @example
 * getLowestNBits(3); // Returns 0b111 (7)
 * getLowestNBits(5); // Returns 0b11111 (31)
 *
 * @complexity
 * Time complexity: O(1) - The function performs a constant number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function getLowestNBits(n: number): number {
    if (n < 0 || n > 32) {
        throw new Error('Invalid number of bits. Must be between 0 and 32 inclusive.');
    }
    return ((1 << n) - 1) >>> 0;
}

/**
 * @function swapBits
 * @description Swaps two bits in a given number.
 *
 * @param {number} n - The number in which to swap bits.
 * @param {number} i - The position of the first bit to swap (0-31).
 * @param {number} j - The position of the second bit to swap (0-31).
 * @returns {number} The number with the specified bits swapped.
 *
 * @throws {Error} If i or j are not within the valid range (0-31 inclusive).
 *
 * @example
 * swapBits(0b1010, 1, 3); // Returns 0b0110 (6)
 *
 * @complexity
 * Time complexity: O(1) - The function performs a constant number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function swapBits(n: number, i: number, j: number): number {
    if (i < 0 || i > 31 || j < 0 || j > 31) {
        throw new Error('Invalid bit positions. Must be between 0 and 31 inclusive.');
    }
    if (((n >>> i) & 1) !== ((n >>> j) & 1)) {
        n ^= (1 << i) | (1 << j);
    }
    return n >>> 0;
}

/**
 * @function modifyBitRange
 * @description Modifies a range of bits in a number with a given value.
 *
 * @param {number} n - The number to modify.
 * @param {number} i - The starting position of the bit range (inclusive, 0-31).
 * @param {number} j - The ending position of the bit range (inclusive, 0-31).
 * @param {number} value - The value to set in the specified range.
 * @returns {number} The modified number.
 *
 * @throws {Error} If i or j are not within the valid range (0-31 inclusive) or if i > j.
 *
 * @example
 * modifyBitRange(0b11111111, 2, 5, 0b1010); // Returns 0b11101011 (235)
 *
 * @complexity
 * Time complexity: O(1) - The function performs a constant number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function modifyBitRange(n: number, i: number, j: number, value: number): number {
    if (i < 0 || j > 31 || i > j) {
        throw new Error('Invalid bit range. Start and end positions must be between 0 and 31 inclusive, and start <= end.');
    }
    const mask = ((1 << (j - i + 1)) - 1) << i;
    return ((n & ~mask) | ((value << i) & mask)) >>> 0;
}