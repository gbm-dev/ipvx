# IPv4 Core Base Module

## Overview

The `ipv4/core/base.ts` module provides a set of fundamental bitwise operations and manipulations specifically designed for IPv4 address handling. This module serves as the foundation for more complex IPv4-related operations and calculations.

The primary purpose of this module is to offer efficient, low-level bitwise functions that can be used as building blocks for higher-level IPv4 operations. These functions are optimized for performance and are designed to work with 32-bit unsigned integers, which is the standard representation for IPv4 addresses in binary form.

## Constants

### `MAX_32BIT_VALUE`

The maximum value for a 32-bit unsigned integer (0xFFFFFFFF).

### `VALID_IPV4_CHARS`

A bitmask representing valid characters in an IPv4 address (digits 0-9 and the dot '.').

## Functions

### `generateBitmask(numBits: number): number`

Generates a bitmask with a specified number of set bits (1s) from the least significant bit.

**Parameters:**
- `numBits`: The number of bits to set in the bitmask (0-32).

**Returns:** The generated bitmask as a 32-bit unsigned integer.

**Example:**
```typescript
const mask8 = generateBitmask(8);  // Returns 0xFF (255)
const mask24 = generateBitmask(24);  // Returns 0xFFFFFF (16777215)
```

**Complexity:**
- Time: O(1)
- Space: O(1)

---

### `isValidChar(charCode: number, validCharMask: number): boolean`

Checks if a character is valid based on a precomputed bitmask of allowed characters.

**Parameters:**
- `charCode`: The character code to check.
- `validCharMask`: Bitmask of valid characters (typically `VALID_IPV4_CHARS`).

**Returns:** `true` if the character is valid, `false` otherwise.

**Example:**
```typescript
isValidChar('0'.charCodeAt(0), VALID_IPV4_CHARS);  // Returns true
isValidChar('A'.charCodeAt(0), VALID_IPV4_CHARS);  // Returns false
```

**Complexity:**
- Time: O(1)
- Space: O(1)

---

### `countSetBits(n: number): number`

Counts the number of set bits (1s) in a 32-bit unsigned integer.

**Parameters:**
- `n`: The 32-bit unsigned integer to analyze.

**Returns:** The number of set bits.

**Example:**
```typescript
countSetBits(0xFF);  // Returns 8
countSetBits(0xF0F);  // Returns 8
```

**Complexity:**
- Time: O(1)
- Space: O(1)

---

### `getBit(n: number, position: number): number`

Gets the value (0 or 1) of a specific bit in a 32-bit unsigned integer.

**Parameters:**
- `n`: The 32-bit unsigned integer to check.
- `position`: The bit position to get (0-31, where 0 is the least significant bit).

**Returns:** 0 or 1, depending on the bit value at the specified position.

**Example:**
```typescript
getBit(0b1010, 0);  // Returns 0
getBit(0b1010, 1);  // Returns 1
```

**Complexity:**
- Time: O(1)
- Space: O(1)

---

### `setBit(n: number, position: number, value: boolean): number`

Sets a specific bit in a 32-bit unsigned integer to 1 or 0.

**Parameters:**
- `n`: The 32-bit unsigned integer to modify.
- `position`: The bit position to set (0-31, where 0 is the least significant bit).
- `value`: The value to set the bit to (true for 1, false for 0).

**Returns:** The modified number with the bit at the specified position set to the given value.

**Example:**
```typescript
setBit(0b1010, 0, true);  // Returns 0b1011 (11)
setBit(0b1010, 1, false);  // Returns 0b1000 (8)
```

**Complexity:**
- Time: O(1)
- Space: O(1)

---

### `clearBit(n: number, position: number): number`

Clears a specific bit (sets it to 0) in a 32-bit unsigned integer.

**Parameters:**
- `n`: The 32-bit unsigned integer to modify.
- `position`: The bit position to clear (0-31, where 0 is the least significant bit).

**Returns:** The modified number with the bit at the specified position cleared.

**Example:**
```typescript
clearBit(0b1011, 0);  // Returns 0b1010 (10)
```

**Complexity:**
- Time: O(1)
- Space: O(1)

---

### `toggleBit(n: number, position: number): number`

Toggles a specific bit in a 32-bit unsigned integer.

**Parameters:**
- `n`: The 32-bit unsigned integer to modify.
- `position`: The bit position to toggle (0-31, where 0 is the least significant bit).

**Returns:** The modified number with the bit at the specified position toggled.

**Example:**
```typescript
toggleBit(0b1010, 0);  // Returns 0b1011 (11)
toggleBit(0b1011, 0);  // Returns 0b1010 (10)
```

**Complexity:**
- Time: O(1)
- Space: O(1)

---

### `extractBits(n: number, start: number, end: number): number`

Extracts a range of bits from a 32-bit unsigned integer.

**Parameters:**
- `n`: The 32-bit unsigned integer to extract bits from.
- `start`: The starting bit position (inclusive, 0-31).
- `end`: The ending bit position (inclusive, 0-31).

**Returns:** The extracted bits as a 32-bit unsigned integer.

**Example:**
```typescript
extractBits(0b11011001, 2, 5);  // Returns 0b110 (6)
extractBits(0xFFFFFFFF, 0, 31);  // Returns 0xFFFFFFFF
```

**Complexity:**
- Time: O(1)
- Space: O(1)

---

### `rotateBits(n: number, positions: number): number`

Rotates the bits in a 32-bit unsigned integer to the right (positive positions) or left (negative positions).

**Parameters:**
- `n`: The 32-bit unsigned integer to rotate.
- `positions`: The number of bit positions to rotate.

**Returns:** The rotated number.

**Example:**
```typescript
rotateBits(0b10110011, 2);  // Returns 0b11101100
rotateBits(0b10110011, -2);  // Returns 0b11001110
```

**Complexity:**
- Time: O(1)
- Space: O(1)

---

### `extractOctet(ip: IPv4Bitflag, octetPosition: number): number`

Extracts a specific octet from an IPv4 address represented as a bitflag.

**Parameters:**
- `ip`: The IPv4 address in bitflag format (a 32-bit unsigned integer).
- `octetPosition`: The position of the octet to extract (0-3, where 0 is the most significant octet).

**Returns:** The value of the specified octet (0-255).

**Example:**
```typescript
const ip = 0xC0A80101;  // 192.168.1.1
extractOctet(ip, 0);  // Returns 192
extractOctet(ip, 3);  // Returns 1
```

**Complexity:**
- Time: O(1)
- Space: O(1)

---

### `setOctet(ip: IPv4Bitflag, octetPosition: number, value: number): IPv4Bitflag`

Sets the value of a specific octet in an IPv4 address represented as a bitflag.

**Parameters:**
- `ip`: The IPv4 address in bitflag format (a 32-bit unsigned integer).
- `octetPosition`: The position of the octet to set (0-3, where 0 is the most significant octet).
- `value`: The value to set for the octet (0-255).

**Returns:** The modified IPv4 address in bitflag format.

**Example:**
```typescript
const ip = 0xC0A80101;  // 192.168.1.1
setOctet(ip, 3, 10);  // Returns 0xC0A8010A (192.168.1.10)
```

**Complexity:**
- Time: O(1)
- Space: O(1)

---

### `invertBits(n: number): number`

Inverts all the bits in a 32-bit unsigned integer.

**Parameters:**
- `n`: The 32-bit unsigned integer to invert.

**Returns:** The inverted number.

**Example:**
```typescript
invertBits(0b1010);  // Returns 0xFFFFFFF5 (4294967285 in decimal)
```

**Complexity:**
- Time: O(1)
- Space: O(1)

---

### `leadingZeros(n: number): number`

Counts the number of leading zeros in a 32-bit unsigned integer.

**Parameters:**
- `n`: The 32-bit unsigned integer to analyze.

**Returns:** The number of leading zeros.

**Example:**
```typescript
leadingZeros(0b10000000000000000000000000000000);  // Returns 0
leadingZeros(0b00000000000000000000000000001000);  // Returns 28
```

**Complexity:**
- Time: O(1)
- Space: O(1)

---

### `bitflagToOctets(ip: IPv4Bitflag): [number, number, number, number]`

Converts an IPv4 address in bitflag format to an array of octets.

**Parameters:**
- `ip`: The IPv4 address in bitflag format.

**Returns:** An array containing the four octets of the IPv4 address.

**Example:**
```typescript
bitflagToOctets(0xC0A80101);  // Returns [192, 168, 1, 1]
```

**Complexity:**
- Time: O(1)
- Space: O(1)

---

### `octetsToBitflag(octets: [number, number, number, number]): IPv4Bitflag`

Converts an array of four octets to an IPv4 address in bitflag format.

**Parameters:**
- `octets`: An array containing the four octets of the IPv4 address.

**Returns:** The IPv4 address in bitflag format.

**Example:**
```typescript
octetsToBitflag([192, 168, 1, 1]);  // Returns 0xC0A80101
```

**Complexity:**
- Time: O(1)
- Space: O(1)

---

### `trailingZeros(n: number): number`

Counts the number of trailing zeros in a 32-bit unsigned integer.

**Parameters:**
- `n`: The 32-bit unsigned integer to analyze.

**Returns:** The number of trailing zeros.

**Example:**
```typescript
trailingZeros(0x80000000);  // Returns 31
trailingZeros(0xFF000000);  // Returns 24
```

**Complexity:**
- Time: O(1)
- Space: O(1)

---

### `findFirstSetBit(n: number): number`

Finds the position of the least significant set bit (1) in a 32-bit unsigned integer.

**Parameters:**
- `n`: The 32-bit unsigned integer to analyze.

**Returns:** The position of the least significant set bit (0-31), or -1 if no bit is set.

**Example:**
```typescript
findFirstSetBit(0x80000000);  // Returns 31
findFirstSetBit(0);  // Returns -1
```

**Complexity:**
- Time: O(1)
- Space: O(1)

## Usage in IPv4 Operations

These bitwise functions form the foundation for more complex IPv4 operations. They can be used to:

1. Manipulate individual bits or ranges of bits in IP addresses and subnet masks.
2. Convert between different representations of IP addresses (e.g., bitflag to dotted decimal).
3. Perform subnet calculations.
4. Implement efficient IP address validation and manipulation algorithms.

By providing these low-level, optimized bitwise operations, this module enables the development of higher-level IPv4 functionality with optimal performance.