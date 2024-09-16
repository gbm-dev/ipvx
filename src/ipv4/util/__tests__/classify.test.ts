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
    isReservedIP
  } from '../classify';
  import type { IPv4Bitflag } from '@src/types';
  
  describe('IPv4 Classification Utilities', () => {
    describe('getIPClass', () => {
      it('should correctly identify Class A IP addresses', () => {
        expect(getIPClass(0x01000000 as IPv4Bitflag)).toBe('A');
        expect(getIPClass(0x7F000000 as IPv4Bitflag)).toBe('A');
      });
  
      it('should correctly identify Class B IP addresses', () => {
        expect(getIPClass(0x80000000 as IPv4Bitflag)).toBe('B');
        expect(getIPClass(0xBFFFFFFF as IPv4Bitflag)).toBe('B');
      });
  
      it('should correctly identify Class C IP addresses', () => {
        expect(getIPClass(0xC0000000 as IPv4Bitflag)).toBe('C');
        expect(getIPClass(0xDFFFFFFF as IPv4Bitflag)).toBe('C');
      });
  
      it('should correctly identify Class D IP addresses', () => {
        expect(getIPClass(0xE0000000 as IPv4Bitflag)).toBe('D');
        expect(getIPClass(0xEFFFFFFF as IPv4Bitflag)).toBe('D');
      });
  
      it('should correctly identify Class E IP addresses', () => {
        expect(getIPClass(0xF0000000 as IPv4Bitflag)).toBe('E');
        expect(getIPClass(0xFFFFFFFF as IPv4Bitflag)).toBe('E');
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
        expect(isLinkLocalIP(0xA9FEFFFF as IPv4Bitflag)).toBe(true); // 169.254.255.255
      });
  
      it('should correctly identify non-link-local IP addresses', () => {
        expect(isLinkLocalIP(0xA9FD0000 as IPv4Bitflag)).toBe(false); // 169.253.0.0
        expect(isLinkLocalIP(0xA9FF0000 as IPv4Bitflag)).toBe(false); // 169.255.0.0
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
        expect(isReservedIP(0x64400000 as IPv4Bitflag)).toBe(true); // 100.64.0.0
        expect(isReservedIP(0xC0000000 as IPv4Bitflag)).toBe(true); // 192.0.0.0
        expect(isReservedIP(0xC0000200 as IPv4Bitflag)).toBe(true); // 192.0.2.0
        expect(isReservedIP(0xC6336400 as IPv4Bitflag)).toBe(true); // 198.51.100.0
        expect(isReservedIP(0xCB007100 as IPv4Bitflag)).toBe(true); // 203.0.113.0
        expect(isReservedIP(0xF0000000 as IPv4Bitflag)).toBe(true); // 240.0.0.0
      });
  
      it('should correctly identify non-reserved IP addresses', () => {
        expect(isReservedIP(0x08080808 as IPv4Bitflag)).toBe(false); // 8.8.8.8
        expect(isReservedIP(0xC0A80001 as IPv4Bitflag)).toBe(false); // 192.168.0.1 (private, but not reserved)
      });
  
      it('should identify loopback, link-local, multicast, and broadcast as reserved', () => {
        expect(isReservedIP(0x7F000001 as IPv4Bitflag)).toBe(true); // 127.0.0.1 (loopback)
        expect(isReservedIP(0xA9FE0001 as IPv4Bitflag)).toBe(true); // 169.254.0.1 (link-local)
        expect(isReservedIP(0xE0000001 as IPv4Bitflag)).toBe(true); // 224.0.0.1 (multicast)
        expect(isReservedIP(0xFFFFFFFF as IPv4Bitflag)).toBe(true); // 255.255.255.255 (broadcast)
      });
    });
  });