/**
 * @file bitflag.ts
 * @module lib/bitwise/bitflag
 * @description Provides operations for working with bitflags, used for representing sets of boolean flags.
 * @exports setFlag, clearFlag, toggleFlag, hasFlag, combineFlags, extractFlags, countSetFlags, firstSetFlag, lastSetFlag, nextSetFlag
 */

// Lookup table for popcount (8-bit)
const POPCOUNT_TABLE = new Uint8Array(256);
for (let i = 0; i < 256; i++) {
    POPCOUNT_TABLE[i] = (i & 1) + POPCOUNT_TABLE[i >> 1];
}

// Lookup table for de Bruijn sequence (used in lastSetFlag)
const DE_BRUIJN_SEQUENCE = 0x077CB531;
const DE_BRUIJN_TABLE = new Uint8Array([
    0, 1, 28, 2, 29, 14, 24, 3, 30, 22, 20, 15, 25, 17, 4, 8,
    31, 27, 13, 23, 21, 19, 16, 7, 26, 12, 18, 6, 11, 5, 10, 9
]);

/**
 * @function setFlag
 * @description Sets a specific flag in a bitflag set.
 * 
 * @param {number} flags - The current set of flags.
 * @param {number} flagToSet - The flag to set.
 * @returns {number} The updated set of flags with the specified flag set.
 * 
 * @example
 * setFlag(0b1010, 0b0100); // Returns 0b1110
 * 
 * @complexity
 * Time complexity: O(1)
 * Space complexity: O(1)
 */
export function setFlag(flags: number, flagToSet: number): number {
    return (flags | flagToSet) >>> 0;
}

/**
 * @function clearFlag
 * @description Clears a specific flag in a bitflag set.
 * 
 * @param {number} flags - The current set of flags.
 * @param {number} flagToClear - The flag to clear.
 * @returns {number} The updated set of flags with the specified flag cleared.
 * 
 * @example
 * clearFlag(0b1110, 0b0100); // Returns 0b1010
 * 
 * @complexity
 * Time complexity: O(1)
 * Space complexity: O(1)
 */
export function clearFlag(flags: number, flagToClear: number): number {
    return (flags & ~flagToClear) >>> 0;
}

/**
 * @function toggleFlag
 * @description Toggles a specific flag in a bitflag set.
 * 
 * @param {number} flags - The current set of flags.
 * @param {number} flagToToggle - The flag to toggle.
 * @returns {number} The updated set of flags with the specified flag toggled.
 * 
 * @example
 * toggleFlag(0b1010, 0b0100); // Returns 0b1110
 * toggleFlag(0b1110, 0b0100); // Returns 0b1010
 * 
 * @complexity
 * Time complexity: O(1)
 * Space complexity: O(1)
 */
export function toggleFlag(flags: number, flagToToggle: number): number {
    return (flags ^ flagToToggle) >>> 0;
}

/**
 * @function hasFlag
 * @description Checks if a specific flag is set in a bitflag set.
 * 
 * @param {number} flags - The current set of flags.
 * @param {number} flagToCheck - The flag to check.
 * @returns {boolean} True if all specified flags are set, false otherwise.
 * 
 * @example
 * hasFlag(0b1010, 0b0010); // Returns true
 * hasFlag(0b1010, 0b0100); // Returns false
 * 
 * @complexity
 * Time complexity: O(1)
 * Space complexity: O(1)
 */
/**
 * @function hasFlag
 * @description Checks if all specified flags are set in a bitflag set.
 * 
 * @param {number} flags - The current set of flags.
 * @param {number} flagToCheck - The flag(s) to check.
 * @returns {boolean} True if all specified flags are set, false otherwise.
 * 
 * @example
 * hasFlag(0b1010, 0b0010); // Returns true
 * hasFlag(0b1010, 0b0100); // Returns false
 * 
 * @complexity
 * Time complexity: O(1)
 * Space complexity: O(1)
 */
export function hasFlag(flags: number, flagToCheck: number): boolean {
    return (((flags >>> 0) & (flagToCheck >>> 0)) >>> 0) === (flagToCheck >>> 0);
}

/**
 * @function combineFlags
 * @description Combines multiple flags into a single bitflag set.
 * 
 * @param {...number} flags - The flags to combine.
 * @returns {number} The combined set of flags as an unsigned 32-bit integer.
 * 
 * @example
 * combineFlags(0b0001, 0b0010, 0b0100); // Returns 0b0111
 * combineFlags(0xFFFFFFFF, 0x00000001); // Returns 0xFFFFFFFF (4294967295 in decimal)
 * 
 * @complexity
 * Time complexity: O(n), where n is the number of flags to combine
 * Space complexity: O(1)
 */
export function combineFlags(...flags: number[]): number {
    return flags.reduce((acc, flag) => (acc | flag) >>> 0, 0);
}

/**
 * @function extractFlags
 * @description Extracts all set flags from a 32-bit unsigned integer bitflag set.
 * Optimized for sparse flag sets commonly used in IPv4 networking functions.
 * 
 * @param {number} flags - The set of flags to extract from (32-bit unsigned integer).
 * @returns {number[]} An array of individual set flags.
 * 
 * @example
 * extractFlags(0b1010); // Returns [2, 8]
 * extractFlags(0x0A000002); // Returns [2, 33554432]
 * 
 * @complexity
 * Time complexity: O(1) - Performs at most 32 iterations for a 32-bit integer.
 * Space complexity: O(1) - Output array has a maximum size of 32 for a 32-bit integer.
 */
export function extractFlags(flags: number): number[] {
    const result: number[] = [];
    flags = flags >>> 0; // Ensure it's a 32-bit unsigned integer

    while (flags) {
        const lowestSetBit = flags & -flags;
        result.push(lowestSetBit);
        flags ^= lowestSetBit; // Remove the lowest set bit from flags using XOR
    }

    return result;
}

/**
 * @function countSetFlags
 * @description Counts the number of set flags in a bitflag set.
 * 
 * @param {number} flags - The set of flags to count.
 * @returns {number} The number of set flags.
 * 
 * @example
 * countSetFlags(0b1010); // Returns 2
 * 
 * @complexity
 * Time complexity: O(1) - Uses lookup table for constant-time operation
 * Space complexity: O(1) - Uses a fixed-size lookup table
 */
export function countSetFlags(flags: number): number {
    return POPCOUNT_TABLE[flags & 0xff] +
           POPCOUNT_TABLE[(flags >> 8) & 0xff] +
           POPCOUNT_TABLE[(flags >> 16) & 0xff] +
           POPCOUNT_TABLE[(flags >> 24) & 0xff];
}

/**
 * @function firstSetFlag
 * @description Finds the least significant set flag in a bitflag set.
 * 
 * @param {number} flags - The set of flags to search.
 * @returns {number} The least significant set flag, or 0 if no flags are set.
 * 
 * @example
 * firstSetFlag(0b1010); // Returns 0b0010
 * 
 * @complexity
 * Time complexity: O(1)
 * Space complexity: O(1)
 */
export function firstSetFlag(flags: number): number {
    return (flags & -flags) >>> 0;
}


/**
 * @function lastSetFlag
 * @description Finds the most significant set flag in a bitflag set.
 * 
 * @param {number} flags - The set of flags to search.
 * @returns {number} The most significant set flag, or 0 if no flags are set.
 * 
 * @example
 * lastSetFlag(0b1010); // Returns 0b1000
 * 
 * @complexity
 * Time complexity: O(1) - Uses de Bruijn sequence for constant-time operation
 * Space complexity: O(1) - Uses a fixed-size lookup table
 */
export function lastSetFlag(flags: number): number {
    if (flags === 0) return 0;
    // Set all bits below the most significant bit
    flags |= flags >> 1;
    flags |= flags >> 2;
    flags |= flags >> 4;
    flags |= flags >> 8;
    flags |= flags >> 16;
    // Isolate the most significant bit
    flags ^= flags >> 1;
    // Use de Bruijn sequence to find the position of the most significant bit
    return 1 << DE_BRUIJN_TABLE[(flags * DE_BRUIJN_SEQUENCE) >>> 27 & 0x1F];
}


/**
 * @function nextSetFlag
 * @description Finds the next set flag after a given position in a bitflag set.
 * 
 * @param {number} flags - The set of flags to search.
 * @param {number} currentFlag - The current flag position.
 * @returns {number} The next set flag, or 0 if no more flags are set.
 * 
 * @example
 * nextSetFlag(0b1010, 0b0010); // Returns 0b1000
 * 
 * @complexity
 * Time complexity: O(1) - Uses constant number of bitwise operations
 * Space complexity: O(1)
 */
export function nextSetFlag(flags: number, currentFlag: number): number {
    if (currentFlag === 0) return flags & -flags; // First set flag
    const next = flags & -(currentFlag << 1);
    return next ? next : 0;
}

/**
 * @function clearAllFlags
 * @description Clears all flags in a bitflag set.
 * 
 * @param {number} flags - The set of flags to clear.
 * @returns {number} 0, representing an empty flag set.
 * 
 * @example
 * clearAllFlags(0b1010); // Returns 0
 * 
 * @complexity
 * Time complexity: O(1)
 * Space complexity: O(1)
 */
export function clearAllFlags(flags: number): number {
    return 0;
}

/**
 * @function setAllFlags
 * @description Sets all flags in a 32-bit bitflag set.
 * 
 * @param {number} flags - The current set of flags (ignored).
 * @returns {number} A 32-bit integer with all bits set to 1.
 * 
 * @example
 * setAllFlags(0b1010); // Returns 0xFFFFFFFF (all 32 bits set)
 * 
 * @complexity
 * Time complexity: O(1)
 * Space complexity: O(1)
 */
export function setAllFlags(flags: number): number {
    return 0xFFFFFFFF;
}

/**
 * @function invertFlags
 * @description Inverts all flags in a bitflag set.
 * 
 * @param {number} flags - The set of flags to invert.
 * @returns {number} The inverted set of flags.
 * 
 * @example
 * invertFlags(0b1010); // Returns 0xFFFFFFF5 (all bits flipped in a 32-bit integer)
 * 
 * @complexity
 * Time complexity: O(1)
 * Space complexity: O(1)
 */
export function invertFlags(flags: number): number {
    return ~flags >>> 0;
}