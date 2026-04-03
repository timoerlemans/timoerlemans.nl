# Website Redesign — Design Spec

**Datum:** 2026-04-03
**Status:** Goedgekeurd

---

## Context

Tim's persoonlijke website draait al een tijdje op dezelfde basis. Het wordt tijd voor een visuele en structurele vernieuwing met meer aandacht voor zijn Substack-publicatie. De huidige site heeft een licht/donker toggle, IndieWeb-features die nooit actief gebruikt worden, en een minimale visuele identiteit die verouderd aanvoelt. Het doel is een herkenbaar, editoriaal ontwerp dat niet de generieke "AI-look" heeft, met Substack als primair schrijfplatform.

---

## Stack

| Onderdeel | Keuze | Reden |
|-----------|-------|-------|
| SSG | 11ty v3 | Vertrouwde basis, geen migratie nodig |
| CSS | Sass (bestaand) | Geen reden om te wisselen |
| Bundler | Geen | Overkill voor een statische blog |
| Hosting | Netlify | Ondersteunt custom headers, redirects, build hooks |
| Package manager | pnpm | Ongewijzigd |
| Node | >=24 | Ongewijzigd |

---

## Design

### Kleurenschema (dark only — geen toggle)

| Token | Waarde | Gebruik |
|-------|--------|---------|
| `--bg` | `#1e1e1e` | Paginaachtergrond |
| `--text-primary` | `#f0f0f0` | H1, H2 koppen |
| `--text-secondary` | `#c8c8c8` | Sectiekoppen (h2 in lijsten) |
| `--text-body` | `#aaaaaa` | Lopende tekst, teasers — 7.1:1 ✓ AAA |
| `--text-muted` | `#999999` | Labels — 6.0:1 ✓ AA |
| `--text-subtle` | `#888888` | Nav, datums — 5.1:1 ✓ AA |
| `--accent` | `#e02020` | Links, CTA, rode lijn |
| `--border` | `#2a2a2a` | Dividers |

Alle contrastwaarden zijn getest tegen `#1e1e1e` (WCAG AA minimum 4.5:1).

### Typografie

| Element | Font | Grootte | Gewicht |
|---------|------|---------|---------|
| H1 | Playfair Display | 3.5rem (56px) | 900 |
| H2 (sectie) | Playfair Display | 2rem (32px) | 700 |
| H2 (posttitel) | Playfair Display | 2rem (32px) | 700 |
| Body / teaser | Roboto Slab | 1rem (16px) | 300 |
| Navigatie | Roboto Slab | 1rem (16px) | 400 |
| CTA | Roboto Slab | 1rem (16px) | 700 |
| Datum / label | Roboto Slab | 0.875rem (14px) | 300 |
| Site-naam / section-label | Roboto Slab | 0.875rem (14px) | 400 |

**Regel:** Essentiële tekst ≥ 16px. Niet-essentiële metadata (datum, decoratieve labels) mag 14px.

**Fonts worden zelf gehost** in `/src/assets/fonts/` (geen Google Fonts CDN — sneller + privacy).

### Rode lijn

Een `2.5rem × 3px` balk in `--accent` als visuele scheiding na de H1, als handtekening van het editoriaal ontwerp.

---

## Pagina's en navigatie

Navigatie: **Home · Blog · Now**

### `/` — Homepage

1. Sitenaam (klein, uppercase)
2. Navigatie
3. H1 — korte tagline (bijv. "Software, boeken & leven.")
4. Rode lijn
5. Intro-alinea (wie is Tim, wat schrijft hij)
6. Substack subscribe-formulier (ingebed Substack embed)
7. Sectie "Recente posts" — 5 meest recente Substack posts via RSS (build-time), met titel, datum en korte teaser; elke post linkt door naar Substack

### `/blog` — Volledig Substack archief

- Alle posts uit de Substack RSS-feed
- Per post: titel (Playfair Display), datum (14px), teaser (eerste ~200 tekens of `description` uit feed)
- Elke post linkt direct naar Substack
- Geen lokale Markdown-blogposts meer

### `/now` — Nu-pagina

- Handmatig bijgehouden Markdown-bestand
- Inhoud: waar Tim mee bezig is, wat hij leest, luistert, volgt
- Frontmatter-veld `lastUpdated` (ISO datum), prominent getoond
- Opzet geïnspireerd op nownownow.com

### Verwijderd

- Alle bestaande Markdown blogposts (`src/blog/`)
- Licht/donker toggle (JS + CSS)
- IndieWeb-features: WebMention, IndieAuth, Pingback
- Google Fonts CDN-aanroep

---

## Substack RSS-integratie

- **Feed URL:** `https://oerlemans.substack.com/feed`
- **Methode:** 11ty `_data/substack.js` — fetch de RSS-feed op build-time, parseer met een lichte XML-parser (bijv. `fast-xml-parser`), exporteer als array
- **Homepage:** eerste 5 items
- **Blog-pagina:** alle items
- **Fallback:** bij een gefaalde fetch → lege array, geen build-fout (bouw slaagt altijd)

### Geplande builds (Netlify Build Hook)

- Netlify build hook instellen
- Dagelijkse cron-trigger via een externe service (bijv. GitHub Actions scheduled workflow of cron-job.org) zodat nieuwe Substack-posts automatisch op de site verschijnen zonder handmatige deploy

---

## Analytics

- **Umami** blijft de analytics-oplossing (eu.umami.is, privacy-vriendelijk, geen cookies)
- Het tracking-script wordt correct geconfigureerd tijdens de rebuild (data-website-id controleren en testen)

---

## Overige technische details

### Custom 404-pagina

- `src/404.html` (of `404.md`) in het nieuwe design
- Netlify serveert dit automatisch

### `.gitignore`

- `.superpowers/` toevoegen (brainstorm-bestanden)

### Netlify-configuratie

- Bestaande security headers behouden (`netlify.toml`)
- Bestaande domein-redirects behouden (timoerlemans.nl → tim.oerlemans.dev)
- Build hook toevoegen voor dagelijkse cron-trigger

### Bestaande SCSS-structuur

- `_variables.scss` aanpassen: dark-only tokens, nieuwe kleurvariabelen, typografie-schaal
- `critical.scss` en `base.scss` herschrijven voor het nieuwe design
- Light/dark-toggle CSS verwijderen

---

## Verificatie

Na implementatie controleren:

- [ ] Alle pagina's laden zonder console-errors
- [ ] Substack RSS-feed toont recente posts op homepage en `/blog`
- [ ] `/now` toont `lastUpdated` datum correct
- [ ] Umami tracking-script vuurt op alle pagina's (controleer via Umami dashboard)
- [ ] Netlify build hook triggert dagelijkse build
- [ ] WCAG contrast checker op alle tekstkleuren (minimaal AA)
- [ ] Alle fonts geladen uit `/assets/fonts/`, geen Google Fonts CDN request
- [ ] 404-pagina werkt op een niet-bestaande URL
- [ ] Domein-redirects werken (timoerlemans.nl → tim.oerlemans.dev)
- [ ] `pnpm test` slaagt
- [ ] `pnpm run lint` slaagt
