// Validation Utility Functions

import { ValidationError } from '@/core/errors/AppError';

export const validateEmail = (email: string): void => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email address');
  }
};

export const validatePassword = (password: string, minLength: number = 6): void => {
  if (password.length < minLength) {
    throw new ValidationError(`Password must be at least ${minLength} characters`);
  }
};

export const validateRequired = (value: unknown, fieldName: string): void => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    throw new ValidationError(`${fieldName} is required`);
  }
};

export const validateArrayNotEmpty = (array: unknown[], fieldName: string): void => {
  if (!array || array.length === 0) {
    throw new ValidationError(`${fieldName} must have at least one item`);
  }
};
