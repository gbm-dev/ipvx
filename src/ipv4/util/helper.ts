/**
 * @file src/ipv4/util/helpers.ts
 * @description This module provides helper functions for safely asserting and converting between IPv4 address types.
 * These functions are primarily used for type checking and in tests to avoid explicit casting.
 */

import type { IPv4Address, IPv4Bitflag } from '@src/types';
import { validateIPv4 } from './parse';
import { IPV4_MAX_ADDRESS } from '@src/ipv4/constants';

/**
 * @function assertIPv4Address
 * @description Asserts that a string is a valid IPv4 address and returns it as a branded IPv4Address type.
 * 
 * @param {string} address - The IPv4 address string to assert.
 * @returns {IPv4Address} The branded IPv4Address.
 * @throws {Error} If the address is invalid.
 *
 * @example
 * const validIP = assertIPv4Address("192.168.1.1"); // Returns "192.168.1.1" as IPv4Address
 * assertIPv4Address("256.0.0.1"); // Throws an Error
 */
export function assertIPv4Address(address: string): IPv4Address {
    const trimmedAddress = address.trim();

    // Check for leading or trailing whitespace
    if (trimmedAddress !== address) {
        throw new Error(`Invalid IPv4 address: '${address}' - Leading or trailing whitespace not allowed.`);
    }

    const validationResult = validateIPv4(trimmedAddress);
    if (!validationResult.isValid) {
      throw new Error(`Invalid IPv4 address: ${validationResult.reason}`);
    }
    return (validationResult.cleanedIP || trimmedAddress) as IPv4Address;
}

/**
 * @function assertIPv4Bitflag
 * @description Asserts that a number is a valid IPv4 bitflag and returns it as a branded IPv4Bitflag type.
 * 
 * @param {number} flag - The bitflag number to assert.
 * @returns {IPv4Bitflag} The branded IPv4Bitflag.
 * @throws {Error} If the bitflag is invalid.
 */
export function assertIPv4Bitflag(flag: number): IPv4Bitflag {
    if (
      !Number.isInteger(flag) ||
      flag < 0 ||
      flag > IPV4_MAX_ADDRESS ||
      !Number.isFinite(flag) ||
      Object.is(flag, -0) ||
      !Number.isSafeInteger(flag) ||
      // Check if the number is not exactly equal to its integer representation
      flag !== Math.floor(flag)
    ) {
      throw new Error("Invalid IPv4 bitflag");
    }
    return flag as IPv4Bitflag;
  }

/**
 * @function convertIPv4AddressToString
 * @description Converts a branded IPv4Address to a string. This function is mainly for explicit type conversion in tests.
 * 
 * @param {IPv4Address} address - The branded IPv4Address to convert.
 * @returns {string} The IP address as a string.
 *
 * @example
 * const ipString = convertIPv4AddressToString("192.168.1.1" as IPv4Address); // Returns "192.168.1.1"
 */
export function convertIPv4AddressToString(address: IPv4Address): string {
  return address;
}

/**
 * @function convertStringToIPv4Address
 * @description Converts a string to a branded IPv4Address. This function is mainly for explicit type conversion in tests.
 * 
 * @param {string} address - The IP address as a string to convert.
 * @returns {IPv4Address} The branded IPv4Address.
 * @throws {Error} If the address is invalid.
 *
 * @example
 * const ipAddress = convertStringToIPv4Address("192.168.1.1"); // Returns "192.168.1.1" as IPv4Address
 * convertStringToIPv4Address("256.0.0.1"); // Throws an Error
 */
export function convertStringToIPv4Address(address: string): IPv4Address {
  return assertIPv4Address(address);
}

/**
 * @function convertIPv4BitflagToNumber
 * @description Converts a branded IPv4Bitflag to a number. This function is mainly for explicit type conversion in tests.
 * 
 * @param {IPv4Bitflag} bitflag - The branded IPv4Bitflag to convert.
 * @returns {number} The bitflag as a number.
 *
 * @example
 * const num = convertIPv4BitflagToNumber(0xC0A80101 as IPv4Bitflag); // Returns 3232235777
 */
export function convertIPv4BitflagToNumber(bitflag: IPv4Bitflag): number {
  return bitflag;
}