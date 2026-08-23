# Paw Haven

A small, playable animal adoption center management game built with JavaScript, Phaser, and Vite. Everything runs in the browser; there is no backend.

## Run locally

```bash
pnpm install
pnpm dev
```

Use WASD or the arrow keys to move and E to interact.

## Build for GitHub Pages

```bash
pnpm build
```

The deployable static site is generated in `dist/`. The included GitHub Actions workflow publishes it automatically whenever `main` is updated. In GitHub, set **Settings → Pages → Source** to **GitHub Actions** once.

## Project map

- `src/scenes/` — the Phaser shelter world, player, collisions, and interaction range
- `src/systems/` — data and rules for animals, adoption, money, and objectives
- `src/ui/` — profiles, care buttons, adoption choices, HUD, and feedback
- `src/main.js` — connects the systems and starts the game
- `tests/` — fast checks for the underlying game rules

The artwork is intentionally drawn from Phaser shapes and CSS, so the prototype has no asset licensing or loading concerns.

