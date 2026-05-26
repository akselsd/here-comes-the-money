# 💸 Pengemaskina

A gamified live shift-earnings tracker. Set your hourly rate + overtime rules, hit start, and watch the kroner roll in. When you cross certain earnings thresholds, motivational/funny YouTube videos drop into your feed.

## Stack
- React + TypeScript + Vite
- Tailwind CSS
- `canvas-confetti` for the celebration moments
- Settings + history persisted in `localStorage`

## Develop

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

## Deploy (GitHub Pages)

1. Push to `main`.
2. In repo settings → Pages → set Source to **GitHub Actions**.
3. The workflow at `.github/workflows/deploy.yml` builds and publishes on every push to `main`.

Site lands at `https://<your-username>.github.io/here-comes-the-money/`.

If you rename the repo, also update `base` in `vite.config.ts`.

## Customize the video feed

Edit `src/data/videos.ts` — each entry has a `thresholdNOK` (kr earned before it unlocks), a YouTube `youtubeId`, and a `caption`.
