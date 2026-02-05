import { describe, it, expect } from 'vitest';
import sortBlogPostsByDate from './sort-blogposts-by-date.js';

describe('sortBlogPostsByDate', () => {
  it('sorts posts by postDate in ascending order', () => {
    const mockCollection = {
      getFilteredByGlob: () => [
        { data: { postDate: '2024-04-30' } },
        { data: { postDate: '2021-09-22' } },
        { data: { postDate: '2024-04-19' } },
      ]
    };

    const result = sortBlogPostsByDate(mockCollection);

    expect(result[0].data.postDate).toBe('2021-09-22');
    expect(result[1].data.postDate).toBe('2024-04-19');
    expect(result[2].data.postDate).toBe('2024-04-30');
  });

  it('handles a single post', () => {
    const mockCollection = {
      getFilteredByGlob: () => [
        { data: { postDate: '2024-04-30' } },
      ]
    };

    const result = sortBlogPostsByDate(mockCollection);
    expect(result).toHaveLength(1);
  });

  it('handles empty collection', () => {
    const mockCollection = {
      getFilteredByGlob: () => []
    };

    const result = sortBlogPostsByDate(mockCollection);
    expect(result).toHaveLength(0);
  });

  it('calls getFilteredByGlob with correct glob pattern', () => {
    let capturedGlob = '';
    const mockCollection = {
      getFilteredByGlob: (glob) => {
        capturedGlob = glob;
        return [];
      }
    };

    sortBlogPostsByDate(mockCollection);
    expect(capturedGlob).toBe('./src/blog/*/**/*.md');
  });
});
