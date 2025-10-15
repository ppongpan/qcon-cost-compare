# Q-CON Cost Compare (React + Vite + Tailwind)

This repository is an automatic conversion of your `Q-CON Cost Compare.html` into a full React + Vite project with Tailwind and Framer Motion for nice animations.

## Quick start (local)

1. Install Node.js (>=18) and npm.
2. Extract this project and run:
```bash
npm install
npm run dev
```
Open http://localhost:5173

## Build & Deploy to GitHub Pages

1. Create a GitHub repository named `qcon-cost-compare`.
2. Replace `homepage` in package.json with `https://<GITHUB_USERNAME>.github.io/qcon-cost-compare`
3. Commit and push all files to the `main` branch.
4. On your machine:
```bash
npm install
npm run build
npm run deploy
```
This uses `gh-pages` to publish the `dist/` folder to `gh-pages` branch.

## Manual GitHub Pages alternative (recommended for Vite)

1. Build:
```bash
npm run build
```
2. In the repository settings -> Pages, choose `gh-pages` branch (or `main`/`docs` if you prefer) and set folder `/ (root)` or `/docs` accordingly.
3. Upload the `dist/` content to the selected branch/folder.

## Notes
- The `base` is set to `./` in `vite.config.js` to make the app work on `github.io/<repo>` subpath.
- If you want CI/CD, add a GitHub Action to build and push `dist/` to `gh-pages`.

