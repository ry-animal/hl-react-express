import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Extend Vitest's expect method with jest-dom matchers
expect.extend({});

// Clean up after each test
afterEach(() => {
  cleanup();
}); 