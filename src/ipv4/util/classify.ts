/**
 * @file src/ipv4/utils/classify.ts
 * @description Utility functions for classifying IPv4 addresses.
 */

import type { IPv4Bitflag } from '@src/types';
import { extractBits, generateBitmask, applyMask } from '@src/ipv4/lib/bitwise/bitmask';
import { IPV4_MAX_ADDRESS } from '../constants';

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
    // 10.0.0.0 to 10.255.255.255
    const classA = applyMask(ip, generateBitmask(8)) === (10 << 24);

    // 172.16.0.0 to 172.31.255.255
    const classB = applyMask(ip, generateBitmask(12)) === (172 << 24 | 16 << 16);

    // 192.168.0.0 to 192.168.255.255
    const classC = applyMask(ip, generateBitmask(16)) === (192 << 24 | 168 << 16);

    return classA || classB || classC;
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
 * @param ip - The IPv4 address to check.
 * @returns True if the IP is a link-local address, false otherwise.
 */
export function isLinkLocalIP(ip: IPv4Bitflag): boolean {
    // 169.254.0.0 to 169.254.255.255
    return applyMask(ip, generateBitmask(16)) === (169 << 24 | 254 << 16);
}

/**
 * Checks if an IPv4 address is a multicast address.
 * 
 * @param ip - The IPv4 address to check.
 * @returns True if the IP is a multicast address, false otherwise.
 */
export function isMulticastIP(ip: IPv4Bitflag): boolean {
    // 224.0.0.0 to 239.255.255.255
    const firstOctet = extractBits(ip, 24, 31);
    return firstOctet >= 224 && firstOctet <= 239;
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
 * @param ip - The IPv4 address to check.
 * @returns True if the IP is in a reserved range, false otherwise.
 */
export function isReservedIP(ip: IPv4Bitflag): boolean {
    // 0.0.0.0/8 - Current network
    const currentNetwork = applyMask(ip, generateBitmask(8)) === 0;

    // 100.64.0.0/10 - Shared address space for communications between a service provider and its subscribers
    const sharedAddressSpace = applyMask(ip, generateBitmask(10)) === (100 << 24 | 64 << 16);

    // 192.0.0.0/24 - IETF Protocol Assignments
    const ietfProtocolAssignments = applyMask(ip, generateBitmask(24)) === (192 << 24);

    // 192.0.2.0/24 - TEST-NET-1, documentation and examples
    const testNet1 = applyMask(ip, generateBitmask(24)) === (192 << 24 | 2 << 16);

    // 198.51.100.0/24 - TEST-NET-2, documentation and examples
    const testNet2 = applyMask(ip, generateBitmask(24)) === (198 << 24 | 51 << 16 | 100 << 8);

    // 203.0.113.0/24 - TEST-NET-3, documentation and examples
    const testNet3 = applyMask(ip, generateBitmask(24)) === (203 << 24 | 113 << 8);

    // 240.0.0.0/4 - Reserved for future use
    const futureUse = extractBits(ip, 28, 31) === 0xF;

    return currentNetwork || sharedAddressSpace || ietfProtocolAssignments || 
           testNet1 || testNet2 || testNet3 || futureUse || 
           isLoopbackIP(ip) || isLinkLocalIP(ip) || isMulticastIP(ip) || isBroadcastIP(ip);
}