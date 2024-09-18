import { expect, describe, it } from 'bun:test';
import {
  parseCIDR,
  calculateNetworkAddress,
  calculateBroadcastAddress,
  isInSubnet,
  calculateAvailableIPs,
  calculateFirstUsableIP,
  calculateLastUsableIP,
  splitSubnet,
  summarizeSubnets,
  getNextSubnet,
  getPreviousSubnet,
  isSubnetOf,
  findCommonSupernet,
  calculateSubnetMaskFromPrefixLength,
  calculatePrefixLengthFromSubnetMask,
  isValidCIDR,
  getIPRange
} from '@src/ipv4/core/cidr';
import { IPv4ValidationError, IPv4SubnetError } from '@src/ipv4/error';
import type { IPv4Address } from '@src/types';

// Helper function to create IPv4Address without explicit casting
function ip(address: string): IPv4Address {
  return address as IPv4Address;
}

describe('CIDR Utility Functions', () => {
  describe('parseCIDR', () => {
    it('should correctly parse valid CIDR notations', () => {
      expect(parseCIDR('192.168.1.0/24')).toEqual([ip('192.168.1.0'), 24]);
      expect(parseCIDR('10.0.0.0/8')).toEqual([ip('10.0.0.0'), 8]);
      expect(parseCIDR('172.16.0.0/12')).toEqual([ip('172.16.0.0'), 12]);
      expect(parseCIDR('0.0.0.0/0')).toEqual([ip('0.0.0.0'), 0]);
      expect(parseCIDR('255.255.255.255/32')).toEqual([ip('255.255.255.255'), 32]);
    });

    it('should throw an error for invalid CIDR notations', () => {
      expect(() => parseCIDR('192.168.1.0')).toThrow(IPv4ValidationError);
      expect(() => parseCIDR('192.168.1.0/33')).toThrow(IPv4ValidationError);
      expect(() => parseCIDR('192.168.1.0/-1')).toThrow(IPv4ValidationError);
      expect(() => parseCIDR('256.0.0.0/24')).toThrow(IPv4ValidationError);
      expect(() => parseCIDR('192.168.1.0/24/25')).toThrow(IPv4ValidationError);
      expect(() => parseCIDR('192.168.1/24')).toThrow(IPv4ValidationError);
      expect(() => parseCIDR('not_an_ip/24')).toThrow(IPv4ValidationError);
    });
  });

  describe('calculateNetworkAddress', () => {
    it('should correctly calculate network addresses', () => {
      expect(calculateNetworkAddress(ip('192.168.1.100'), 24)).toBe(ip('192.168.1.0'));
      expect(calculateNetworkAddress(ip('10.10.10.10'), 8)).toBe(ip('10.0.0.0'));
      expect(calculateNetworkAddress(ip('172.16.50.50'), 12)).toBe(ip('172.16.0.0'));
      expect(calculateNetworkAddress(ip('192.168.1.1'), 32)).toBe(ip('192.168.1.1'));
      expect(calculateNetworkAddress(ip('0.0.0.0'), 0)).toBe(ip('0.0.0.0'));
    });

    it('should handle edge cases', () => {
      expect(calculateNetworkAddress(ip('255.255.255.255'), 32)).toBe(ip('255.255.255.255'));
      expect(calculateNetworkAddress(ip('0.0.0.0'), 32)).toBe(ip('0.0.0.0'));
      expect(calculateNetworkAddress(ip('1.2.3.4'), 0)).toBe(ip('0.0.0.0'));
    });
  });

  describe('calculateBroadcastAddress', () => {
    it('should correctly calculate broadcast addresses', () => {
      expect(calculateBroadcastAddress(ip('192.168.1.0'), 24)).toBe(ip('192.168.1.255'));
      expect(calculateBroadcastAddress(ip('10.0.0.0'), 8)).toBe(ip('10.255.255.255'));
      expect(calculateBroadcastAddress(ip('172.16.0.0'), 12)).toBe(ip('172.31.255.255'));
      expect(calculateBroadcastAddress(ip('192.168.1.1'), 32)).toBe(ip('192.168.1.1'));
    });

    it('should handle edge cases', () => {
      expect(calculateBroadcastAddress(ip('0.0.0.0'), 0)).toBe(ip('255.255.255.255'));
      expect(calculateBroadcastAddress(ip('255.255.255.255'), 32)).toBe(ip('255.255.255.255'));
      expect(calculateBroadcastAddress(ip('1.2.3.4'), 31)).toBe(ip('1.2.3.5'));
    });
  });

  describe('isInSubnet', () => {
    it('should correctly determine if an IP is in a subnet', () => {
      expect(isInSubnet(ip('192.168.1.100'), ip('192.168.1.0'), 24)).toBe(true);
      expect(isInSubnet(ip('192.168.2.100'), ip('192.168.1.0'), 24)).toBe(false);
      expect(isInSubnet(ip('10.0.0.50'), ip('10.0.0.0'), 8)).toBe(true);
      expect(isInSubnet(ip('11.0.0.50'), ip('10.0.0.0'), 8)).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isInSubnet(ip('0.0.0.0'), ip('0.0.0.0'), 0)).toBe(true);
      expect(isInSubnet(ip('255.255.255.255'), ip('0.0.0.0'), 0)).toBe(true);
      expect(isInSubnet(ip('192.168.1.1'), ip('192.168.1.1'), 32)).toBe(true);
      expect(isInSubnet(ip('192.168.1.2'), ip('192.168.1.1'), 32)).toBe(false);
    });
  });

  describe('calculateAvailableIPs', () => {
    it('should correctly calculate available IPs', () => {
      expect(calculateAvailableIPs(24)).toBe(254);
      expect(calculateAvailableIPs(16)).toBe(65534);
      expect(calculateAvailableIPs(8)).toBe(16777214);
      expect(calculateAvailableIPs(30)).toBe(2);
      expect(calculateAvailableIPs(31)).toBe(2);
      expect(calculateAvailableIPs(32)).toBe(1);
    });

    it('should handle edge cases', () => {
      expect(calculateAvailableIPs(0)).toBe(4294967294);
      expect(() => calculateAvailableIPs(-1)).toThrow(IPv4SubnetError);
      expect(() => calculateAvailableIPs(33)).toThrow(IPv4SubnetError);
    });
  });

  describe('calculateFirstUsableIP', () => {
    it('should correctly calculate the first usable IP', () => {
      expect(calculateFirstUsableIP(ip('192.168.1.0'), 24)).toBe(ip('192.168.1.1'));
      expect(calculateFirstUsableIP(ip('10.0.0.0'), 8)).toBe(ip('10.0.0.1'));
      expect(calculateFirstUsableIP(ip('172.16.0.0'), 12)).toBe(ip('172.16.0.1'));
    });

    it('should handle edge cases', () => {
      expect(calculateFirstUsableIP(ip('0.0.0.0'), 0)).toBe(ip('0.0.0.1'));
      expect(calculateFirstUsableIP(ip('192.168.1.0'), 31)).toBe(ip('192.168.1.0'));
      expect(calculateFirstUsableIP(ip('192.168.1.1'), 32)).toBe(ip('192.168.1.1'));
    });
  });

  describe('calculateLastUsableIP', () => {
    it('should correctly calculate the last usable IP', () => {
      expect(calculateLastUsableIP(ip('192.168.1.0'), 24)).toBe(ip('192.168.1.254'));
      expect(calculateLastUsableIP(ip('10.0.0.0'), 8)).toBe(ip('10.255.255.254'));
      expect(calculateLastUsableIP(ip('172.16.0.0'), 12)).toBe(ip('172.31.255.254'));
    });

    it('should handle edge cases', () => {
      expect(calculateLastUsableIP(ip('0.0.0.0'), 0)).toBe(ip('255.255.255.254'));
      expect(calculateLastUsableIP(ip('192.168.1.0'), 31)).toBe(ip('192.168.1.1'));
      expect(calculateLastUsableIP(ip('192.168.1.1'), 32)).toBe(ip('192.168.1.1'));
    });
  });

  describe('splitSubnet', () => {
    it('should correctly split subnets', () => {
      expect(splitSubnet(ip('192.168.1.0'), 24, 25)).toEqual([ip('192.168.1.0'), ip('192.168.1.128')]);
      expect(splitSubnet(ip('10.0.0.0'), 8, 9)).toEqual([ip('10.0.0.0'), ip('10.128.0.0')]);
      expect(splitSubnet(ip('172.16.0.0'), 12, 13)).toEqual([ip('172.16.0.0'), ip('172.24.0.0')]);
    });

    it('should handle edge cases', () => {
      expect(splitSubnet(ip('192.168.1.0'), 24, 24)).toEqual([ip('192.168.1.0')]);
      expect(() => splitSubnet(ip('192.168.1.0'), 24, 23)).toThrow(IPv4SubnetError);
      expect(() => splitSubnet(ip('192.168.1.0'), 24, 33)).toThrow(IPv4SubnetError);
      expect(splitSubnet(ip('0.0.0.0'), 0, 1)).toEqual([ip('0.0.0.0'), ip('128.0.0.0')]);
    });
  });

  describe('summarizeSubnets', () => {
    it('should correctly summarize subnets', () => {
      expect(summarizeSubnets([ip('192.168.1.0'), ip('192.168.2.0')])).toEqual([ip('192.168.0.0'), 23]);
      expect(summarizeSubnets([ip('10.0.0.0'), ip('10.0.1.0'), ip('10.0.2.0'), ip('10.0.3.0')])).toEqual([ip('10.0.0.0'), 22]);
    });

    it('should handle edge cases', () => {
      expect(summarizeSubnets([ip('0.0.0.0'), ip('128.0.0.0')])).toEqual([ip('0.0.0.0'), 1]);
      expect(summarizeSubnets([ip('255.255.255.254'), ip('255.255.255.255')])).toEqual([ip('255.255.255.254'), 31]);
      expect(() => summarizeSubnets([ip('192.168.1.0')])).toThrow(IPv4SubnetError);
    });
  });

  describe('getNextSubnet', () => {
    it('should correctly get the next subnet', () => {
      expect(getNextSubnet(ip('192.168.1.0'), 24)).toBe(ip('192.168.2.0'));
      expect(getNextSubnet(ip('10.0.0.0'), 8)).toBe(ip('11.0.0.0'));
      expect(getNextSubnet(ip('172.16.0.0'), 12)).toBe(ip('172.32.0.0'));
    });

    it('should handle edge cases', () => {
      expect(() => getNextSubnet(ip('255.255.255.0'), 24)).toThrow(IPv4SubnetError);
      expect(getNextSubnet(ip('255.255.254.0'), 23)).toBe(ip('255.255.255.0'));
      expect(() => getNextSubnet(ip('0.0.0.0'), 0)).toThrow(IPv4SubnetError);
    });
  });

  describe('getPreviousSubnet', () => {
    it('should correctly get the previous subnet', () => {
      expect(getPreviousSubnet(ip('192.168.1.0'), 24)).toBe(ip('192.168.0.0'));
      expect(getPreviousSubnet(ip('11.0.0.0'), 8)).toBe(ip('10.0.0.0'));
      expect(getPreviousSubnet(ip('172.32.0.0'), 12)).toBe(ip('172.16.0.0'));
    });

    it('should handle edge cases', () => {
      expect(() => getPreviousSubnet(ip('0.0.0.0'), 24)).toThrow(IPv4SubnetError);
      expect(getPreviousSubnet(ip('0.0.1.0'), 24)).toBe(ip('0.0.0.0'));
      expect(() => getPreviousSubnet(ip('0.0.0.0'), 0)).toThrow(IPv4SubnetError);
    });
  });

  describe('isSubnetOf', () => {
    it('should correctly determine if one subnet is a subset of another', () => {
      expect(isSubnetOf(ip('192.168.1.0'), 24, ip('192.168.0.0'), 16)).toBe(true);
      expect(isSubnetOf(ip('10.1.0.0'), 16, ip('10.0.0.0'), 8)).toBe(true);
      expect(isSubnetOf(ip('172.16.0.0'), 16, ip('172.16.0.0'), 12)).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isSubnetOf(ip('0.0.0.0'), 32, ip('0.0.0.0'), 0)).toBe(true);
      expect(isSubnetOf(ip('255.255.255.255'), 32, ip('0.0.0.0'), 0)).toBe(true);
      expect(isSubnetOf(ip('192.168.1.0'), 24, ip('192.168.1.0'), 24)).toBe(false);
    });

    it('should handle corner cases', () => {
      expect(isSubnetOf(ip('10.0.0.0'), 8, ip('10.0.0.0'), 8)).toBe(false);
      expect(isSubnetOf(ip('192.168.1.0'), 24, ip('192.168.0.0'), 23)).toBe(true);
      expect(isSubnetOf(ip('192.168.1.0'), 24, ip('192.168.2.0'), 23)).toBe(false);
    });
  });

  describe('findCommonSupernet', () => {
    it('should correctly find the common supernet', () => {
      expect(findCommonSupernet(ip('192.168.1.0'), 24, ip('192.168.2.0'), 24)).toEqual([ip('192.168.0.0'), 23]);
      expect(findCommonSupernet(ip('10.0.0.0'), 8, ip('11.0.0.0'), 8)).toEqual([ip('8.0.0.0'), 7]);
    });

    it('should handle edge cases', () => {
      expect(findCommonSupernet(ip('0.0.0.0'), 32, ip('255.255.255.255'), 32)).toEqual([ip('0.0.0.0'), 0]);
      expect(findCommonSupernet(ip('192.168.1.0'), 24, ip('192.168.1.0'), 24)).toEqual([ip('192.168.1.0'), 24]);
    });

    it('should handle subnets of different sizes', () => {
      expect(findCommonSupernet(ip('192.168.0.0'), 16, ip('192.168.1.0'), 24)).toEqual([ip('192.168.0.0'), 16]);
      expect(findCommonSupernet(ip('10.0.0.0'), 8, ip('10.1.1.0'), 24)).toEqual([ip('10.0.0.0'), 8]);
    });
  });

  describe('calculateSubnetMaskFromPrefixLength', () => {
    it('should correctly calculate subnet masks', () => {
      expect(calculateSubnetMaskFromPrefixLength(24)).toBe(ip('255.255.255.0'));
      expect(calculateSubnetMaskFromPrefixLength(16)).toBe(ip('255.255.0.0'));
      expect(calculateSubnetMaskFromPrefixLength(8)).toBe(ip('255.0.0.0'));
      expect(calculateSubnetMaskFromPrefixLength(30)).toBe(ip('255.255.255.252'));
    });
  
    it('should handle edge cases', () => {
      expect(calculateSubnetMaskFromPrefixLength(0)).toBe(ip('0.0.0.0'));
      expect(calculateSubnetMaskFromPrefixLength(32)).toBe(ip('255.255.255.255'));
      expect(() => calculateSubnetMaskFromPrefixLength(-1)).toThrow(IPv4SubnetError);
      expect(() => calculateSubnetMaskFromPrefixLength(33)).toThrow(IPv4SubnetError);
    });
  
    it('should handle non-octet boundary prefix lengths', () => {
      expect(calculateSubnetMaskFromPrefixLength(1)).toBe(ip('128.0.0.0'));
      expect(calculateSubnetMaskFromPrefixLength(9)).toBe(ip('255.128.0.0'));
      expect(calculateSubnetMaskFromPrefixLength(17)).toBe(ip('255.255.128.0'));
      expect(calculateSubnetMaskFromPrefixLength(25)).toBe(ip('255.255.255.128'));
    });
  });
  
  describe('calculatePrefixLengthFromSubnetMask', () => {
    it('should correctly calculate prefix lengths from subnet masks', () => {
      expect(calculatePrefixLengthFromSubnetMask(ip('255.255.255.0'))).toBe(24);
      expect(calculatePrefixLengthFromSubnetMask(ip('255.255.0.0'))).toBe(16);
      expect(calculatePrefixLengthFromSubnetMask(ip('255.0.0.0'))).toBe(8);
      expect(calculatePrefixLengthFromSubnetMask(ip('255.255.255.252'))).toBe(30);
    });
  
    it('should handle edge cases', () => {
      expect(calculatePrefixLengthFromSubnetMask(ip('0.0.0.0'))).toBe(0);
      expect(calculatePrefixLengthFromSubnetMask(ip('255.255.255.255'))).toBe(32);
    });
  
    it('should handle non-octet boundary subnet masks', () => {
      expect(calculatePrefixLengthFromSubnetMask(ip('128.0.0.0'))).toBe(1);
      expect(calculatePrefixLengthFromSubnetMask(ip('255.128.0.0'))).toBe(9);
      expect(calculatePrefixLengthFromSubnetMask(ip('255.255.128.0'))).toBe(17);
      expect(calculatePrefixLengthFromSubnetMask(ip('255.255.255.128'))).toBe(25);
    });
  
    it('should throw error for invalid subnet masks', () => {
      expect(() => calculatePrefixLengthFromSubnetMask(ip('255.255.255.1'))).toThrow(IPv4ValidationError);
      expect(() => calculatePrefixLengthFromSubnetMask(ip('255.0.255.0'))).toThrow(IPv4ValidationError);
    });
  });
  
  describe('isValidCIDR', () => {
    it('should correctly validate valid CIDR notations', () => {
      expect(isValidCIDR('192.168.1.0/24')).toBe(true);
      expect(isValidCIDR('10.0.0.0/8')).toBe(true);
      expect(isValidCIDR('172.16.0.0/12')).toBe(true);
      expect(isValidCIDR('0.0.0.0/0')).toBe(true);
      expect(isValidCIDR('255.255.255.255/32')).toBe(true);
    });
  
    it('should correctly invalidate improper CIDR notations', () => {
      expect(isValidCIDR('192.168.1.0')).toBe(false);
      expect(isValidCIDR('192.168.1.0/33')).toBe(false);
      expect(isValidCIDR('256.0.0.0/24')).toBe(false);
      expect(isValidCIDR('192.168.1.0/24/25')).toBe(false);
      expect(isValidCIDR('not_an_ip/24')).toBe(false);
    });
  
    it('should handle edge cases', () => {
      expect(isValidCIDR('0.0.0.0/0')).toBe(true);
      expect(isValidCIDR('255.255.255.255/32')).toBe(true);
      expect(isValidCIDR('192.168.1.1/32')).toBe(true);
      expect(isValidCIDR('192.168.1.0/-1')).toBe(false);
      expect(isValidCIDR('192.168.1.0/abc')).toBe(false);
    });
  });
  
  describe('getIPRange', () => {
    it('should correctly calculate IP ranges', () => {
      expect(getIPRange(ip('192.168.1.0'), 24)).toEqual([ip('192.168.1.0'), ip('192.168.1.255')]);
      expect(getIPRange(ip('10.0.0.0'), 8)).toEqual([ip('10.0.0.0'), ip('10.255.255.255')]);
      expect(getIPRange(ip('172.16.0.0'), 12)).toEqual([ip('172.16.0.0'), ip('172.31.255.255')]);
    });
  
    it('should handle edge cases', () => {
      expect(getIPRange(ip('0.0.0.0'), 0)).toEqual([ip('0.0.0.0'), ip('255.255.255.255')]);
      expect(getIPRange(ip('255.255.255.255'), 32)).toEqual([ip('255.255.255.255'), ip('255.255.255.255')]);
      expect(getIPRange(ip('192.168.1.0'), 31)).toEqual([ip('192.168.1.0'), ip('192.168.1.1')]);
    });
  
    it('should throw error for invalid inputs', () => {
      expect(() => getIPRange(ip('256.0.0.0'), 24)).toThrow(IPv4ValidationError);
      expect(() => getIPRange(ip('192.168.1.0'), 33)).toThrow(IPv4SubnetError);
    });
  });
});