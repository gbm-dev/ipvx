import { expect, describe, it } from 'bun:test';
import type { IPv4Bitflag } from '@src/types';
import {
  createMask,
  getMaskPrefix,
  invertMaskBits,
  applyMask,
  combineMasks,
  expandMask,
  getMaskDifference
} from '../mask';
import { IPv4ValidationError } from '@src/ipv4/error';

describe('IPv4::Utils::Mask::createMask', () => {
  it('should create correct subnet masks for various prefix lengths', () => {
    expect(createMask(0)).toBe(0x00000000 as IPv4Bitflag);
    expect(createMask(8)).toBe(0xFF000000 as IPv4Bitflag);
    expect(createMask(16)).toBe(0xFFFF0000 as IPv4Bitflag);
    expect(createMask(24)).toBe(0xFFFFFF00 as IPv4Bitflag);
    expect(createMask(32)).toBe(0xFFFFFFFF as IPv4Bitflag);
  });

  it('should create correct subnet masks for edge cases', () => {
    expect(createMask(1)).toBe(0x80000000 as IPv4Bitflag);
    expect(createMask(31)).toBe(0xFFFFFFFE as IPv4Bitflag);
  });

  it('should throw an error for invalid prefix lengths', () => {
    expect(() => createMask(-1)).toThrow(IPv4ValidationError);
    expect(() => createMask(33)).toThrow(IPv4ValidationError);
    expect(() => createMask(100)).toThrow(IPv4ValidationError);
  });

  it('should throw an error for non-integer prefix lengths', () => {
    expect(() => createMask(15.5)).toThrow(IPv4ValidationError);
    expect(() => createMask(15.5)).toThrow('Invalid prefix length: 15.5. Must be an integer between 0 and 32.');
    expect(() => createMask(NaN)).toThrow(IPv4ValidationError);
    expect(() => createMask(Infinity)).toThrow(IPv4ValidationError);
  });
});

describe('IPv4::Utils::Mask::getMaskPrefix', () => {
  it('should return correct prefix lengths for various subnet masks', () => {
    expect(getMaskPrefix(0x00000000 as IPv4Bitflag)).toBe(0);
    expect(getMaskPrefix(0xFF000000 as IPv4Bitflag)).toBe(8);
    expect(getMaskPrefix(0xFFFF0000 as IPv4Bitflag)).toBe(16);
    expect(getMaskPrefix(0xFFFFFF00 as IPv4Bitflag)).toBe(24);
    expect(getMaskPrefix(0xFFFFFFFF as IPv4Bitflag)).toBe(32);
  });

  it('should return correct prefix lengths for edge cases', () => {
    expect(getMaskPrefix(0x80000000 as IPv4Bitflag)).toBe(1);
    expect(getMaskPrefix(0xFFFFFFFE as IPv4Bitflag)).toBe(31);
  });

  it('should throw an error for invalid subnet masks', () => {
    expect(() => getMaskPrefix(0xFFFFFFFD as IPv4Bitflag)).toThrow(IPv4ValidationError);
    expect(() => getMaskPrefix(0x00FFFFFF as IPv4Bitflag)).toThrow(IPv4ValidationError);
    expect(() => getMaskPrefix(0xFFFF00FF as IPv4Bitflag)).toThrow(IPv4ValidationError);
  });
});

describe('IPv4::Utils::Mask::invertMaskBits', () => {
  it('should correctly invert subnet masks', () => {
    expect(invertMaskBits(0x00000000 as IPv4Bitflag)).toBe(0xFFFFFFFF as IPv4Bitflag);
    expect(invertMaskBits(0xFF000000 as IPv4Bitflag)).toBe(0x00FFFFFF as IPv4Bitflag);
    expect(invertMaskBits(0xFFFF0000 as IPv4Bitflag)).toBe(0x0000FFFF as IPv4Bitflag);
    expect(invertMaskBits(0xFFFFFF00 as IPv4Bitflag)).toBe(0x000000FF as IPv4Bitflag);
    expect(invertMaskBits(0xFFFFFFFF as IPv4Bitflag)).toBe(0x00000000 as IPv4Bitflag);
  });

  it('should correctly invert edge case masks', () => {
    expect(invertMaskBits(0x80000000 as IPv4Bitflag)).toBe(0x7FFFFFFF as IPv4Bitflag);
    expect(invertMaskBits(0xFFFFFFFE as IPv4Bitflag)).toBe(0x00000001 as IPv4Bitflag);
  });

  it('should be reversible', () => {
    const mask = 0xFFFF0000 as IPv4Bitflag;
    expect(invertMaskBits(invertMaskBits(mask))).toBe(mask);
  });
});

describe('IPv4::Utils::Mask::applyMask', () => {
  it('should correctly apply subnet masks to IP addresses', () => {
    expect(applyMask(0xC0A80101 as IPv4Bitflag, 0xFFFFFF00 as IPv4Bitflag)).toBe(0xC0A80100 as IPv4Bitflag);
    expect(applyMask(0xC0A80101 as IPv4Bitflag, 0xFFFF0000 as IPv4Bitflag)).toBe(0xC0A80000 as IPv4Bitflag);
    expect(applyMask(0xC0A80101 as IPv4Bitflag, 0xFF000000 as IPv4Bitflag)).toBe(0xC0000000 as IPv4Bitflag);
  });

  it('should handle edge cases', () => {
    expect(applyMask(0xFFFFFFFF as IPv4Bitflag, 0x00000000 as IPv4Bitflag)).toBe(0x00000000 as IPv4Bitflag);
    expect(applyMask(0x00000000 as IPv4Bitflag, 0xFFFFFFFF as IPv4Bitflag)).toBe(0x00000000 as IPv4Bitflag);
    expect(applyMask(0xFFFFFFFF as IPv4Bitflag, 0xFFFFFFFF as IPv4Bitflag)).toBe(0xFFFFFFFF as IPv4Bitflag);
  });
});

describe('IPv4::Utils::Mask::combineMasks', () => {
  it('should correctly combine two subnet masks', () => {
    expect(combineMasks(0xFFFF0000 as IPv4Bitflag, 0xFFFFFF00 as IPv4Bitflag)).toBe(0xFFFF0000 as IPv4Bitflag);
    expect(combineMasks(0xFFFFFF00 as IPv4Bitflag, 0xFFFF0000 as IPv4Bitflag)).toBe(0xFFFF0000 as IPv4Bitflag);
    expect(combineMasks(0xFFFFFF00 as IPv4Bitflag, 0xFFFFFFF0 as IPv4Bitflag)).toBe(0xFFFFFF00 as IPv4Bitflag);
  });

  it('should handle edge cases', () => {
    expect(combineMasks(0xFFFFFFFF as IPv4Bitflag, 0x00000000 as IPv4Bitflag)).toBe(0x00000000 as IPv4Bitflag);
    expect(combineMasks(0xFFFFFFFF as IPv4Bitflag, 0xFFFFFFFF as IPv4Bitflag)).toBe(0xFFFFFFFF as IPv4Bitflag);
  });
});

describe('IPv4::Utils::Mask::expandMask', () => {
  it('should correctly expand subnet masks', () => {
    expect(expandMask(0xFFFF0000 as IPv4Bitflag, 0x0000FF00 as IPv4Bitflag)).toBe(0xFFFFFF00 as IPv4Bitflag);
    expect(expandMask(0xFFFFFF00 as IPv4Bitflag, 0x000000F0 as IPv4Bitflag)).toBe(0xFFFFFFF0 as IPv4Bitflag);
  });

  it('should handle edge cases', () => {
    expect(expandMask(0x00000000 as IPv4Bitflag, 0xFFFFFFFF as IPv4Bitflag)).toBe(0xFFFFFFFF as IPv4Bitflag);
    expect(expandMask(0xFFFFFFFF as IPv4Bitflag, 0x00000000 as IPv4Bitflag)).toBe(0xFFFFFFFF as IPv4Bitflag);
  });
});

describe('IPv4::Utils::Mask::getMaskDifference', () => {
  it('should correctly calculate the difference between two subnet masks', () => {
    expect(getMaskDifference(0xFFFFFF00 as IPv4Bitflag, 0xFFFF0000 as IPv4Bitflag)).toBe(0x0000FF00 as IPv4Bitflag);
    expect(getMaskDifference(0xFFFFFFFF as IPv4Bitflag, 0xFFFFFF00 as IPv4Bitflag)).toBe(0x000000FF as IPv4Bitflag);
  });

  it('should handle edge cases', () => {
    expect(getMaskDifference(0xFFFFFFFF as IPv4Bitflag, 0x00000000 as IPv4Bitflag)).toBe(0xFFFFFFFF as IPv4Bitflag);
    expect(getMaskDifference(0xFFFFFFFF as IPv4Bitflag, 0xFFFFFFFF as IPv4Bitflag)).toBe(0x00000000 as IPv4Bitflag);
  });

  it('should be commutative', () => {
    const mask1 = 0xFFFFFF00 as IPv4Bitflag;
    const mask2 = 0xFFFF0000 as IPv4Bitflag;
    expect(getMaskDifference(mask1, mask2)).toBe(getMaskDifference(mask2, mask1));
  });
});