/**
 * @file tests/ipv4/errors.test.ts
 * @description Unit tests for IPv4 custom error classes
 */

import { expect, describe, it } from 'bun:test';
import {
  IPv4ValidationError,
  IPv4CIDRValidationError,
  IPv4SubnetError,
  IPv4OperationError
} from '@src/ipv4/error';

describe('IPv4::Errors', () => {
  describe('IPv4ValidationError', () => {
    it('should create an error with the correct name and message', () => {
      const errorMessage = 'Invalid IP address';
      const error = new IPv4ValidationError(errorMessage);
      
      expect(error.name).toBe('IPv4ValidationError');
      expect(error.message).toBe('IPv4 Validation Error: Invalid IP address');
      expect(error instanceof Error).toBe(true);
    });
  });

  describe('IPv4CIDRValidationError', () => {
    it('should create an error with the correct name and message', () => {
      const errorMessage = 'Invalid CIDR notation';
      const error = new IPv4CIDRValidationError(errorMessage);
      
      expect(error.name).toBe('IPv4CIDRValidationError');
      expect(error.message).toBe('IPv4 CIDR Validation Error: Invalid CIDR notation');
      expect(error instanceof Error).toBe(true);
    });
  });

  describe('IPv4SubnetError', () => {
    it('should create an error with the correct name and message', () => {
      const errorMessage = 'Invalid subnet mask';
      const error = new IPv4SubnetError(errorMessage);
      
      expect(error.name).toBe('IPv4SubnetError');
      expect(error.message).toBe('IPv4 Subnet Error: Invalid subnet mask');
      expect(error instanceof Error).toBe(true);
    });
  });

  describe('IPv4OperationError', () => {
    it('should create an error with the correct name and message', () => {
      const errorMessage = 'Invalid operation';
      const error = new IPv4OperationError(errorMessage);
      
      expect(error.name).toBe('IPv4OperationError');
      expect(error.message).toBe('IPv4 Operation Error: Invalid operation');
      expect(error instanceof Error).toBe(true);
    });
  });
});