/**
 * @file src/ipv4/utils/__tests__/classify.test.ts
 * @description Unit tests for IPv4 classification utilities
 */
import { expect, describe, it } from 'bun:test';
import {
    getIPClass,
    isPrivateIP,
    isLoopbackIP,
    isLinkLocalIP,
    isMulticastIP,
    isBroadcastIP,
    isReservedIP,
    isGloballyRoutableIP,
    getMulticastType
  } from '../classify';
import type { IPv4Bitflag } from '@src/types';

describe('IPv4 Classification Utilities', () => {
    describe('getIPClass', () => {
        it('should correctly identify Class A IP addresses', () => {
            expect(getIPClass(0x01000000 as IPv4Bitflag)).toBe('A'); // 1.0.0.0
            expect(getIPClass(0x7F000000 as IPv4Bitflag)).toBe('A'); // 127.0.0.0
            expect(getIPClass(0x7FFFFFFF as IPv4Bitflag)).toBe('A'); // 127.255.255.255
        });

        it('should correctly identify Class B IP addresses', () => {
            expect(getIPClass(0x80000000 as IPv4Bitflag)).toBe('B'); // 128.0.0.0
            expect(getIPClass(0xBFFFFFFF as IPv4Bitflag)).toBe('B'); // 191.255.255.255
        });

        it('should correctly identify Class C IP addresses', () => {
            expect(getIPClass(0xC0000000 as IPv4Bitflag)).toBe('C'); // 192.0.0.0
            expect(getIPClass(0xDFFFFFFF as IPv4Bitflag)).toBe('C'); // 223.255.255.255
        });

        it('should correctly identify Class D IP addresses', () => {
            expect(getIPClass(0xE0000000 as IPv4Bitflag)).toBe('D'); // 224.0.0.0
            expect(getIPClass(0xEFFFFFFF as IPv4Bitflag)).toBe('D'); // 239.255.255.255
        });

        it('should correctly identify Class E IP addresses', () => {
            expect(getIPClass(0xF0000000 as IPv4Bitflag)).toBe('E'); // 240.0.0.0
            expect(getIPClass(0xFFFFFFFF as IPv4Bitflag)).toBe('E'); // 255.255.255.255
        });
    });

    describe('isPrivateIP', () => {
        it('should correctly identify private Class A IP addresses', () => {
            expect(isPrivateIP(0x0A000000 as IPv4Bitflag)).toBe(true); // 10.0.0.0
            expect(isPrivateIP(0x0AFFFFFF as IPv4Bitflag)).toBe(true); // 10.255.255.255
        });

        it('should correctly identify private Class B IP addresses', () => {
            expect(isPrivateIP(0xAC100000 as IPv4Bitflag)).toBe(true); // 172.16.0.0
            expect(isPrivateIP(0xAC1F0000 as IPv4Bitflag)).toBe(true); // 172.31.0.0
            expect(isPrivateIP(0xAC1FFFFF as IPv4Bitflag)).toBe(true); // 172.31.255.255
            expect(isPrivateIP(0xAC0FFFFF as IPv4Bitflag)).toBe(false); // 172.15.255.255
            expect(isPrivateIP(0xAC200000 as IPv4Bitflag)).toBe(false); // 172.32.0.0
        });

        it('should correctly identify private Class C IP addresses', () => {
            expect(isPrivateIP(0xC0A80000 as IPv4Bitflag)).toBe(true); // 192.168.0.0
            expect(isPrivateIP(0xC0A8FFFF as IPv4Bitflag)).toBe(true); // 192.168.255.255
        });

        it('should correctly identify non-private IP addresses', () => {
            expect(isPrivateIP(0x08080808 as IPv4Bitflag)).toBe(false); // 8.8.8.8
            expect(isPrivateIP(0xC0000000 as IPv4Bitflag)).toBe(false); // 192.0.0.0
        });
    });

    describe('isLoopbackIP', () => {
        it('should correctly identify loopback IP addresses', () => {
            expect(isLoopbackIP(0x7F000000 as IPv4Bitflag)).toBe(true); // 127.0.0.0
            expect(isLoopbackIP(0x7F000001 as IPv4Bitflag)).toBe(true); // 127.0.0.1
            expect(isLoopbackIP(0x7FFFFFFF as IPv4Bitflag)).toBe(true); // 127.255.255.255
        });

        it('should correctly identify non-loopback IP addresses', () => {
            expect(isLoopbackIP(0x7E000001 as IPv4Bitflag)).toBe(false); // 126.0.0.1
            expect(isLoopbackIP(0x80000000 as IPv4Bitflag)).toBe(false); // 128.0.0.0
        });
    });

    describe('isLinkLocalIP', () => {
        it('should correctly identify link-local IP addresses', () => {
            expect(isLinkLocalIP(0xA9FE0000 as IPv4Bitflag)).toBe(true); // 169.254.0.0
            expect(isLinkLocalIP(0xA9FE0001 as IPv4Bitflag)).toBe(true); // 169.254.0.1
            expect(isLinkLocalIP(0xA9FE1234 as IPv4Bitflag)).toBe(true); // 169.254.18.52
            expect(isLinkLocalIP(0xA9FEFFFF as IPv4Bitflag)).toBe(true); // 169.254.255.255
        });

        it('should correctly identify non-link-local IP addresses', () => {
            expect(isLinkLocalIP(0xA9FD0000 as IPv4Bitflag)).toBe(false); // 169.253.0.0
            expect(isLinkLocalIP(0xA9FF0000 as IPv4Bitflag)).toBe(false); // 169.255.0.0
            expect(isLinkLocalIP(0xC0A80001 as IPv4Bitflag)).toBe(false); // 192.168.0.1
            expect(isLinkLocalIP(0x7F000001 as IPv4Bitflag)).toBe(false); // 127.0.0.1
        });
    });

    describe('isMulticastIP', () => {
        it('should correctly identify multicast IP addresses', () => {
            expect(isMulticastIP(0xE0000000 as IPv4Bitflag)).toBe(true); // 224.0.0.0
            expect(isMulticastIP(0xEFFFFFFF as IPv4Bitflag)).toBe(true); // 239.255.255.255
        });

        it('should correctly identify non-multicast IP addresses', () => {
            expect(isMulticastIP(0xDFFFFFFF as IPv4Bitflag)).toBe(false); // 223.255.255.255
            expect(isMulticastIP(0xF0000000 as IPv4Bitflag)).toBe(false); // 240.0.0.0
        });
    });

    describe('isBroadcastIP', () => {
        it('should correctly identify the broadcast IP address', () => {
            expect(isBroadcastIP(0xFFFFFFFF as IPv4Bitflag)).toBe(true); // 255.255.255.255
        });

        it('should correctly identify non-broadcast IP addresses', () => {
            expect(isBroadcastIP(0xFFFFFFFE as IPv4Bitflag)).toBe(false); // 255.255.255.254
            expect(isBroadcastIP(0x00000000 as IPv4Bitflag)).toBe(false); // 0.0.0.0
        });
    });

    describe('isReservedIP', () => {
        it('should correctly identify reserved IP addresses', () => {
            expect(isReservedIP(0x00000000 as IPv4Bitflag)).toBe(true); // 0.0.0.0
            expect(isReservedIP(0x00FFFFFF as IPv4Bitflag)).toBe(true); // 0.255.255.255
            expect(isReservedIP(0x64400000 as IPv4Bitflag)).toBe(true); // 100.64.0.0
            expect(isReservedIP(0x647FFFFF as IPv4Bitflag)).toBe(true); // 100.127.255.255
            expect(isReservedIP(0xC0000000 as IPv4Bitflag)).toBe(true); // 192.0.0.0
            expect(isReservedIP(0xC00000FF as IPv4Bitflag)).toBe(true); // 192.0.0.255
            expect(isReservedIP(0xC0000200 as IPv4Bitflag)).toBe(true); // 192.0.2.0
            expect(isReservedIP(0xC63364FF as IPv4Bitflag)).toBe(true); // 198.51.100.255
            expect(isReservedIP(0xCB007100 as IPv4Bitflag)).toBe(true); // 203.0.113.0
            expect(isReservedIP(0xF0000000 as IPv4Bitflag)).toBe(true); // 240.0.0.0
            expect(isReservedIP(0xFFFFFFFF as IPv4Bitflag)).toBe(true); // 255.255.255.255
        });

        it('should correctly identify non-reserved IP addresses', () => {
            expect(isReservedIP(0x01000000 as IPv4Bitflag)).toBe(false); // 1.0.0.0
            expect(isReservedIP(0x63FFFFFF as IPv4Bitflag)).toBe(false); // 99.255.255.255
            expect(isReservedIP(0x65000000 as IPv4Bitflag)).toBe(false); // 101.0.0.0
            expect(isReservedIP(0xBFFFFFFF as IPv4Bitflag)).toBe(false); // 191.255.255.255
            expect(isReservedIP(0xC0000100 as IPv4Bitflag)).toBe(false); // 192.0.1.0
            expect(isReservedIP(0xC0000300 as IPv4Bitflag)).toBe(false); // 192.0.3.0
            expect(isReservedIP(0xEFFFFFFF as IPv4Bitflag)).toBe(false); // 239.255.255.255
        });
    });

    describe('isGloballyRoutableIP', () => {
        it('should correctly identify globally routable IP addresses', () => {
            expect(isGloballyRoutableIP(0x08080808 as IPv4Bitflag)).toBe(true); // 8.8.8.8
            expect(isGloballyRoutableIP(0x01010101 as IPv4Bitflag)).toBe(true); // 1.1.1.1
            expect(isGloballyRoutableIP(0xC0000201 as IPv4Bitflag)).toBe(true); // 192.0.2.1
            expect(isGloballyRoutableIP(0x63FFFFFF as IPv4Bitflag)).toBe(true); // 100.63.255.255
            expect(isGloballyRoutableIP(0x64800000 as IPv4Bitflag)).toBe(true); // 100.128.0.0
        });

        it('should correctly identify non-globally routable IP addresses', () => {
            expect(isGloballyRoutableIP(0x0A000001 as IPv4Bitflag)).toBe(false); // 10.0.0.1 (private)
            expect(isGloballyRoutableIP(0x7F000001 as IPv4Bitflag)).toBe(false); // 127.0.0.1 (loopback)
            expect(isGloballyRoutableIP(0xA9FE0001 as IPv4Bitflag)).toBe(false); // 169.254.0.1 (link-local)
            expect(isGloballyRoutableIP(0xE0000001 as IPv4Bitflag)).toBe(false); // 224.0.0.1 (multicast)
            expect(isGloballyRoutableIP(0xFFFFFFFF as IPv4Bitflag)).toBe(false); // 255.255.255.255 (broadcast)
            expect(isGloballyRoutableIP(0x00000000 as IPv4Bitflag)).toBe(false); // 0.0.0.0 (reserved)
            expect(isGloballyRoutableIP(0x64400000 as IPv4Bitflag)).toBe(false); // 100.64.0.0 (non-globally routable)
            expect(isGloballyRoutableIP(0x647FFFFF as IPv4Bitflag)).toBe(false); // 100.127.255.255 (non-globally routable)
            expect(isGloballyRoutableIP(0xF0000000 as IPv4Bitflag)).toBe(false); // 240.0.0.0 (non-globally routable)
        });
    });

    describe('getMulticastType', () => {
        it('should correctly identify well-known multicast addresses', () => {
            expect(getMulticastType(0xE0000001 as IPv4Bitflag)).toBe('Well-Known Multicast'); // 224.0.0.1
            expect(getMulticastType(0xE00000FF as IPv4Bitflag)).toBe('Well-Known Multicast'); // 224.0.0.255
        });

        it('should correctly identify transient multicast addresses', () => {
            expect(getMulticastType(0xE1000000 as IPv4Bitflag)).toBe('Transient Multicast'); // 225.0.0.0
            expect(getMulticastType(0xE1FFFFFF as IPv4Bitflag)).toBe('Transient Multicast'); // 225.255.255.255
        });

        it('should correctly identify source-specific multicast addresses', () => {
            expect(getMulticastType(0xE8000000 as IPv4Bitflag)).toBe('Source-Specific Multicast'); // 232.0.0.0
            expect(getMulticastType(0xEBFFFFFF as IPv4Bitflag)).toBe('Source-Specific Multicast'); // 235.255.255.255
        });

        it('should correctly identify GLOP addressing', () => {
            expect(getMulticastType(0xEC000000 as IPv4Bitflag)).toBe('GLOP Addressing'); // 236.0.0.0
            expect(getMulticastType(0xEDFFFFFF as IPv4Bitflag)).toBe('GLOP Addressing'); // 237.255.255.255
        });

        it('should correctly identify unicast-prefix-based multicast addresses', () => {
            expect(getMulticastType(0xEE000000 as IPv4Bitflag)).toBe('Unicast-Prefix-based Multicast'); // 238.0.0.0
            expect(getMulticastType(0xEE000001 as IPv4Bitflag)).toBe('Unicast-Prefix-based Multicast'); // 238.0.0.1
        });

        it('should correctly identify administratively scoped multicast addresses', () => {
            expect(getMulticastType(0xEF000000 as IPv4Bitflag)).toBe('Administratively Scoped'); // 239.0.0.0
            expect(getMulticastType(0xEFFFFFFF as IPv4Bitflag)).toBe('Administratively Scoped'); // 239.255.255.255
        });

        it('should correctly identify reserved multicast addresses', () => {
            expect(getMulticastType(0xE2000000 as IPv4Bitflag)).toBe('Reserved'); // 226.0.0.0
            expect(getMulticastType(0xE7FFFFFF as IPv4Bitflag)).toBe('Reserved'); // 231.255.255.255
            expect(getMulticastType(0xEE010000 as IPv4Bitflag)).toBe('Reserved'); // 238.1.0.0
            expect(getMulticastType(0xEEFFFFFF as IPv4Bitflag)).toBe('Reserved'); // 238.255.255.255
        });

        it('should correctly identify non-multicast addresses', () => {
            expect(getMulticastType(0x0A000001 as IPv4Bitflag)).toBe('Not Multicast'); // 10.0.0.1
            expect(getMulticastType(0xC0A80001 as IPv4Bitflag)).toBe('Not Multicast'); // 192.168.0.1
            expect(getMulticastType(0xFFFFFFFF as IPv4Bitflag)).toBe('Not Multicast'); // 255.255.255.255
        });
    });
});
