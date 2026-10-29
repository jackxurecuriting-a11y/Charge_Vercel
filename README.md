# Charge campus site

React/Vite marketing site and planned UW station explorer. Production: https://charge-campus.vercel.app

## Run locally

```bash
npm install
npm run dev
npm test
npm run build
```

## Deploy to Vercel

Use the existing Vercel `charge-campus` project. `vercel.json` configures the Vite build and `/stations` SPA rewrite. No app environment variables are required. Verify Git integration before relying on automatic deployment; a push alone is not proof of deployment. For an authenticated linked checkout, use `vercel --prod` and verify its production URL.

## Where to edit

- Main page copy and sections: `src/App.jsx`
- Station data: `src/data/stations.js`
- Search, selection, and fallback states: `src/components/StationLocator.jsx`
- Lazy-loaded Leaflet/OpenStreetMap map: `src/components/StationMap.jsx`
- Colors and layout: `src/styles.css` (brand variables are at the top)
- Images: `public/`

## Routes and honest states

`/` introduces the planned borrowing loop. `/stations` provides search, map/list selection, and building directions. The existing printed QR destination `/#stations` automatically opens `/stations`. Preserve `public/charge-uw-stations-qr.*` and that destination.

All four locations are planned. There is no hardware, inventory, rental, payment, or identity integration. Directions lead to buildings, not verified return slots. Pricing, indoor placement, hours, and support contacts need confirmation before launch. Do not claim successful rentals or returns without backend verification.

Location permission is requested only after a click. Coordinates stay in page memory; distance ordering is approximate, not walking distance. External maps load tiles from OpenStreetMap. Google Maps direction links do not embed the user's coordinates. Search/list remain usable when map tiles fail. This is not an installable offline app.

Before release: run tests/build; check phone/tablet/desktop layouts, search and empty recovery, map/list selection, help keyboard dismissal, location fallback, and the legacy QR route.
