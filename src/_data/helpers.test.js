import { describe, it, expect } from 'vitest';
import helpers from './helpers.js';

describe('helpers', () => {
  describe('getLinkActiveState', () => {
    it('returns aria-current and data-state for exact match', () => {
      const result = helpers.getLinkActiveState('/blog/', '/blog/');
      expect(result).toContain('aria-current="page"');
      expect(result).toContain('data-state="active"');
    });

    it('returns data-state for parent match', () => {
      const result = helpers.getLinkActiveState('/blog/', '/blog/my-post/');
      expect(result).not.toContain('aria-current="page"');
      expect(result).toContain('data-state="active"');
    });

    it('returns empty string for non-matching URLs', () => {
      const result = helpers.getLinkActiveState('/about/', '/blog/');
      expect(result).toBe('');
    });

    it('returns empty string for root URL with non-matching page', () => {
      const result = helpers.getLinkActiveState('/', '/blog/');
      expect(result).toBe('');
    });
  });

  describe('getLinkActiveClass', () => {
    it('returns nav__item--active for exact match', () => {
      const result = helpers.getLinkActiveClass('/blog/', '/blog/');
      expect(result).toBe('nav__item--active');
    });

    it('returns nav__link--active for parent match', () => {
      const result = helpers.getLinkActiveClass('/blog/', '/blog/my-post/');
      expect(result).toBe('nav__link--active');
    });

    it('returns empty string for non-matching URLs', () => {
      const result = helpers.getLinkActiveClass('/about/', '/blog/');
      expect(result).toBe('');
    });
  });

  describe('linkIsActiveLink', () => {
    it('returns true for exact match', () => {
      expect(helpers.linkIsActiveLink('/blog/', '/blog/')).toBe(true);
    });

    it('returns false for different URLs', () => {
      expect(helpers.linkIsActiveLink('/blog/', '/about/')).toBe(false);
    });

    it('returns false for parent URL (not exact match)', () => {
      expect(helpers.linkIsActiveLink('/blog/', '/blog/my-post/')).toBe(false);
    });
  });
});
