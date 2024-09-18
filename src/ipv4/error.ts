/**
 * @file src/ipv4/errors.ts
 * @description This module defines custom error classes for IPv4 operations.
 */

/**
 * Custom error class for IPv4 address validation errors.
 */
export class IPv4ValidationError extends Error {
    constructor(message: string) {
        super(`IPv4 Validation Error: ${message}`);
        this.name = 'IPv4ValidationError';
    }
}

/**
 * Custom error class for IPv4 CIDR notation validation errors.
 */
export class IPv4CIDRValidationError extends Error {
    constructor(message: string) {
        super(`IPv4 CIDR Validation Error: ${message}`);
        this.name = 'IPv4CIDRValidationError';
    }
}

/**
 * Custom error class for IPv4 subnet calculation errors.
 */
export class IPv4SubnetError extends Error {
    constructor(message: string) {
        super(`IPv4 Subnet Error: ${message}`);
        this.name = 'IPv4SubnetError';
    }
}

/**
 * Custom error class for IPv4 Operation errors.
 */
export class IPv4OperationError extends Error {
    constructor(message: string) {
        super(`IPv4 Operation Error: ${message}`);
        this.name = 'IPv4OperationError';
    }
}