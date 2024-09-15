/**
 * @file types.ts
 * @description This module defines TypeScript interfaces and types used throughout the IP validation library, ensuring type safety and consistency.
 */

/**
 * Custom type for IPv4 addresses.
 *
 * @description
 * This type is a string with a phantom property '__brand'.
 * It allows TypeScript to differentiate between regular strings and IPv4 addresses at compile time.
 *
 * Usage example:
 * const ipv4: IPv4Address = "192.168.0.1" as IPv4Address;
 */
export type IPv4Address = string & { __brand: 'IPv4Address' };

/**
 * Custom type for IPv6 addresses.
 *
 * @description
 * Similar to IPv4Address, this type is a string with a phantom property '__brand'.
 * It allows TypeScript to differentiate between regular strings and IPv6 addresses at compile time.
 *
 * Usage example:
 * const ipv6: IPv6Address = "2001:db8::1" as IPv6Address;
 */
export type IPv6Address = string & { __brand: 'IPv6Address' };

/**
 * Union type representing either an IPv4 or IPv6 address.
 *
 * @description
 * This type can be used when a function accepts either IPv4 or IPv6 addresses.
 *
 * Usage example:
 * function processIP(ip: IPAddress) { ... }
 */
export type IPAddress = IPv4Address | IPv6Address;

/**
 * Custom type for IPv4 bitflag representations.
 *
 * @description
 * This type is a number with a phantom property '__brand'.
 * It allows TypeScript to differentiate between regular numbers and IPv4 bitflags at compile time.
 *
 * Usage example:
 * const ipv4Bitflag: IPv4Bitflag = 3232235521 as IPv4Bitflag; // 192.168.0.1
 */
export type IPv4Bitflag = number & { __brand: 'IPv4Bitflag' };

/**
 * Custom type for IPv6 bitflag representations.
 *
 * @description
 * Similar to IPv4Bitflag, this type is a bigint with a phantom property '__brand'.
 * It allows TypeScript to differentiate between regular bigints and IPv6 bitflags at compile time.
 *
 * Usage example:
 * const ipv6Bitflag: IPv6Bitflag = BigInt("42540766411282592856903984951653826561") as IPv6Bitflag; // 2001:db8::1
 */
export type IPv6Bitflag = bigint & { __brand: 'IPv6Bitflag' };

/**
 * Union type representing either an IPv4 or IPv6 bitflag.
 *
 * @description
 * This type can be used when a function accepts either IPv4 or IPv6 bitflags.
 *
 * Usage example:
 * function processBitflag(bitflag: IPBitflag) { ... }
 */
export type IPBitflag = IPv4Bitflag | IPv6Bitflag;

/**
 * Type representing the IP version.
 *
 * @description
 * This type can be either 4 for IPv4 or 6 for IPv6.
 */
export type IPVersion = 4 | 6;

/**
 * Interface for validation options.
 *
 * @property detailed - Optional boolean to request detailed validation results.
 *
 * @description
 * This interface defines the shape of options that can be passed to validation functions.
 *
 * Usage example:
 * const options: ValidationOptions = { detailed: true };
 * const result = validateIP(ip, options);
 */
export interface ValidationOptions {
  detailed?: boolean;
}

/**
 * Interface for validation results.
 *
 * @property isValid - Boolean indicating whether the validation passed.
 * @property reason - Optional string explaining why validation failed (if it did).
 *
 * @description
 * This interface defines the shape of the object returned by validation functions.
 *
 * Usage example:
 * const result: ValidationResult = validateIP(ip);
 * if (!result.isValid) {
 *   console.log(result.reason);
 * }
 */
export interface ValidationResult {
  isValid: boolean;
  reason?: string;
}