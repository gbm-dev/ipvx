import { expect, describe, it } from 'bun:test';
import type {
  IPv4Address,
  IPv6Address,
  IPAddress,
  IPv4Bitflag,
  IPv6Bitflag,
  IPBitflag,
  IPVersion,
  ValidationOptions,
  ValidationResult
} from '@src/types';

describe('IP Address Types', () => {
  describe('IPv4Address', () => {
    it('should allow valid IPv4 addresses', () => {
      const ipv4: IPv4Address = '192.168.0.1' as IPv4Address;
      expect(typeof ipv4).toBe('string');
    });
  });

  describe('IPv6Address', () => {
    it('should allow valid IPv6 addresses', () => {
      const ipv6: IPv6Address = '2001:db8::1' as IPv6Address;
      expect(typeof ipv6).toBe('string');
    });
  });

  describe('IPAddress', () => {
    it('should allow both IPv4 and IPv6 addresses', () => {
      const ipv4: IPAddress = '192.168.0.1' as IPv4Address;
      const ipv6: IPAddress = '2001:db8::1' as IPv6Address;
      expect(typeof ipv4).toBe('string');
      expect(typeof ipv6).toBe('string');
    });
  });

  describe('IPv4Bitflag', () => {
    it('should allow valid IPv4 bitflags', () => {
      const bitflag: IPv4Bitflag = 3232235521 as IPv4Bitflag; // 192.168.0.1
      expect(typeof bitflag).toBe('number');
    });
  });

  describe('IPv6Bitflag', () => {
    it('should allow valid IPv6 bitflags', () => {
      const bitflag: IPv6Bitflag = BigInt('42540766411282592856903984951653826561') as IPv6Bitflag; // 2001:db8::1
      expect(typeof bitflag).toBe('bigint');
    });
  });

  describe('IPBitflag', () => {
    it('should allow both IPv4 and IPv6 bitflags', () => {
      const ipv4Bitflag: IPBitflag = 3232235521 as IPv4Bitflag;
      const ipv6Bitflag: IPBitflag = BigInt('42540766411282592856903984951653826561') as IPv6Bitflag;
      expect(typeof ipv4Bitflag).toBe('number');
      expect(typeof ipv6Bitflag).toBe('bigint');
    });
  });

  describe('IPVersion', () => {
    it('should only allow 4 or 6', () => {
      const v4: IPVersion = 4;
      const v6: IPVersion = 6;
      expect(v4).toBe(4);
      expect(v6).toBe(6);
      // @ts-expect-error
      const invalid: IPVersion = 5;
    });
  });

  describe('ValidationOptions', () => {
    it('should have the correct shape', () => {
      const options: ValidationOptions = { detailed: true };
      expect(options).toHaveProperty('detailed');
      expect(typeof options.detailed).toBe('boolean');
    });
  });

  describe('ValidationResult', () => {
    it('should have the correct shape', () => {
      const validResult: ValidationResult = { isValid: true };
      const invalidResult: ValidationResult = { isValid: false, reason: 'Invalid IP' };
      expect(validResult).toHaveProperty('isValid');
      expect(invalidResult).toHaveProperty('isValid');
      expect(invalidResult).toHaveProperty('reason');
      expect(typeof validResult.isValid).toBe('boolean');
      expect(typeof invalidResult.reason).toBe('string');
    });
  });
});