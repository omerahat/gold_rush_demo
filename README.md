# Gold Rush

A **two-player, hot-seat strategy game** built with React and Vite. Players take turns demanding gold from each other while mining through zones (Surface → Deep Mine → Core). The game keeps each player’s gold hidden from the opponent and uses a “three strikes” (pickaxe) system—fail three demands and you lose.

---

## Table of Contents

- [Overview](#overview)
- [Game Rules](#game-rules)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Scripts Reference](#scripts-reference)
- [Deployment](#deployment)
- [Configuration](#configuration)
- [Components](#components)
- [Game Logic](#game-logic)
- [Styling & Theming](#styling--theming)
- [Browser Support](#browser-support)

---

## Overview

**Gold Rush** is a local, same-device game for two players. It’s designed for **hot-seat play**: one person acts as Player 1, then passes the device to Player 2. A transition screen (“curtain”) hides gold totals between turns so neither player sees the other’s stash.

- **Objective:** Force the opponent to run out of gold or lose all three pickaxes (three failed demands).
- **Flow:** On your turn you enter a **demand** (gold amount). If the opponent has at least that much, they pay you; otherwise you get a **strike** (lose one pickaxe). Turns alternate with feedback and a private handoff screen.

---

## Game Rules

### Setup

- Each player starts with **gold** drawn from a shuffled “loot deck” of 12 cards:  
  `[80, 80, 100, 100, 120, 120, 150, 150, 180, 200, 220, 250]`
- Each player is dealt **2 cards**; their starting gold is the sum of those two cards (so between **160 and 470** gold).
- Each player has **3 pickaxes** (lives). Losing a pickaxe = one failed demand.

### Zones and Minimum Demand

The game advances by **rounds**. The current **zone** sets the **minimum demand** for that round:

| Zone       | Rounds   | Minimum demand |
|-----------|----------|----------------|
| Surface   | 1–3      | 10 gold        |
| Deep Mine | 4–6      | 50 gold        |
| Core      | 7+       | 100 gold       |

- Demands must be **positive**, in **multiples of 10**, and **≥** the zone’s minimum.

### Turn Flow

1. **Your turn:** You see your own gold and pickaxes; the opponent’s gold is shown as **???**.
2. You enter a **demand** (e.g. 80, 130, 200) and submit.
3. **Resolution:**
   - If the opponent has **≥** your demand: they pay you that amount. You gain gold, they lose it.
   - If the opponent has **<** your demand: **strike**. You gain nothing and lose **1 pickaxe**.
4. **Feedback:** A short overlay shows “Success!” (and transfer amount) or “Strike!” (and lost pickaxe).
5. **Transition:** A “curtain” tells the next player to take the device and tap **Ready** (gold stays hidden).
6. The other player’s turn starts; rounds increment when the turn returns to Player 1.

### Winning and Losing

- **You win** if:
  - The opponent has **0 gold** (you took it all), or
  - The opponent loses **all 3 pickaxes** (three failed demands).
- **You lose** if the same happens to you (0 gold or 0 pickaxes).

---

## Tech Stack

| Category      | Technology |
|---------------|------------|
| Framework     | [React](https://react.dev/) 19.x |
| Build tool    | [Vite](https://vite.dev/) 7.x |
| Styling       | [Tailwind CSS](https://tailwindcss.com/) 3.x |
| Animations    | [Framer Motion](https://www.framer.com/motion/) |
| Icons         | [Lucide React](https://lucide.dev/) |
| Linting       | ESLint (flat config) |
| Deployment    | GitHub Actions → GitHub Pages |

- **Language:** JavaScript (JSX). No TypeScript.
- **Package manager:** npm.

---

## Project Structure

```
goldrush/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml    # CI: build + deploy to GitHub Pages
├── public/                     # Static assets (if any)
├── src/
│   ├── components/
│   │   ├── GoldRush.jsx        # Main game container, state, reducer
│   │   ├── HUD.jsx             # Zone name, min demand, round
│   │   ├── PlayerDisplay.jsx   # Current player panel + demand input
│   │   ├── OpponentDisplay.jsx # Opponent panel (gold hidden)
│   │   ├── TurnFeedbackOverlay.jsx  # Success / Strike overlay
│   │   ├── TransitionCurtain.jsx    # Hot-seat handoff screen
│   │   ├── CheatSheetModal.jsx # Strategy tips modal
│   │   └── GameOverScreen.jsx  # Winner + New Game
│   ├── lib/
│   │   └── GameLogic.js        # Deck, zones, demand validation, resolution
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css               # Tailwind + Bebas Neue font
├── index.html
├── package.json
├── vite.config.js              # base: '/gold_rush_demo/' for GitHub Pages
├── tailwind.config.js          # Custom colors (gold, saloon, danger)
├── postcss.config.js
└── README.md
```

- **Entry:** `index.html` → `src/main.jsx` → `App.jsx` → `GoldRush.jsx`.
- **State:** Single `useReducer` in `GoldRush.jsx`; pure helpers in `GameLogic.js`.

---

## Prerequisites

- **Node.js** 18+ (project uses Node 20 in CI).
- **npm** (comes with Node).

Check versions:

```bash
node -v   # e.g. v20.x
npm -v    # e.g. 10.x
```

---

## Installation

1. **Clone the repository** (or download and extract):

   ```bash
   git clone <repository-url>
   cd goldrush
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

   For a clean install matching `package-lock.json` (recommended in CI):

   ```bash
   npm ci
   ```

---

## Running the App

### Development (local)

From the project root (`goldrush`):

```bash
npm run dev
```

- Leave this command running.
- Vite will print something like: **Local: http://localhost:5173/**
- Open that URL in your browser. The app supports hot module replacement (HMR).

**Note:** The app is configured with `base: '/gold_rush_demo/'` for GitHub Pages. For local dev, Vite serves from `/`; if you need to mimic the deployed base path locally, you can temporarily change `base` in `vite.config.js` or run with `npm run build && npm run preview` and open the preview URL.

### Production build

```bash
npm run build
```

- Output is in **`dist/`**.
- Assumes the app is served from the path set in `vite.config.js` (`base`).

### Preview production build locally

```bash
npm run preview
```

- Serves the contents of `dist/` locally so you can test the production build (and base path) before deploying.

---

## Scripts Reference

| Script     | Command           | Description |
|-----------|-------------------|-------------|
| `dev`     | `npm run dev`     | Start Vite dev server (HMR). |
| `build`   | `npm run build`   | Build for production into `dist/`. |
| `preview` | `npm run preview` | Serve `dist/` locally. |
| `lint`    | `npm run lint`    | Run ESLint on the project. |

---

## Deployment

The repo includes a **GitHub Actions** workflow that builds and deploys to **GitHub Pages** on every push to `main`.

- **Workflow file:** `.github/workflows/deploy-pages.yml`
- **Steps:** Checkout → Setup Node 20 → `npm ci` → `npm run build` → Upload `dist/` as Pages artifact → Deploy.
- **Result:** The app is available at:  
  `https://<username>.github.io/gold_rush_demo/`  
  (or your repo’s Pages URL if you changed the base path).

To use it:

1. Push code to the `main` branch.
2. In the repo: **Settings → Pages** → set “Source” to **GitHub Actions**.
3. After the workflow runs, open the Pages URL.

---

## Configuration

### Vite (`vite.config.js`)

- **Base path:** `base: '/gold_rush_demo/'` so the app works when served from a subpath (e.g. GitHub Pages).
- **Plugin:** `@vitejs/plugin-react` for React and Fast Refresh.

If you deploy to a different path, change `base` accordingly (e.g. `'/'` for root, or `'/goldrush/'`).

### Tailwind (`tailwind.config.js`)

- **Content:** `./index.html`, `./src/**/*.{js,ts,jsx,tsx}`
- **Custom theme:**
  - **Colors:** `gold` (300–600), `danger` (500–600), `saloon` (700–900)
  - **Font:** `display: ['Bebas Neue', 'serif']`
  - **Shadow:** `saloon`
  - **Background:** `parchment` (radial gradient)

### PostCSS (`postcss.config.js`)

- Uses **tailwindcss** and **autoprefixer** for Tailwind and vendor prefixes.

---

## Components

| Component              | Role |
|------------------------|------|
| **GoldRush**           | Root game component. Holds `useReducer` state, turn phases, and handlers. Renders HUD, opponent/player panels, feedback overlay, transition curtain, cheat sheet modal, and game-over screen. |
| **HUD**                | Shows current zone name, minimum demand for the zone, and current round number. |
| **PlayerDisplay**      | Current player’s card: gold, pickaxes, minimum demand, and the demand input + “Demand” button. Shows validation errors. |
| **OpponentDisplay**    | Opponent’s card: label and pickaxes; gold is always “???” so the active player cannot see it. |
| **TurnFeedbackOverlay**| Full-screen overlay after a demand: “Success!” (with amount) or “Strike!” (lost pickaxe). Auto-advances after ~2.5s or on click. |
| **TransitionCurtain**   | Full-screen “pass the device to [Player]” screen with “Ready” button. Keeps gold secret between players. |
| **CheatSheetModal**     | Modal with strategy tips (e.g. typical starting gold, probing with 80/130, playing conservatively at Surface). |
| **GameOverScreen**      | Shows winner, reason (e.g. “Domination” / “Bankrupt”), and “New Game” button. |

State flow: **GoldRush** dispatches actions (`RESOLVE_DEMAND`, `COMPLETE_FEEDBACK`, `READY_NEXT_PLAYER`, `RESET_GAME`); **GameLogic.js** provides pure functions for validation and resolution.

---

## Game Logic

Implemented in **`src/lib/GameLogic.js`**:

- **Loot deck:** Fixed 12-card array; shuffled at game start.
- **Initial deal:** Each player gets 2 cards; starting gold = sum of those cards.
- **Zones:** `getZoneData(round)` returns zone name and `minDemand` from round thresholds (Surface 1–3, Deep Mine 4–6, Core 7+).
- **Validation:** `validateDemand(amount, minDemand)` checks number, multiple of 10, ≥ minDemand, > 0; returns an error string or `null`.
- **Resolution:** `resolveDemand(demandAmount, activePlayerGold, opponentGold)` returns success/failure, transfer amount, and new gold for both players.
- **Player state:** `initialPlayerState(initialGold)` returns `{ gold, pickaxes: 3 }`.
- **Turn phases:** `TURN_PHASES` (e.g. `PLAYER_1_TURN`, `TURN_FEEDBACK`, `TRANSITION_SCREEN`, `GAME_OVER`) are used in the reducer.

No persistent storage; a full page reload starts a new game with a new random deal.

---

## Styling & Theming

- **Global:** `index.css` imports Tailwind layers and Google Font **Bebas Neue**; body uses `bg-saloon-900`, `text-amber-100`, and Bebas Neue.
- **Palette:** “Saloon” (browns) for backgrounds, “gold” and “amber” for accents and text, “danger” for strikes and errors.
- **Animations:** Framer Motion used for modals, feedback overlay, transition curtain, and game-over screen (enter/exit and scale).
- **Layout:** Responsive flex layouts; max width and padding tuned for desktop and smaller screens.

---

## Browser Support

- Targets modern browsers that support ES modules and the features used by React 19 and Vite (e.g. recent Chrome, Firefox, Safari, Edge).
- No polyfills are included; for older browsers you would need to adjust build targets and add polyfills as needed.

---

## Quick Start (TL;DR)

```bash
git clone <repo-url>
cd goldrush
npm install
npm run dev
```

Then open **http://localhost:5173/** and play hot-seat with two people on the same device.

---

## License

This project is private. See the repository for any license or usage terms.
