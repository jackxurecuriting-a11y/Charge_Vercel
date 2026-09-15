# Charge marketing site

Editable React/Vite source for the Charge shared-power-bank marketing demo.

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Unzip this folder and push it to a GitHub repository, or import the folder with the Vercel CLI.
2. In Vercel, choose **Add New → Project**, then import the repository.
3. Vercel will detect Vite automatically. No environment variables are required.
4. Deploy. Future GitHub pushes will automatically create new Vercel deployments.

## Where to edit

- Main page copy and sections: `src/App.jsx`
- Full-screen scroll animation: `src/components/ChargeMachineStory.jsx`
- Colors and layout: `src/styles.css` (brand variables are at the top)
- Images: `public/`

This is a concept marketing demo. It does not include live payments, station data, pricing, or a rental backend.
