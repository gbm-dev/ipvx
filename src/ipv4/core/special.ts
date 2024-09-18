/**
 * @module ipv4/special.ts
 * @overview This module provides functions for working with special-use IPv4 addresses,
 * including private, reserved, and special-purpose addresses as defined by IANA.
 */

import type { IPv4Address } from '@src/types';
import { isIPInRange } from '@src/ipv4/core/operation';
import { assertIPv4Address } from '@src/ipv4/util/helper';
import { parseIPv4 as ipToBitflag } from '@src/ipv4/util/parse';

/**
 * Predefined IP ranges for various special-use categories.
 * These are validated and converted to IPv4Address types using factory functions.
 */
const PRIVATE_RANGES: [IPv4Address, IPv4Address][] = [
  [assertIPv4Address('10.0.0.0'), assertIPv4Address('10.255.255.255')],
  [assertIPv4Address('172.16.0.0'), assertIPv4Address('172.31.255.255')],
  [assertIPv4Address('192.168.0.0'), assertIPv4Address('192.168.255.255')],
];

const LOOPBACK_RANGE: [IPv4Address, IPv4Address] = [
  assertIPv4Address('127.0.0.0'),
  assertIPv4Address('127.255.255.255'),
];

const LINK_LOCAL_RANGE: [IPv4Address, IPv4Address] = [
  assertIPv4Address('169.254.0.0'),
  assertIPv4Address('169.254.255.255'),
];

const MULTICAST_RANGE: [IPv4Address, IPv4Address] = [
  assertIPv4Address('224.0.0.0'),
  assertIPv4Address('239.255.255.255'),
];

const BROADCAST_IP: IPv4Address = assertIPv4Address('255.255.255.255');

const DOCUMENTATION_RANGES: [IPv4Address, IPv4Address][] = [
  [assertIPv4Address('192.0.2.0'), assertIPv4Address('192.0.2.255')], // TEST-NET-1
  [assertIPv4Address('198.51.100.0'), assertIPv4Address('198.51.100.255')], // TEST-NET-2
  [assertIPv4Address('203.0.113.0'), assertIPv4Address('203.0.113.255')], // TEST-NET-3
];

const BENCHMARKING_RANGE: [IPv4Address, IPv4Address] = [
  assertIPv4Address('198.18.0.0'),
  assertIPv4Address('198.19.255.255'),
];

const SHARED_ADDRESS_SPACE_RANGE: [IPv4Address, IPv4Address] = [
  assertIPv4Address('100.64.0.0'),
  assertIPv4Address('100.127.255.255'),
];

const RESERVED_RANGES: [IPv4Address, IPv4Address][] = [
  [assertIPv4Address('0.0.0.0'), assertIPv4Address('0.255.255.255')],
  [assertIPv4Address('240.0.0.0'), assertIPv4Address('255.255.255.254')],
];

/**
 * @function isPrivateIP
 * @description Checks if an IPv4 address is in a private range.
 *
 * @param {IPv4Address} ip - The IPv4 address to check.
 * @returns {boolean} True if the IP is in a private range, false otherwise.
 *
 * @complexity
 * Time complexity: O(1) - Fixed number of range checks.
 * Space complexity: O(1) - Uses constant extra space.
 */
export function isPrivateIP(ip: IPv4Address): boolean {
  return PRIVATE_RANGES.some(([start, end]) => isIPInRange(ip, start, end));
}

/**
 * @function isLoopbackIP
 * @description Checks if an IPv4 address is a loopback address.
 *
 * @param {IPv4Address} ip - The IPv4 address to check.
 * @returns {boolean} True if the IP is a loopback address, false otherwise.
 *
 * @complexity
 * Time complexity: O(1) - Fixed number of operations.
 * Space complexity: O(1) - Uses constant extra space.
 */
export function isLoopbackIP(ip: IPv4Address): boolean {
  return isIPInRange(ip, LOOPBACK_RANGE[0], LOOPBACK_RANGE[1]);
}

/**
 * @function isLinkLocalIP
 * @description Checks if an IPv4 address is a link-local address.
 *
 * @param {IPv4Address} ip - The IPv4 address to check.
 * @returns {boolean} True if the IP is a link-local address, false otherwise.
 *
 * @complexity
 * Time complexity: O(1) - Fixed number of operations.
 * Space complexity: O(1) - Uses constant extra space.
 */
export function isLinkLocalIP(ip: IPv4Address): boolean {
  return isIPInRange(ip, LINK_LOCAL_RANGE[0], LINK_LOCAL_RANGE[1]);
}

/**
 * @function isMulticastIP
 * @description Checks if an IPv4 address is a multicast address.
 *
 * @param {IPv4Address} ip - The IPv4 address to check.
 * @returns {boolean} True if the IP is a multicast address, false otherwise.
 *
 * @complexity
 * Time complexity: O(1) - Fixed number of operations.
 * Space complexity: O(1) - Uses constant extra space.
 */
export function isMulticastIP(ip: IPv4Address): boolean {
  return isIPInRange(ip, MULTICAST_RANGE[0], MULTICAST_RANGE[1]);
}

/**
 * @function isBroadcastIP
 * @description Checks if an IPv4 address is the limited broadcast address.
 *
 * @param {IPv4Address} ip - The IPv4 address to check.
 * @returns {boolean} True if the IP is the limited broadcast address, false otherwise.
 *
 * @complexity
 * Time complexity: O(1) - Fixed number of operations.
 * Space complexity: O(1) - Uses constant extra space.
 */
export function isBroadcastIP(ip: IPv4Address): boolean {
  return ip === BROADCAST_IP;
}

/**
 * @function isDocumentationIP
 * @description Checks if an IPv4 address is reserved for documentation.
 *
 * @param {IPv4Address} ip - The IPv4 address to check.
 * @returns {boolean} True if the IP is reserved for documentation, false otherwise.
 *
 * @complexity
 * Time complexity: O(1) - Fixed number of range checks.
 * Space complexity: O(1) - Uses constant extra space.
 */
export function isDocumentationIP(ip: IPv4Address): boolean {
  return DOCUMENTATION_RANGES.some(([start, end]) => isIPInRange(ip, start, end));
}

/**
 * @function isBenchmarkingIP
 * @description Checks if an IPv4 address is reserved for benchmarking.
 *
 * @param {IPv4Address} ip - The IPv4 address to check.
 * @returns {boolean} True if the IP is reserved for benchmarking, false otherwise.
 *
 * @complexity
 * Time complexity: O(1) - Fixed number of operations.
 * Space complexity: O(1) - Uses constant extra space.
 */
export function isBenchmarkingIP(ip: IPv4Address): boolean {
  return isIPInRange(ip, BENCHMARKING_RANGE[0], BENCHMARKING_RANGE[1]);
}

/**
 * @function isSharedAddressSpaceIP
 * @description Checks if an IPv4 address is in the shared address space.
 *
 * @param {IPv4Address} ip - The IPv4 address to check.
 * @returns {boolean} True if the IP is in the shared address space, false otherwise.
 *
 * @complexity
 * Time complexity: O(1) - Fixed number of operations.
 * Space complexity: O(1) - Uses constant extra space.
 */
export function isSharedAddressSpaceIP(ip: IPv4Address): boolean {
  return isIPInRange(ip, SHARED_ADDRESS_SPACE_RANGE[0], SHARED_ADDRESS_SPACE_RANGE[1]);
}

/**
 * @function isReservedIP
 * @description Checks if an IPv4 address is in a reserved range.
 *
 * @param {IPv4Address} ip - The IPv4 address to check.
 * @returns {boolean} True if the IP is in a reserved range, false otherwise.
 *
 * @complexity
 * Time complexity: O(1) - Fixed number of range checks.
 * Space complexity: O(1) - Uses constant extra space.
 */
export function isReservedIP(ip: IPv4Address): boolean {
  return RESERVED_RANGES.some(([start, end]) => isIPInRange(ip, start, end));
}

/**
 * @function getSpecialIPType
 * @description Determines the type of special IP address, if any.
 *
 * @param {IPv4Address} ip - The IPv4 address to check.
 * @returns {string} The type of special IP address, or 'Public' if not special.
 *
 * @complexity
 * Time complexity: O(1) - Fixed number of checks.
 * Space complexity: O(1) - Uses constant extra space.
 */
export function getSpecialIPType(ip: IPv4Address): string {
  if (isPrivateIP(ip)) return 'Private';
  if (isLoopbackIP(ip)) return 'Loopback';
  if (isLinkLocalIP(ip)) return 'Link-local';
  if (isMulticastIP(ip)) return 'Multicast';
  if (isBroadcastIP(ip)) return 'Broadcast';
  if (isBenchmarkingIP(ip)) return 'Benchmarking';
  if (isSharedAddressSpaceIP(ip)) return 'Shared Address Space';
  if (isDocumentationIP(ip)) return 'Documentation';
  if (isReservedIP(ip)) return 'Reserved';
  return 'Public';
}

/**
 * @function isGlobalUnicastIP
 * @description Checks if an IPv4 address is a global unicast address (public and not special-use).
 *
 * @param {IPv4Address} ip - The IPv4 address to check.
 * @returns {boolean} True if the IP is a global unicast address, false otherwise.
 *
 * @complexity
 * Time complexity: O(1) - Fixed number of operations.
 * Space complexity: O(1) - Uses constant extra space.
 */
export function isGlobalUnicastIP(ip: IPv4Address): boolean {
  return getSpecialIPType(ip) === 'Public';
}

/**
 * @function getSpecialIPRange
 * @description Gets the range of a special IP address type.
 *
 * @param {string} type - The type of special IP address.
 * @returns {[IPv4Address, IPv4Address][] | null} An array of IP ranges for the given type, or null if not found.
 *
 * @complexity
 * Time complexity: O(1) - Fixed number of operations.
 * Space complexity: O(1) - Uses constant extra space.
 */
export function getSpecialIPRange(type: string): [IPv4Address, IPv4Address][] | null {
  const normalizedType = type.toLowerCase();
  const ranges: { [key: string]: [IPv4Address, IPv4Address][] } = {
    'private': PRIVATE_RANGES,
    'loopback': [LOOPBACK_RANGE],
    'link-local': [LINK_LOCAL_RANGE],
    'multicast': [MULTICAST_RANGE],
    'broadcast': [[BROADCAST_IP, BROADCAST_IP]],
    'reserved': RESERVED_RANGES,
    'documentation': DOCUMENTATION_RANGES,
    'benchmarking': [BENCHMARKING_RANGE],
    'shared address space': [SHARED_ADDRESS_SPACE_RANGE],
  };

  return ranges[normalizedType] || null;
}
