/**
 * @file src/ipv4/utils/classify.ts
 * @description Utility functions for classifying IPv4 addresses.
 */

import type { IPv4Bitflag } from '@src/types';
import { parseIPv4 } from './parse';
import { extractBits, generateBitmask, applyMask } from '@src/ipv4/lib/bitwise/bitmask';
import { IPV4_MAX_ADDRESS } from '@src/ipv4/constants';
import { extractOctet } from './octet';

/**
 * Determines the class of an IPv4 address.
 * 
 * @param ip - The IPv4 address to classify.
 * @returns The class of the IP address ('A', 'B', 'C', 'D', or 'E').
 */
export function getIPClass(ip: IPv4Bitflag): string {
    const firstOctet = extractBits(ip, 24, 31);

    if (firstOctet < 128) return 'A';
    if (firstOctet < 192) return 'B';
    if (firstOctet < 224) return 'C';
    if (firstOctet < 240) return 'D';
    return 'E';
}

/**
 * Checks if an IPv4 address is in a private range.
 * 
 * @param ip - The IPv4 address to check.
 * @returns True if the IP is in a private range, false otherwise.
 */
export function isPrivateIP(ip: IPv4Bitflag): boolean {
    // Class A: 10.0.0.0 to 10.255.255.255
    if (applyMask(ip, parseIPv4('255.0.0.0') as IPv4Bitflag) === parseIPv4('10.0.0.0') as IPv4Bitflag) {
        return true;
    }

    // Class B: 172.16.0.0 to 172.31.255.255
    if (ip >= parseIPv4('172.16.0.0') as unknown as IPv4Bitflag && ip <= parseIPv4('172.31.255.255') as unknown as IPv4Bitflag) {
        return true;
    }

    // Class C: 192.168.0.0 to 192.168.255.255
    if (applyMask(ip, parseIPv4('255.255.0.0') as IPv4Bitflag) === parseIPv4('192.168.0.0') as IPv4Bitflag) {
        return true;
    }

    return false;
}


/**
 * Checks if an IPv4 address is a loopback address.
 * 
 * @param ip - The IPv4 address to check.
 * @returns True if the IP is a loopback address, false otherwise.
 */
export function isLoopbackIP(ip: IPv4Bitflag): boolean {
    // 127.0.0.0 to 127.255.255.255
    return applyMask(ip, generateBitmask(8)) === (127 << 24);
}

/**
 * Checks if an IPv4 address is a link-local address.
 * 
 * @param ip - The IPv4 address to check as a bitflag.
 * @returns True if the IP is a link-local address, false otherwise.
 */
export function isLinkLocalIP(ip: IPv4Bitflag): boolean {
    // Link-local addresses are in the range 169.254.0.0 to 169.254.255.255
    const linkLocalPrefix = 0xA9FE0000; // 169.254.0.0
    const mask = generateBitmask(16); // Mask for the first two octets

    return applyMask(ip, mask) === linkLocalPrefix;
}

/**
 * Checks if an IPv4 address is a multicast address.
 * 
 * @param ip - The IPv4 address to check.
 * @returns True if the IP is a multicast address, false otherwise.
 */
export function isMulticastIP(ip: IPv4Bitflag): boolean {
    return applyMask(ip, generateBitmask(4)) === 0xE0000000;
}

/**
 * Checks if an IPv4 address is a broadcast address.
 * 
 * @param ip - The IPv4 address to check.
 * @returns True if the IP is a broadcast address, false otherwise.
 */
export function isBroadcastIP(ip: IPv4Bitflag): boolean {
    // 255.255.255.255
    return ip === IPV4_MAX_ADDRESS;
}

/**
 * Checks if an IPv4 address is in a reserved range.
 * 
 * @param ip - The IPv4 address to check as a bitflag.
 * @returns True if the IP is in a reserved range, false otherwise.
 */
export function isReservedIP(ip: IPv4Bitflag): boolean {
    // 0.0.0.0/8 - Current network
    if (applyMask(ip, generateBitmask(8)) === 0x00000000) return true;

    // 100.64.0.0/10 - Shared address space
    if (applyMask(ip, generateBitmask(10)) === 0x64400000) return true;

    // 192.0.0.0/24 - IETF Protocol Assignments
    if (applyMask(ip, generateBitmask(24)) === 0xC0000000) return true;

    // 192.0.2.0/24 - TEST-NET-1, documentation and examples
    if (applyMask(ip, generateBitmask(24)) === 0xC0000200) return true;

    // 198.51.100.0/24 - TEST-NET-2, documentation and examples
    if (applyMask(ip, generateBitmask(24)) === 0xC6336400) return true;

    // 203.0.113.0/24 - TEST-NET-3, documentation and examples
    if (applyMask(ip, generateBitmask(24)) === 0xCB007100) return true;

    // 240.0.0.0/4 - Reserved for future use
    if (applyMask(ip, generateBitmask(4)) === 0xF0000000) return true;

    return false;
}

/**
 * @function isGloballyRoutableIP
 * @description Determines if an IPv4 address is globally routable.
 * 
 * @param {IPv4Bitflag} ip - The IPv4 address to check as a bitflag.
 * @returns {boolean} True if the IP is globally routable, false otherwise.
 *
 * @example
 * isGloballyRoutableIP(0x08080808 as IPv4Bitflag); // Returns true (8.8.8.8 is globally routable)
 * isGloballyRoutableIP(0xC0A80101 as IPv4Bitflag); // Returns false (192.168.1.1 is private)
 *
 * @complexity
 * Time complexity: O(1) - The function performs a fixed number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function isGloballyRoutableIP(ip: IPv4Bitflag): boolean {
    // Check if the IP is not private, loopback, link-local, multicast, broadcast, or in certain reserved ranges
    return !(isPrivateIP(ip) || isLoopbackIP(ip) || isLinkLocalIP(ip) || 
             isMulticastIP(ip) || isBroadcastIP(ip) || 
             (ip >= 0x00000000 && ip <= 0x00FFFFFF) || // 0.0.0.0/8
             (ip >= 0x64400000 && ip <= 0x647FFFFF) || // 100.64.0.0/10
             (ip >= 0xF0000000 && ip <= 0xFFFFFFFF));  // 240.0.0.0/4
    // Note: We're not excluding 192.0.2.0/24, 198.51.100.0/24, and 203.0.113.0/24 here
}

/**
 * @function getMulticastType
 * @description Provides a detailed classification of IPv4 multicast addresses.
 * 
 * @param {IPv4Bitflag} ip - The IPv4 address to classify as a bitflag.
 * @returns {string} The type of multicast address, or 'Not Multicast' if not applicable.
 *
 * @example
 * getMulticastType(0xE0000001 as IPv4Bitflag); // Returns 'Well-Known Multicast'
 * getMulticastType(0xEFFFFFFF as IPv4Bitflag); // Returns 'Administratively Scoped'
 * getMulticastType(0x0A000001 as IPv4Bitflag); // Returns 'Not Multicast'
 *
 * @complexity
 * Time complexity: O(1) - The function performs a fixed number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function getMulticastType(ip: IPv4Bitflag): string {
    if (!isMulticastIP(ip)) {
        return 'Not Multicast';
    }

    // Extract the second octet (index 1) using the extractOctet function
    const firstOctet = extractOctet(ip, 0);

    // Check for reserved ranges within multicast space
    if (isReservedIP(ip)) {
        return 'Reserved';
    }

    // Handle specific multicast ranges
    switch (firstOctet) {
        case 224:
            return 'Well-Known Multicast';
        case 225:
            return 'Transient Multicast';
        case 238:
            // Check if it's in the 238.0.0.0/24 range
            if (applyMask(ip, generateBitmask(24)) === 0xEE000000) {
                return 'Unicast-Prefix-based Multicast';
            }
            return 'Reserved';
        case 239:
            return 'Administratively Scoped';
    }

    // Classify remaining ranges
    if (firstOctet >= 232 && firstOctet <= 235) {
        return 'Source-Specific Multicast';
    } else if (firstOctet >= 236 && firstOctet <= 237) {
        return 'GLOP Addressing';
    }

    // Any other cases are considered reserved
    return 'Reserved';
}