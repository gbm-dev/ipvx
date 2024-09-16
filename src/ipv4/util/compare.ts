/**
 * @file src/ipv4/utils/compare.ts
 * @description Utility functions for comparing IPv4 addresses and ranges.
 */

import type { IPv4Bitflag } from '@src/types';

/**
 * Compares two IPv4 addresses.
 * 
 * @param ip1 - The first IPv4 address to compare.
 * @param ip2 - The second IPv4 address to compare.
 * @returns -1 if ip1 < ip2, 0 if ip1 === ip2, 1 if ip1 > ip2
 */
export function compareIPs(ip1: IPv4Bitflag, ip2: IPv4Bitflag): number {
    // Implementation goes here
}

/**
 * Checks if an IP address is within a given range.
 * 
 * @param ip - The IP address to check.
 * @param startIP - The start of the IP range.
 * @param endIP - The end of the IP range.
 * @returns True if the IP is within the range, false otherwise.
 */
export function isIPInRange(ip: IPv4Bitflag, startIP: IPv4Bitflag, endIP: IPv4Bitflag): boolean {
    // Implementation goes here
}