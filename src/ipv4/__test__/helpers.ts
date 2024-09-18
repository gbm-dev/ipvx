// src/ipv4/core/__test__/helpers.ts

import type { IPv4Address, IPv4Bitflag } from '@src/types';
import { validateIPv4 } from '../util/parse';

/**
 * Creates a branded IPv4Address after validation.
 *
 * @param address - The IPv4 address string.
 * @returns The branded IPv4Address.
 * @throws Error if the address is invalid.
 */
export function createIPv4Address(address: string): IPv4Address {
  if (!validateIPv4(address)) {
    throw new Error(`Invalid IPv4 address: ${address}`);
  }
  return address as IPv4Address;
}
