/**
 * @module ipv4/special.ts
 * @overview This module provides functions for working with special-use IPv4 addresses,
 * including private, reserved, and special-purpose addresses as defined by IANA.
 */

import type { IPv4Address } from '@src/types';
import { isIPInRange } from '@src/ipv4/core/operation';

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
  return isIPInRange(ip, '10.0.0.0', '10.255.255.255') ||
         isIPInRange(ip, '172.16.0.0', '172.31.255.255') ||
         isIPInRange(ip, '192.168.0.0', '192.168.255.255');
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
  return isIPInRange(ip, '127.0.0.0', '127.255.255.255');
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
  return isIPInRange(ip, '169.254.0.0', '169.254.255.255');
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
  return isIPInRange(ip, '224.0.0.0', '239.255.255.255');
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
  return ip === '255.255.255.255';
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
  return isIPInRange(ip, '240.0.0.0', '255.255.255.254') || // Future use
         isIPInRange(ip, '198.51.100.0', '198.51.100.255') || // TEST-NET-2
         isIPInRange(ip, '203.0.113.0', '203.0.113.255') || // TEST-NET-3
         ip === '192.0.2.0' || ip === '192.0.2.255'; // TEST-NET-1
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
  return isIPInRange(ip, '192.0.2.0', '192.0.2.255') || // TEST-NET-1
         isIPInRange(ip, '198.51.100.0', '198.51.100.255') || // TEST-NET-2
         isIPInRange(ip, '203.0.113.0', '203.0.113.255'); // TEST-NET-3
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
  return isIPInRange(ip, '198.18.0.0', '198.19.255.255');
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
  return isIPInRange(ip, '100.64.0.0', '100.127.255.255');
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
  if (isReservedIP(ip)) return 'Reserved';
  if (isDocumentationIP(ip)) return 'Documentation';
  if (isBenchmarkingIP(ip)) return 'Benchmarking';
  if (isSharedAddressSpaceIP(ip)) return 'Shared Address Space';
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
  const ranges: { [key: string]: [IPv4Address, IPv4Address][] } = {
    'Private': [
      ['10.0.0.0', '10.255.255.255'],
      ['172.16.0.0', '172.31.255.255'],
      ['192.168.0.0', '192.168.255.255']
    ],
    'Loopback': [['127.0.0.0', '127.255.255.255']],
    'Link-local': [['169.254.0.0', '169.254.255.255']],
    'Multicast': [['224.0.0.0', '239.255.255.255']],
    'Reserved': [
      ['240.0.0.0', '255.255.255.254'],
      ['198.51.100.0', '198.51.100.255'],
      ['203.0.113.0', '203.0.113.255']
    ],
    'Documentation': [
      ['192.0.2.0', '192.0.2.255'],
      ['198.51.100.0', '198.51.100.255'],
      ['203.0.113.0', '203.0.113.255']
    ],
    'Benchmarking': [['198.18.0.0', '198.19.255.255']],
    'Shared Address Space': [['100.64.0.0', '100.127.255.255']]
  };

  return ranges[type] || null;
}