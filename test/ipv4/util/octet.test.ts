import { bitflagToOctets, extractOctet, octetsToBitflag, setOctet } from '@src/ipv4/util/octet';
import { expect, describe, it } from 'bun:test';
import type { IPv4Bitflag } from '@src/types'; // Make sure to import the IPv4Bitflag type

describe('Bitwise::Bitmask::extractOctet', () => {
  it('should extract the correct octet', () => {
    const ip = 0xC0A80101 as IPv4Bitflag; // 192.168.1.1
    expect(extractOctet(ip, 0)).toBe(192);
    expect(extractOctet(ip, 1)).toBe(168);
    expect(extractOctet(ip, 2)).toBe(1);
    expect(extractOctet(ip, 3)).toBe(1);
  });

  it('should throw an error for invalid octet position', () => {
    expect(() => extractOctet(0 as IPv4Bitflag, -1)).toThrow();
    expect(() => extractOctet(0 as IPv4Bitflag, 4)).toThrow();
  });
});

describe('Bitwise::Bitmask::setOctet', () => {
  it('should set the correct octet', () => {
    let ip = 0xC0A80101 as IPv4Bitflag; // 192.168.1.1
    ip = setOctet(ip, 3, 10);
    expect(ip).toBe(0xC0A8010A as IPv4Bitflag); // 192.168.1.10
  });

  it('should throw an error for invalid octet position', () => {
    expect(() => setOctet(0 as IPv4Bitflag, -1, 0)).toThrow();
    expect(() => setOctet(0 as IPv4Bitflag, 4, 0)).toThrow();
  });

  it('should throw an error for invalid octet value', () => {
    expect(() => setOctet(0 as IPv4Bitflag, 0, -1)).toThrow();
    expect(() => setOctet(0 as IPv4Bitflag, 0, 256)).toThrow();
  });
});

describe('Bitwise::Bitflag::bitflagToOctets', () => {
  it('should convert bitflag to octets correctly', () => {
    expect(bitflagToOctets(0xC0A80101 as IPv4Bitflag)).toEqual([192, 168, 1, 1]);
    expect(bitflagToOctets(0x7F000001 as IPv4Bitflag)).toEqual([127, 0, 0, 1]);
  });
});

describe('Bitwise::Bitflag::octetsToBitflag', () => {
  it('should convert octets to bitflag correctly', () => {
    expect(octetsToBitflag([192, 168, 1, 1])).toBe(0xC0A80101 as IPv4Bitflag);
    expect(octetsToBitflag([127, 0, 0, 1])).toBe(0x7F000001 as IPv4Bitflag);
  });
});