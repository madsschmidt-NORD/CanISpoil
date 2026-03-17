# CanISpoil

A live-ready spoiler etiquette calculator with a Max-inspired premium interface.

## Stack
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- TMDb for search and title metadata
- OMDb for IMDb vote enrichment

## Environment variables
Create a `.env.local` file from `.env.example`.

```bash
TMDB_API_READ_ACCESS_TOKEN=your_tmdb_read_access_token
OMDB_API_KEY=your_omdb_api_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Run locally
```bash
npm install
npm run dev
```

## Deploy to Vercel
1. Push the project to GitHub.
2. Import the repo into Vercel.
3. Add `TMDB_API_READ_ACCESS_TOKEN` and `OMDB_API_KEY` in Project Settings → Environment Variables.
4. Deploy.

## Notes
- Search is live through TMDb.
- Title pages enrich vote counts from OMDb when an IMDb ID is available.
- Without `OMDB_API_KEY`, the site still works, but popularity falls back to TMDb vote counts.
- The spoiler model follows the CanISpoil logic: the more culturally known the title, the faster it becomes socially fair game.
