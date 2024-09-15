/**
 * @function getNetworkAddress
 * @description Calculates the network address for a given IP and subnet mask.
 *
 * @param {IPv4Address} ip - The IPv4 address.
 * @param {IPv4Address} subnetMask - The subnet mask.
 * @returns {IPv4Address} The network address.
 *
 * @complexity
 * Time complexity: O(1) - Fixed number of operations.
 * Space complexity: O(1) - Uses constant extra space.
 */
export function getNetworkAddress(ip: IPv4Address, subnetMask: IPv4Address): IPv4Address {
    const ipBitflag = ipToBitflag(ip);
    const maskBitflag = ipToBitflag(subnetMask);
    const networkBitflag = (ipBitflag & maskBitflag) >>> 0;
    return bitflagToIP(networkBitflag as IPv4Bitflag);
  }
  
  /**
   * @function getBroadcastAddress
   * @description Calculates the broadcast address for a given IP and subnet mask.
   *
   * @param {IPv4Address} ip - The IPv4 address.
   * @param {IPv4Address} subnetMask - The subnet mask.
   * @returns {IPv4Address} The broadcast address.
   *
   * @complexity
   * Time complexity: O(1) - Fixed number of operations.
   * Space complexity: O(1) - Uses constant extra space.
   */
  export function getBroadcastAddress(ip: IPv4Address, subnetMask: IPv4Address): IPv4Address {
    const ipBitflag = ipToBitflag(ip);
    const maskBitflag = ipToBitflag(subnetMask);
    const invertedMask = ~maskBitflag >>> 0;
    const broadcastBitflag = (ipBitflag | invertedMask) >>> 0;
    return bitflagToIP(broadcastBitflag as IPv4Bitflag);
  }
  
  /**
   * @function getUsableHostCount
   * @description Calculates the number of usable host addresses in a subnet.
   *
   * @param {IPv4Address} subnetMask - The subnet mask.
   * @returns {number} The number of usable host addresses.
   *
   * @complexity
   * Time complexity: O(1) - Fixed number of operations.
   * Space complexity: O(1) - Uses constant extra space.
   */
  export function getUsableHostCount(subnetMask: IPv4Address): number {
    const maskBitflag = ipToBitflag(subnetMask);
    const hostBits = 32 - countSetBits(maskBitflag);
    return Math.pow(2, hostBits) - 2; // Subtract 2 for network and broadcast addresses
  }
  
  /**
   * @function areIPsOnSameSubnet
   * @description Checks if two IPv4 addresses are on the same subnet.
   *
   * @param {IPv4Address} ip1 - The first IPv4 address.
   * @param {IPv4Address} ip2 - The second IPv4 address.
   * @param {IPv4Address} subnetMask - The subnet mask.
   * @returns {boolean} True if the IPs are on the same subnet, false otherwise.
   *
   * @complexity
   * Time complexity: O(1) - Fixed number of operations.
   * Space complexity: O(1) - Uses constant extra space.
   */
  export function areIPsOnSameSubnet(ip1: IPv4Address, ip2: IPv4Address, subnetMask: IPv4Address): boolean {
    const network1 = getNetworkAddress(ip1, subnetMask);
    const network2 = getNetworkAddress(ip2, subnetMask);
    return network1 === network2;
  }
  
  /**
   * @function getWildcardMask
   * @description Calculates the wildcard mask from a subnet mask.
   *
   * @param {IPv4Address} subnetMask - The subnet mask.
   * @returns {IPv4Address} The wildcard mask.
   *
   * @complexity
   * Time complexity: O(1) - Fixed number of operations.
   * Space complexity: O(1) - Uses constant extra space.
   */
  export function getWildcardMask(subnetMask: IPv4Address): IPv4Address {
    const maskBitflag = ipToBitflag(subnetMask);
    const wildcardBitflag = (~maskBitflag) >>> 0;
    return bitflagToIP(wildcardBitflag as IPv4Bitflag);
  }
  
  /**
   * @function cidrToSubnetMask
   * @description Converts a CIDR notation to a subnet mask.
   *
   * @param {number} cidr - The CIDR notation (0-32).
   * @returns {IPv4Address} The subnet mask as an IPv4 address.
   * @throws {IPv4ArithmeticError} If the CIDR notation is invalid.
   *
   * @complexity
   * Time complexity: O(1) - Fixed number of operations.
   * Space complexity: O(1) - Uses constant extra space.
   */
  export function cidrToSubnetMask(cidr: number): IPv4Address {
    if (cidr < 0 || cidr > 32) {
      throw new IPv4ArithmeticError('Invalid CIDR notation');
    }
    const maskBitflag = generateBitmask(cidr) << (32 - cidr);
    return bitflagToIP(maskBitflag as IPv4Bitflag);
  }
  
  /**
   * @function subnetMaskToCIDR
   * @description Converts a subnet mask to CIDR notation.
   *
   * @param {IPv4Address} subnetMask - The subnet mask.
   * @returns {number} The CIDR notation (0-32).
   * @throws {IPv4ArithmeticError} If the subnet mask is invalid.
   *
   * @complexity
   * Time complexity: O(1) - Fixed number of operations.
   * Space complexity: O(1) - Uses constant extra space.
   */
  export function subnetMaskToCIDR(subnetMask: IPv4Address): number {
    const maskBitflag = ipToBitflag(subnetMask);
    const cidr = countSetBits(maskBitflag);
    if ((maskBitflag >>> 0) !== (generateBitmask(cidr) << (32 - cidr))) {
      throw new IPv4ArithmeticError('Invalid subnet mask');
    }
    return cidr;
  }
  
  /**
   * @function getNextSubnet
   * @description Calculates the next subnet of the same size.
   *
   * @param {IPv4Address} currentSubnet - The current subnet's network address.
   * @param {IPv4Address} subnetMask - The subnet mask.
   * @returns {IPv4Address} The next subnet's network address.
   * @throws {IPv4ArithmeticError} If there is no next subnet (reached the end of address space).
   *
   * @complexity
   * Time complexity: O(1) - Fixed number of operations.
   * Space complexity: O(1) - Uses constant extra space.
   */
  export function getNextSubnet(currentSubnet: IPv4Address, subnetMask: IPv4Address): IPv4Address {
    const subnetBitflag = ipToBitflag(currentSubnet);
    const maskBitflag = ipToBitflag(subnetMask);
    const subnetSize = (~maskBitflag >>> 0) + 1;
    const nextSubnetBitflag = (subnetBitflag + subnetSize) >>> 0;
    
    if (nextSubnetBitflag > 0xFFFFFFFF) {
      throw new IPv4ArithmeticError('No next subnet available');
    }
    
    return bitflagToIP(nextSubnetBitflag as IPv4Bitflag);
  }
  
  /**
   * @function getPreviousSubnet
   * @description Calculates the previous subnet of the same size.
   *
   * @param {IPv4Address} currentSubnet - The current subnet's network address.
   * @param {IPv4Address} subnetMask - The subnet mask.
   * @returns {IPv4Address} The previous subnet's network address.
   * @throws {IPv4ArithmeticError} If there is no previous subnet (reached the beginning of address space).
   *
   * @complexity
   * Time complexity: O(1) - Fixed number of operations.
   * Space complexity: O(1) - Uses constant extra space.
   */
  export function getPreviousSubnet(currentSubnet: IPv4Address, subnetMask: IPv4Address): IPv4Address {
      const subnetBitflag = ipToBitflag(currentSubnet);
      const maskBitflag = ipToBitflag(subnetMask);
      const subnetSize = (~maskBitflag >>> 0) + 1;
      
      if (subnetBitflag < subnetSize) {
        throw new IPv4ArithmeticError('No previous subnet available');
      }
      
      const prevSubnetBitflag = (subnetBitflag - subnetSize) >>> 0;
      return bitflagToIP(prevSubnetBitflag as IPv4Bitflag);
    }
    