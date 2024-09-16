import { expect, describe, it } from 'bun:test';
import {
  generateBitmask,
  applyMask,
  invertMask,
  extractBits,
  isSubsetMask,
  countLeadingOnes,
  mergeBitmasks,
  intersectBitmasks,
  isolateRightmostSetBit,
  removeRightmostSetBit,
  nextLexicographicalMask,
  getLowestNBits,
  swapBits,
  modifyBitRange
} from '@src/ipv4/lib/bitwise/bitmask';

describe('Bitwise::Bitmask', () => {
  describe('Bitwise::Bitmask::generateBitmask', () => {
    it('should generate correct bitmasks', () => {
      expect(generateBitmask(24)).toBe(0xFFFFFF00);
      expect(generateBitmask(16)).toBe(0xFFFF0000);
      expect(generateBitmask(0)).toBe(0);
      expect(generateBitmask(32)).toBe(0xFFFFFFFF);
    });

    it('should throw an error for invalid input', () => {
      expect(() => generateBitmask(-1)).toThrow();
      expect(() => generateBitmask(33)).toThrow();
    });
  });

  describe('Bitwise::Bitmask::applyMask', () => {
    it('should correctly apply bitmasks', () => {
      expect(applyMask(0xC0A80105, 0xFFFFFF00)).toBe(0xC0A80100);
      expect(applyMask(0x12345678, 0xF0F0F0F0)).toBe(0x10305070);
    });
  });

  describe('Bitwise::Bitmask::invertMask', () => {
    it('should correctly invert bitmasks', () => {
      expect(invertMask(0xFFFFFF00)).toBe(0x000000FF);
      expect(invertMask(0xF0F0F0F0)).toBe(0x0F0F0F0F);
    });
  });

  describe('Bitwise::Bitmask::extractBits', () => {
    it('should correctly extract bits', () => {
      expect(extractBits(0xC0A80105, 16, 23)).toBe(0xA8);
      expect(extractBits(0x12345678, 4, 11)).toBe(0x67);
    });

    it('should throw an error for invalid input', () => {
      expect(() => extractBits(0, -1, 31)).toThrow();
      expect(() => extractBits(0, 0, 32)).toThrow();
      expect(() => extractBits(0, 16, 8)).toThrow();
    });
  });

  describe('Bitwise::Bitmask::isSubsetMask', () => {
    it('should correctly identify subset masks', () => {
      expect(isSubsetMask(0xFFFF0000, 0xFFFFFF00)).toBe(true);
      expect(isSubsetMask(0x0000FFFF, 0xFFFF0000)).toBe(false);
    });
  });

  describe('Bitwise::Bitmask::countLeadingOnes', () => {
    it('should correctly count leading ones', () => {
      expect(countLeadingOnes(0xFFFFFFFF)).toBe(32);
      expect(countLeadingOnes(0xFFFF0000)).toBe(16);
      expect(countLeadingOnes(0xFFF00000)).toBe(12);
      expect(countLeadingOnes(0x00000000)).toBe(0);
    });
  });

  describe('Bitwise::Bitmask::mergeBitmasks', () => {
    it('should correctly merge bitmasks', () => {
      expect(mergeBitmasks(0xFF00FF00, 0x00FF00FF)).toBe(0xFFFFFFFF);
      expect(mergeBitmasks(0xF0F0F0F0, 0x0F0F0F0F)).toBe(0xFFFFFFFF);
    });
  });

  describe('Bitwise::Bitmask::intersectBitmasks', () => {
    it('should correctly intersect bitmasks', () => {
      expect(intersectBitmasks(0xFF00FF00, 0xFFFF0000)).toBe(0xFF000000);
      expect(intersectBitmasks(0xF0F0F0F0, 0x0F0F0F0F)).toBe(0x00000000);
    });
  });

  describe('Bitwise::Bitmask::isolateRightmostSetBit', () => {
    it('should correctly isolate the rightmost set bit', () => {
      expect(isolateRightmostSetBit(0b10100)).toBe(0b100);
      expect(isolateRightmostSetBit(0b11000)).toBe(0b1000);
    });
  });

  describe('Bitwise::Bitmask::removeRightmostSetBit', () => {
    it('should correctly remove the rightmost set bit', () => {
      expect(removeRightmostSetBit(0b10100)).toBe(0b10000);
      expect(removeRightmostSetBit(0b11000)).toBe(0b10000);
    });
  });

  describe('Bitwise::Bitmask::nextLexicographicalMask', () => {
    it('should correctly generate the next lexicographical mask', () => {
      expect(nextLexicographicalMask(0b0011)).toBe(0b0101);
      expect(nextLexicographicalMask(0b0101)).toBe(0b0110);
    });
  });

  describe('Bitwise::Bitmask::getLowestNBits', () => {
    it('should correctly generate masks with the lowest N bits set', () => {
      expect(getLowestNBits(3)).toBe(0b111);
      expect(getLowestNBits(5)).toBe(0b11111);
    });

    it('should throw an error for invalid input', () => {
      expect(() => getLowestNBits(-1)).toThrow();
      expect(() => getLowestNBits(33)).toThrow();
    });
  });

  describe('Bitwise::Bitmask::swapBits', () => {
    it('should correctly swap bits', () => {
      // Test case where bits are different
      expect(swapBits(0b1010, 0, 1)).toBe(0b1001); // Correct result should be 9
      expect(swapBits(0b11110000, 3, 7)).toBe(0b01111000); // Correct result should be 120

      // Test case where bits are the same
      expect(swapBits(0b1010, 1, 3)).toBe(0b1010); // Bits are the same, no change
      expect(swapBits(0b11111111, 0, 7)).toBe(0b11111111); // Bits are the same, no change

      // Swapping edge bits
      expect(swapBits(0b00000001, 0, 7)).toBe(0b10000000); // Swaps bits at the edges

      // Swapping in the middle
      expect(swapBits(0b01010101, 2, 4)).toBe(0b01010101); // Correct result should be 85
  });

    it('should throw an error for invalid input', () => {
      expect(() => swapBits(0, -1, 31)).toThrow();
      expect(() => swapBits(0, 0, 32)).toThrow();
    });
  });

  describe('Bitwise::Bitmask::modifyBitRange', () => {
    it('should correctly modify a range of bits', () => {
      expect(modifyBitRange(0b11111111, 2, 5, 0b1010)).toBe(0b11101011);
      expect(modifyBitRange(0b00000000, 0, 3, 0b1111)).toBe(0b00001111);
    });

    it('should throw an error for invalid input', () => {
      expect(() => modifyBitRange(0, -1, 31, 0)).toThrow();
      expect(() => modifyBitRange(0, 0, 32, 0)).toThrow();
      expect(() => modifyBitRange(0, 16, 8, 0)).toThrow();
    });
  });

  describe('Edge Cases and Complex Scenarios', () => {
    it('should handle 32-bit unsigned integer limits', () => {
      const maxUint32 = 0xFFFFFFFF;
      const minUint32 = 0;
      
      expect(applyMask(maxUint32, maxUint32)).toBe(maxUint32);
      expect(applyMask(minUint32, maxUint32)).toBe(minUint32);
      expect(invertMask(maxUint32)).toBe(minUint32);
      expect(invertMask(minUint32)).toBe(maxUint32);
    });

    it('should handle operations on the highest bit', () => {
      const highestBit = 0x80000000;
      
      expect(isolateRightmostSetBit(highestBit)).toBe(highestBit);
      expect(removeRightmostSetBit(highestBit)).toBe(0);
      expect(swapBits(highestBit, 31, 0)).toBe(1);
    });

    it('should handle alternating bit patterns', () => {
      const alternating = 0xAAAAAAAA;
      expect(invertMask(alternating)).toBe(0x55555555);
      expect(countLeadingOnes(alternating)).toBe(1);
    });
  });

  describe('Chained Operations', () => {
    it('should handle multiple operations correctly', () => {
      let mask = generateBitmask(16);
      mask = applyMask(0xFFFFFFFF, mask);
      mask = invertMask(mask);
      expect(mask).toBe(0x0000FFFF);
      
      const extracted = extractBits(mask, 0, 15);
      expect(extracted).toBe(0xFFFF);
    });
  });

  describe('Boundary Value Analysis', () => {
    it('should handle single bit flags at boundaries', () => {
      expect(generateBitmask(1)).toBe(0x80000000);
      expect(generateBitmask(32)).toBe(0xFFFFFFFF);
      expect(extractBits(0xFFFFFFFF, 0, 0)).toBe(1);
      expect(extractBits(0xFFFFFFFF, 31, 31)).toBe(1);
    });
  });

  describe('Performance Considerations', () => {
    it('should handle operations on large sets efficiently', () => {
      const largeSet = 0xFFFFFFFF;
      const start = performance.now();
      
      for (let i = 0; i < 1000000; i++) {
        countLeadingOnes(largeSet);
      }
      
      const end = performance.now();
      expect(end - start).toBeLessThan(1000); // Adjust threshold as needed
    });
  });

  describe('Bitwise Operations Consistency', () => {
    it('should maintain consistency across operations', () => {
      const initial = 0xAAAAAAAA;
      const inverted = invertMask(initial);
      const reInverted = invertMask(inverted);
      
      expect(reInverted).toBe(initial);
      expect(mergeBitmasks(initial, inverted)).toBe(0xFFFFFFFF);
    });
  });

  describe('JavaScript-specific Integer Behavior', () => {
    it('should handle negative integers correctly', () => {
      expect(applyMask(-1, 0xFFFFFFFF)).toBe(0xFFFFFFFF);
      expect(invertMask(-1)).toBe(0);
      expect(extractBits(-1, 0, 31)).toBe(0xFFFFFFFF);
    });

    it('should handle integers larger than 32 bits', () => {
      const largeInt = 2 ** 53 - 1; // Max safe integer in JavaScript
      expect(applyMask(largeInt, 0xFFFFFFFF)).toBe(0xFFFFFFFF);
      expect(extractBits(largeInt, 0, 31)).toBe(0xFFFFFFFF);
    });

    it('should handle floating-point numbers', () => {
      expect(applyMask(3.14, 0xFFFFFFFF)).toBe(3);
      expect(extractBits(3.99, 0, 1)).toBe(3);
    });

    it('should handle NaN and Infinity', () => {
      expect(applyMask(NaN, 0xFFFFFFFF)).toBe(0);
      expect(applyMask(Infinity, 0xFFFFFFFF)).toBe(0);
    });
  });

  describe('Overflow and Underflow Scenarios', () => {
    it('should handle overflow in bitmask operations', () => {
      expect(mergeBitmasks(0xFFFFFFFF, 1)).toBe(0xFFFFFFFF);
      expect(nextLexicographicalMask(0xFFFFFFFF)).toBe(0);
    });

    it('should handle underflow in bitmask operations', () => {
      expect(removeRightmostSetBit(0)).toBe(0);
      expect(isolateRightmostSetBit(0)).toBe(0);
    });
  });

  describe('Edge Cases for Specific Functions', () => {
    it('should handle edge cases for generateBitmask', () => {
      expect(generateBitmask(0)).toBe(0);
      expect(generateBitmask(32)).toBe(0xFFFFFFFF);
      expect(() => generateBitmask(33)).toThrow();
      expect(() => generateBitmask(-1)).toThrow();
    });

    it('should handle edge cases for extractBits', () => {
      expect(extractBits(0xFFFFFFFF, 0, 31)).toBe(0xFFFFFFFF);
      expect(extractBits(0xFFFFFFFF, 31, 31)).toBe(1);
      expect(() => extractBits(0, -1, 31)).toThrow();
      expect(() => extractBits(0, 0, 32)).toThrow();
    });

    it('should handle edge cases for countLeadingOnes', () => {
      expect(countLeadingOnes(0)).toBe(0);
      expect(countLeadingOnes(0xFFFFFFFF)).toBe(32);
      expect(countLeadingOnes(0x80000000)).toBe(1);
    });

    it('should handle edge cases for nextLexicographicalMask', () => {
      expect(nextLexicographicalMask(0)).toBe(0);
      expect(nextLexicographicalMask(0x7FFFFFFF)).toBe(0xBFFFFFFF);
      expect(nextLexicographicalMask(0xFFFFFFFF)).toBe(0);  // Add this case
      expect(nextLexicographicalMask(0b1010)).toBe(0b1100);  // Normal case
      expect(nextLexicographicalMask(0b11100)).toBe(0b100011);  // Another normal case
    });
  });

  describe('Bitwise Operations with Non-Integer Inputs', () => {
    it('should handle string inputs by converting to numbers', () => {
      expect(applyMask('10' as unknown as number, '3' as unknown as number)).toBe(2);
      expect(extractBits('15' as unknown as number, 0, 2)).toBe(7);
    });

    it('should handle boolean inputs', () => {
      expect(applyMask(true as unknown as number, true as unknown as number)).toBe(1);
      expect(applyMask(false as unknown as number, true as unknown as number)).toBe(0);
    });

    it('should handle object inputs', () => {
      expect(applyMask({} as unknown as number, 0xFFFFFFFF)).toBe(0);
      expect(applyMask([] as unknown as number, 0xFFFFFFFF)).toBe(0);
    });
  });

  describe('Consistency Across Operations', () => {
    it('should maintain consistency when combining multiple operations', () => {
      const original = 0xA5A5A5A5;
      const mask = generateBitmask(16);
      const masked = applyMask(original, mask);
      const inverted = invertMask(masked);
      const reApplied = applyMask(inverted, mask);
      expect(reApplied).toBe(0x5A5A0000);
    });
  });

  describe('Performance for Large-Scale Operations', () => {
    it('should handle a large number of operations efficiently', () => {
      const start = performance.now();
      let result = 0;
      for (let i = 0; i < 1000000; i++) {
        result = applyMask(result, i);
      }
      const end = performance.now();
      expect(end - start).toBeLessThan(1000); // Adjust threshold as needed
      expect(result).toBe(999999);
    });
  });
});