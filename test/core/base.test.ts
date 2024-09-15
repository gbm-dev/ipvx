/**
 * @file tests/ipv4/core/base.test.ts
 * @description Unit tests for the IPv4 core bitmask and conversion functions.
 */

import { expect, describe, it } from 'bun:test';
import {
  generateBitmask,
  isValidChar,
  countSetBits,
  getBit,
  setBit,
  clearBit,
  toggleBit,
  extractBits,
  rotateBits,
  extractOctet,
  setOctet,
  invertBits,
  leadingZeros,
  bitflagToOctets,
  octetsToBitflag,
  MAX_32BIT_VALUE,
  VALID_IPV4_CHARS,
  rightShift,
  leftShift,
  findFirstSetBit,
  trailingZeros,
} from '@src/ipv4/core/base';
import type { IPv4Bitflag } from '@src/types';

describe('IPv4::Core::Base', () => {
  describe('IPv4::Core::Base::generateBitmask', () => {
    it('should generate correct bitmask for 0 bits', () => {
      const result = generateBitmask(0);
      expect(result).toBe(0);
    });

    it('should generate correct bitmask for 1 bit', () => {
      const result = generateBitmask(1);
      expect(result).toBe(1);
    });

    it('should generate correct bitmask for 8 bits', () => {
      const result = generateBitmask(8);
      expect(result).toBe(0xFF);
    });

    it('should generate correct bitmask for 16 bits', () => {
      const result = generateBitmask(16);
      expect(result).toBe(0xFFFF);
    });

    it('should generate correct bitmask for 24 bits', () => {
      const result = generateBitmask(24);
      expect(result).toBe(0xFFFFFF);
    });

    it('should generate correct bitmask for 31 bits', () => {
      const result = generateBitmask(31);
      expect(result).toBe(0x7FFFFFFF);
    });

    it('should generate correct bitmask for 32 bits', () => {
      const result = generateBitmask(32);
      expect(result).toBe(0xFFFFFFFF);
    });

    it('should throw an error for negative numBits', () => {
      expect(() => generateBitmask(-1)).toThrow(
        'Invalid number of bits. Must be between 0 and 32 inclusive.'
      );
    });

    it('should throw an error for numBits greater than 32', () => {
      expect(() => generateBitmask(33)).toThrow(
        'Invalid number of bits. Must be between 0 and 32 inclusive.'
      );
    });
  });

  describe('IPv4::Core::Base::isValidChar', () => {
    it('should return true for character "0"', () => {
      const charCode = '0'.charCodeAt(0);
      const result = isValidChar(charCode, VALID_IPV4_CHARS);
      expect(result).toBe(true);
    });

    it('should return true for character "9"', () => {
      const charCode = '9'.charCodeAt(0);
      const result = isValidChar(charCode, VALID_IPV4_CHARS);
      expect(result).toBe(true);
    });

    it('should return true for character "."', () => {
      const charCode = '.'.charCodeAt(0);
      const result = isValidChar(charCode, VALID_IPV4_CHARS);
      expect(result).toBe(true);
    });

    it('should return false for character "A"', () => {
      const charCode = 'A'.charCodeAt(0);
      const result = isValidChar(charCode, VALID_IPV4_CHARS);
      expect(result).toBe(false);
    });

    it('should return false for character "!"', () => {
      const charCode = '!'.charCodeAt(0);
      const result = isValidChar(charCode, VALID_IPV4_CHARS);
      expect(result).toBe(false);
    });

    it('should return true for character "1"', () => {
      const charCode = '1'.charCodeAt(0);
      const result = isValidChar(charCode, VALID_IPV4_CHARS);
      expect(result).toBe(true);
    });

    it('should return true for character "8"', () => {
      const charCode = '8'.charCodeAt(0);
      const result = isValidChar(charCode, VALID_IPV4_CHARS);
      expect(result).toBe(true);
    });

    it('should return false for empty string', () => {
      const charCode = ''.charCodeAt(0);
      const result = isValidChar(charCode, VALID_IPV4_CHARS);
      expect(result).toBe(false);
    });

    it('should return false for space character', () => {
      const charCode = ' '.charCodeAt(0);
      const result = isValidChar(charCode, VALID_IPV4_CHARS);
      expect(result).toBe(false);
    });
  });

  describe('IPv4::Core::Base::countSetBits', () => {
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

  describe('IPv4::Core::Base::getBit', () => {
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

  describe('IPv4::Core::Base::setBit', () => {
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

  describe('IPv4::Core::Base::clearBit', () => {
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

  describe('IPv4::Core::Base::toggleBit', () => {
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

  describe('IPv4::Core::Base::extractBits', () => {
    it('should extract bits from position 2 to 5', () => {
      const n = 0b11011001;
      const result = extractBits(n, 2, 5);
      expect(result).toBe(0b110);
    });

    it('should throw an error if start > end', () => {
      expect(() => extractBits(0, 5, 2)).toThrow(
        'Invalid bit range. Start and end positions must be between 0 and 31 inclusive, and start <= end.'
      );
    });

    it('should throw an error for negative start', () => {
      expect(() => extractBits(0, -1, 5)).toThrow(
        'Invalid bit range. Start and end positions must be between 0 and 31 inclusive, and start <= end.'
      );
    });

    it('should throw an error for end > 31', () => {
      expect(() => extractBits(0, 0, 32)).toThrow(
        'Invalid bit range. Start and end positions must be between 0 and 31 inclusive, and start <= end.'
      );
    });

    it('should extract all 32 bits', () => {
        const n = 0xFFFFFFFF;
        const result = extractBits(n, 0, 31);
        expect(result).toBe(0xFFFFFFFF);
      });
    
      it('should extract a single bit', () => {
        const n = 0b10101010;
        const result = extractBits(n, 3, 3);
        expect(result).toBe(1);
      });
    
      it('should extract bits from position 2 to 5', () => {
        const n = 0b11011001;
        const result = extractBits(n, 2, 5);
        expect(result).toBe(0b110);
      });
    
      it('should handle extracting all bits from a number with leading zeros', () => {
        const n = 0x0FFFFFFF;
        const result = extractBits(n, 0, 31);
        expect(result).toBe(0x0FFFFFFF);
      });

  });

  describe('IPv4::Core::Base::rotateBits', () => {
    it('should rotate bits to the right by 2 positions', () => {
      const n = 0b10110011;
      const result = rotateBits(n, 2);
      expect(result).toBe(0b11101100);
    });

    it('should rotate bits to the left by 2 positions', () => {
      const n = 0b10110011;
      const result = rotateBits(n, -2);
      expect(result).toBe(0b11001110);
    });

    it('should handle rotations greater than 32', () => {
      const n = 0b10110011;
      const result = rotateBits(n, 34); // Equivalent to rotating by 2 positions
      expect(result).toBe(0b11101100);
    });

    it('should not change bits when rotating by 0 positions', () => {
        const n = 0b10110011;
        const result = rotateBits(n, 0);
        expect(result).toBe(0b10110011);
      });
  
    it('should return the same value when rotating by 8 positions', () => {
    const n = 0b10110011;
    const result = rotateBits(n, 8);
    expect(result).toBe(0b10110011);
    });

    it('should handle larger numbers correctly', () => {
    const n = 0xFF;
    const result = rotateBits(n, 1);
    expect(result).toBe(0xFF);
    })
  });

  describe('IPv4::Core::Base::extractOctet', () => {
    const ip: IPv4Bitflag = 0xC0A80101 as IPv4Bitflag; // 192.168.1.1

    it('should extract the first octet (position 0)', () => {
      const result = extractOctet(ip, 0);
      expect(result).toBe(192);
    });

    it('should extract the second octet (position 1)', () => {
      const result = extractOctet(ip, 1);
      expect(result).toBe(168);
    });

    it('should extract the third octet (position 2)', () => {
      const result = extractOctet(ip, 2);
      expect(result).toBe(1);
    });

    it('should extract the fourth octet (position 3)', () => {
      const result = extractOctet(ip, 3);
      expect(result).toBe(1);
    });

    it('should throw an error for invalid octet position', () => {
      expect(() => extractOctet(ip, -1)).toThrow(
        'Invalid octet position. Must be between 0 and 3 inclusive.'
      );
      expect(() => extractOctet(ip, 4)).toThrow(
        'Invalid octet position. Must be between 0 and 3 inclusive.'
      );
    });
  });

  describe('IPv4::Core::Base::setOctet', () => {
    const ip: IPv4Bitflag = 0xC0A80101 as IPv4Bitflag; // 192.168.1.1

    it('should set the fourth octet to 10', () => {
      const result = setOctet(ip, 3, 10);
      expect(result).toBe(0xC0A8010A as IPv4Bitflag);
    });

    it('should set the first octet to 10', () => {
      const result = setOctet(ip, 0, 10);
      expect(result).toBe(0x0AA80101 as IPv4Bitflag);
    });

    it('should throw an error for invalid octet position', () => {
      expect(() => setOctet(ip, -1, 10)).toThrow(
        'Invalid octet position. Must be between 0 and 3 inclusive.'
      );
      expect(() => setOctet(ip, 4, 10)).toThrow(
        'Invalid octet position. Must be between 0 and 3 inclusive.'
      );
    });

    it('should throw an error for invalid octet value', () => {
      expect(() => setOctet(ip, 0, -1)).toThrow(
        'Invalid octet value. Must be between 0 and 255 inclusive.'
      );
      expect(() => setOctet(ip, 0, 256)).toThrow(
        'Invalid octet value. Must be between 0 and 255 inclusive.'
      );
    });

    it('should set all octets to 255', () => {
        let ip: IPv4Bitflag = 0x00000000 as IPv4Bitflag;
        ip = setOctet(ip, 0, 255);
        ip = setOctet(ip, 1, 255);
        ip = setOctet(ip, 2, 255);
        ip = setOctet(ip, 3, 255);
        expect(ip).toBe(0xFFFFFFFF as IPv4Bitflag);
      });    

  });

  describe('IPv4::Core::Base::invertBits', () => {
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

  describe('IPv4::Core::Base::leadingZeros', () => {
    it('should return 0 for n=0x80000000', () => {
      const n = 0x80000000;
      const result = leadingZeros(n);
      expect(result).toBe(0);
    });

    it('should return 31 for n=1', () => {
      const n = 1;
      const result = leadingZeros(n);
      expect(result).toBe(31);
    });

    it('should return 32 for n=0', () => {
      const n = 0;
      const result = leadingZeros(n);
      expect(result).toBe(32);
    });

    it('should return 28 for n=0b00000000000000000000000000001000', () => {
      const n = 0b00000000000000000000000000001000;
      const result = leadingZeros(n);
      expect(result).toBe(28);
    });

    it('should return 31 for n=0x00000001', () => {
        const n = 0x00000001;
        const result = leadingZeros(n);
        expect(result).toBe(31);
      });

  });

  describe('IPv4::Core::Base::bitflagToOctets', () => {
    it('should convert 0xC0A80101 to [192, 168, 1, 1]', () => {
      const ip: IPv4Bitflag = 0xC0A80101 as IPv4Bitflag;
      const result = bitflagToOctets(ip);
      expect(result).toEqual([192, 168, 1, 1]);
    });

    it('should convert 0x7F000001 to [127, 0, 0, 1]', () => {
      const ip: IPv4Bitflag = 0x7F000001 as IPv4Bitflag;
      const result = bitflagToOctets(ip);
      expect(result).toEqual([127, 0, 0, 1]);
    });

    it('should convert 0x00000000 to [0, 0, 0, 0]', () => {
        const ip: IPv4Bitflag = 0x00000000 as IPv4Bitflag;
        const result = bitflagToOctets(ip);
        expect(result).toEqual([0, 0, 0, 0]);
      });
  
      it('should convert 0xFFFFFFFF to [255, 255, 255, 255]', () => {
        const ip: IPv4Bitflag = 0xFFFFFFFF as IPv4Bitflag;
        const result = bitflagToOctets(ip);
        expect(result).toEqual([255, 255, 255, 255]);
      });

  });

  describe('IPv4::Core::Base::octetsToBitflag', () => {
    it('should convert [192, 168, 1, 1] to 0xC0A80101', () => {
      const octets: [number, number, number, number] = [192, 168, 1, 1];
      const result = octetsToBitflag(octets);
      expect(result).toBe(0xC0A80101 as IPv4Bitflag);
    });

    it('should convert [127, 0, 0, 1] to 0x7F000001', () => {
      const octets: [number, number, number, number] = [127, 0, 0, 1];
      const result = octetsToBitflag(octets);
      expect(result).toBe(0x7F000001 as IPv4Bitflag);
    });

    it('should convert [0, 0, 0, 0] to 0x00000000', () => {
        const octets: [number, number, number, number] = [0, 0, 0, 0];
        const result = octetsToBitflag(octets);
        expect(result).toBe(0x00000000 as IPv4Bitflag);
      });
  
    it('should convert [255, 255, 255, 255] to 0xFFFFFFFF', () => {
        const octets: [number, number, number, number] = [255, 255, 255, 255];
        const result = octetsToBitflag(octets);
        expect(result).toBe(0xFFFFFFFF as IPv4Bitflag);
    });
  });

  describe('IPv4::Core::Base::trailingZeros', () => {
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
  
  describe('IPv4::Core::Base::findFirstSetBit', () => {
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
  
  describe('IPv4::Core::Base::leftShift', () => {
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
  
  describe('IPv4::Core::Base::rightShift', () => {
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
  
});
