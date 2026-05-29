# Football Guess Who ⚽

A real-time two-player Football (Soccer) guessing game. Challenge a friend to identify each other's secret footballer using yes/no questions!

## Local Development

### Prerequisites
- Node.js 18+

### Setup
```bash
npm run install:all   # install all dependencies
npm run dev           # start both server (3001) and client (5173)
```

Open two browser tabs at `http://localhost:5173` to test multiplayer locally.

### Testing Multiplayer Locally
1. Tab 1: Click "Create Game" → copy the room link
2. Tab 2: Open the room link (or enter the room code)
3. Both players configure settings (host only), then start the game

## Production Build

```bash
npm run build    # builds React into client/dist
npm start        # serves everything from Express on port 3001
```

Test the production build locally before deploying:
```bash
npm run build && npm start
```
Then visit `http://localhost:3001`

## Railway Deployment

1. Push this repository to GitHub
2. Go to [Railway](https://railway.app) → New Project → Deploy from GitHub repo
3. Add environment variable: `NODE_ENV=production`
4. Railway auto-detects `railway.toml` and runs the build
5. Your public URL will be available immediately

## Game Features

- **155+ real footballers** from Premier League, La Liga, Bundesliga, Serie A, and Ligue 1
- **Configurable settings**: filter by nation/league, set guess attempts (1-3), question limits, win conditions
- **Multi-attempt guessing**: up to 3 guesses per round (configurable) — wrong guesses consume attempts; turn stays with same player
- **Q&A log** shown during gameplay and on the round-end reveal screen
- **Round reveal**: both players' secret footballers revealed with full Q&A history
- **Reconnection support**: room held for 60s on disconnect with countdown timer
- Real-time via Socket.IO with WebSocket + polling fallback

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express + Socket.IO
- **Deployment**: Railway (single server, zero database)
