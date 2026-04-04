import Parser from 'rss-parser';

const FEED_URL = 'https://oerlemans.substack.com/feed';
const parser = new Parser();

/**
 * Mapt een array van RSS-items naar het interne post-formaat.
 * Geëxporteerd voor testbaarheid.
 * @param {Array} items
 * @returns {Array<{title: string, url: string, date: Date, teaser: string}>}
 */
export function parseSubstackFeed(items) {
  return items.map(item => {
    const snippet = item.contentSnippet || '';
    const teaser = snippet.length > 200
      ? snippet.slice(0, 200) + '...'
      : snippet;

    return {
      title: item.title || '',
      url: item.link || '',
      date: item.pubDate ? new Date(item.pubDate) : new Date(0),
      teaser
    };
  });
}

/**
 * 11ty global data functie — haalt Substack RSS op bij elke build.
 * Geeft lege array terug bij een fout zodat de build altijd slaagt.
 */
export default async function substackData() {
  try {
    const feed = await parser.parseURL(FEED_URL);
    return parseSubstackFeed(feed.items);
  } catch (err) {
    console.warn('[substack] RSS ophalen mislukt:', err.message);
    return [];
  }
}
