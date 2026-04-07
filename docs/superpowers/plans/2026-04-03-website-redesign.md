# Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Vernieuw timoerlemans.nl met een donker editoriaal design, Substack RSS-integratie, een /now pagina en verwijdering van verouderde features.

**Architecture:** 11ty v3 statische site met Sass voor CSS. Substack posts worden op build-time opgehaald via RSS (`rss-parser`) en als globale data beschikbaar gesteld. Design is permanent donker, zonder toggle. Fonts worden zelf gehost.

**Tech Stack:** 11ty v3 · Sass · Nunjucks · rss-parser · @fontsource/playfair-display · @fontsource/roboto-slab · Vitest · Netlify

---

## File Map

| Actie | Bestand |
|-------|---------|
| Modify | `eleventy.config.js` |
| Modify | `src/_includes/layouts/base.html` |
| Modify | `src/_includes/layouts/page.html` |
| Delete | `src/_includes/layouts/blogpost.html` |
| Modify | `src/assets/css/_variables.scss` |
| Modify | `src/assets/css/critical.scss` |
| Modify | `src/assets/css/base.scss` |
| Modify | `src/assets/css/fonts.scss` |
| Modify | `src/assets/js/main.js` |
| Modify | `src/_data/navigation.json` |
| Modify | `src/index.md` |
| Modify | `src/blog.md` |
| Create | `src/_data/substack.js` |
| Create | `src/_data/substack.test.js` |
| Create | `src/now.md` |
| Create | `src/404.md` |
| Create | `src/assets/fonts/` (WOFF2 bestanden) |
| Delete | `src/_utils/sort-blogposts-by-date.js` |
| Delete | `src/blog/` (alle Markdown posts) |
| Modify | `netlify.toml` |
| Modify | `CLAUDE.md` |

---

## Task 1: Opruimen — verwijder toggle, IndieWeb en oude blogposts

**Files:**
- Delete: `src/_utils/sort-blogposts-by-date.js`
- Delete: `src/blog/2021-09-22/the-science-of-getting-started.md`
- Delete: `src/blog/2021-09-22/book-review-breach-of-peace.md`
- Delete: `src/blog/2024/onbevooroordeelde-nieuwsgierigheid.md`
- Delete: `src/blog/2024/wat-te-doen-als-je-vast-zit.md`
- Delete: `src/_includes/layouts/blogpost.html`
- Modify: `eleventy.config.js`

- [ ] **Stap 1: Verwijder oude blogposts en layout**

```bash
rm -rf src/blog/
rm src/_utils/sort-blogposts-by-date.js
rm src/_includes/layouts/blogpost.html
```

- [ ] **Stap 2: Verwijder blog-collectie en import uit eleventy.config.js**

Verwijder regel 1 (`import sortBlogPostsByDate`) en verwijder het `config.addCollection('blog', ...)` blok (regels 39-41). Verwijder ook de ongebruikte `date-fns` imports als die alleen voor blog gebruikt werden — maar die worden nog gebruikt door de `date` filter, dus die blijven.

`eleventy.config.js` regel 1:
```js
// Verwijder deze import:
import sortBlogPostsByDate from './src/_utils/sort-blogposts-by-date.js';
```

`eleventy.config.js` regels 39-41:
```js
// Verwijder dit blok volledig:
config.addCollection('blog',
    collection => sortBlogPostsByDate(collection));
```

- [ ] **Stap 3: Controleer of de build nog werkt**

```bash
pnpm start
```

Verwacht: server start zonder errors. Geen `/blog/` posts in de output.

- [ ] **Stap 4: Commit**

```bash
git add -A
git commit -m "chore: remove old blog posts, toggle and IndieWeb infrastructure"
```

---

## Task 2: Zelf-gehoste fonts

**Files:**
- Create: `src/assets/fonts/` (6 WOFF2 bestanden)
- Modify: `src/assets/css/fonts.scss`

- [ ] **Stap 1: Installeer fontsource pakketten als dev dependency**

```bash
pnpm add -D @fontsource/playfair-display @fontsource/roboto-slab
```

- [ ] **Stap 2: Kopieer benodigde WOFF2-bestanden naar src/assets/fonts/**

```bash
mkdir -p src/assets/fonts

# Playfair Display
cp node_modules/@fontsource/playfair-display/files/playfair-display-latin-400-italic.woff2 src/assets/fonts/
cp node_modules/@fontsource/playfair-display/files/playfair-display-latin-700-normal.woff2 src/assets/fonts/
cp node_modules/@fontsource/playfair-display/files/playfair-display-latin-900-normal.woff2 src/assets/fonts/

# Roboto Slab
cp node_modules/@fontsource/roboto-slab/files/roboto-slab-latin-300-normal.woff2 src/assets/fonts/
cp node_modules/@fontsource/roboto-slab/files/roboto-slab-latin-400-normal.woff2 src/assets/fonts/
cp node_modules/@fontsource/roboto-slab/files/roboto-slab-latin-700-normal.woff2 src/assets/fonts/
```

- [ ] **Stap 3: Schrijf @font-face declaraties in fonts.scss**

Vervang de volledige inhoud van `src/assets/css/fonts.scss`:

```scss
@font-face {
  font-family: 'Playfair Display';
  src: url('/assets/fonts/playfair-display-latin-900-normal.woff2') format('woff2');
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Playfair Display';
  src: url('/assets/fonts/playfair-display-latin-700-normal.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Playfair Display';
  src: url('/assets/fonts/playfair-display-latin-400-italic.woff2') format('woff2');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: 'Roboto Slab';
  src: url('/assets/fonts/roboto-slab-latin-300-normal.woff2') format('woff2');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Roboto Slab';
  src: url('/assets/fonts/roboto-slab-latin-400-normal.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Roboto Slab';
  src: url('/assets/fonts/roboto-slab-latin-700-normal.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

- [ ] **Stap 4: Controleer dat fonts.css wordt gegenereerd**

```bash
pnpm start
```

Verwacht: `dist/css/fonts.css` bestaat en bevat de `@font-face` declaraties.

- [ ] **Stap 5: Commit**

```bash
git add src/assets/fonts/ src/assets/css/fonts.scss package.json pnpm-lock.yaml
git commit -m "feat: self-host Playfair Display and Roboto Slab fonts"
```

---

## Task 3: Design tokens — herschrijf _variables.scss

**Files:**
- Modify: `src/assets/css/_variables.scss`

- [ ] **Stap 1: Vervang de volledige inhoud van _variables.scss**

```scss
$breakpoint-phone: 480px !default;
$breakpoint-tablet: 768px !default;
$breakpoint-laptop: 1024px !default;
$breakpoint-desktop: 1920px !default;
$breakpoint-4k: 2560px !default;
$breakpoint-ultrawide: 3440px !default;

:root {
  // Kleuren — donker editoriaal
  // Achtergrond: #1e1e1e
  // Contrastwaarden getest tegen #1e1e1e (WCAG AA = 4.5:1)
  --color-bg:           #1e1e1e;
  --color-text-primary: #f0f0f0;  // 16.5:1 AAA — H1, H2 koppen
  --color-text-secondary: #c8c8c8; // 10.2:1 AAA — sectiekoppen in lijsten
  --color-text-body:    #aaaaaa;  //  7.1:1 AAA — lopende tekst, teasers
  --color-text-muted:   #999999;  //  6.0:1 AA  — labels, uppercase captions
  --color-text-subtle:  #888888;  //  5.1:1 AA  — nav, datums, metadata
  --color-accent:       #e02020;  // rood accent
  --color-border:       #2a2a2a;  // subtiele scheiding

  // Typografie
  --font-display:  'Playfair Display', Georgia, serif;
  --font-body:     'Roboto Slab', 'Georgia', serif;

  // Spacing
  --spacing-xs: 0.625rem;
  --spacing-sm: 0.9375rem;
  --spacing-md: 1.875rem;
  --spacing-lg: 2.8125rem;

  // Maximale inhoudbreedte
  --content-max-width: 800px;
}
```

- [ ] **Stap 2: Controleer dat SCSS-compilatie nog werkt**

```bash
pnpm start
```

Verwacht: geen SCSS-compilatiefouten.

- [ ] **Stap 3: Commit**

```bash
git add src/assets/css/_variables.scss
git commit -m "feat: replace design tokens with dark editorial color scheme"
```

---

## Task 4: Herschrijf base.scss en critical.scss

**Files:**
- Modify: `src/assets/css/critical.scss`
- Modify: `src/assets/css/base.scss`

- [ ] **Stap 1: Vervang critical.scss**

```scss
@use 'modern-normalize/modern-normalize.css';
```

(Ongewijzigd — critical.scss bevat alleen de CSS reset.)

- [ ] **Stap 2: Vervang de volledige inhoud van base.scss**

```scss
@import 'variables';

// Basis
body {
  font-family: var(--font-body);
  font-weight: 300;
  font-size: 1rem;
  line-height: 1.6;
  background: var(--color-bg);
  color: var(--color-text-body);
}

// Skip link (toegankelijkheid)
.skip-link {
  position: absolute;
  left: -9999px;
  z-index: 999;
  padding: 1em;
  background: var(--color-accent);
  color: #fff;
  text-decoration: none;
  font-weight: 700;

  &:focus {
    left: 50%;
    transform: translateX(-50%);
    top: 0;
  }
}

// Schermlezers
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

// Layout
.wrapper {
  padding: var(--spacing-sm) var(--spacing-sm) var(--spacing-lg);
}

.content {
  max-width: var(--content-max-width);
  margin: 0 auto;
}

// Header
.header {
  padding: var(--spacing-xs) var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.header__site-name {
  font-family: var(--font-body);
  font-size: 0.875rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
  text-decoration: none;
}

// Navigatie
.nav__list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: var(--spacing-md);
}

.nav__item {
  margin: 0;
}

.nav__link,
.nav__link--active {
  font-family: var(--font-body);
  font-size: 1rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--color-text-subtle);
  border: none;
  font-weight: 400;

  &:hover,
  &:focus {
    color: var(--color-text-primary);
    text-decoration: none;
  }
}

.nav__link--active {
  color: var(--color-accent);
}

// Typografie
h1 {
  font-family: var(--font-display);
  font-size: 3.5rem;
  font-weight: 900;
  line-height: 1.05;
  color: var(--color-text-primary);
  margin-top: 0;
  margin-bottom: 0;
}

h2 {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.15;
  color: var(--color-text-secondary);
  margin-top: 0;
}

h3 {
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-text-secondary);
  margin-top: 0;
}

p {
  font-size: 1rem;
  color: var(--color-text-body);
  line-height: 1.8;
}

a {
  color: var(--color-accent);
  text-decoration: underline;
  font-weight: 700;
  border: 1px solid transparent;

  &:hover,
  &:focus {
    color: var(--color-text-primary);
    text-decoration: none;
  }

  &:active {
    border-color: var(--color-accent);
  }
}

// Rode lijn — editoriaal handtekening
.rule {
  width: 2.5rem;
  height: 3px;
  background: var(--color-accent);
  border: none;
  margin: 1.5rem 0;
}

// Homepage hero
.hero__tagline {
  font-family: var(--font-display);
  font-size: 3.5rem;
  font-weight: 900;
  line-height: 1.05;
  color: var(--color-text-primary);
  margin: 0;
}

.hero__intro {
  font-size: 1rem;
  color: var(--color-text-body);
  line-height: 1.8;
  margin-bottom: 1.5rem;
  max-width: 60ch;
}

// Substack CTA knop
.substack-cta {
  display: inline-block;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-accent);
  letter-spacing: 0.04em;
  text-decoration: none;
  border: 2px solid var(--color-accent);
  padding: var(--spacing-xs) var(--spacing-sm);
  transition: background 0.2s, color 0.2s;

  &:hover,
  &:focus {
    background: var(--color-accent);
    color: #fff;
    text-decoration: none;
  }
}

// Blog post lijst (homepage + /blog)
.posts-section {
  margin-top: var(--spacing-lg);
}

.section-label {
  font-family: var(--font-body);
  font-size: 0.875rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-sm);
}

.post-item {
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);

  &:last-child {
    border-bottom: none;
  }
}

.post-item__title {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.15;
  color: var(--color-text-secondary);
  text-decoration: none;
  display: block;
  margin-bottom: 0.75rem;

  &:hover,
  &:focus {
    color: var(--color-text-primary);
    text-decoration: none;
  }
}

.post-item__date {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-text-subtle);
  font-weight: 300;
  margin-bottom: 0.75rem;
  display: block;
}

.post-item__teaser {
  font-size: 1rem;
  color: var(--color-text-body);
  line-height: 1.75;
  margin: 0;
}

// /now pagina
.now-meta {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-text-subtle);
  font-weight: 300;
  margin-bottom: var(--spacing-md);
  display: block;
}

// 404 pagina
.error-page {
  text-align: center;
  padding: var(--spacing-lg) 0;
}

.error-page__code {
  font-family: var(--font-display);
  font-size: 6rem;
  font-weight: 900;
  color: var(--color-accent);
  line-height: 1;
  margin-bottom: 0;
}
```

- [ ] **Stap 3: Bouw en controleer visueel**

```bash
pnpm start
```

Verwacht: donkere achtergrond zichtbaar, typografie correct, geen SCSS-fouten.

- [ ] **Stap 4: Commit**

```bash
git add src/assets/css/base.scss src/assets/css/critical.scss
git commit -m "feat: rewrite CSS for dark editorial design"
```

---

## Task 5: Update base.html

**Files:**
- Modify: `src/_includes/layouts/base.html`

- [ ] **Stap 1: Vervang de volledige inhoud van base.html**

```html
{% set assetHash = global.random() %}
<!DOCTYPE html>
<html lang="{{ lang or 'nl' }}">

<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' eu.umami.is; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self' eu.umami.is; form-action 'self' oerlemans.substack.com; frame-ancestors 'none'; frame-src oerlemans.substack.com; upgrade-insecure-requests">
    <meta name="author" content="{{ site.authorName }}">
    <meta name="description" content="{{ description or site.description }}">
    <meta name="robots" content="index,follow">
    <meta name="theme-color" content="#1e1e1e">
    <meta name="google-site-verification" content="jMjTF6OAleBAVNBHENj6eyCnpvWA4HBrJboL76VFXQc" />
    <meta name="google-site-verification" content="bT8IJSWDUWGQmUBZi1HVmfslbUSOFVOIGfmag0CHrBk" />

    {% if canonical %}
        <link rel="canonical" href="https://tim.oerlemans.dev/blog/{{ canonical }}">
    {% else %}
        <link rel="canonical" href="https://tim.oerlemans.dev{{ page.url }}">
    {% endif %}

    <title>{%- if title %}{{ title }} - {% endif -%}Tim Oerlemans</title>

    <link rel="stylesheet" href="/css/fonts.css?{{ assetHash }}">
    <style>{% include "css/critical.css" %}</style>
    <style>{% include "css/base.css" %}</style>

    {% if pageCriticalStyles %}
        {% for item in pageCriticalStyles %}
            <style>{% include item %}</style>
        {% endfor %}
    {% endif %}

    {% if pageStylesheets %}
        {% for item in pageStylesheets %}
            <link rel="stylesheet" media="all" href="{{ item }}?{{ assetHash }}" />
        {% endfor %}
    {% endif %}

    <link href="https://github.com/timoerlemans" rel="me">
    <link href="https://mastodon.social/@oerlemans" rel="me">
    <link href="mailto:tim@oerlemans.dev" rel="me">
    <link href="https://www.linkedin.com/in/timoerlemans" rel="me">
    <link href="https://oerlemans.substack.com" rel="me">
    <link href="https://bsky.app/profile/groenoranjerood.bsky.social" rel="me">

    <script src="/assets/js/main.js" defer></script>
    <script defer src="https://eu.umami.is/script.js" data-website-id="6b5a5a34-b2f6-4e32-b181-fab14b35f53e" crossorigin="anonymous"></script>
</head>

<body>
<a href="#main-content" class="skip-link">Skip to content</a>

<header class="header">
    <a href="/" class="header__site-name">Tim Oerlemans</a>
    {% if navigation.items.length > 1 %}
        <nav aria-label="Main navigation">
            <ul class="nav__list">
                {% for item in navigation.items %}
                    <li class="nav__item">
                        {% if helpers.linkIsActiveLink(item.url, page.url) %}
                            <span class="nav__link nav__link--active" aria-current="page">{{ item.text }}</span>
                        {% else %}
                            <a class="nav__link" href="{{ item.url }}">{{ item.text }}</a>
                        {% endif %}
                    </li>
                {% endfor %}
            </ul>
        </nav>
    {% endif %}
</header>

<main class="wrapper" id="main-content">
    <div class="content">
        {% block content %}{% endblock %}
    </div>
</main>

</body>
</html>
```

- [ ] **Stap 2: Bouw en controleer**

```bash
pnpm start
```

Verwacht: header toont sitenaam als link + nav. Geen toggle. Geen IndieAuth/WebMention links in de `<head>`. Fonts laden uit `/css/fonts.css`.

- [ ] **Stap 3: Commit**

```bash
git add src/_includes/layouts/base.html
git commit -m "feat: update base layout — remove toggle, IndieWeb, self-hosted fonts"
```

---

## Task 6: Vereenvoudig main.js

**Files:**
- Modify: `src/assets/js/main.js`

- [ ] **Stap 1: Vervang main.js — behoud alleen datum-lokalisatie**

```js
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('time[datetime]').forEach(el => {
    const date = new Date(el.getAttribute('datetime') + 'T00:00:00');
    if (!isNaN(date)) {
      const locale = document.documentElement.lang || navigator.language;
      el.textContent = new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    }
  });
});
```

- [ ] **Stap 2: Commit**

```bash
git add src/assets/js/main.js
git commit -m "chore: remove theme toggle logic from main.js"
```

---

## Task 7: Substack RSS-data

**Files:**
- Create: `src/_data/substack.js`
- Create: `src/_data/substack.test.js`
- Modify: `package.json` (via pnpm add)

- [ ] **Stap 1: Installeer rss-parser**

```bash
pnpm add rss-parser
```

- [ ] **Stap 2: Schrijf de falende test eerst**

Maak `src/_data/substack.test.js`:

```js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseSubstackFeed } from './substack.js';

describe('parseSubstackFeed', () => {
  it('geeft een lege array terug als de feed leeg is', async () => {
    const result = await parseSubstackFeed([]);
    expect(result).toEqual([]);
  });

  it('mapt RSS items naar het verwachte formaat', async () => {
    const mockItems = [
      {
        title: 'Test Post',
        link: 'https://oerlemans.substack.com/p/test-post',
        pubDate: 'Fri, 19 Apr 2024 10:00:00 +0000',
        contentSnippet: 'Dit is een korte omschrijving van de post.'
      }
    ];

    const result = await parseSubstackFeed(mockItems);

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Test Post');
    expect(result[0].url).toBe('https://oerlemans.substack.com/p/test-post');
    expect(result[0].date).toBeInstanceOf(Date);
    expect(result[0].teaser).toBe('Dit is een korte omschrijving van de post.');
  });

  it('kapt teasers af op 200 tekens', async () => {
    const longDescription = 'a'.repeat(300);
    const mockItems = [
      {
        title: 'Lange post',
        link: 'https://oerlemans.substack.com/p/lang',
        pubDate: 'Fri, 19 Apr 2024 10:00:00 +0000',
        contentSnippet: longDescription
      }
    ];

    const result = await parseSubstackFeed(mockItems);
    expect(result[0].teaser.length).toBeLessThanOrEqual(203); // 200 + '...'
  });

  it('handelt missende velden gracefully af', async () => {
    const mockItems = [{ title: 'Alleen titel' }];
    const result = await parseSubstackFeed(mockItems);

    expect(result[0].url).toBe('');
    expect(result[0].teaser).toBe('');
  });
});
```

- [ ] **Stap 3: Draai de test — verifieer dat hij faalt**

```bash
pnpm exec vitest run src/_data/substack.test.js
```

Verwacht: `FAIL` — `parseSubstackFeed` bestaat nog niet.

- [ ] **Stap 4: Maak src/_data/substack.js**

```js
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
```

- [ ] **Stap 5: Draai de test — verifieer dat hij slaagt**

```bash
pnpm exec vitest run src/_data/substack.test.js
```

Verwacht: alle 4 tests PASS.

- [ ] **Stap 6: Draai alle tests**

```bash
pnpm test
```

Verwacht: alle tests PASS, inclusief helpers.test.js.

- [ ] **Stap 7: Commit**

```bash
git add src/_data/substack.js src/_data/substack.test.js package.json pnpm-lock.yaml
git commit -m "feat: add Substack RSS data with tests"
```

---

## Task 8: Homepage

**Files:**
- Modify: `src/index.md`
- Modify: `src/_includes/layouts/page.html`

- [ ] **Stap 1: Update src/_includes/layouts/page.html**

```html
{% extends "layouts/base.html" %}
{% block content %}
    {{ content | safe }}
{% endblock %}
```

(De `h1` wordt nu door de pagina-content zelf gerendered, niet door de layout.)

- [ ] **Stap 2: Vervang src/index.md**

```markdown
---
layout: 'layouts/page.html'
title: 'Tim Oerlemans'
description: 'Persoonlijke website van Tim Oerlemans — software, boeken en wat er tussendoor gebeurt.'
---

<h1 class="hero__tagline">Software,<br>boeken & leven.</h1>
<hr class="rule">
<p class="hero__intro">Ik schrijf over softwareontwikkeling, de boeken die ik lees en alles wat er tussendoor gebeurt. Front-end developer in Nederland, werkzaam bij <a href="https://www.vanspaendonck.nl/" rel="noopener noreferrer" target="_blank">Van Spaendonck</a>.</p>

<a class="substack-cta" href="https://oerlemans.substack.com" rel="noopener noreferrer" target="_blank">Abonneer op Substack →</a>

{% if substack.length > 0 %}
<section class="posts-section">
  <p class="section-label">Recente posts</p>
  {% for post in substack | first(5) %}
  <div class="post-item">
    <a class="post-item__title" href="{{ post.url }}" rel="noopener noreferrer" target="_blank">{{ post.title }}</a>
    <time class="post-item__date" datetime="{{ post.date | date('yyyy-MM-dd') }}">{{ post.date | date('d MMMM yyyy', 'nl') }}</time>
    {% if post.teaser %}<p class="post-item__teaser">{{ post.teaser }}</p>{% endif %}
  </div>
  {% endfor %}
</section>
{% endif %}
```

- [ ] **Stap 3: Voeg `first` filter toe aan eleventy.config.js**

Voeg toe na de bestaande `config.addFilter('date', ...)`:

```js
config.addFilter('first', (arr, n) => arr.slice(0, n));
```

- [ ] **Stap 4: Bouw en controleer**

```bash
pnpm start
```

Verwacht: homepage toont tagline, rode lijn, intro, Substack CTA, en 5 recente posts met titels, datums en teasers.

- [ ] **Stap 5: Commit**

```bash
git add src/index.md src/_includes/layouts/page.html eleventy.config.js
git commit -m "feat: redesign homepage with Substack RSS section"
```

---

## Task 9: Blogpagina

**Files:**
- Modify: `src/blog.md`

- [ ] **Stap 1: Vervang src/blog.md**

```markdown
---
title: Blog
layout: layouts/page.html
description: 'Alle posts van Tim Oerlemans op Substack — software, boeken en wat er tussendoor gebeurt.'
---

<h1>Blog</h1>
<hr class="rule">

{% if substack.length > 0 %}
<div class="posts-section">
  {% for post in substack %}
  <div class="post-item">
    <a class="post-item__title" href="{{ post.url }}" rel="noopener noreferrer" target="_blank">{{ post.title }}</a>
    <time class="post-item__date" datetime="{{ post.date | date('yyyy-MM-dd') }}">{{ post.date | date('d MMMM yyyy', 'nl') }}</time>
    {% if post.teaser %}<p class="post-item__teaser">{{ post.teaser }}</p>{% endif %}
  </div>
  {% endfor %}
</div>
{% else %}
<p>Geen posts gevonden. Probeer het later opnieuw of bezoek <a href="https://oerlemans.substack.com" rel="noopener noreferrer" target="_blank">Substack</a> direct.</p>
{% endif %}
```

- [ ] **Stap 2: Bouw en controleer**

```bash
pnpm start
```

Verwacht: `/blog` toont alle Substack posts, elk met titel, datum en teaser.

- [ ] **Stap 3: Commit**

```bash
git add src/blog.md
git commit -m "feat: replace blog page with Substack RSS feed"
```

---

## Task 10: /now pagina

**Files:**
- Create: `src/now.md`
- Modify: `src/_data/navigation.json`

- [ ] **Stap 1: Update navigatie**

Vervang de volledige inhoud van `src/_data/navigation.json`:

```json
{
  "items": [
    { "text": "Home", "url": "/" },
    { "text": "Blog", "url": "/blog/" },
    { "text": "Now", "url": "/now/" }
  ]
}
```

- [ ] **Stap 2: Maak src/now.md**

```markdown
---
layout: 'layouts/page.html'
title: 'Nu'
lastUpdated: '2026-04-03'
description: 'Waar Tim Oerlemans nu mee bezig is.'
---

<h1>Nu</h1>
<hr class="rule">
<time class="now-meta" datetime="{{ lastUpdated }}">Bijgewerkt op {{ lastUpdated | date('d MMMM yyyy', 'nl') }}</time>

*Geïnspireerd door [nownownow.com](https://nownownow.com).*

## Aan het werk

Ik werk als front-end developer bij [Van Spaendonck](https://www.vanspaendonck.nl/) in Tilburg.

## Aan het lezen

*Vul hier in wat je momenteel leest.*

## Aan het luisteren

*Vul hier in wat je momenteel luistert.*
```

- [ ] **Stap 3: Bouw en controleer**

```bash
pnpm start
```

Verwacht: `/now/` is bereikbaar, toont `lastUpdated` datum, navigatie bevat "Now" als derde item.

- [ ] **Stap 4: Commit**

```bash
git add src/now.md src/_data/navigation.json
git commit -m "feat: add /now page and update navigation"
```

---

## Task 11: Custom 404-pagina

**Files:**
- Create: `src/404.md`

- [ ] **Stap 1: Maak src/404.md**

```markdown
---
layout: 'layouts/page.html'
title: 'Pagina niet gevonden'
permalink: '/404.html'
---

<div class="error-page">
  <p class="error-page__code">404</p>
  <h1>Pagina niet gevonden</h1>
  <hr class="rule" style="margin: 1.5rem auto;">
  <p>De pagina die je zoekt bestaat niet (meer). Terug naar <a href="/">home</a>?</p>
</div>
```

- [ ] **Stap 2: Verifieer dat Netlify de 404 oppikt**

Netlify serveert automatisch `404.html` als catch-all voor niet-bestaande routes. Geen configuratie nodig in `netlify.toml`.

- [ ] **Stap 3: Bouw en controleer**

```bash
pnpm run production
```

Verwacht: `dist/404.html` bestaat en bevat de error-page markup.

- [ ] **Stap 4: Commit**

```bash
git add src/404.md
git commit -m "feat: add custom 404 page"
```

---

## Task 12: Umami analytics controleren en fixen

**Files:**
- Modify: `src/_includes/layouts/base.html` (indien nodig)

- [ ] **Stap 1: Verifieer de huidige configuratie**

Het Umami-script staat al in `base.html` (Task 5). Controleer of het `data-website-id` klopt door in te loggen op [eu.umami.is](https://eu.umami.is) en het website-ID te vergelijken met `6b5a5a34-b2f6-4e32-b181-fab14b35f53e`.

- [ ] **Stap 2: Test de tracking lokaal**

Open de dev-server en check de browser DevTools → Network tab. Zoek naar een request naar `eu.umami.is/api/send`. Als die er is, werkt tracking.

Als het request er **niet** is: controleer of het `integrity`-attribuut klopt. Het oude script had een `integrity` hash die kan zijn verlopen. De script-tag in Task 5 heeft dat attribuut bewust weggelaten; dat is de meest betrouwbare oplossing.

- [ ] **Stap 3: Commit indien base.html aangepast**

```bash
git add src/_includes/layouts/base.html
git commit -m "fix: verify Umami analytics configuration"
```

---

## Task 13: Netlify build hook voor dagelijkse RSS-updates

**Files:**
- Modify: `netlify.toml`

- [ ] **Stap 1: Maak een Netlify build hook aan**

1. Ga naar Netlify dashboard → jouw site → **Site configuration** → **Build & deploy** → **Build hooks**
2. Klik **Add build hook**
3. Naam: `Daily RSS refresh`
4. Branch: `main`
5. Kopieer de gegenereerde webhook URL (ziet eruit als `https://api.netlify.com/build_hooks/xxxxxxx`)

- [ ] **Stap 2: Stel een dagelijkse cron-trigger in via GitHub Actions**

Maak `.github/workflows/daily-build.yml`:

```yaml
name: Daily Netlify build

on:
  schedule:
    - cron: '0 6 * * *'  # elke dag om 06:00 UTC

jobs:
  trigger-build:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Netlify build hook
        run: curl -s -X POST ${{ secrets.NETLIFY_BUILD_HOOK }}
```

- [ ] **Stap 3: Voeg het secret toe aan GitHub**

1. Ga naar GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Klik **New repository secret**
3. Naam: `NETLIFY_BUILD_HOOK`
4. Waarde: de webhook URL uit stap 1

- [ ] **Stap 4: Commit**

```bash
git add .github/workflows/daily-build.yml
git commit -m "feat: add daily GitHub Actions cron to trigger Netlify RSS rebuild"
```

---

## Task 14: CLAUDE.md updaten

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Stap 1: Voeg Design System sectie toe aan CLAUDE.md**

Voeg de volgende sectie toe aan `CLAUDE.md` (na de bestaande "Architecture" sectie):

```markdown
## Design System

Spec: `docs/superpowers/specs/2026-04-03-website-redesign.md`

**Dark only** — geen licht/donker toggle.

### Kleuren (op `#1e1e1e` achtergrond)
| Token | Waarde | Contrast | Gebruik |
|-------|--------|----------|---------|
| `--color-text-primary` | `#f0f0f0` | 16.5:1 AAA | H1, display koppen |
| `--color-text-secondary` | `#c8c8c8` | 10.2:1 AAA | Sectiekoppen, postlijsten |
| `--color-text-body` | `#aaaaaa` | 7.1:1 AAA | Lopende tekst, teasers |
| `--color-text-muted` | `#999999` | 6.0:1 AA | Uppercase labels |
| `--color-text-subtle` | `#888888` | 5.1:1 AA | Nav, metadata, datums |
| `--color-accent` | `#e02020` | — | Links, CTA, rode lijn |

### Typografie
- **Koppen (h1/h2/h3):** Playfair Display (zelf gehost)
- **Body / UI:** Roboto Slab (zelf gehost)
- **Essentiële tekst:** minimaal `1rem` (16px)
- **Niet-essentiële metadata** (datum, labels): `0.875rem` (14px) toegestaan

### WCAG
Minimaal WCAG AA (4.5:1) voor alle tekst. AAA waar haalbaar.
Geen tekst kleiner dan 14px.
```

- [ ] **Stap 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add design system reference to CLAUDE.md"
```

---

## Eindverificatie

Na alle taken:

- [ ] `pnpm test` — alle tests slagen
- [ ] `pnpm run lint` — geen linting errors
- [ ] `pnpm run production` — productie-build slaagt
- [ ] Homepage toont tagline, rode lijn, intro, Substack CTA, 5 recente posts
- [ ] `/blog` toont volledige Substack feed
- [ ] `/now` toont pagina met `lastUpdated` datum
- [ ] `/not-bestaand` toont custom 404-pagina
- [ ] Alle fonts laden uit `/assets/fonts/`, geen request naar `fonts.googleapis.com`
- [ ] Browser DevTools → Network: request naar `eu.umami.is/api/send` aanwezig
- [ ] WCAG contrast check: gebruik [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/) voor alle tekst-kleur combinaties
- [ ] Domeinredirects werken: `timoerlemans.nl` → `tim.oerlemans.dev`
- [ ] GitHub Actions daily-build.yml staat in de repo
