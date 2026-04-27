# Deployment Guide — Raíz Restaurant Site

## Part A: Frontend → GitHub Pages

### File structure in portfolio repo

```
drame31.github.io/
├── index.html         ← your existing portfolio
├── raiz/
│   ├── index.html     ← restaurant site (this file)
│   ├── css/raiz.css
│   ├── js/raiz.js
│   └── images/
│       └── og-raiz.jpg  ← 1200×630px OG image (add this manually)
└── ...
```

Copy the entire `projects/raiz/` folder into your portfolio repo, renaming it `raiz/`.

### Steps

1. Copy the folder (adjust paths to match where you cloned each repo):
   ```bash
   cp -r /path/to/equipo_de_agentes/projects/raiz/ /path/to/drame31.github.io/raiz/
   ```

2. Commit and push:
   ```bash
   cd drame31.github.io
   git add raiz/
   git commit -m "Add Raíz restaurant portfolio project"
   git push origin main
   ```

3. GitHub Pages deploys automatically within ~60 seconds.

4. Verify at: `https://drame31.github.io/raiz/`

### Add the portfolio card

Open `drame31.github.io/index.html` and paste the HTML comment block from the bottom of `raiz/index.html` into your projects section. Remove the comment markers.

---

## Part B: Backend → Render.com

The FastAPI backend is in `projects/raiz/api/`. You can keep it in the same repo or a separate one.

### Steps

1. Push the `api/` folder to GitHub.

2. Go to [render.com](https://render.com) → New → Web Service.

3. Connect your GitHub repo. Set:
   - **Root Directory:** `raiz/api` (or wherever the `main.py` lives)
   - Render detects `render.yaml` automatically — build and start commands are pre-configured.

4. Free tier settings:
   - Instance type: **Free**
   - Auto-deploy: On (deploys on every push to main)

5. After first deploy, note the service URL: `https://raiz-api.onrender.com` (or similar).

6. Update `API_URL` in `raiz/js/raiz.js`:
   ```js
   const API_URL = 'https://your-actual-render-url.onrender.com';
   ```

7. Commit and push the updated `raiz.js`.

### Cold start note

Render free tier spins down after 15 minutes of inactivity. First request after idle takes ~30 seconds. The frontend `handleFormSubmit` already shows a "Enviando…" state during this wait — no extra handling needed.

---

## Part C: CORS

If form submissions fail with a CORS error:

1. Open `api/main.py`.
2. Add your exact Render URL and GitHub Pages URL to `ALLOWED_ORIGINS`:
   ```python
   ALLOWED_ORIGINS = [
       "https://drame31.github.io",
       "https://your-render-url.onrender.com",  # optional, for API docs
       "http://localhost:5500",
       "http://127.0.0.1:5500",
   ]
   ```
3. Redeploy.

---

## Part D: Post-Deploy Checklist

- [ ] Site loads at `https://drame31.github.io/raiz/`
- [ ] All Unsplash images load (check Network tab for 404s)
- [ ] WhatsApp floating button appears after scrolling 300px
- [ ] Mobile hamburger nav opens and closes
- [ ] Gallery lightbox opens on image click
- [ ] Reservation CTA links open WhatsApp correctly
- [ ] Google Maps iframe loads (may be blocked in some regions — acceptable)
- [ ] Console is clean (zero JS errors)
- [ ] `og-raiz.jpg` exists in `raiz/images/` — test OG image at [opengraph.xyz](https://www.opengraph.xyz)
- [ ] Lighthouse SEO score: 100 (run `npx lhci autorun` or Chrome DevTools)
- [ ] Lighthouse Performance: 90+
- [ ] Portfolio card in main `index.html` links correctly to `raiz/index.html`
- [ ] Copyright year is current

---

## Part E: GitHub Actions (optional)

To add automated Lighthouse CI to the portfolio repo:

1. Copy `docs/github-actions-deploy.yml` to `.github/workflows/deploy.yml` in your portfolio repo.
2. Copy `docs/lighthouse-ci.yml` to `.lighthouserc.yml` in the repo root.
3. Push. The workflow runs on every push to `main`.

The workflow will fail the deploy if Lighthouse scores drop below the thresholds in `.lighthouserc.yml`.
