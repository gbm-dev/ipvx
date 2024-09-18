import {
  extractOctet,
  setOctet,
  bitflagToOctets,
  octetsToBitflag,
  setOctetInIP,
  getOctetFromIP,
  replaceOctetRange,
  swapOctets
} from '../octet';
import { expect, describe, it } from 'bun:test';
import type { IPv4Bitflag, IPv4Address } from '@src/types';

describe('Bitwise::Bitmask::extractOctet', () => {
  it('should extract the correct octet', () => {
    const ip = 0xC0A80101 as IPv4Bitflag; // 192.168.1.1
    expect(extractOctet(ip, 0)).toBe(192);
    expect(extractOctet(ip, 1)).toBe(168);
    expect(extractOctet(ip, 2)).toBe(1);
    expect(extractOctet(ip, 3)).toBe(1);
  });

  it('should extract octets from ip zero', () => {
    const ip = 0x00000000 as IPv4Bitflag;
    expect(extractOctet(ip, 0)).toBe(0);
    expect(extractOctet(ip, 1)).toBe(0);
    expect(extractOctet(ip, 2)).toBe(0);
    expect(extractOctet(ip, 3)).toBe(0);
  });

  it('should extract octets from ip maximum', () => {
    const ip = 0xFFFFFFFF as IPv4Bitflag;
    expect(extractOctet(ip, 0)).toBe(255);
    expect(extractOctet(ip, 1)).toBe(255);
    expect(extractOctet(ip, 2)).toBe(255);
    expect(extractOctet(ip, 3)).toBe(255);
  });

  it('should extract octets from ip with alternating bits', () => {
    const ip = 0xAAAAAAAA as IPv4Bitflag; // 10101010 repeated
    expect(extractOctet(ip, 0)).toBe(170);
    expect(extractOctet(ip, 1)).toBe(170);
    expect(extractOctet(ip, 2)).toBe(170);
    expect(extractOctet(ip, 3)).toBe(170);
  });

  it('should extract octets from ip with specific octet set', () => {
    const ip = 0x00FF0000 as IPv4Bitflag; // Only the second octet is 255
    expect(extractOctet(ip, 0)).toBe(0);
    expect(extractOctet(ip, 1)).toBe(255);
    expect(extractOctet(ip, 2)).toBe(0);
    expect(extractOctet(ip, 3)).toBe(0);
  });

  it('should throw an error for invalid octet position', () => {
    expect(() => extractOctet(0 as IPv4Bitflag, -1)).toThrow();
    expect(() => extractOctet(0 as IPv4Bitflag, 4)).toThrow();
    expect(() => extractOctet(0 as IPv4Bitflag, 100)).toThrow();
  });
});

describe('Bitwise::Bitmask::setOctet', () => {
  it('should set the correct octet', () => {
    let ip = 0xC0A80101 as IPv4Bitflag; // 192.168.1.1
    ip = setOctet(ip, 3, 10);
    expect(ip).toBe(0xC0A8010A as IPv4Bitflag); // 192.168.1.10
  });

  it('should set the first octet to 0', () => {
    let ip = 0xFFFFFFFF as IPv4Bitflag; // 255.255.255.255
    ip = setOctet(ip, 0, 0);
    expect(ip).toBe(0x00FFFFFF as IPv4Bitflag); // 0.255.255.255
  });

  it('should set the last octet to 255', () => {
    let ip = 0x00000000 as IPv4Bitflag; // 0.0.0.0
    ip = setOctet(ip, 3, 255);
    expect(ip).toBe(0x000000FF as IPv4Bitflag); // 0.0.0.255
  });

  it('should not change other octets', () => {
    let ip = 0x12345678 as IPv4Bitflag; // Some arbitrary IP
    ip = setOctet(ip, 2, 0xAA); // Set third octet
    expect(extractOctet(ip, 0)).toBe(0x12);
    expect(extractOctet(ip, 1)).toBe(0x34);
    expect(extractOctet(ip, 2)).toBe(0xAA);
    expect(extractOctet(ip, 3)).toBe(0x78);
  });

  it('should throw an error for invalid octet position', () => {
    expect(() => setOctet(0 as IPv4Bitflag, -1, 0)).toThrow();
    expect(() => setOctet(0 as IPv4Bitflag, 4, 0)).toThrow();
    expect(() => setOctet(0 as IPv4Bitflag, 100, 0)).toThrow();
  });

  it('should throw an error for invalid octet value', () => {
    expect(() => setOctet(0 as IPv4Bitflag, 0, -1)).toThrow();
    expect(() => setOctet(0 as IPv4Bitflag, 0, 256)).toThrow();
    expect(() => setOctet(0 as IPv4Bitflag, 0, 1000)).toThrow();
  });

  it('should throw an error for non-integer octet position', () => {
    const ip = '192.168.1.1' as IPv4Address;
    expect(() => setOctetInIP(ip, 1.5, 10)).toThrow('Invalid octet position. Must be an integer between 0 and 3 inclusive.');
    expect(() => setOctetInIP(ip, NaN, 10)).toThrow('Invalid octet position. Must be an integer between 0 and 3 inclusive.');
    expect(() => setOctetInIP(ip, Infinity, 10)).toThrow('Invalid octet position. Must be an integer between 0 and 3 inclusive.');
  });

  it('should throw an error for non-integer octet value', () => {
    const ip = '192.168.1.1' as IPv4Address;
    expect(() => setOctetInIP(ip, 0, 1.5)).toThrow('Invalid octet value. Must be an integer between 0 and 255 inclusive.');
    expect(() => setOctetInIP(ip, 0, NaN)).toThrow('Invalid octet value. Must be an integer between 0 and 255 inclusive.');
    expect(() => setOctetInIP(ip, 0, Infinity)).toThrow('Invalid octet value. Must be an integer between 0 and 255 inclusive.');
  });

  it('should throw an error for out-of-range octet position', () => {
    const ip = '192.168.1.1' as IPv4Address;
    expect(() => setOctetInIP(ip, -1, 10)).toThrow('Invalid octet position. Must be an integer between 0 and 3 inclusive.');
    expect(() => setOctetInIP(ip, 4, 10)).toThrow('Invalid octet position. Must be an integer between 0 and 3 inclusive.');
  });

  it('should throw an error for out-of-range octet value', () => {
    const ip = '192.168.1.1' as IPv4Address;
    expect(() => setOctetInIP(ip, 0, -1)).toThrow('Invalid octet value. Must be an integer between 0 and 255 inclusive.');
    expect(() => setOctetInIP(ip, 0, 256)).toThrow('Invalid octet value. Must be an integer between 0 and 255 inclusive.');
  });

});

describe('Bitwise::Bitflag::bitflagToOctets', () => {
  it('should convert bitflag to octets correctly', () => {
    expect(bitflagToOctets(0xC0A80101 as IPv4Bitflag)).toEqual([192, 168, 1, 1]);
    expect(bitflagToOctets(0x7F000001 as IPv4Bitflag)).toEqual([127, 0, 0, 1]);
  });

  it('should convert ip zero', () => {
    expect(bitflagToOctets(0x00000000 as IPv4Bitflag)).toEqual([0, 0, 0, 0]);
  });

  it('should convert ip maximum', () => {
    expect(bitflagToOctets(0xFFFFFFFF as IPv4Bitflag)).toEqual([255, 255, 255, 255]);
  });

  it('should convert arbitrary ip', () => {
    expect(bitflagToOctets(0x12345678 as IPv4Bitflag)).toEqual([0x12, 0x34, 0x56, 0x78]);
  });
});

describe('Bitwise::Bitflag::octetsToBitflag', () => {
  it('should convert octets to bitflag correctly', () => {
    expect(octetsToBitflag([192, 168, 1, 1])).toBe(0xC0A80101 as IPv4Bitflag);
    expect(octetsToBitflag([127, 0, 0, 1])).toBe(0x7F000001 as IPv4Bitflag);
  });

  it('should convert octets of ip zero', () => {
    expect(octetsToBitflag([0, 0, 0, 0])).toBe(0x00000000 as IPv4Bitflag);
  });

  it('should convert octets of ip maximum', () => {
    expect(octetsToBitflag([255, 255, 255, 255])).toBe(0xFFFFFFFF as IPv4Bitflag);
  });

  it('should convert arbitrary octets', () => {
    expect(octetsToBitflag([0x12, 0x34, 0x56, 0x78])).toBe(0x12345678 as IPv4Bitflag);
  });

  it('should throw error for invalid octet values', () => {
    expect(() => octetsToBitflag([-1, 0, 0, 0] as any)).toThrow();
    expect(() => octetsToBitflag([0, 0, 0, 256] as any)).toThrow();
    expect(() => octetsToBitflag([0, 0, 0, 1000] as any)).toThrow();
  });

  it('should throw error if not exactly 4 octets', () => {
    expect(() => octetsToBitflag([192, 168, 1] as any)).toThrow();
    expect(() => octetsToBitflag([192, 168, 1, 1, 0] as any)).toThrow();
  });

  it('should throw error if not exactly 4 octets', () => {
    expect(() => octetsToBitflag([192, 168, 1] as any)).toThrow('Input must be an array of exactly 4 octets');
    expect(() => octetsToBitflag([192, 168, 1, 1, 1] as any)).toThrow('Input must be an array of exactly 4 octets');
  });

  it('should throw error if input is not an array', () => {
    expect(() => octetsToBitflag('192.168.1.1' as any)).toThrow('Input must be an array of exactly 4 octets');
    expect(() => octetsToBitflag(192168001 as any)).toThrow('Input must be an array of exactly 4 octets');
  });

  it('should throw error for NaN or Infinity octet values', () => {
    expect(() => octetsToBitflag([NaN, 0, 0, 0] as any)).toThrow();
    expect(() => octetsToBitflag([0, Infinity, 0, 0] as any)).toThrow();
    expect(() => octetsToBitflag([0, -Infinity, 0, 0] as any)).toThrow();
  });

  it('should throw error for non-number octet values', () => {
    expect(() => octetsToBitflag(['192', 168, 1, 1] as any)).toThrow();
    expect(() => octetsToBitflag([null, 0, 0, 0] as any)).toThrow();
    expect(() => octetsToBitflag([undefined, 0, 0, 0] as any)).toThrow();
  });

  it('should handle edge case octet values', () => {
    expect(octetsToBitflag([0, 0, 0, 1])).toBe(0x00000001 as IPv4Bitflag);
    expect(octetsToBitflag([255, 255, 255, 254])).toBe(0xFFFFFFFE as IPv4Bitflag);
  });
});

describe('IPv4::setOctetInIP', () => {
  it('should set the specified octet in an IP address', () => {
    const ip = '192.168.1.1' as IPv4Address;
    const newIp = setOctetInIP(ip, 3, 10);
    expect(newIp).toBe('192.168.1.10' as IPv4Address);
  });

  it('should set the first octet to 0', () => {
    const ip = '255.255.255.255' as IPv4Address;
    const newIp = setOctetInIP(ip, 0, 0);
    expect(newIp).toBe('0.255.255.255' as IPv4Address);
  });

  it('should throw an error for invalid octet position', () => {
    const ip = '192.168.1.1' as IPv4Address;
    expect(() => setOctetInIP(ip, -1, 0)).toThrow();
    expect(() => setOctetInIP(ip, 4, 0)).toThrow();
  });

  it('should throw an error for invalid octet value', () => {
    const ip = '192.168.1.1' as IPv4Address;
    expect(() => setOctetInIP(ip, 0, -1)).toThrow();
    expect(() => setOctetInIP(ip, 0, 256)).toThrow();
  });

  it('should handle setting octet to 255', () => {
    const ip = '192.168.1.1' as IPv4Address;
    const newIp = setOctetInIP(ip, 2, 255);
    expect(newIp).toBe('192.168.255.1' as IPv4Address);
  });

  it('should throw an error for non-integer octet value', () => {
    const ip = '192.168.1.1' as IPv4Address;
    expect(() => setOctetInIP(ip, 0, 1.5)).toThrow();
  });

  it('should throw an error for NaN or Infinity octet value', () => {
    const ip = '192.168.1.1' as IPv4Address;
    expect(() => setOctetInIP(ip, 0, NaN)).toThrow();
    expect(() => setOctetInIP(ip, 0, Infinity)).toThrow();
  });

  it('should throw an error for invalid IP address format', () => {
    const ip = '192.168.1' as any;
    expect(() => setOctetInIP(ip, 0, 10)).toThrow();
  });

  it('should throw an error for IP address with invalid octet values', () => {
    const ip = '192.168.300.1' as any;
    expect(() => setOctetInIP(ip, 0, 10)).toThrow();
  });

});

describe('IPv4::getOctetFromIP', () => {
  it('should get the specified octet from an IP address', () => {
    const ip = '192.168.1.1' as IPv4Address;
    expect(getOctetFromIP(ip, 0)).toBe(192);
    expect(getOctetFromIP(ip, 1)).toBe(168);
    expect(getOctetFromIP(ip, 2)).toBe(1);
    expect(getOctetFromIP(ip, 3)).toBe(1);
  });

  it('should throw an error for invalid octet position', () => {
    const ip = '192.168.1.1' as IPv4Address;
    expect(() => getOctetFromIP(ip, -1)).toThrow();
    expect(() => getOctetFromIP(ip, 4)).toThrow();
  });
});

describe('IPv4::replaceOctetRange', () => {
  it('should replace a range of octets in an IP address', () => {
    const ip = '192.168.1.1' as IPv4Address;
    const newIp = replaceOctetRange(ip, 1, 2, [200, 100]);
    expect(newIp).toBe('192.200.100.1' as IPv4Address);
  });

  it('should replace all octets', () => {
    const ip = '192.168.1.1' as IPv4Address;
    const newIp = replaceOctetRange(ip, 0, 3, [10, 20, 30, 40]);
    expect(newIp).toBe('10.20.30.40' as IPv4Address);
  });

  it('should throw an error if octet positions are invalid', () => {
    const ip = '192.168.1.1' as IPv4Address;
    expect(() => replaceOctetRange(ip, -1, 2, [1, 2, 3])).toThrow();
    expect(() => replaceOctetRange(ip, 1, 4, [1, 2, 3])).toThrow();
    expect(() => replaceOctetRange(ip, 2, 1, [1, 2])).toThrow();
  });

  it('should throw an error if newValues length does not match the range', () => {
    const ip = '192.168.1.1' as IPv4Address;
    expect(() => replaceOctetRange(ip, 1, 2, [1])).toThrow();
    expect(() => replaceOctetRange(ip, 1, 2, [1, 2, 3])).toThrow();
  });

  it('should throw an error for invalid octet values', () => {
    const ip = '192.168.1.1' as IPv4Address;
    expect(() => replaceOctetRange(ip, 1, 2, [-1, 256])).toThrow();
  });
});

describe('IPv4::swapOctets', () => {
  it('should swap two octets in an IP address', () => {
    const ip = '192.168.1.1' as IPv4Address;
    const newIp = swapOctets(ip, 0, 3);
    expect(newIp).toBe('1.168.1.192' as IPv4Address);
  });

  it('should swap the same octet (no change)', () => {
    const ip = '192.168.1.1' as IPv4Address;
    const newIp = swapOctets(ip, 2, 2);
    expect(newIp).toBe('192.168.1.1' as IPv4Address);
  });

  it('should throw an error for invalid octet positions', () => {
    const ip = '192.168.1.1' as IPv4Address;
    expect(() => swapOctets(ip, -1, 2)).toThrow();
    expect(() => swapOctets(ip, 1, 4)).toThrow();
  });
});
