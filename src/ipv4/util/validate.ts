import { ValidationResult, IPv4Address } from '@src/types';
import { extractBits, generateBitmask, applyMask } from '@src/ipv4/lib/bitwise/bitmask';
import { countSetFlags, hasFlag } from '@src/ipv4/lib/bitwise/bitflag';
import { leftShift, rightShift } from '@src/ipv4/lib/bitwise/basic';

export const VALID_IPV4_CHARS = 0x03FF4000; // Bitmask for valid IPv4 characters (0-9 and .)

/**
 * @function isValidChar
 * @description Checks if a character is valid based on a precomputed bitmask of allowed characters.
 * This function is typically used for validating IPv4 address characters.
 *
 * @param {number} charCode - The character code to check.
 * @param {number} validCharMask - Bitmask of valid characters. For IPv4, this is typically `VALID_IPV4_CHARS`.
 * @returns {boolean} True if the character is valid, false otherwise.
 */
export function isValidChar(charCode: number, validCharMask: number): boolean {
    return (validCharMask & (1 << charCode)) !== 0;
}

/**
 * Validates an IPv4 address string.
 * 
 * @param {string} ip - The IPv4 address to validate.
 * @returns {ValidationResult} The validation result.
 */
export function validateIPv4(ip: string): ValidationResult {
    // Check for invalid characters
    for (let i = 0; i < ip.length; i++) {
        if (!isValidChar(ip.charCodeAt(i), VALID_IPV4_CHARS)) {
            return { isValid: false, reason: `Invalid character in IP address: ${ip[i]}` };
        }
    }

    // Split the IP address into octets
    const octets = ip.split('.');

    // Check if we have exactly 4 octets
    if (octets.length !== 4) {
        return { isValid: false, reason: 'IPv4 address must have exactly 4 octets' };
    }

    let ipBitflag = 0;

    for (let i = 0; i < 4; i++) {
        const octet = parseInt(octets[i], 10);

        // Check if the octet is a valid number
        if (isNaN(octet)) {
            return { isValid: false, reason: `Invalid octet: ${octets[i]}` };
        }

        // Check if the octet is within the valid range (0-255)
        if (octet < 0 || octet > 255) {
            return { isValid: false, reason: `Octet out of range: ${octet}` };
        }

        // Check for leading zeros
        if (octets[i].length > 1 && octets[i][0] === '0') {
            return { isValid: false, reason: `Leading zeros are not allowed: ${octets[i]}` };
        }

        // Convert octet to bitflag and add it to the IP bitflag
        ipBitflag = leftShift(ipBitflag, 8);
        ipBitflag |= octet;
    }

    // Check for invalid IP addresses
    if (ipBitflag === 0) {
        return { isValid: false, reason: 'Invalid IP: 0.0.0.0' };
    }

    const classDMask = generateBitmask(4);
    const classEMask = generateBitmask(3);

    if (hasFlag(ipBitflag, classDMask)) {
        if (hasFlag(ipBitflag, classEMask)) {
            return { isValid: false, reason: 'Class E IP addresses are reserved' };
        }
        return { isValid: false, reason: 'Class D IP addresses are reserved for multicast' };
    }

    // Check for broadcast address
    if (ipBitflag === 0xFFFFFFFF) {
        return { isValid: false, reason: 'Broadcast IP address is not valid for hosts' };
    }

    // All checks passed
    return { isValid: true };
}

/**
 * Converts an IPv4 address string to its bitflag representation.
 * 
 * @param {IPv4Address} ip - The IPv4 address to convert.
 * @returns {number} The bitflag representation of the IPv4 address.
 */
export function ipv4ToBitflag(ip: IPv4Address): number {
    return ip.split('.').reduce((acc, octet) => (leftShift(acc, 8) | parseInt(octet, 10)), 0);
}

/**
 * Converts a bitflag representation to an IPv4 address string.
 * 
 * @param {number} bitflag - The bitflag representation of an IPv4 address.
 * @returns {IPv4Address} The IPv4 address string.
 */
export function bitflagToIPv4(bitflag: number): IPv4Address {
    return [
        extractBits(bitflag, 24, 31),
        extractBits(bitflag, 16, 23),
        extractBits(bitflag, 8, 15),
        extractBits(bitflag, 0, 7)
    ].join('.') as IPv4Address;
}