# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website and blog for Tim Oerlemans, built with **11ty (Eleventy) v3** as a static site generator. Deployed to Netlify. Node >= 24.0.0, pnpm as package manager.

## Commands

```bash
pnpm start          # Development server with hot reload
pnpm run production # Production build → dist/
pnpm test           # Run Vitest test suite (single pass)
pnpm run lint       # ESLint
pnpm run lint:fix   # ESLint with auto-fix
```

To run a single test file: `pnpm exec vitest run src/_data/helpers.test.js`

## Architecture

### Source → Output Flow

11ty reads `src/` and writes to `dist/`. Template engine is **Nunjucks** (`.njk`, `.html`). Markdown front matter uses YAML.

### Key Directories

- **`src/_data/`** — Global data available to all templates. `helpers.js` exports nav utility functions; `global.js` generates a build-time asset hash for cache busting. `substack.js` fetches the Substack RSS feed at build time.
- **`src/_includes/layouts/`** — Page layouts. `base.html` is the master layout (inlines critical CSS, includes nav). `page.html` extends it.
- **`src/assets/css/`** — SCSS source. `critical.scss` and `base.scss` are compiled and **inlined** in `<head>`. `fonts.scss` is compiled to `dist/css/`. Files prefixed with `_` are SCSS partials (not output).
- **`src/assets/fonts/`** — Zelf-gehoste WOFF2 font files (Playfair Display + Roboto Slab). Geen Google Fonts CDN.
- **`src/assets/js/main.js`** — Client-side JS (no bundler). Alleen `<time>` datum-lokalisatie. Geen theme toggle.

### 11ty Configuration (`eleventy.config.js`)

Central config handles:
- **SCSS compilation**: Uses `sass` + `clean-css`. Dev builds include source maps; production minifies.
- **Markdown**: `markdown-it` with `html`, `breaks`, `linkify` enabled; `markdown-it-attrs` plugin for `{.class}` syntax in content.
- **Filters**: Custom `date` filter (locale-aware via `date-fns`). Custom `first` filter (`arr.slice(0, n)`).

### Blog

Blog posts leven op **Substack** (`oerlemans.substack.com`). De RSS-feed (`https://oerlemans.substack.com/feed`) wordt op build-time opgehaald via `src/_data/substack.js`. Geen lokale Markdown blogposts meer.

## ESLint Rules

Flat config (`eslint.config.js`): single quotes, semicolons required, unused variables error (except `_`-prefixed names).

## Claude Code Integraties

### MCP-servers (`.mcp.json`)

- **`repomix`** — vat de hele codebase samen in één call; gebruik voor brede contextvragen i.p.v. meerdere Glob/Read-rondjes
- **`fetch`** — haal documentatie (11ty, Nunjucks, Netlify) direct op zonder web search

### LSP

Gebruik de `LSP`-tool voor JS-navigatie (go-to-definition, referenties, diagnostics). Na elke edit: haal diagnostics op via LSP om type-fouten direct te vangen. Dit is ~50ms vs. grep (~45s).

### Hooks

- **PostToolUse Write/Edit** → `lint-on-edit.sh`: draait automatisch `eslint --fix` op gewijzigde `.js`-bestanden

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
| `--color-bg` | `#1e1e1e` | — | Paginaachtergrond |
| `--color-border` | `#2a2a2a` | — | Subtiele scheidingen |

### Typografie

- **Koppen (h1/h2/h3):** Playfair Display (zelf gehost in `src/assets/fonts/`)
- **Body / UI:** Roboto Slab (zelf gehost in `src/assets/fonts/`)
- **Essentiële tekst:** minimaal `1rem` (16px)
- **Niet-essentiële metadata** (datum, labels): `0.875rem` (14px) toegestaan

### WCAG

Minimaal WCAG AA (4.5:1) voor alle tekst. AAA waar haalbaar. Geen tekst kleiner dan 14px.

## Tests

`src/_data/helpers.test.js` — nav helper functies (`getLinkActiveState`, `getLinkActiveClass`, `linkIsActiveLink`).
`src/_data/substack.test.js` — RSS feed parser (`parseSubstackFeed`).
Nieuwe utilities in `_data/` of `_utils/` krijgen een bijbehorend testbestand.
