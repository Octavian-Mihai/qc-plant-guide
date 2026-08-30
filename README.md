# Quebec Plant Zone Guide

A beginner-friendly, bilingual (English / French) web app for gardeners in **Southern and Central Quebec** (hardiness zones 4b–5a). Browse native and adaptive plants, test your soil, plan garden beds, and learn when to plant — all in the browser with no account required.

**Live repo:** [github.com/Octavian-Mihai/qc-plant-guide](https://github.com/Octavian-Mihai/qc-plant-guide)

---

## What This Website Does

### Plant discovery
- **63-plant database** covering native Quebec species, winter-hardy adaptive plants, and fruit-bearing varieties
- **Search and filter** by name, hardiness zone, planting/bloom/harvest season, and origin (native, adaptive, fruit)
- **Advanced filters** for bloom color, mature height, foliage, wildlife attraction, edible parts, drought/deer/salt tolerance, and medicinal use
- **Native plants prioritized** in search results
- **Plant detail pages** with care calendar, beginner-friendly score, troubleshooting tips, and optional Unsplash images

### Soil testing
- **3-step soil wizard** — jar test, touch test, or pH strip
- **Tiered recommendations** — only strong soil matches appear in results; moderate matches are noted separately
- Filters the plant catalog based on texture, pH, and drainage

### Garden planning tools
- **Drag-and-drop garden planner** — 4×4, 4×8, and 8×8 bed layouts with spacing calculator and companion hints
- **Companion planting guide** — good/bad pair matrix, allelopathic effects, three sisters layout, pollinator combos, succession planting
- **Favorites and compare** — save plants, compare up to 3 side-by-side, share a wishlist via URL

### Growing guides
- **Seed starting scheduler** — frost-date presets for Montreal, Quebec City, Sherbrooke, Trois-Rivières, and Gatineau; indoor start and transplant timelines; hardening-off checklist; browser notifications
- **Microgreens 101** — 7-day timeline, shopping list, harvest tracker with notifications
- **IPM (Integrated Pest Management)** — 8 common Quebec pests with identification, natural controls, organic treatments, and beneficial plant links

### Education center
- Interactive **hardiness zone map** (zones 2–5)
- **Frost date calculator** by city
- Articles on **soil testing**, **native vs. invasive plants**, and **winter protection**

### Export and accessibility
- **Print and PDF export** for plant details, planting calendars, shopping lists, and garden layouts
- **Dark mode** with saved preference
- **PWA offline support** — browse plants and filters without a connection after first load
- **Bilingual UI** — toggle English / French anytime

---

## Tech Stack

| Layer | Technology | Role |
|-------|------------|------|
| **Framework** | [React 18](https://react.dev/) | UI components with Hooks |
| **Build tool** | [Vite 6](https://vitejs.dev/) | Fast dev server and production builds |
| **Routing** | [React Router v6](https://reactrouter.com/) | Client-side SPA routes (`/plant/:id`, `/learn/*`, etc.) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) | Utility-first CSS, custom Quebec forest palette, dark mode (`class` strategy) |
| **State** | [Zustand 5](https://zustand.docs.pmnd.rs/) | Global filters, favorites, garden layouts, theme, locale |
| **Data** | Local JSON | `plants.json`, `companions.json`, `pests.json`, `seedSchedule.json` — no backend |
| **Types** | TypeScript (`types.ts`) | Interfaces only; runtime code is JavaScript |
| **Drag & drop** | [@dnd-kit](https://dndkit.com/) | Garden bed planner |
| **PDF** | [jsPDF](https://github.com/parallax/jsPDF) + [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable) | Client-side PDF generation |
| **Print** | [react-to-print](https://github.com/MatthewHerbst/react-to-print) | Browser print layouts |
| **Images** | Unsplash API (optional) | Plant photos with SVG placeholder fallback |
| **Offline** | [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) | Service worker and asset caching |
| **i18n** | Custom hook + JSON | `en.json` / `fr.json` with Zustand locale |
| **Persistence** | `localStorage` | Favorites, layouts, theme, language, microgreen batches |
| **Deployment** | [Vercel](https://vercel.com/) | Static hosting, SPA rewrites in `vercel.json` |

### Architecture highlights
- **Single-page application** — all data local; no server or database
- **Filter pipeline** — `plantHelpers.js` applies search, zone, season, origin, soil, and advanced filters; native plants sorted first
- **Soil matcher** — scored tiers (`strong` / `moderate` / `none`) in `soilMatcher.js`
- **Notification service** — shared between seed starting and microgreens modules (Browser Notification API)

---

## Routes

| Route | Description |
|-------|-------------|
| `/` | Dashboard — hero, soil wizard, filters, plant grid |
| `/plant/:id` | Plant detail modal (shareable link) |
| `/favorites` | Saved plants + shareable wishlist |
| `/compare` | Side-by-side comparison (max 3 plants) |
| `/garden-planner` | Drag-and-drop bed designer |
| `/companions` | Companion planting guide |
| `/ipm` | Integrated pest management |
| `/seed-starting` | Seed starting scheduler |
| `/microgreens` | Microgreens 101 |
| `/learn` | Education center hub |
| `/learn/zones` | Hardiness zone map |
| `/learn/planting` | Frost date calculator |
| `/learn/soil-testing` | Soil testing deep dive |
| `/learn/native-plants` | Native plant guide |
| `/learn/winter-care` | Winter protection guide |

---

## Getting Started

```bash
git clone https://github.com/Octavian-Mihai/qc-plant-guide.git
cd qc-plant-guide
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Optional: plant images

Copy `.env.example` to `.env` and add an Unsplash access key:

```bash
cp .env.example .env
```

```env
VITE_UNSPLASH_ACCESS_KEY=your_key_here
```

Get a free key at [unsplash.com/developers](https://unsplash.com/developers). The app works without it — placeholders are used instead.

### Build for production

```bash
npm run build
npm run preview   # preview the dist/ output locally
```

Output directory: `dist/`

---

## Deploy to Vercel

1. Import the repository on [vercel.com](https://vercel.com)
2. **Build command:** `npm run build`
3. **Output directory:** `dist`
4. **Environment variable (optional):** `VITE_UNSPLASH_ACCESS_KEY`
5. SPA rewrites are already configured in `vercel.json`

---

## Project Structure

```
src/
├── components/
│   ├── common/       # Navbar, Footer, PlantCard, ThemeToggle, FavoriteButton
│   ├── dashboard/    # Dashboard, FilterBar, ResultsGrid, PlantDetailModal
│   ├── soil/         # SoilTester wizard, SoilSuggestionBanner
│   ├── garden/       # GardenPlanner, PlantPalette, GardenBedGrid
│   ├── companions/   # CompanionPlanting, CompanionMatrix
│   ├── ipm/          # IPMGuide
│   ├── seeds/        # SeedStarting, SeedTimeline, SoilTempGuide
│   ├── microgreens/  # Timeline, ShoppingList, HarvestTracker
│   ├── favorites/    # FavoritesPage
│   ├── compare/      # ComparePage, CompareBar
│   ├── learn/        # ZoneMap, FrostDateCalculator, articles
│   └── print/        # Print/PDF views
├── data/             # plants.json, companions.json, pests.json, seedSchedule.json
├── services/         # imageService, soilMatcher, pdfService, notificationService
├── store/            # Zustand useStore
├── i18n/             # en.json, fr.json, useTranslation hook
├── utils/            # plantHelpers, dateHelpers
└── types.ts          # TypeScript interfaces
```

---

## Browser Notes

- **Notifications** (seed starting, microgreens) require permission and only fire while the browser tab is open
- **PDF export** runs entirely client-side — no data is sent to a server
- **Offline mode** caches static assets and plant data after the first visit (PWA)

---

## License

MIT
