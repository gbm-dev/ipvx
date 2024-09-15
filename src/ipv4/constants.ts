/**
 * @file src/ipv4/core/constants.ts
 * @description This module stores shared constants used across the IPv4 operations.
 */

import type { IPv4Bitflag } from '@src/types';

/**
 * The number of bits in an IPv4 address.
 */
export const IPV4_BIT_LENGTH: number = 32;

/**
 * The number of octets in an IPv4 address.
 */
export const IPV4_OCTET_COUNT: number = 4;

/**
 * The maximum value of an octet in an IPv4 address.
 */
export const IPV4_MAX_OCTET_VALUE: number = 255;

/**
 * The minimum prefix length for an IPv4 subnet.
 */
export const IPV4_MIN_PREFIX_LENGTH: number = 0;

/**
 * The maximum prefix length for an IPv4 subnet.
 */
export const IPV4_MAX_PREFIX_LENGTH: number = 32;

/**
 * Bitflag representation of the maximum IPv4 address (255.255.255.255).
 */
export const IPV4_MAX_ADDRESS: IPv4Bitflag = 0xFFFFFFFF as IPv4Bitflag;

/**
 * Bitflag representation of the minimum IPv4 address (0.0.0.0).
 */
export const IPV4_MIN_ADDRESS: IPv4Bitflag = 0x00000000 as IPv4Bitflag;
