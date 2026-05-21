# NADIR

NADIR e una web app React per simulare crescita, lead, fatturato potenziale, ROI, premium score e rischio agenda per centri estetici e aziende estetiche.

## Stack

- React
- Vite
- Tailwind CSS
- Recharts
- Lucide React

## Avvio locale

```bash
npm install
npm run dev
```

Vite mostrera un URL locale, di solito `http://localhost:5173`.

## Build produzione

```bash
npm run build
```

Il risultato viene creato nella cartella `dist/`.

## Preview build

```bash
npm run preview
```

## Deploy su Vercel

1. Carica la cartella `nadir` su GitHub.
2. Entra in Vercel e seleziona **Add New Project**.
3. Importa il repository.
4. Imposta:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Clicca **Deploy**.

## Deploy su Netlify

1. Importa il repository su Netlify.
2. Imposta:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Avvia il deploy.