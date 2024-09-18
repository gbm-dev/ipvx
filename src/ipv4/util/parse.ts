import type { IPv4Address, IPv4Bitflag, ValidationResult } from '@src/types';
import { leftShift, or } from '@src/ipv4/lib/bitwise/basic';
import { IPV4_OCTET_COUNT, IPV4_MAX_OCTET_VALUE, VALID_IPV4_CHARS } from '@src/ipv4/constants';
import { IPv4ValidationError } from '@src/ipv4/errors';
import { bitflagToOctets, octetsToBitflag } from './octet';

/**
 * @function validateIPv4
 * @description Validates an IPv4 address string.
 * 
 * @param {string} ip - The IPv4 address to validate.
 * @returns {ValidationResult} The validation result.
 *
 * @complexity
 * Time complexity: O(n), where n is the length of the input string.
 * Space complexity: O(1), as it uses a constant amount of additional space.
 */
export function validateIPv4(ip: string): ValidationResult {
    // Check for invalid characters
    for (let i = 0; i < ip.length; i++) {
        if (!isValidChar(ip.charCodeAt(i), VALID_IPV4_CHARS)) {
            return { isValid: false, reason: `Invalid character in IP address: ${ip[i]}` };
        }
    }

    const octets = ip.split('.');

    if (octets.length !== IPV4_OCTET_COUNT) {
        return { isValid: false, reason: 'IPv4 address must have exactly 4 octets' };
    }

    for (let i = 0; i < IPV4_OCTET_COUNT; i++) {
        const octet = parseInt(octets[i], 10);

        if (isNaN(octet)) {
            return { isValid: false, reason: `Invalid octet: ${octets[i]}` };
        }

        if (octet < 0 || octet > IPV4_MAX_OCTET_VALUE) {
            return { isValid: false, reason: `Octet out of range: ${octet}` };
        }

        if (octets[i].length > 1 && octets[i][0] === '0') {
            return { isValid: false, reason: `Leading zeros are not allowed: ${octets[i]}` };
        }
    }

    return { isValid: true };
}

/**
 * @function parseIPv4
 * @description Parses an IPv4 address string into its bitflag representation.
 * 
 * @param {string} ip - The IPv4 address string to parse.
 * @returns {IPv4Bitflag} The bitflag representation of the IPv4 address.
 * @throws {IPv4ValidationError} If the input is not a valid IPv4 address.
 *
 * @complexity
 * Time complexity: O(n), where n is the length of the input string (due to validation).
 * Space complexity: O(1), as it uses a constant amount of additional space.
 */
export function parseIPv4(ip: string): IPv4Bitflag {
    const validationResult = validateIPv4(ip);
    if (!validationResult.isValid) {
        throw new IPv4ValidationError(validationResult.reason || 'Invalid IPv4 address');
    }

    const octets = ip.split('.').map(octet => parseInt(octet, 10));
    return octetsToBitflag(octets as [number, number, number, number]);
}

/**
 * @function formatIPv4
 * @description Converts an IPv4Bitflag to its string representation.
 * 
 * @param {IPv4Bitflag} bitflag - The IPv4 bitflag to convert.
 * @returns {IPv4Address} The string representation of the IPv4 address.
 *
 * @complexity
 * Time complexity: O(1) - The function performs a fixed number of operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function formatIPv4(bitflag: IPv4Bitflag): IPv4Address {
    const octets = bitflagToOctets(bitflag);
    return octets.join('.') as IPv4Address;
}

/**
 * @function bitflagToIP
 * @description Alias for formatIPv4. Converts an IPv4Bitflag to its string representation.
 *
 * @param {IPv4Bitflag} bitflag - The IPv4 bitflag to convert.
 * @returns {IPv4Address} The string representation of the IPv4 address.
 *
 * @complexity
 * Time complexity: O(1) - Same as formatIPv4.
 * Space complexity: O(1) - Same as formatIPv4.
 */
export const bitflagToIP = formatIPv4;

/**
 * @function ipToNumber
 * @description Converts an IPv4 address string to its numeric representation.
 * 
 * @param {IPv4Address} ip - The IPv4 address to convert.
 * @returns {number} The numeric representation of the IPv4 address.
 * @throws {IPv4ValidationError} If the input is not a valid IPv4 address.
 *
 * @complexity
 * Time complexity: O(n), where n is the length of the input string (due to validation in parseIPv4).
 * Space complexity: O(1), as it uses a constant amount of additional space.
 */
export function ipToNumber(ip: IPv4Address): number {
    return parseIPv4(ip) as number;
}

/**
 * @function numberToIP
 * @description Converts a numeric representation to an IPv4 address string.
 * 
 * @param {number} num - The numeric representation of an IPv4 address.
 * @returns {IPv4Address} The IPv4 address string.
 * @throws {Error} If the input is not a valid IPv4 numeric representation.
 *
 * @complexity
 * Time complexity: O(1) - The function performs a fixed number of operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function numberToIP(num: number): IPv4Address {
    if (num < 0 || num > 0xFFFFFFFF) {
        throw new Error('Invalid IPv4 numeric representation');
    }
    return formatIPv4(num as IPv4Bitflag);
}

/**
 * @function ipToBinary
 * @description Converts an IPv4 address to its binary string representation.
 * 
 * @param {IPv4Address} ip - The IPv4 address to convert.
 * @returns {string} The binary string representation of the IPv4 address.
 * @throws {IPv4ValidationError} If the input is not a valid IPv4 address.
 *
 * @complexity
 * Time complexity: O(n), where n is the length of the input string (due to validation in parseIPv4).
 * Space complexity: O(1), as it uses a constant amount of additional space.
 */
export function ipToBinary(ip: IPv4Address): string {
    const bitflag = parseIPv4(ip);
    return bitflag.toString(2).padStart(32, '0');
}

/**
 * @function binaryToIP
 * @description Converts a binary string to an IPv4 address.
 * 
 * @param {string} binary - The binary string representation of an IPv4 address.
 * @returns {IPv4Address} The IPv4 address.
 * @throws {Error} If the input is not a valid 32-bit binary string.
 *
 * @complexity
 * Time complexity: O(1) - The function performs a fixed number of operations (32 iterations).
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function binaryToIP(binary: string): IPv4Address {
    if (binary.length !== 32) {
        throw new Error('Invalid binary string length for IPv4 address');
    }

    let bitflag: IPv4Bitflag = 0 as IPv4Bitflag;

    for (let i = 0; i < 32; i++) {
        if (binary[i] !== '0' && binary[i] !== '1') {
            throw new Error('Invalid character in binary string');
        }
        bitflag = or(leftShift(bitflag, 1), binary[i] === '1' ? 1 : 0) as IPv4Bitflag;
    }

    return formatIPv4(bitflag);
}

/**
 * @function isValidChar
 * @description Checks if a character is valid based on a precomputed bitmask of allowed characters.
 *
 * @param {number} charCode - The character code to check.
 * @param {number} validCharMask - Bitmask of valid characters.
 * @returns {boolean} True if the character is valid, false otherwise.
 *
 * @complexity
 * Time complexity: O(1) - The function performs a constant number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function isValidChar(charCode: number, validCharMask: number): boolean {
    return (validCharMask & (1 << charCode)) !== 0;
}
