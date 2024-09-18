// src/ipv4/util/helpers.ts

import type { IPv4Address, IPv4Bitflag } from '@src/types';
import { validateIPv4 } from './parse';

/**
 * Creates a branded IPv4Address after validation.
 *
 * @param address - The IPv4 address string.
 * @returns The branded IPv4Address.
 * @throws Error if the address is invalid.
 */
export function createIPv4Address(address: string): IPv4Address {
  const validationResult = validateIPv4(address);
  if (!validationResult.isValid) {
    throw new Error(`Invalid IPv4 address: ${validationResult.reason}`);
  }
  return address as IPv4Address;
}

/**
 * Creates a branded IPv4Bitflag after validation.
 *
 * @param flag - The bitflag number.
 * @returns The branded IPv4Bitflag.
 * @throws Error if the bitflag is invalid.
 */
export function createIPv4Bitflag(flag: number): IPv4Bitflag {
  if (
    !Number.isInteger(flag) ||
    flag < 0 ||
    flag > 0xFFFFFFFF ||
    !Number.isFinite(flag)
  ) {
    throw new Error(`Invalid IPv4 bitflag: ${flag}`);
  }
  return flag as IPv4Bitflag;
}

/**
 * Converts a branded IPv4Address to a string.
 *
 * @param address - The branded IPv4Address.
 * @returns The IP address as a string.
 */
export function ipv4AddressToString(address: IPv4Address): string {
  return address;
}

/**
 * Converts a string to a branded IPv4Address.
 *
 * @param address - The IP address as a string.
 * @returns The branded IPv4Address.
 */
export function stringToIPv4Address(address: string): IPv4Address {
  return createIPv4Address(address);
}

/**
 * Converts a branded IPv4Bitflag to a number.
 *
 * @param bitflag - The branded IPv4Bitflag.
 * @returns The bitflag as a number.
 */
export function ipv4BitflagToNumber(bitflag: IPv4Bitflag): number {
  return bitflag;
}
