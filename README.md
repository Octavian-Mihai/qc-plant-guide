# Quebec Plant Zone Guide

A bilingual (EN/FR) gardening guide for Southern and Central Quebec (Zones 4b/5a). Built with Vite + React 18, Tailwind CSS, Zustand, and optional PWA offline support.

## Features (V2)

- **63-plant database** — extended schema with height/spacing, bloom colors, wildlife, tolerances, companions
- **Advanced filters** — bloom color, height range, foliage, wildlife, edible parts, medicinal, drought/deer/salt
- **Favorites & compare** — save plants, compare up to 3 side-by-side, share wishlist via URL
- **Garden planner** — drag-and-drop 4×4 / 4×8 / 8×8 bed grids with spacing & companion hints
- **Companion planting** — matrix, allelopathic effects, three sisters, pollinator combos, succession
- **IPM guide** — 8 Quebec pests with SVG illustrations, natural controls, beneficial plants
- **Seed starting** — frost-based timeline, soil temp guide, hardening schedule, notifications
- **Print & PDF** — plant detail, calendar, shopping list, garden layout exports
- **Dark mode** — class-based theme toggle with localStorage persistence
- **Soil Testing Wizard**, **Microgreens 101**, **Education Center** (from V1)

## Routes

| Route | Module |
|-------|--------|
| `/` | Plant dashboard |
| `/plant/:id` | Plant detail modal |
| `/favorites` | Saved plants + shareable wishlist |
| `/compare` | Side-by-side comparison (max 3) |
| `/garden-planner` | Drag-and-drop bed planner |
| `/companions` | Companion planting guide |
| `/ipm` | Integrated pest management |
| `/seed-starting` | Seed starting scheduler |
| `/microgreens` | Microgreens 101 |
| `/learn/*` | Education center articles |

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

## Build

```bash
npm run build
```

Output goes to `dist/`.

## localStorage Keys

| Key | Purpose |
|-----|---------|
| `qc-favorites` | Saved plant IDs |
| `qc-compare-list` | Compare list (max 3) |
| `qc-garden-layouts` | Saved garden bed layouts |
| `qc-seed-reminders` | Seed starting notification reminders |
| `qc-theme` | `light` or `dark` |
| `locale` | `en` or `fr` |
| `microgreens-batches` | Active microgreen batches |
| `microgreens-shopping-list` | Shopping list checkboxes |

## Browser Notifications

Seed starting and microgreens modules can schedule reminders. Grant notification permission when prompted. **Note:** reminders only fire while the browser tab is open (same limitation as V1 microgreens tracker).

## Dark Mode

Toggle via the moon/sun button in the navbar. Preference is saved to `qc-theme` and applied via the `dark` class on `<html>`.

## PDF Export

Uses client-side `jspdf` + `jspdf-autotable`. Available on plant detail modal, favorites page, garden planner, and compare page. Browser print uses `react-to-print`.

## Deploy to Vercel

1. Import the repository on [vercel.com](https://vercel.com)
2. Build command: `npm run build`
3. Output directory: `dist`
4. SPA rewrites configured in `vercel.json`

## Tech Stack

- Vite 6 + React 18
- React Router v6
- Zustand (state + localStorage persistence)
- Tailwind CSS 3 (dark mode: class)
- @dnd-kit/core (garden planner)
- jspdf + jspdf-autotable (PDF export)
- react-to-print (browser print)
- vite-plugin-pwa (offline caching)

## Project Structure

```
src/
├── components/
│   ├── common/       # Navbar, PlantCard, ThemeToggle, FavoriteButton
│   ├── compare/    # ComparePage, CompareBar
│   ├── companions/ # CompanionPlanting, CompanionMatrix
│   ├── dashboard/  # Dashboard, FilterBar, PlantDetailModal
│   ├── favorites/  # FavoritesPage
│   ├── garden/     # GardenPlanner, PlantPalette, GardenBedGrid
│   ├── ipm/        # IPMGuide
│   ├── print/      # PrintPlantDetail, PrintCalendar, PrintShoppingList
│   └── seeds/      # SeedStarting, SeedTimeline, SoilTempGuide
├── data/           # plants.json, companions.json, pests.json, seedSchedule.json
├── services/       # pdfService, notificationService, imageService, soilMatcher
├── store/          # Zustand useStore
└── types.ts        # TypeScript interfaces
```

## License

MIT
