# Quebec Plant Zone Guide

A bilingual (EN/FR) gardening guide for Southern and Central Quebec (Zones 4b/5a). Built with Vite + React 18, Tailwind CSS, Zustand, and optional PWA offline support.

## Features

- **60+ plant database** — native QC, adaptive, and fruit-bearing species
- **Soil Testing Wizard** — jar, touch, and pH tests with plant filtering
- **Filterable dashboard** — search, zone, season, origin filters with infinite scroll
- **Plant detail modal** — calendar, beginner score, troubleshooting, share link
- **Microgreens 101** — timeline, shopping list, harvest tracker with notifications
- **Education Center** — zone map, frost dates, native plants, winter care
- **Bilingual UI** — toggle EN/FR with language persistence

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Optional: add an Unsplash API key for plant images:

```
VITE_UNSPLASH_ACCESS_KEY=your_key_here
```

Get a key at [unsplash.com/developers](https://unsplash.com/developers). Without it, placeholder SVGs are used.

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Deploy to Vercel

1. Import the repository on [vercel.com](https://vercel.com)
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add environment variable: `VITE_UNSPLASH_ACCESS_KEY` (optional)
5. Deploy — SPA rewrites are configured in `vercel.json`

## Browser Notifications

The microgreens harvest tracker can send notifications when batches are ready. Grant notification permission when prompted.

## Quebec Frost Dates

Default frost window: **last frost ~May 10**, **first frost ~Oct 10**.

City presets: Montreal, Quebec City, Sherbrooke, Trois-Rivières, Gatineau.

## Tech Stack

- Vite 6 + React 18
- React Router v6
- Zustand (state management)
- Tailwind CSS 3
- vite-plugin-pwa (offline caching)
- TypeScript interfaces only (`src/types.ts`)

## Project Structure

```
src/
├── components/     # UI components by feature
├── data/           # plants.json (60+ entries)
├── i18n/           # en.json, fr.json, useTranslation hook
├── services/       # imageService, soilMatcher
├── store/          # Zustand useStore
├── utils/          # plantHelpers, dateHelpers
└── types.ts        # TypeScript interfaces
```

## License

MIT
# qc-plant-guide
