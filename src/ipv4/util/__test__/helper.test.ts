// src/ipv4/util/__tests__/helpers.test.ts

import {
    assertIPv4Address,
    assertIPv4Bitflag,
    convertIPv4AddressToString,
    convertIPv4BitflagToNumber,
    convertStringToIPv4Address,
  } from '../helper';
  import type { IPv4Address, IPv4Bitflag } from '@src/types';
  import { expect, describe, it } from 'bun:test';
  
  describe('IPv4 Helper Functions', () => {
    describe('assertIPv4Address', () => {
      it('should create a branded IPv4Address for valid IPs', () => {
        const validIPs = [
          '0.0.0.0',
          '127.0.0.1',
          '192.168.1.1',
          '255.255.255.255',
          '10.0.0.1',
          '172.16.0.1',
        ];
  
        validIPs.forEach((ip) => {
          const result = assertIPv4Address(ip);
          const resultString = convertIPv4AddressToString(result);
          expect(resultString).toBe(ip);
        });
      });
  
      it('should throw an error for invalid IPs', () => {
        const invalidIPs = [
          '256.256.256.256', // Out of range
          '192.168.1',       // Incomplete
          'abc.def.ghi.jkl', // Non-numeric
          '123.456.78.90',   // Mixed invalid ranges
          '192.168.1.1.1',   // Too many octets
          '192.168..1',      // Missing octet
          '',                 // Empty string
          '   ',              // Whitespaces
          '192.168.1.-1',    // Negative number
          '192.168.1.1a',    // Alphanumeric
        ];
  
        invalidIPs.forEach((ip) => {
          expect(() => assertIPv4Address(ip)).toThrowError(/Invalid IPv4 address/);
        });
      });

      it('should reject IP addresses with leading zeros', () => {
        expect(() => assertIPv4Address('192.168.001.001')).toThrowError(/Leading zeros are not allowed/);
      });
    
      it('should trim whitespace from valid IP addresses', () => {
        expect(convertIPv4AddressToString(assertIPv4Address(' 192.168.1.1 '))).toBe('192.168.1.1');
      });
    
      it('should reject hexadecimal or octal representations', () => {
        expect(() => assertIPv4Address('0xC0.0xA8.0x01.0x01')).toThrowError(/Invalid IPv4 address/);
      });
    });
  
    describe('assertIPv4Bitflag', () => {
      it('should create a branded IPv4Bitflag for valid flags', () => {
        const validFlags = [
          0x00000000, // 0
          0xFFFFFFFF, // 4294967295
          0xC0A80101, // 3232235777 (192.168.1.1)
          0x0A000001, // 167772161 (10.0.0.1)
          0xAC100001, // 2886729729 (172.16.0.1)
        ];
  
        validFlags.forEach((flag) => {
          const result = assertIPv4Bitflag(flag);
          const resultNumber = convertIPv4BitflagToNumber(result)
          expect(resultNumber).toBe(flag);
        });
      });
  
      it('should throw an error for invalid flags', () => {
        const invalidFlags = [
          -1,               // Negative number
          0x100000000,      // Greater than 0xFFFFFFFF
          3.14,             // Non-integer
          NaN,              // Not a number
          Infinity,         // Infinity
          -0,               // Negative zero (edge case, but should be valid since -0 === 0)
          Number.MAX_SAFE_INTEGER, // Larger integer
          Number.MIN_SAFE_INTEGER, // Smaller integer
        ];
  
        invalidFlags.forEach((flag) => {
          expect(() => assertIPv4Bitflag(flag)).toThrowError(/Invalid IPv4 bitflag/);
        });
      });
  
      it('should allow 0 and 0xFFFFFFFF as valid flags', () => {
        expect(convertIPv4BitflagToNumber(assertIPv4Bitflag(0))).toBe(0);
        expect(convertIPv4BitflagToNumber(assertIPv4Bitflag(0xFFFFFFFF))).toBe(0xFFFFFFFF);
      });

      it('should accept the maximum valid IPv4 bitflag', () => {
        expect(convertIPv4BitflagToNumber(assertIPv4Bitflag(0xFFFFFFFF))).toBe(0xFFFFFFFF);
      });
    
      it('should reject values just outside the valid range', () => {
        expect(() => assertIPv4Bitflag(0xFFFFFFFF + 1)).toThrowError(/Invalid IPv4 bitflag/);
        expect(() => assertIPv4Bitflag(-1)).toThrowError(/Invalid IPv4 bitflag/);
      });
    
      it('should handle floating-point numbers that appear to be integers', () => {
        expect(convertIPv4BitflagToNumber(assertIPv4Bitflag(1.0))).toBe(1);
        expect(() => assertIPv4Bitflag(1.1)).toThrowError(/Invalid IPv4 bitflag/);
      });
    
      it('should reject non-number types', () => {
        expect(() => assertIPv4Bitflag(undefined as any)).toThrowError(/Invalid IPv4 bitflag/);
        expect(() => assertIPv4Bitflag(null as any)).toThrowError(/Invalid IPv4 bitflag/);
        expect(() => assertIPv4Bitflag(true as any)).toThrowError(/Invalid IPv4 bitflag/);
        expect(() => assertIPv4Bitflag({} as any)).toThrowError(/Invalid IPv4 bitflag/);
        expect(() => assertIPv4Bitflag([] as any)).toThrowError(/Invalid IPv4 bitflag/);
      });

    });
  
    describe('convertIPv4AddressToString', () => {
      it('should convert a branded IPv4Address to a string', () => {
        const ip = assertIPv4Address('192.168.1.1');
        const result = convertIPv4AddressToString(ip);
        expect(typeof result).toBe('string');
        expect(result).toBe('192.168.1.1');
      });
  
      it('should return the same string value', () => {
        const ipStrings = [
          '0.0.0.0',
          '127.0.0.1',
          '192.168.1.1',
          '255.255.255.255',
          '10.0.0.1',
          '172.16.0.1',
        ];
  
        ipStrings.forEach((ip) => {
          const ipAddress = assertIPv4Address(ip);
          const result = convertIPv4AddressToString(ipAddress);
          expect(result).toBe(ip);
        });
      });
    });
  
    describe('convertIPv4BitflagToNumber', () => {
      it('should convert a branded IPv4Bitflag to a number', () => {
        const flags = [
          0x00000000,
          0xFFFFFFFF,
          0xC0A80101,
          0x0A000001,
          0xAC100001,
        ];
  
        flags.forEach((flag) => {
          const bitflag = assertIPv4Bitflag(flag);
          const result = convertIPv4BitflagToNumber(bitflag);
          expect(typeof result).toBe('number');
          expect(result).toBe(flag);
        });
      });
    });
  
    describe('convertStringToIPv4Address', () => {
      it('should convert a string to a branded IPv4Address for valid IPs', () => {
        const validIPs = [
          '0.0.0.0',
          '127.0.0.1',
          '192.168.1.1',
          '255.255.255.255',
          '10.0.0.1',
          '172.16.0.1',
        ];
  
        validIPs.forEach((ip) => {
          const result = convertStringToIPv4Address(ip);
          const resultString = convertIPv4AddressToString(result);
          expect(resultString).toBe(ip);
        });
      });
  
      it('should throw an error when converting invalid strings to IPv4Address', () => {
        const invalidIPs = [
          '256.256.256.256', // Out of range
          '192.168.1',       // Incomplete
          'abc.def.ghi.jkl', // Non-numeric
          '123.456.78.90',   // Mixed invalid ranges
          '192.168.1.1.1',   // Too many octets
          '192.168..1',      // Missing octet
          '',                 // Empty string
          '   ',              // Whitespaces
          '192.168.1.-1',    // Negative number
          '192.168.1.1a',    // Alphanumeric
        ];
  
        invalidIPs.forEach((ip) => {
          expect(() => convertStringToIPv4Address(ip)).toThrowError(/Invalid IPv4 address/);
        });
      });
    });
  });
  