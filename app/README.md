# Vantheon Codex — Web App

A web app that connects to the **Vantheon Codex** to display visual statistics for Vantheon factions and accept text or form inputs to update standings.

## Features

- **Visual standings**: Ranked table with a chosen stat (Power, Territory, Influence, Cohesion) and bar visuals
- **Charts**: Horizontal bar charts per stat via Recharts
- **Text commands**: Free-form input, e.g.  
  - `add 50 power to Aurora`  
  - `subtract 20 influence from Umbra`  
  - `set Meridian territory to 40`
- **Form updates**: Dropdowns for Faction, Stat, operation (Set / Add / Subtract), and value

## Connecting to the real Codex

The app uses a **mock** Codex client by default. To connect to your backend or Notion:

1. **API**: In `src/codex/client.ts`, implement `fetchStandings(config)` and `applyStandingsUpdate(update, current, config)` to call your API. Set `config.source = 'api'`, `config.baseUrl`, and `config.apiKey` as needed.
2. **Notion**: If your faction data lives in a Notion database, add a small adapter that maps Notion rows to the `Faction` type and call it from `fetchStandings`; use the Notion API or MCP from your backend.

Data types and the `StandingsUpdate` shape are in `src/codex/types.ts`.

## Run locally

```bash
cd app
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview   # optional: serve dist/
```
