# E-Comm Track

E-Comm Track is a responsive Expo shopping demo app built for mobile and web. It showcases a fast product discovery experience with typo-tolerant search, filters, instant sorting, and curated featured products.

## What the app does

- Smart search across product titles, categories, and descriptions
- Typo-tolerant autocomplete and fuzzy matching for easy discovery
- Filters for category, minimum rating, and price range
- Sort controls for relevance, price, and highest rating
- Featured product highlights and quick category browsing
- Supports Expo on Android, iOS, and web

## App structure

- `src/app/index.tsx` — home screen with featured products and categories
- `src/app/explore.tsx` — search screen with filters and sorting
- `src/components/product-card.tsx` — product card layout
- `src/components/filters.tsx` — filter panel for category, rating, and price
- `src/lib/search.ts` — search engine with prefix and fuzzy searching
- `src/data/products.ts` — sample product catalog used by the app

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the Expo development server:

   ```bash
   npm start
   ```

3. Open the project in a simulator or browser using the Expo CLI options.

## Recommended commands

- `npm start` — launch Expo Dev Tools
- `npm run android` — open the Android simulator
- `npm run ios` — open the iOS simulator
- `npm run web` — launch the web version
- `npm run lint` — run Expo lint checks

## Tech stack

- Expo SDK 55
- React 19
- React Native 0.83
- Expo Router for tab navigation
- TypeScript for type-safe development

## Notes

This repository is designed as a modern shopping experience prototype. You can extend it by adding product detail pages, real API integration, user accounts, and checkout flows.
