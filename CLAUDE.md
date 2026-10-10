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

To run a single test file: `pnpm exec vitest run tests/helpers.test.js`

## Architecture

### Source → Output Flow

11ty reads `src/` and writes to `dist/`. Template engine is **Nunjucks** (`.njk`, `.html`). Markdown front matter uses YAML.

### Key Directories

- **`src/_data/`** — Global data available to all templates. `helpers.js` exports nav utility functions; `global.js` generates a build-time asset hash for cache busting. Substack data is part of the planned redesign, not the current checkout.
- **`src/_includes/layouts/`** — Page layouts. `base.html` is the master layout (inlines critical CSS, includes nav). `page.html` extends it.
- **`src/assets/css/`** — SCSS source. `critical.scss` and `base.scss` are compiled and **inlined** in `<head>`. Other stylesheet entrypoints compile to `dist/css/`; `fonts.scss` is planned for the redesign. Files prefixed with `_` are SCSS partials (not output).
- **`src/assets/js/main.js`** — Client-side JS (no bundler). `<time>` date localization and the existing theme toggle.

### CSS build (`build/css.js`)

`setupCssBuild(config)` registers one before-build hook for every stylesheet entrypoint. `critical` and `base` write to the configured includes directory for inlining; other entrypoints write to the output directory’s `css/`. All styles use the same Sass imports and production minification. CSS changes rebuild all entrypoints. Generated includes are excluded from watching, and their Nunjucks cache is invalidated before rendering. Development builds do not emit source maps.

### 11ty Configuration (`eleventy.config.js`)

Central config handles:
- **CSS build**: Registers `setupCssBuild(config)`; compilation and delivery are owned by `build/css.js`.
- **Markdown**: `markdown-it` with `html`, `breaks`, `linkify` enabled; `markdown-it-attrs` plugin for `{.class}` syntax in content.
- **Filters**: Custom `date` filter (locale-aware via `date-fns`).

### Blog

Current blog posts are Markdown files in `src/blog/`, collected and sorted by `postDate`. The approved redesign replaces them with build-time Substack RSS data; see `docs/superpowers/specs/2026-04-03-website-redesign.md` when implementing that migration.

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

## Planned Redesign Design System

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

`tests/helpers.test.js` — nav helper functies (`getLinkActiveState`, `getLinkActiveClass`, `linkIsActiveLink`).
`build/css.test.js` exercises real Eleventy builds and watching with temporary fixtures.
Tests for `_data/` utilities live in `tests/`, because Eleventy loads JavaScript files in `_data/` as build data.
