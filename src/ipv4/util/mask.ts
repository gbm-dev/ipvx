/**
 * @file src/ipv4/utils/mask.ts
 * @description Essential low-level utility functions for IPv4 subnet mask operations.
 */

import type { IPv4Bitflag } from '@src/types';
import { generateBitmask, countLeadingOnes, invertMask } from '@src/ipv4/lib/bitwise/bitmask';
import { and, or, xor } from '@src/ipv4/lib/bitwise/basic';
import { IPV4_MAX_PREFIX_LENGTH, IPV4_MIN_PREFIX_LENGTH } from '@src/ipv4/constants';
import { IPv4ValidationError } from '@src/ipv4/errors';

/**
 * @function createMask
 * @description Creates a subnet mask from a given prefix length.
 * 
 * @param {number} prefixLength - The prefix length (0-32).
 * @returns {IPv4Bitflag} The subnet mask as an IPv4Bitflag.
 * @throws {IPv4ValidationError} If the prefix length is invalid or not an integer.
 *
 * @complexity
 * Time complexity: O(1) - Constant time operation using bitwise functions.
 * Space complexity: O(1) - Uses a constant amount of space.
 */
export function createMask(prefixLength: number): IPv4Bitflag {
    if (!Number.isInteger(prefixLength) || prefixLength < IPV4_MIN_PREFIX_LENGTH || prefixLength > IPV4_MAX_PREFIX_LENGTH) {
        throw new IPv4ValidationError(`Invalid prefix length: ${prefixLength}. Must be an integer between ${IPV4_MIN_PREFIX_LENGTH} and ${IPV4_MAX_PREFIX_LENGTH}.`);
    }
    return (generateBitmask(prefixLength) >>> 0) as IPv4Bitflag;
}

/**
 * @function getMaskPrefix
 * @description Calculates the prefix length from a given subnet mask.
 * 
 * @param {IPv4Bitflag} mask - The subnet mask as an IPv4Bitflag.
 * @returns {number} The prefix length (0-32).
 * @throws {IPv4ValidationError} If the mask is invalid.
 *
 * @complexity
 * Time complexity: O(1) - Constant time operation using bitwise functions.
 * Space complexity: O(1) - Uses a constant amount of space.
 */
export function getMaskPrefix(mask: IPv4Bitflag): number {
    const prefix = countLeadingOnes(mask);
    if ((mask >>> 0) !== (createMask(prefix) >>> 0)) {
        throw new IPv4ValidationError('Invalid subnet mask');
    }
    return prefix;
}

/**
 * @function invertMaskBits
 * @description Inverts all bits in a mask (subnet to wildcard or vice versa).
 * 
 * @param {IPv4Bitflag} mask - The mask to invert.
 * @returns {IPv4Bitflag} The inverted mask.
 *
 * @complexity
 * Time complexity: O(1) - Constant time bitwise operation.
 * Space complexity: O(1) - Uses a constant amount of space.
 */
export function invertMaskBits(mask: IPv4Bitflag): IPv4Bitflag {
    return (invertMask(mask) >>> 0) as IPv4Bitflag;
}

/**
 * @function applyMask
 * @description Applies a mask to an IP address.
 * 
 * @param {IPv4Bitflag} ip - The IP address as an IPv4Bitflag.
 * @param {IPv4Bitflag} mask - The mask to apply.
 * @returns {IPv4Bitflag} The result of applying the mask to the IP.
 *
 * @complexity
 * Time complexity: O(1) - Constant time bitwise operation.
 * Space complexity: O(1) - Uses a constant amount of space.
 */
export function applyMask(ip: IPv4Bitflag, mask: IPv4Bitflag): IPv4Bitflag {
    return (and(ip, mask) >>> 0) as IPv4Bitflag;
}

/**
 * @function combineMasks
 * @description Combines two masks using bitwise AND.
 * 
 * @param {IPv4Bitflag} mask1 - The first mask.
 * @param {IPv4Bitflag} mask2 - The second mask.
 * @returns {IPv4Bitflag} The combined mask.
 *
 * @complexity
 * Time complexity: O(1) - Constant time bitwise operation.
 * Space complexity: O(1) - Uses a constant amount of space.
 */
export function combineMasks(mask1: IPv4Bitflag, mask2: IPv4Bitflag): IPv4Bitflag {
    return (and(mask1, mask2) >>> 0) as IPv4Bitflag;
}

/**
 * @function expandMask
 * @description Expands a mask by performing a bitwise OR with another mask.
 * 
 * @param {IPv4Bitflag} baseMask - The base mask to expand.
 * @param {IPv4Bitflag} expansionMask - The mask to expand with.
 * @returns {IPv4Bitflag} The expanded mask.
 *
 * @complexity
 * Time complexity: O(1) - Constant time bitwise operation.
 * Space complexity: O(1) - Uses a constant amount of space.
 */
export function expandMask(baseMask: IPv4Bitflag, expansionMask: IPv4Bitflag): IPv4Bitflag {
    return (or(baseMask, expansionMask) >>> 0) as IPv4Bitflag;
}

/**
 * @function getMaskDifference
 * @description Calculates the difference between two masks using XOR.
 * 
 * @param {IPv4Bitflag} mask1 - The first mask.
 * @param {IPv4Bitflag} mask2 - The second mask.
 * @returns {IPv4Bitflag} The difference between the masks.
 *
 * @complexity
 * Time complexity: O(1) - Constant time bitwise operation.
 * Space complexity: O(1) - Uses a constant amount of space.
 */
export function getMaskDifference(mask1: IPv4Bitflag, mask2: IPv4Bitflag): IPv4Bitflag {
    return (xor(mask1, mask2) >>> 0) as IPv4Bitflag;
}