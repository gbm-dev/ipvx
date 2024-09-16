import { expect, describe, it } from 'bun:test';
import {
  setFlag,
  clearFlag,
  toggleFlag,
  hasFlag,
  combineFlags,
  extractFlags,
  countSetFlags,
  firstSetFlag,
  lastSetFlag,
  nextSetFlag,
  clearAllFlags,
  setAllFlags,
  invertFlags
} from '@src/ipv4/lib/bitwise/bitflag';

describe('Bitwise::Bitflag', () => {
  describe('Bitwise::Bitflag::setFlag', () => {
    it('should set a specific flag', () => {
      expect(setFlag(0b1010, 0b0100)).toBe(0b1110);
    });

    it('should not change already set flags', () => {
      expect(setFlag(0b1010, 0b1000)).toBe(0b1010);
    });

    it('should handle setting multiple flags at once', () => {
      expect(setFlag(0b1010, 0b0101)).toBe(0b1111);
    });
  });

  describe('Bitwise::Bitflag::clearFlag', () => {
    it('should clear a specific flag', () => {
      expect(clearFlag(0b1110, 0b0100)).toBe(0b1010);
    });

    it('should not change already cleared flags', () => {
      expect(clearFlag(0b1010, 0b0100)).toBe(0b1010);
    });

    it('should handle clearing multiple flags at once', () => {
      expect(clearFlag(0b1111, 0b0101)).toBe(0b1010);
    });
  });

  describe('Bitwise::Bitflag::toggleFlag', () => {
    it('should toggle a set flag to unset', () => {
      expect(toggleFlag(0b1110, 0b0100)).toBe(0b1010);
    });

    it('should toggle an unset flag to set', () => {
      expect(toggleFlag(0b1010, 0b0100)).toBe(0b1110);
    });

    it('should handle toggling multiple flags at once', () => {
      expect(toggleFlag(0b1100, 0b0110)).toBe(0b1010);
    });
  });

  describe('Bitwise::Bitflag::hasFlag', () => {
    it('should return true for set flags', () => {
      expect(hasFlag(0b1010, 0b0010)).toBe(true);
    });

    it('should return false for unset flags', () => {
      expect(hasFlag(0b1010, 0b0100)).toBe(false);
    });

    it('should return true only if all specified flags are set', () => {
      expect(hasFlag(0b1110, 0b1100)).toBe(true);
      expect(hasFlag(0b1010, 0b1100)).toBe(false);
    });
  });

  describe('Bitwise::Bitflag::combineFlags', () => {
    it('should combine multiple flags', () => {
      expect(combineFlags(0b0001, 0b0010, 0b0100)).toBe(0b0111);
    });

    it('should handle overlapping flags', () => {
      expect(combineFlags(0b1100, 0b0110)).toBe(0b1110);
    });

    it('should return 0 when no flags are provided', () => {
      expect(combineFlags()).toBe(0);
    });
  });

  describe('Bitwise::Bitflag::extractFlags', () => {
    it('should extract all set flags', () => {
      expect(extractFlags(0b1010)).toEqual([0b0010, 0b1000]);
    });

    it('should return an empty array for 0', () => {
      expect(extractFlags(0)).toEqual([]);
    });

    it('should handle flags with multiple bits set', () => {
      expect(extractFlags(0b1001)).toEqual([0b0001, 0b1000]);
    });
  });

  describe('Bitwise::Bitflag::countSetFlags', () => {
    it('should count the number of set flags', () => {
      expect(countSetFlags(0b1010)).toBe(2);
    });

    it('should return 0 for no set flags', () => {
      expect(countSetFlags(0)).toBe(0);
    });

    it('should handle all flags set', () => {
      expect(countSetFlags(0xFFFFFFFF)).toBe(32);
    });
  });

  describe('Bitwise::Bitflag::firstSetFlag', () => {
    it('should find the least significant set flag', () => {
      expect(firstSetFlag(0b1010)).toBe(0b0010);
    });

    it('should return 0 for no set flags', () => {
      expect(firstSetFlag(0)).toBe(0);
    });

    it('should handle flags with only the most significant bit set', () => {
      expect(firstSetFlag(0x80000000)).toBe(0x80000000);
    });
  });

  describe('Bitwise::Bitflag::lastSetFlag', () => {
    it('should find the most significant set flag', () => {
      expect(lastSetFlag(0b1010)).toBe(0b1000);
    });

    it('should return 0 for no set flags', () => {
      expect(lastSetFlag(0)).toBe(0);
    });

    it('should handle flags with only the least significant bit set', () => {
      expect(lastSetFlag(1)).toBe(1);
    });
  });

  describe('Bitwise::Bitflag::nextSetFlag', () => {
    it('should find the next set flag after a given position', () => {
      expect(nextSetFlag(0b1010, 0b0010)).toBe(0b1000);
    });

    it('should return 0 if there are no more set flags', () => {
      expect(nextSetFlag(0b1010, 0b1000)).toBe(0);
    });

    it('should return the first set flag if currentFlag is 0', () => {
      expect(nextSetFlag(0b1010, 0)).toBe(0b0010);
    });
  });

  describe('Bitwise::Bitflag::clearAllFlags', () => {
    it('should clear all flags', () => {
      expect(clearAllFlags(0b1010)).toBe(0);
    });

    it('should return 0 for already cleared flags', () => {
      expect(clearAllFlags(0)).toBe(0);
    });
  });

  describe('Bitwise::Bitflag::setAllFlags', () => {
    it('should set all flags in a 32-bit integer', () => {
      expect(setAllFlags(0b1010)).toBe(0xFFFFFFFF);
    });

    it('should return all flags set even if input is 0', () => {
      expect(setAllFlags(0)).toBe(0xFFFFFFFF);
    });
  });

  describe('Bitwise::Bitflag::invertFlags', () => {
    it('should invert all flags', () => {
      expect(invertFlags(0b1010)).toBe(0xFFFFFFF5);
    });

    it('should return all flags set when inverting 0', () => {
      expect(invertFlags(0)).toBe(0xFFFFFFFF);
    });

    it('should return 0 when inverting all flags set', () => {
      expect(invertFlags(0xFFFFFFFF)).toBe(0);
    });
  });

  describe('Edge Cases and Complex Scenarios', () => {
    it('should handle 32-bit unsigned integer limits', () => {
      const maxUint32 = 0xFFFFFFFF;  // Maximum 32-bit unsigned integer
      const minUint32 = 0;           // Minimum 32-bit unsigned integer
      
      expect(setFlag(maxUint32, 1)).toBe(0xFFFFFFFF);
      expect(clearFlag(maxUint32, 1)).toBe(0xFFFFFFFE);
      expect(toggleFlag(maxUint32, 1)).toBe(0xFFFFFFFE);
      
      expect(setFlag(minUint32, 1)).toBe(1);
      expect(clearFlag(minUint32, 1)).toBe(0);
      expect(toggleFlag(minUint32, 1)).toBe(1);
    });
  
    it('should handle operations on the highest bit', () => {
      const highestBit = 0x80000000;
      
      expect(setFlag(0, highestBit)).toBe(0x80000000);
      expect(clearFlag(0xFFFFFFFF, highestBit)).toBe(0x7FFFFFFF);
      expect(toggleFlag(0, highestBit)).toBe(0x80000000);
      expect(toggleFlag(0xFFFFFFFF, highestBit)).toBe(0x7FFFFFFF);
    });

    it('should handle alternating bit patterns', () => {
      const alternating = 0xAAAAAAAA;
      expect(invertFlags(alternating)).toBe(0x55555555);
      expect(countSetFlags(alternating)).toBe(16);
    });

    it('should handle sparse bit patterns', () => {
      const sparse = 0x10001000;
      expect(extractFlags(sparse)).toEqual([0x1000, 0x10000000]);
      expect(nextSetFlag(sparse, 0x1000)).toBe(0x10000000);
    });
  });

  describe('Chained Operations', () => {
    it('should handle multiple operations correctly', () => {
      let flags = 0;
      flags = setFlag(flags, 0b0001);
      flags = setFlag(flags, 0b0100);
      flags = clearFlag(flags, 0b0001);
      flags = toggleFlag(flags, 0b1000);
      
      expect(flags).toBe(0b1100);
      expect(hasFlag(flags, 0b1100)).toBe(true);
    });
  });

  describe('Boundary Value Analysis', () => {
    it('should handle single bit flags at boundaries', () => {
      expect(setFlag(0, 0x80000000)).toBe(0x80000000);
      expect(clearFlag(0xFFFFFFFF, 0x80000000)).toBe(0x7FFFFFFF);
      expect(toggleFlag(0, 1)).toBe(1);
      expect(toggleFlag(0xFFFFFFFF, 1)).toBe(0xFFFFFFFE);
    });
  });

  describe('Performance Considerations', () => {
    it('should handle operations on large sets efficiently', () => {
      const largeSet = 0xFFFFFFFF;
      const start = performance.now();
      
      for (let i = 0; i < 1000000; i++) {
        countSetFlags(largeSet);
      }
      
      const end = performance.now();
      expect(end - start).toBeLessThan(1000); // Adjust threshold as needed
    });
  });

  describe('Bitwise Operations Consistency', () => {
    it('should maintain consistency across operations', () => {
      const initial = 0b1010101010101010;
      const inverted = invertFlags(initial);
      const reInverted = invertFlags(inverted);
      
      expect(reInverted).toBe(initial);
      expect(combineFlags(initial, inverted)).toBe(0xFFFFFFFF);
    });
  });

  describe('Flag Extraction and Manipulation', () => {
    it('should correctly extract and manipulate individual flags', () => {
      const flags = 0b1010101010101010;
      const extracted = extractFlags(flags);
      
      expect(extracted.length).toBe(8);
      expect(combineFlags(...extracted)).toBe(flags);
      
      const cleared = extracted.reduce((acc, flag) => clearFlag(acc, flag), flags);
      expect(cleared).toBe(0);
    });
  });

  describe('Advanced Unsigned Integer Behavior', () => {
    it('should handle unsigned integer overflow correctly', () => {
      const maxUint32 = 0xFFFFFFFF;
      expect(setFlag(maxUint32, 1)).toBe(maxUint32);
      expect(toggleFlag(maxUint32, 0x80000000)).toBe(0x7FFFFFFF);
    });
  
    it('should handle negative inputs by treating them as unsigned', () => {
      expect(setFlag(-1, 1)).toBe(0xFFFFFFFF);
      expect(clearFlag(-1, 1)).toBe(0xFFFFFFFE);
      expect(hasFlag(-1, 0x80000000)).toBe(true);
    });
  
    it('should handle non-integer inputs by truncating to 32-bit integers', () => {
      expect(setFlag(3.14, 1)).toBe(3);
      expect(clearFlag(3.99, 1)).toBe(2);
      expect(toggleFlag(NaN, 1)).toBe(1);
    });
  
    it('should handle large numbers by truncating to 32-bit unsigned integers', () => {
      const largeNumber = 2 ** 53 - 1; // Max safe integer in JavaScript
      expect(setFlag(largeNumber, 1)).toBe(0xFFFFFFFF);   
      expect(clearFlag(largeNumber, 1)).toBe(0xFFFFFFFE);
    });
  });
  
  describe('Extended Edge Cases', () => {
    it('should handle all bits toggling', () => {
      let flags = 0;
      for (let i = 0; i < 32; i++) {
        flags = toggleFlag(flags, 1 << i);
      }
      expect(flags).toBe(0xFFFFFFFF);
      for (let i = 0; i < 32; i++) {
        flags = toggleFlag(flags, 1 << i);
      }
      expect(flags).toBe(0);
    });
  
    it('should handle extracting and combining all possible single-bit flags', () => {
      const allFlags = 0xFFFFFFFF;
      const extracted = extractFlags(allFlags);
      expect(extracted.length).toBe(32);
      expect(combineFlags(...extracted)).toBe(allFlags);
    });
  });
  
  describe('Bitwise Operations with Type Coercion', () => {
    it('should handle string inputs by converting to numbers', () => {
      expect(setFlag('10' as unknown as number, '1' as unknown as number)).toBe(11);
      expect(clearFlag('7' as unknown as number, '2' as unknown as number)).toBe(5);
      expect(toggleFlag('15' as unknown as number, '4' as unknown as number)).toBe(11);
    });
  
    it('should handle boolean inputs', () => {
      expect(setFlag(true as unknown as number, true as unknown as number)).toBe(1);
      expect(clearFlag(true as unknown as number, false as unknown as number)).toBe(1);
      expect(toggleFlag(false as unknown as number, true as unknown as number)).toBe(1);
    });
  });

});