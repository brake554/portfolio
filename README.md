# Portfolio

A static portfolio site generated from [`projects.json`](projects.json).

## Edit content

Everything on the page comes from `projects.json` — edit that file (add/remove
projects, change descriptions, mark `"featured": true`), then rebuild:

```bash
node build.mjs
```

That regenerates `index.html`. No dependencies, no framework.

## Deploy to GitHub Pages

1. Create a new GitHub repo (e.g. `portfolio`).
2. From this `portfolio/` folder:

   ```bash
   git init -b main
   git add .
   git commit -m "Portfolio site"
   git remote add origin https://github.com/<your-username>/<repo>.git
   git push -u origin main
   ```

3. On GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

The included workflow (`.github/workflows/deploy.yml`) rebuilds `index.html` from
`projects.json` and publishes on every push to `main`. The live URL will be
`https://<your-username>.github.io/<repo>/`.
