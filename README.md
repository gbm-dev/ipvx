# IPv4 Utility Library

## Overview

This library provides a comprehensive set of utilities for working with IPv4 addresses. It includes functions for validation, conversion, subnet calculations, and various IPv4 operations. The library is designed with a focus on performance and accuracy, utilizing bitwise operations for efficient processing.

## Project Structure

```
ip-utils/
├── src/
│   ├── types.ts
│   ├── ipv4/
│   │   ├── core/
│   │   │   ├── base.ts
│   │   │   ├── constants.ts
│   │   │   └── errors.ts
│   │   ├── operations.ts
│   │   ├── validation.ts
│   │   ├── conversion.ts
│   │   ├── subnet.ts
│   │   └── utils.ts
│   └── index.ts
├── tests/
│   └── ipv4/
│       ├── core/
│       │   ├── base.test.ts
│       │   ├── constants.test.ts
│       │   └── errors.test.ts
│       ├── operations.test.ts
│       ├── validation.test.ts
│       ├── conversion.test.ts
│       ├── subnet.test.ts
│       └── utils.test.ts
├── package.json
├── tsconfig.json
└── README.md
```

## File Descriptions

### Source Files

#### `src/types.ts`
- **Purpose**: Defines TypeScript types and interfaces used throughout the library.
- **Key Definitions**:
  - `IPv4Address`: Custom type for IPv4 addresses.
  - `IPv4Bitflag`: Custom type for IPv4 bitflag representations.
  - `ValidationOptions`: Interface for validation options.
  - `ValidationResult`: Interface for validation results.

#### `src/ipv4/core/base.ts`
- **Purpose**: Provides core bitwise operations and manipulations for IPv4 addresses.
- **Key Functions**:
  - `generateBitmask`: Generates a bitmask with specified number of set bits.
  - `bitflagToOctets`: Converts an IPv4 bitflag to an array of octets.
  - `octetsToBitflag`: Converts an array of octets to an IPv4 bitflag.
  - `applySubnetMask`: Applies a subnet mask to an IPv4 address.
  - `invertBits`: Inverts all bits in a 32-bit unsigned integer.
  - `countLeadingZeros`: Counts the number of leading zeros in a 32-bit unsigned integer.
  - `countSetBits`: Counts the number of set bits in a 32-bit unsigned integer.

#### `src/ipv4/core/constants.ts`
- **Purpose**: Defines constants used throughout the IPv4 operations.
- **Key Constants**:
  - `IPV4_BIT_LENGTH`: Number of bits in an IPv4 address.
  - `IPV4_OCTET_COUNT`: Number of octets in an IPv4 address.
  - `IPV4_MAX_OCTET_VALUE`: Maximum value of an octet.
  - `IPV4_MIN_PREFIX_LENGTH` and `IPV4_MAX_PREFIX_LENGTH`: Range for valid prefix lengths.
  - `IPV4_MAX_ADDRESS` and `IPV4_MIN_ADDRESS`: Bitflag representations of max and min IPv4 addresses.
  - `IPV4_REGEX`: Regular expression for validating IPv4 addresses.
  - `IPV4_CIDR_REGEX`: Regular expression for validating IPv4 CIDR notation.

#### `src/ipv4/core/errors.ts`
- **Purpose**: Defines custom error classes for IPv4 operations.
- **Key Error Classes**:
  - `IPv4ValidationError`: For IPv4 address validation errors.
  - `IPv4CIDRValidationError`: For IPv4 CIDR notation validation errors.
  - `IPv4SubnetError`: For IPv4 subnet calculation errors.
  - `IPv4OperationError`: For IPv4 operation errors.

#### `src/ipv4/operations.ts`
- **Purpose**: Provides higher-level operations for IPv4 addresses.
- **Key Functions**:
  - `incrementIP`: Increments an IPv4 address by a specified amount.
  - `decrementIP`: Decrements an IPv4 address by a specified amount.
  - `ipDifference`: Calculates the difference between two IPv4 addresses.
  - `isIPInRange`: Determines if an IPv4 address is within a given range.
  - `compareIPs`: Compares two IPv4 addresses.

#### `src/ipv4/validation.ts`
- **Purpose**: Provides functions for validating IPv4 addresses and related constructs.
- **Key Functions**:
  - `isValidIPv4`: Validates an IPv4 address string.
  - `isValidCIDR`: Validates an IPv4 CIDR notation string.
  - `isValidSubnetMask`: Validates an IPv4 subnet mask.

#### `src/ipv4/conversion.ts`
- **Purpose**: Provides functions for converting between different IPv4 representations.
- **Key Functions**:
  - `ipToNumber`: Converts an IPv4 address string to its numeric representation.
  - `numberToIP`: Converts a numeric representation to an IPv4 address string.
  - `ipToBinary`: Converts an IPv4 address to its binary string representation.
  - `binaryToIP`: Converts a binary string to an IPv4 address.

#### `src/ipv4/subnet.ts`
- **Purpose**: Provides functions for IPv4 subnet calculations.
- **Key Functions**:
  - `getNetworkAddress`: Calculates the network address for a given IP and subnet mask.
  - `getBroadcastAddress`: Calculates the broadcast address for a given IP and subnet mask.
  - `getAddressRange`: Determines the range of usable IP addresses in a subnet.
  - `calculateSubnetMask`: Calculates a subnet mask from a CIDR prefix length.
  - `getSubnetInfo`: Provides comprehensive information about a subnet.

#### `src/ipv4/utils.ts`
- **Purpose**: Provides additional utility functions for IPv4 operations.
- **Key Functions**:
  - `expandIPv4`: Expands abbreviated IPv4 addresses.
  - `compressIPv4`: Compresses IPv4 addresses where possible.
  - `getOctetValue`: Retrieves the value of a specific octet from an IPv4 address.
  - `setOctetValue`: Sets the value of a specific octet in an IPv4 address.

#### `src/index.ts`
- **Purpose**: Main entry point for the library, exporting all public functions and types.

### Test Files

Each source file has a corresponding test file in the `tests/ipv4/` directory. These test files ensure the correctness of the implemented functions and help maintain code quality as the library evolves.

## Usage

(Include basic usage examples here once the library is implemented)

## Contributing

(Include guidelines for contributing to the project)

## License

(Specify the license under which this library is released)


#### Scratchpad

Core/Base (ipv4/core/base.ts):

Lowest-level bitwise operations
Generic bit manipulation functions


Utils (ipv4/utils.ts):

IPv4-specific utility functions
Operations on octets and IP structure


Operations (ipv4/operations.ts):

Higher-level IP operations
Functions that combine multiple low-level operations


Subnet (ipv4/subnet.ts):

Subnet-specific calculations and operations


Conversion (ipv4/conversion.ts):

Functions for converting between different IP representations


Validation (ipv4/validation.ts):

IP and subnet mask validation functions


Types (types.ts):

Type definitions used across the library



/lib/bitwise.ts: Contains the lowest-level bitwise operations.
/types.ts: Defines the basic types used throughout the IP version-specific code.
/core/address.ts: Contains the basic IP address operations that build directly on the bitwise logic. For example:

Converting between string and bitflag representations
Incrementing/decrementing IP addresses
Extracting or setting individual octets


/core/subnet.ts, /core/routing.ts, /core/nat.ts, /core/dhcp.ts: These files contain more complex operations that often build upon the basic address operations.
/utils/parse.ts and /utils/octet.ts: Contain helper functions that enable the other higher level libraries, essentially, adapters for the library.