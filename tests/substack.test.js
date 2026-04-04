import { describe, it, expect } from 'vitest';
import { parseSubstackFeed } from '../src/_data/substack.js';

describe('parseSubstackFeed', () => {
  it('geeft een lege array terug als de feed leeg is', () => {
    const result = parseSubstackFeed([]);
    expect(result).toEqual([]);
  });

  it('mapt RSS items naar het verwachte formaat', () => {
    const mockItems = [
      {
        title: 'Test Post',
        link: 'https://oerlemans.substack.com/p/test-post',
        pubDate: 'Fri, 19 Apr 2024 10:00:00 +0000',
        contentSnippet: 'Dit is een korte omschrijving van de post.'
      }
    ];

    const result = parseSubstackFeed(mockItems);

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Test Post');
    expect(result[0].url).toBe('https://oerlemans.substack.com/p/test-post');
    expect(result[0].date).toBeInstanceOf(Date);
    expect(result[0].teaser).toBe('Dit is een korte omschrijving van de post.');
  });

  it('kapt teasers af op 200 tekens', () => {
    const longDescription = 'a'.repeat(300);
    const mockItems = [
      {
        title: 'Lange post',
        link: 'https://oerlemans.substack.com/p/lang',
        pubDate: 'Fri, 19 Apr 2024 10:00:00 +0000',
        contentSnippet: longDescription
      }
    ];

    const result = parseSubstackFeed(mockItems);
    expect(result[0].teaser.length).toBeLessThanOrEqual(203); // 200 + '...'
  });

  it('handelt missende velden gracefully af', () => {
    const mockItems = [{ title: 'Alleen titel' }];
    const result = parseSubstackFeed(mockItems);

    expect(result[0].url).toBe('');
    expect(result[0].teaser).toBe('');
  });
});
