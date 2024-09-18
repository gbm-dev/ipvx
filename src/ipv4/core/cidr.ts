/**
 * @file cidr.ts
 * @module ipv4/utils/cidr
 * @description Provides core network functions for CIDR calculations and manipulations.
 */

import type { IPAddress, IPv4Address, IPv4Bitflag } from '@src/types';
import { IPv4ValidationError, IPv4SubnetError } from '@src/ipv4/errors';
import { IPV4_MAX_PREFIX_LENGTH, IPV4_MIN_PREFIX_LENGTH } from '@src/ipv4/constants';
import { parseIPv4, formatIPv4 } from '@src/ipv4/util/parse';
import { createMask, getPrefixLength } from '@src/ipv4/util/mask';
import { applyMask, generateBitmask } from '@src/ipv4/lib/bitwise/bitmask';
import { and, or, not } from '@src/ipv4/lib/bitwise/basic';

/**
 * @function parseCIDR
 * @description Parses a CIDR notation string into its IP address and prefix length components.
 * 
 * @param {string} cidr - The CIDR notation string (e.g., "192.168.1.0/24").
 * @returns {[IPv4Address, number]} A tuple containing the IP address and prefix length.
 * @throws {IPv4ValidationError} If the CIDR notation is invalid.
 * 
 * @example
 * parseCIDR("192.168.1.0/24"); // Returns ["192.168.1.0", 24]
 * 
 * @complexity
 * Time complexity: O(1) - The function performs a fixed number of operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function parseCIDR(cidr: string): [IPv4Address, number] {
    const parts = cidr.split('/');
    if (parts.length !== 2) {
        throw new IPv4ValidationError('Invalid CIDR notation');
    }

    const ipAddress = parts[0] as IPv4Address;
    const prefixLength = parseInt(parts[1], 10);

    if (isNaN(prefixLength) || prefixLength < IPV4_MIN_PREFIX_LENGTH || prefixLength > IPV4_MAX_PREFIX_LENGTH) {
        throw new IPv4ValidationError('Invalid prefix length');
    }

    // Validate the IP address
    parseIPv4(ipAddress); // This will throw an error if the IP is invalid

    return [ipAddress, prefixLength];
}

/**
 * @function calculateNetworkAddress
 * @description Calculates the network address for a given IP address and prefix length.
 * 
 * @param {IPv4Address} ip - The IP address.
 * @param {number} prefixLength - The prefix length of the subnet.
 * @returns {IPv4Address} The network address.
 * 
 * @example
 * calculateNetworkAddress("192.168.1.100", 24); // Returns "192.168.1.0"
 * 
 * @complexity
 * Time complexity: O(1) - The function performs a fixed number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function calculateNetworkAddress(ip: IPv4Address, prefixLength: number): IPv4Address {
    const ipBitflag = parseIPv4(ip);
    const mask = createSubnetMask(prefixLength);
    const networkBitflag = (applyMask(ipBitflag, mask)) >>> 0;
    return formatIPv4(networkBitflag as IPv4Bitflag);
}


/**
 * @function calculateBroadcastAddress
 * @description Calculates the broadcast address for a given IP address and prefix length.
 * 
 * @param {IPv4Address} ip - The IP address.
 * @param {number} prefixLength - The prefix length of the subnet.
 * @returns {IPv4Address} The broadcast address.
 * 
 * @example
 * calculateBroadcastAddress("192.168.1.100", 24); // Returns "192.168.1.255"
 * 
 * @complexity
 * Time complexity: O(1) - The function performs a fixed number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function calculateBroadcastAddress(ip: IPv4Address, prefixLength: number): IPv4Address {
    const ipBitflag = parseIPv4(ip);
    const mask = createSubnetMask(prefixLength);
    const invertedMask = (not(mask)) >>> 0;
    const broadcastBitflag = (or(ipBitflag, invertedMask)) >>> 0;
    return formatIPv4(broadcastBitflag as IPv4Bitflag);
}


/**
 * @function isInSubnet
 * @description Checks if a given IP address is within a specified subnet.
 * 
 * @param {IPv4Address} ip - The IP address to check.
 * @param {IPv4Address} subnetIp - The subnet's network address.
 * @param {number} prefixLength - The prefix length of the subnet.
 * @returns {boolean} True if the IP is in the subnet, false otherwise.
 * 
 * @example
 * isInSubnet("192.168.1.100", "192.168.1.0", 24); // Returns true
 * 
 * @complexity
 * Time complexity: O(1) - The function performs a fixed number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function isInSubnet(ip: IPv4Address, subnetIp: IPv4Address, prefixLength: number): boolean {
    const ipBitflag = parseIPv4(ip);
    const subnetBitflag = parseIPv4(subnetIp);
    const mask = createSubnetMask(prefixLength);
    return (applyMask(ipBitflag, mask) >>> 0) === (applyMask(subnetBitflag, mask) >>> 0);
}


/**
 * @function calculateAvailableIPs
 * @description Calculates the number of available IP addresses in a subnet.
 * 
 * @param {number} prefixLength - The prefix length of the subnet.
 * @returns {number} The number of available IP addresses.
 * 
 * @example
 * calculateAvailableIPs(24); // Returns 254 (256 total - network and broadcast)
 * 
 * @complexity
 * Time complexity: O(1) - The function performs a fixed number of arithmetic operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function calculateAvailableIPs(prefixLength: number): number {
    if (prefixLength < IPV4_MIN_PREFIX_LENGTH || prefixLength > IPV4_MAX_PREFIX_LENGTH) {
        throw new IPv4SubnetError('Invalid prefix length');
    }
    if (prefixLength === IPV4_MAX_PREFIX_LENGTH) return 1; // /32 has only one IP
    if (prefixLength === IPV4_MAX_PREFIX_LENGTH - 1) return 2; // /31 has two usable IPs
    return Math.pow(2, IPV4_MAX_PREFIX_LENGTH - prefixLength) - 2;
}


/**
 * @function calculateFirstUsableIP
 * @description Calculates the first usable IP address in a subnet.
 * 
 * @param {IPv4Address} networkAddress - The network address of the subnet.
 * @param {number} prefixLength - The prefix length of the subnet.
 * @returns {IPv4Address} The first usable IP address.
 * 
 * @example
 * calculateFirstUsableIP("192.168.1.0", 24); // Returns "192.168.1.1"
 * 
 * @complexity
 * Time complexity: O(1) - The function performs a fixed number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function calculateFirstUsableIP(networkAddress: IPv4Address, prefixLength: number): IPv4Address {
    const networkBitflag = parseIPv4(networkAddress);
    if (prefixLength >= IPV4_MAX_PREFIX_LENGTH - 1) return formatIPv4(networkBitflag); // For /31 and /32
    const firstUsableBitflag = (networkBitflag + 1) >>> 0;
    return formatIPv4(firstUsableBitflag as IPv4Bitflag);
}


/**
 * @function calculateLastUsableIP
 * @description Calculates the last usable IP address in a subnet.
 * 
 * @param {IPv4Address} networkAddress - The network address of the subnet.
 * @param {number} prefixLength - The prefix length of the subnet.
 * @returns {IPv4Address} The last usable IP address.
 * 
 * @example
 * calculateLastUsableIP("192.168.1.0", 24); // Returns "192.168.1.254"
 * 
 * @complexity
 * Time complexity: O(1) - The function performs a fixed number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function calculateLastUsableIP(networkAddress: IPv4Address, prefixLength: number): IPv4Address {
    const broadcastAddress = calculateBroadcastAddress(networkAddress, prefixLength);
    const broadcastBitflag = parseIPv4(broadcastAddress);
    if (prefixLength >= IPV4_MAX_PREFIX_LENGTH - 1) return formatIPv4(broadcastBitflag); // For /31 and /32
    const lastUsableBitflag = (broadcastBitflag - 1) >>> 0;
    return formatIPv4(lastUsableBitflag as IPv4Bitflag);
}


/**
 * @function splitSubnet
 * @description Splits a subnet into smaller subnets.
 * 
 * @param {IPv4Address} networkAddress - The network address of the original subnet.
 * @param {number} currentPrefixLength - The prefix length of the original subnet.
 * @param {number} newPrefixLength - The prefix length for the new smaller subnets.
 * @returns {IPv4Address[]} An array of network addresses for the new subnets.
 * @throws {IPv4SubnetError} If the new prefix length is not valid for splitting.
 * 
 * @example
 * splitSubnet("192.168.1.0", 24, 26); // Returns ["192.168.1.0", "192.168.1.64", "192.168.1.128", "192.168.1.192"]
 * 
 * @complexity
 * Time complexity: O(2^(newPrefixLength - currentPrefixLength)) - The function generates all new subnets.
 * Space complexity: O(2^(newPrefixLength - currentPrefixLength)) - The function stores all new subnet addresses.
 */
export function splitSubnet(networkAddress: IPv4Address, currentPrefixLength: number, newPrefixLength: number): IPv4Address[] {
    if (newPrefixLength <= currentPrefixLength || newPrefixLength > IPV4_MAX_PREFIX_LENGTH) {
        throw new IPv4SubnetError('Invalid new prefix length for splitting');
    }

    const networkInt = parseIPv4(networkAddress);
    const numNewSubnets = Math.pow(2, newPrefixLength - currentPrefixLength);
    const newSubnetSize = Math.pow(2, IPV4_MAX_PREFIX_LENGTH - newPrefixLength);

    const newSubnets: IPv4Address[] = [];
    for (let i = 0; i < numNewSubnets; i++) {
        const newSubnetInt = (networkInt + i * newSubnetSize) >>> 0;
        if (newSubnetInt > 0xFFFFFFFF) {
            throw new IPv4SubnetError('Address space overflow');
        }
        newSubnets.push(formatIPv4(newSubnetInt as IPv4Bitflag));
    }

    return newSubnets;
}


/**
 * @function summarizeSubnets
 * @description Summarizes a list of subnets into the smallest possible supernet.
 * 
 * @param {IPv4Address[]} subnets - An array of subnet network addresses.
 * @returns {[IPv4Address, number]} The summarized supernet as [network address, prefix length].
 * @throws {IPv4SubnetError} If the subnets cannot be summarized.
 * 
 * @example
 * summarizeSubnets(["192.168.1.0", "192.168.2.0", "192.168.3.0", "192.168.4.0"]); // Returns ["192.168.0.0", 22]
 * 
 * @complexity
 * Time complexity: O(n * log(m)), where n is the number of subnets and m is the number of bits in an IPv4 address.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function summarizeSubnets(subnets: IPv4Address[]): [IPv4Address, number] {
    if (subnets.length < 2) {
        throw new IPv4SubnetError('At least two subnets are required for summarization');
    }

    const ipIntegers = subnets.map(parseIPv4).sort((a, b) => a - b);
    const minIp = ipIntegers[0];
    const maxIp = ipIntegers[ipIntegers.length - 1];

    const diff = minIp ^ maxIp;
    const commonPrefixLength = IPV4_MAX_PREFIX_LENGTH - getPrefixLength(diff as IPv4Bitflag);

    const mask = createSubnetMask(commonPrefixLength);
    const networkInt = (applyMask(minIp, mask)) >>> 0;

    return [formatIPv4(networkInt as IPv4Bitflag), commonPrefixLength];
}


/**
 * @function getNextSubnet
 * @description Calculates the next subnet of the same size.
 * 
 * @param {IPv4Address} currentSubnet - The current subnet's network address.
 * @param {number} prefixLength - The prefix length of the subnet.
 * @returns {IPv4Address} The network address of the next subnet.
 * @throws {IPv4SubnetError} If there is no next subnet (overflow).
 * 
 * @example
 * getNextSubnet("192.168.1.0", 24); // Returns "192.168.2.0"
 * 
 * @complexity
 * Time complexity: O(1) - The function performs a fixed number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function getNextSubnet(currentSubnet: IPv4Address, prefixLength: number): IPv4Address {
    const currentBitflag = parseIPv4(currentSubnet);
    const subnetSize = Math.pow(2, IPV4_MAX_PREFIX_LENGTH - prefixLength);
    const nextSubnetBitflag = currentBitflag + subnetSize;

    if (nextSubnetBitflag > 0xFFFFFFFF) {
        throw new IPv4SubnetError('No next subnet available (address space overflow)');
    }

    return formatIPv4(nextSubnetBitflag as IPv4Bitflag);
}

/**
 * @function getPreviousSubnet
 * @description Calculates the previous subnet of the same size.
 * 
 * @param {IPv4Address} currentSubnet - The current subnet's network address.
 * @param {number} prefixLength - The prefix length of the subnet.
 * @returns {IPv4Address} The network address of the previous subnet.
 * @throws {IPv4SubnetError} If there is no previous subnet (underflow).
 * 
 * @example
 * getPreviousSubnet("192.168.1.0", 24); // Returns "192.168.0.0"
 * 
 * @complexity
 * Time complexity: O(1) - The function performs a fixed number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function getPreviousSubnet(currentSubnet: IPv4Address, prefixLength: number): IPv4Address {
    const currentBitflag = parseIPv4(currentSubnet);
    const subnetSize = Math.pow(2, IPV4_MAX_PREFIX_LENGTH - prefixLength);
    const previousSubnetBitflag = currentBitflag - subnetSize;

    if (previousSubnetBitflag < 0) {
        throw new IPv4SubnetError('No previous subnet available (address space underflow)');
    }

    return formatIPv4(previousSubnetBitflag as IPv4Bitflag);
}

/**
 * @function isSubnetOf
 * @description Checks if one subnet is a subset of another subnet.
 * 
 * @param {IPv4Address} subnetA - The network address of the potential subset.
 * @param {number} prefixLengthA - The prefix length of subnet A.
 * @param {IPv4Address} subnetB - The network address of the potential superset.
 * @param {number} prefixLengthB - The prefix length of subnet B.
 * @returns {boolean} True if subnet A is a subset of subnet B, false otherwise.
 * 
 * @example
 * isSubnetOf("192.168.1.0", 24, "192.168.0.0", 16); // Returns true
 * 
 * @complexity
 * Time complexity: O(1) - The function performs a fixed number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function isSubnetOf(subnetA: IPv4Address, prefixLengthA: number, subnetB: IPv4Address, prefixLengthB: number): boolean {
    if (prefixLengthA <= prefixLengthB) {
        return false; // A subnet with a smaller or equal prefix length cannot be a subset
    }

    const networkA = parseIPv4(subnetA);
    const networkB = parseIPv4(subnetB);
    const maskB = createSubnetMask(prefixLengthB);

    return applyMask(networkA, maskB) === applyMask(networkB, maskB);
}

/**
 * @function findCommonSupernet
 * @description Finds the smallest common supernet that contains both given subnets.
 * 
 * @param {IPv4Address} subnetA - The network address of the first subnet.
 * @param {number} prefixLengthA - The prefix length of the first subnet.
 * @param {IPv4Address} subnetB - The network address of the second subnet.
 * @param {number} prefixLengthB - The prefix length of the second subnet.
 * @returns {[IPv4Address, number]} The common supernet as [network address, prefix length].
 * 
 * @example
 * findCommonSupernet("192.168.1.0", 24, "192.168.2.0", 24); // Returns ["192.168.0.0", 23]
 * 
 * @complexity
 * Time complexity: O(1) - The function performs a fixed number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function findCommonSupernet(subnetA: IPv4Address, prefixLengthA: number, subnetB: IPv4Address, prefixLengthB: number): [IPv4Address, number] {
    const networkA = parseIPv4(subnetA);
    const networkB = parseIPv4(subnetB);

    const diff = networkA ^ networkB;
    const differentBits = getPrefixLength(diff as IPv4Bitflag);
    const commonPrefixLength = IPV4_MAX_PREFIX_LENGTH - differentBits;

    const mask = createSubnetMask(commonPrefixLength);
    const commonNetwork = (applyMask(networkA, mask)) >>> 0;

    return [formatIPv4(commonNetwork as IPv4Bitflag), commonPrefixLength];
}


/**
 * @function calculateSubnetMaskFromPrefixLength
 * @description Calculates the subnet mask from a given prefix length.
 * 
 * @param {number} prefixLength - The prefix length of the subnet.
 * @returns {IPv4Address} The subnet mask as an IPv4 address.
 * 
 * @example
 * calculateSubnetMaskFromPrefixLength(24); // Returns "255.255.255.0"
 * 
 * @complexity
 * Time complexity: O(1) - The function performs a fixed number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function calculateSubnetMaskFromPrefixLength(prefixLength: number): IPv4Address {
    if (prefixLength < IPV4_MIN_PREFIX_LENGTH || prefixLength > IPV4_MAX_PREFIX_LENGTH) {
        throw new IPv4SubnetError('Invalid prefix length');
    }

    const mask = createSubnetMask(prefixLength);
    return formatIPv4(mask >>> 0);
} 

/**
 * @function calculatePrefixLengthFromSubnetMask
 * @description Calculates the prefix length from a given subnet mask.
 * 
 * @param {IPv4Address} subnetMask - The subnet mask as an IPv4 address.
 * @returns {number} The prefix length of the subnet.
 * 
 * @example
 * calculatePrefixLengthFromSubnetMask("255.255.255.0"); // Returns 24
 * 
 * @complexity
 * Time complexity: O(1) - The function performs a fixed number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function calculatePrefixLengthFromSubnetMask(subnetMask: IPv4Address): number {
    const maskInt = parseIPv4(subnetMask);
    const prefixLength = getPrefixLength(maskInt);

    // Validate that the subnet mask is contiguous
    const expectedMask = createSubnetMask(prefixLength);
    if (maskInt !== expectedMask) {
        throw new IPv4ValidationError('Invalid subnet mask');
    }

    return prefixLength;
}

/**
 * @function isValidCIDR
 * @description Checks if a given CIDR notation is valid.
 * 
 * @param {string} cidr - The CIDR notation to validate.
 * @returns {boolean} True if the CIDR notation is valid, false otherwise.
 * 
 * @example
 * isValidCIDR("192.168.1.0/24"); // Returns true
 * isValidCIDR("192.168.1.0/33"); // Returns false
 * 
 * @complexity
 * Time complexity: O(1) - The function performs a fixed number of operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function isValidCIDR(cidr: string): boolean {
    try {
        const [ip, prefixLength] = parseCIDR(cidr);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * @function getIPRange
 * @description Gets the range of IP addresses in a subnet, including network and broadcast addresses.
 * 
 * @param {IPv4Address} networkAddress - The network address of the subnet.
 * @param {number} prefixLength - The prefix length of the subnet.
 * @returns {[IPv4Address, IPv4Address]} A tuple containing the first and last IP addresses in the range.
 * 
 * @example
 * getIPRange("192.168.1.0", 24); // Returns ["192.168.1.0", "192.168.1.255"]
 * 
 * @complexity
 * Time complexity: O(1) - The function performs a fixed number of bitwise operations.
 * Space complexity: O(1) - The function uses a constant amount of space.
 */
export function getIPRange(networkAddress: IPv4Address, prefixLength: number): [IPv4Address, IPv4Address] {
    const firstIP = calculateNetworkAddress(networkAddress, prefixLength);
    const lastIP = calculateBroadcastAddress(networkAddress, prefixLength);
    return [firstIP, lastIP];
}
