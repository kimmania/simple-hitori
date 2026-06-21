# Simple Hitori

A mobile-first Hitori puzzle game built with vanilla TypeScript. Play in the browser — optimized for iPad Mini and phones — with four difficulty levels (by grid size), help, single-step undo, reset, and mistake counting.

**Play online:** [https://kimmania.github.io/simple-hitori/](https://kimmania.github.io/simple-hitori/)

## Features

- **Difficulty levels:** Easy (5×5), Medium (6×6), Hard (8×8), Expert (12×12)
- **Tap to play:** Cycle each cell — shade (black), mark white (ring), or clear
- **Help:** Rules, controls, and starter logic patterns
- **Undo:** Revert the last cell change (single-step undo; button or ⌘Z / Ctrl+Z)
- **Reset:** Clear markings on the current puzzle
- **Mistake counter:** Tracks wrong markings against the puzzle solution
- **Resume game:** Progress saved to local storage
- **Puzzle banks:** 50 puzzles each for easy, medium, and hard; 30 for expert (12×12 grids are generated as valid solutions but are not guaranteed to be uniquely solvable)
- **Keyboard accessible:** Tab to the board, navigate with arrow keys, and toggle cells with Space or Enter
- **Accessibility:** ARIA labels announce each cell’s marking state (shaded / kept / undecided), selected cells expose `aria-selected`, and conflict indicators use high-contrast outlines visible in grayscale mode
- **Installable PWA:** Add to Home Screen for a full-screen app experience

## Development

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173/simple-hitori/`).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run unit tests (14 tests across rules, solver, moves, validation, and storage) |
| `npm run generate-puzzles` | Regenerate puzzle JSON banks |

## GitHub Pages

Pushes to `main` deploy automatically via GitHub Actions.

1. In the repo, go to **Settings → Pages**
2. Under **Build and deployment**, set **Source** to **GitHub Actions**
3. Push to `main` (or run the workflow manually via **Actions → Deploy to GitHub Pages → Run workflow**)
4. Live site: [https://kimmania.github.io/simple-hitori/](https://kimmania.github.io/simple-hitori/)

The workflow (`.github/workflows/deploy.yml`) runs on **Node 22 LTS**, executes `npm ci`, `npm test`, and `npm run build`, then publishes the `dist` folder with `actions/deploy-pages`.

`vite.config.ts` sets `base: '/simple-hitori/'` so assets resolve correctly on GitHub Pages project sites.

### Puzzle updates & caching

Puzzle banks are fetched at runtime and cached by the service worker. Each build injects a unique `__PUZZLE_STAMP__` into the puzzle fetch URLs, so returning players automatically receive fresh puzzle banks after a redeploy without needing to clear the PWA cache.

## Install on iPad

1. Open the site in Safari
2. Tap the Share button
3. Choose **Add to Home Screen**

## License

MIT
