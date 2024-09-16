import { expect, describe, it } from 'bun:test';
import {
  leftShift,
  rightShift,
  rotateBits,
  rotateLeft,
  rotateRight,
  leadingZeros,
  trailingZeros,
  findFirstSetBit,
  getBit,
  setBit,
  clearBit,
  toggleBit,
  invertBits,
  countSetBits,
  and,
  or,
  xor,
  not,
  isPowerOfTwo,
  hasAlternatingBits,
  reverseBits,
  parity,
  signExtend,
  abs,
  min,
  max
} from '@src/ipv4/lib/bitwise/basic';

describe('Bitwise::Basic', () => {
  describe('Bitwise::Basic::leftShift', () => {
    it('should shift 1 left by 1 position', () => {
      expect(leftShift(1, 1)).toBe(2);
    });

    it('should shift 1 left by 31 positions', () => {
      expect(leftShift(1, 31)).toBe(0x80000000);
    });

    it('should wrap around for 32-bit integers', () => {
      expect(leftShift(0x80000000, 1)).toBe(0);
    });

    it('should throw an error for invalid shift amount', () => {
      expect(() => leftShift(1, 32)).toThrow('Invalid number of positions for left shift. Must be an integer between 0 and 31 inclusive.');
    });
  });

  describe('Bitwise::Basic::rightShift', () => {
    it('should perform logical right shift', () => {
      expect(rightShift(0xF0000000, 4)).toBe(0x0F000000);
    });

    it('should perform arithmetic right shift', () => {
      expect(rightShift(-8, 1, true)).toBe(-4);
    });

    it('should shift 0x80000000 right by 31 positions', () => {
      expect(rightShift(0x80000000, 31)).toBe(1);
    });

    it('should throw an error for invalid shift amount', () => {
      expect(() => rightShift(1, 32)).toThrow('Invalid number of positions for right shift. Must be an integer between 0 and 31 inclusive.');
    });
  });

  describe('Bitwise::Basic::rotateBits', () => {
    it('should rotate bits to the right by 2 positions', () => {
      const result = rotateBits(0b10110011, 2);
      expect(result).toBe(0b11101100);
    });

    it('should rotate bits to the left by 2 positions', () => {
      const result = rotateBits(0b10110011, -2);
      expect(result).toBe(0b11001110);
    });

    it('should handle rotations greater than 8', () => {
      const result = rotateBits(0b10110011, 10); // Equivalent to rotating by 2 positions
      expect(result).toBe(0b11101100);
    });

    it('should not change bits when rotating by 0 positions', () => {
      const result = rotateBits(0b10110011, 0);
      expect(result).toBe(0b10110011);
    });

    it('should return the same value when rotating by 8 positions', () => {
      const result = rotateBits(0b10110011, 8);
      expect(result).toBe(0b10110011);
    });
  });

  describe('Bitwise::Basic::leadingZeros', () => {
    it('should return 0 for n=0x80000000', () => {
      const result = leadingZeros(0x80000000);
      expect(result).toBe(0);
    });

    it('should return 31 for n=1', () => {
      const result = leadingZeros(1);
      expect(result).toBe(31);
    });

    it('should return 32 for n=0', () => {
      const result = leadingZeros(0);
      expect(result).toBe(32);
    });

    it('should return 28 for n=0b00000000000000000000000000001000', () => {
      const result = leadingZeros(0b00000000000000000000000000001000);
      expect(result).toBe(28);
    });

    it('should return 31 for n=0x00000001', () => {
      const result = leadingZeros(0x00000001);
      expect(result).toBe(31);
    });
  });

  describe('Bitwise::Basic::trailingZeros', () => {
    it('should return 0 for n=1', () => {
      expect(trailingZeros(1)).toBe(0);
    });

    it('should return 31 for n=0x80000000', () => {
      expect(trailingZeros(0x80000000)).toBe(31);
    });

    it('should return 32 for n=0', () => {
      expect(trailingZeros(0)).toBe(32);
    });

    it('should return 3 for n=0x00000008', () => {
      expect(trailingZeros(0x00000008)).toBe(3);
    });
  });

  describe('Bitwise::Basic::findFirstSetBit', () => {
    it('should return -1 for n=0', () => {
      expect(findFirstSetBit(0)).toBe(-1);
    });

    it('should return 0 for n=1', () => {
      expect(findFirstSetBit(1)).toBe(0);
    });

    it('should return 31 for n=0x80000000', () => {
      expect(findFirstSetBit(0x80000000)).toBe(31);
    });

    it('should return 3 for n=0x00000008', () => {
      expect(findFirstSetBit(0x00000008)).toBe(3);
    });
  });

  describe('Bitwise::Basic::getBit', () => {
    it('should return the correct bit value at position 0', () => {
      const n = 0b1010;
      const result = getBit(n, 0);
      expect(result).toBe(0);
    });

    it('should return the correct bit value at position 1', () => {
      const n = 0b1010;
      const result = getBit(n, 1);
      expect(result).toBe(1);
    });

    it('should return the correct bit value at position 31', () => {
      const n = 0x80000000;
      const result = getBit(n, 31);
      expect(result).toBe(1);
    });

    it('should throw an error for negative position', () => {
      expect(() => getBit(0, -1)).toThrow(
        'Invalid bit position. Must be between 0 and 31 inclusive.'
      );
    });

    it('should throw an error for position greater than 31', () => {
      expect(() => getBit(0, 32)).toThrow(
        'Invalid bit position. Must be between 0 and 31 inclusive.'
      );
    });
  });

  describe('Bitwise::Basic::setBit', () => {
    it('should set bit at position 0 to 1', () => {
      const n = 0b1010;
      const result = setBit(n, 0, true);
      expect(result).toBe(0b1011);
    });

    it('should set bit at position 1 to 0', () => {
      const n = 0b1010;
      const result = setBit(n, 1, false);
      expect(result).toBe(0b1000);
    });

    it('should set bit at position 31 to 1', () => {
      const n = 0;
      const result = setBit(n, 31, true);
      expect(result).toBe(0x80000000);
    });

    it('should throw an error for negative position', () => {
      expect(() => setBit(0, -1, true)).toThrow(
        'Invalid bit position. Must be between 0 and 31 inclusive.'
      );
    });

    it('should throw an error for position greater than 31', () => {
      expect(() => setBit(0, 32, true)).toThrow(
        'Invalid bit position. Must be between 0 and 31 inclusive.'
      );
    });
  });

  describe('Bitwise::Basic::clearBit', () => {
    it('should clear bit at position 0', () => {
      const n = 0b1011;
      const result = clearBit(n, 0);
      expect(result).toBe(0b1010);
    });

    it('should throw an error for negative position', () => {
      expect(() => clearBit(0, -1)).toThrow(
        'Invalid bit position. Must be between 0 and 31 inclusive.'
      );
    });

    it('should throw an error for position greater than 31', () => {
      expect(() => clearBit(0, 32)).toThrow(
        'Invalid bit position. Must be between 0 and 31 inclusive.'
      );
    });
  });

  describe('Bitwise::Basic::toggleBit', () => {
    it('should toggle bit at position 0 from 0 to 1', () => {
      const n = 0b1010;
      const result = toggleBit(n, 0);
      expect(result).toBe(0b1011);
    });

    it('should toggle bit at position 0 from 1 to 0', () => {
      const n = 0b1011;
      const result = toggleBit(n, 0);
      expect(result).toBe(0b1010);
    });

    it('should throw an error for negative position', () => {
      expect(() => toggleBit(0, -1)).toThrow(
        'Invalid bit position. Must be between 0 and 31 inclusive.'
      );
    });

    it('should throw an error for position greater than 31', () => {
      expect(() => toggleBit(0, 32)).toThrow(
        'Invalid bit position. Must be between 0 and 31 inclusive.'
      );
    });
  });

  describe('Bitwise::Basic::invertBits', () => {
    it('should invert bits of 0b1010', () => {
      const n = 0b1010;
      const result = invertBits(n);
      expect(result).toBe(0xFFFFFFF5);
    });

    it('should invert bits of 0xFFFFFFFF', () => {
      const n = 0xFFFFFFFF;
      const result = invertBits(n);
      expect(result).toBe(0x00000000);
    });

    it('should invert bits of 0x00000000', () => {
      const n = 0x00000000;
      const result = invertBits(n);
      expect(result).toBe(0xFFFFFFFF);
    });

    it('should correctly invert alternating bits', () => {
      const n = 0x55555555;
      const result = invertBits(n);
      expect(result).toBe(0xAAAAAAAA);
    });
  });

  describe('Bitwise::Basic::countSetBits', () => {
    it('should return 0 for n=0', () => {
      const result = countSetBits(0);
      expect(result).toBe(0);
    });

    it('should return 32 for n=0xFFFFFFFF', () => {
      const result = countSetBits(0xFFFFFFFF);
      expect(result).toBe(32);
    });

    it('should return 16 for n=0x0F0F0F0F', () => {
      const result = countSetBits(0x0F0F0F0F);
      expect(result).toBe(16);
    });

    it('should return 16 for n=0xF0F0F0F0', () => {
      const result = countSetBits(0xF0F0F0F0);
      expect(result).toBe(16);
    });

    it('should return 16 for alternating bits (0xAAAAAAAA)', () => {
      const result = countSetBits(0xAAAAAAAA);
      expect(result).toBe(16);
    });

    it('should return 1 for n=0x00000001', () => {
      const result = countSetBits(0x00000001);
      expect(result).toBe(1);
    });

    it('should return 1 for n=0x80000000', () => {
      const result = countSetBits(0x80000000);
      expect(result).toBe(1);
    });
  });

  describe('Bitwise::Basic::rotateLeft', () => {
    it('should rotate bits to the left by 1 position', () => {
      expect(rotateLeft(0b1010, 1)).toBe(0b10100);
    });

    it('should handle rotation by 32 positions (no change)', () => {
      expect(rotateLeft(0b1010, 32)).toBe(0b1010);
    });

    it('should handle large rotation values', () => {
      expect(rotateLeft(0b1010, 33)).toBe(0b10100);
    });
  });

  describe('Bitwise::Basic::rotateRight', () => {
    it('should rotate bits to the right by 1 position', () => {
      expect(rotateRight(0b1010, 1)).toBe(0b101);
    });

    it('should handle rotation by 32 positions (no change)', () => {
      expect(rotateRight(0b1010, 32)).toBe(0b1010);
    });

    it('should handle large rotation values', () => {
      expect(rotateRight(0b1010, 33)).toBe(0b101);
    });
  });

  describe('Bitwise::Basic::and', () => {
    it('should perform bitwise AND operation', () => {
      expect(and(0b1010, 0b1100)).toBe(0b1000);
    });
  });

  describe('Bitwise::Basic::or', () => {
    it('should perform bitwise OR operation', () => {
      expect(or(0b1010, 0b1100)).toBe(0b1110);
    });
  });

  describe('Bitwise::Basic::xor', () => {
    it('should perform bitwise XOR operation', () => {
      expect(xor(0b1010, 0b1100)).toBe(0b0110);
    });
  });

  describe('Bitwise::Basic::not', () => {
    it('should perform bitwise NOT operation', () => {
      expect(not(0b1010)).toBe(0xFFFFFFF5);
    });
  });

  describe('Bitwise::Basic::isPowerOfTwo', () => {
    it('should return true for powers of two', () => {
      expect(isPowerOfTwo(1)).toBe(true);
      expect(isPowerOfTwo(2)).toBe(true);
      expect(isPowerOfTwo(4)).toBe(true);
      expect(isPowerOfTwo(1024)).toBe(true);
    });

    it('should return false for non-powers of two', () => {
      expect(isPowerOfTwo(0)).toBe(false);
      expect(isPowerOfTwo(3)).toBe(false);
      expect(isPowerOfTwo(6)).toBe(false);
      expect(isPowerOfTwo(1023)).toBe(false);
    });
  });

  describe('Bitwise::Basic::hasAlternatingBits', () => {
    it('should return true for numbers with alternating bits', () => {
      expect(hasAlternatingBits(0b10101)).toBe(true);
      expect(hasAlternatingBits(0b1010101010101010)).toBe(true);
    });

    it('should return false for numbers without alternating bits', () => {
      expect(hasAlternatingBits(0b1011)).toBe(false);
      expect(hasAlternatingBits(0b1110)).toBe(false);
    });
  });

  describe('Bitwise::Basic::reverseBits', () => {
    it('should reverse all bits in a 32-bit integer', () => {
      expect(reverseBits(0b1010)).toBe(0x50000000);
      expect(reverseBits(0xFFFF0000)).toBe(0x0000FFFF);
    });

    it('should handle edge cases', () => {
      expect(reverseBits(0)).toBe(0);
      expect(reverseBits(0xFFFFFFFF)).toBe(0xFFFFFFFF);
    });
  });

  describe('Bitwise::Basic::parity', () => {
    it('should return 1 for odd number of set bits', () => {
      expect(parity(0b1010)).toBe(0);
      expect(parity(0b1011)).toBe(1);
    });

    it('should return 0 for even number of set bits', () => {
      expect(parity(0b1010)).toBe(0);
      expect(parity(0b1111)).toBe(0);
    });
  });

  describe('Bitwise::Basic::signExtend', () => {
    it('should correctly sign-extend positive numbers', () => {
      expect(signExtend(0b0101, 4)).toBe(0b0101);
    });

    it('should correctly sign-extend negative numbers', () => {
      expect(signExtend(0b1101, 4)).toBe(-3);
    });

    it('should handle edge cases', () => {
      expect(signExtend(0, 32)).toBe(0);
      expect(signExtend(-1, 32)).toBe(-1);
    });
  });

  describe('Bitwise::Basic::abs', () => {
    it('should return absolute value of positive numbers', () => {
      expect(abs(5)).toBe(5);
    });

    it('should return absolute value of negative numbers', () => {
      expect(abs(-5)).toBe(5);
    });

    it('should handle zero', () => {
      expect(abs(0)).toBe(0);
    });

    it('should handle edge cases', () => {
      expect(abs(-2147483648)).toBe(2147483648);
    });
  });

  describe('Bitwise::Basic::min', () => {
    it('should return the smaller of two numbers', () => {
      expect(min(5, 10)).toBe(5);
      expect(min(-5, 5)).toBe(-5);
    });

    it('should handle equal numbers', () => {
      expect(min(5, 5)).toBe(5);
    });
  });

  describe('Bitwise::Basic::max', () => {
    it('should return the larger of two numbers', () => {
      expect(max(5, 10)).toBe(10);
      expect(max(-5, 5)).toBe(5);
    });

    it('should handle equal numbers', () => {
      expect(max(5, 5)).toBe(5);
    });
  });

});