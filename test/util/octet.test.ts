// Add to basic.test.ts
describe('Bitwise::Basic::isValidChar', () => {
    const VALID_IPV4_CHARS = ['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
    it('should return true for valid IPv4 characters', () => {
      VALID_IPV4_CHARS.forEach(char => {
        expect(isValidChar(char.charCodeAt(0), VALID_IPV4_CHARS)).toBe(true);
      });
    });
  
    it('should return false for invalid characters', () => {
      expect(isValidChar('A'.charCodeAt(0), VALID_IPV4_CHARS)).toBe(false);
      expect(isValidChar('!'.charCodeAt(0), VALID_IPV4_CHARS)).toBe(false);
      expect(isValidChar(' '.charCodeAt(0), VALID_IPV4_CHARS)).toBe(false);
    });
  });
  
  // Add to bitmask.test.ts
  describe('Bitwise::Bitmask::extractOctet', () => {
    it('should extract the correct octet', () => {
      const ip = 0xC0A80101; // 192.168.1.1
      expect(extractOctet(ip, 0)).toBe(192);
      expect(extractOctet(ip, 1)).toBe(168);
      expect(extractOctet(ip, 2)).toBe(1);
      expect(extractOctet(ip, 3)).toBe(1);
    });
  
    it('should throw an error for invalid octet position', () => {
      expect(() => extractOctet(0, -1)).toThrow();
      expect(() => extractOctet(0, 4)).toThrow();
    });
  });
  
  describe('Bitwise::Bitmask::setOctet', () => {
    it('should set the correct octet', () => {
      let ip = 0xC0A80101; // 192.168.1.1
      ip = setOctet(ip, 3, 10);
      expect(ip).toBe(0xC0A8010A); // 192.168.1.10
    });
  
    it('should throw an error for invalid octet position', () => {
      expect(() => setOctet(0, -1, 0)).toThrow();
      expect(() => setOctet(0, 4, 0)).toThrow();
    });
  
    it('should throw an error for invalid octet value', () => {
      expect(() => setOctet(0, 0, -1)).toThrow();
      expect(() => setOctet(0, 0, 256)).toThrow();
    });
  });
  
  // Add to bitflag.test.ts
  describe('Bitwise::Bitflag::bitflagToOctets', () => {
    it('should convert bitflag to octets correctly', () => {
      expect(bitflagToOctets(0xC0A80101)).toEqual([192, 168, 1, 1]);
      expect(bitflagToOctets(0x7F000001)).toEqual([127, 0, 0, 1]);
    });
  });
  
  describe('Bitwise::Bitflag::octetsToBitflag', () => {
    it('should convert octets to bitflag correctly', () => {
      expect(octetsToBitflag([192, 168, 1, 1])).toBe(0xC0A80101);
      expect(octetsToBitflag([127, 0, 0, 1])).toBe(0x7F000001);
    });
  });