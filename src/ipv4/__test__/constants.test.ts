/**
 * @file tests/ipv4/constants.test.ts
 * @description Unit tests for IPv4 constants
 */

import { expect, describe, it } from 'bun:test';
import {
  IPV4_BIT_LENGTH,
  IPV4_OCTET_COUNT,
  IPV4_MAX_OCTET_VALUE,
  IPV4_MIN_PREFIX_LENGTH,
  IPV4_MAX_PREFIX_LENGTH,
  IPV4_MAX_ADDRESS,
  IPV4_MIN_ADDRESS,
  VALID_IPV4_CHARS
} from '@src/ipv4/constants';
import type { IPv4Bitflag } from '@src/types';

describe('IPv4::Constants', () => {
  describe('IPV4_BIT_LENGTH', () => {
    it('should be 32', () => {
      expect(IPV4_BIT_LENGTH).toBe(32);
    });
  });

  describe('IPV4_OCTET_COUNT', () => {
    it('should be 4', () => {
      expect(IPV4_OCTET_COUNT).toBe(4);
    });
  });

  describe('IPV4_MAX_OCTET_VALUE', () => {
    it('should be 255', () => {
      expect(IPV4_MAX_OCTET_VALUE).toBe(255);
    });
  });

  describe('IPV4_MIN_PREFIX_LENGTH', () => {
    it('should be 0', () => {
      expect(IPV4_MIN_PREFIX_LENGTH).toBe(0);
    });
  });

  describe('IPV4_MAX_PREFIX_LENGTH', () => {
    it('should be 32', () => {
      expect(IPV4_MAX_PREFIX_LENGTH).toBe(32);
    });
  });

  describe('IPV4_MAX_ADDRESS', () => {
    it('should be 0xFFFFFFFF', () => {
      expect(IPV4_MAX_ADDRESS).toBe(0xFFFFFFFF as IPv4Bitflag);
    });
  });

  describe('IPV4_MIN_ADDRESS', () => {
    it('should be 0x00000000', () => {
      expect(IPV4_MIN_ADDRESS).toBe(0x00000000 as IPv4Bitflag);
    });
  });

  describe('VALID_IPV4_CHARS', () => {
    it('should be 0x03FF4000', () => {
      expect(VALID_IPV4_CHARS).toBe(0x03FF4000);
    });
  
    it('should include digits 0-9 and dot', () => {
      const validChars = '0123456789.';
      validChars.split('').forEach(char => {
        expect((VALID_IPV4_CHARS & (1 << char.charCodeAt(0))) !== 0).toBe(true);
      });
    });
  });
});