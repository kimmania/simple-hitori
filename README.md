# Simple Hitori

A mobile-first Hitori game built with vanilla TypeScript. Play in the browser — optimized for iPad Mini and phones — with four difficulty levels (by grid size), help, undo, reset, and mistake counting.

**Play online:** [https://kimmania.github.io/simple-hitori/](https://kimmania.github.io/simple-hitori/)

## Features

- **Difficulty levels:** Easy (5×5), Medium (6×6), Hard (8×8), Expert (12×12)
- **Tap to play:** Cycle each cell — shade (black), mark white (ring), or clear
- **Help:** Rules, controls, and starter logic patterns
- **Undo:** Revert the last cell change (button or ⌘Z / Ctrl+Z)
- **Reset:** Clear markings on the current puzzle
- **Mistake counter:** Wrong markings vs. the solution and new rule violations
- **Resume game:** Progress saved to local storage
- **Puzzle banks:** 50 puzzles each for easy, medium, and hard; 30 for expert
- **Installable PWA:** Add to Home Screen for a full-screen app experience

## Development

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173/simple-hitori/`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run unit tests |
| `npm run generate-puzzles` | Regenerate puzzle JSON banks |

## GitHub Pages

Pushes to `main` deploy automatically via GitHub Actions (same setup as [simple-sudoku](https://github.com/kimmania/simple-sudoku)).

1. In the repo, go to **Settings → Pages**
2. Under **Build and deployment**, set **Source** to **GitHub Actions**
3. Push to `main` (or run the workflow manually via **Actions → Deploy to GitHub Pages → Run workflow**)
4. Live site: [https://kimmania.github.io/simple-hitori/](https://kimmania.github.io/simple-hitori/)

The workflow (`.github/workflows/deploy.yml`) runs `npm ci`, `npm test`, and `npm run build`, then publishes the `dist` folder with `actions/deploy-pages`.

`vite.config.ts` sets `base: '/simple-hitori/'` so assets resolve correctly on GitHub Pages project sites.

## Install on iPad

1. Open the site in Safari
2. Tap the Share button
3. Choose **Add to Home Screen**

## License

MIT
