import { describe, it, expect } from 'vitest';
import global from './global.js';

describe('global', () => {
  describe('random', () => {
    it('returns a string', () => {
      const result = global.random();
      expect(typeof result).toBe('string');
    });

    it('returns a string with three segments separated by dashes', () => {
      const result = global.random();
      const segments = result.split('-');
      expect(segments).toHaveLength(3);
    });

    it('returns hex segments of 4-5 characters each', () => {
      const result = global.random();
      const segments = result.split('-');
      for (const segment of segments) {
        expect(segment).toMatch(/^[0-9a-f]{4,5}$/);
      }
    });

    it('returns different values on subsequent calls', () => {
      const results = new Set();
      for (let i = 0; i < 10; i++) {
        results.add(global.random());
      }
      expect(results.size).toBeGreaterThan(1);
    });
  });
});
