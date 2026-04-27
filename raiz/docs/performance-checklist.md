# Performance Checklist — Raíz Restaurant Site

## LCP — Largest Contentful Paint (target: < 2.5s)

- [ ] Hero `<img>` is NOT lazy-loaded (`loading="lazy"` is absent on hero)
- [ ] Hero has `fetchpriority="high"` attribute
- [ ] `<link rel="preload" as="image" href="...hero-url...">` is in `<head>`
- [ ] Hero image is compressed WebP under 200KB (replace Unsplash URL with local optimized file before launch)
- [ ] Google Fonts loaded with `&display=swap` parameter (already done in template)
- [ ] `<link rel="preconnect">` for fonts.googleapis.com and fonts.gstatic.com (already in template)
- [ ] No render-blocking `<script>` tags without `defer` in `<head>`

## CLS — Cumulative Layout Shift (target: < 0.1)

- [ ] Every `<img>` has explicit `width` and `height` attributes (done in template)
- [ ] Google Maps iframe container has fixed height (`height: 420px` in CSS) before iframe loads
- [ ] AOS library uses `transform` + `opacity` only — does not shift layout
- [ ] Fonts use `font-display: swap` (handled by `&display=swap` in Google Fonts URL)
- [ ] WhatsApp float button uses `position: fixed` — does not affect document flow

## INP — Interaction to Next Paint (target: < 200ms)

- [ ] Mobile nav toggle: CSS transition is 220ms (within budget)
- [ ] Form submit: `submitBtn.disabled = true` fires before `fetch()` — immediate feedback
- [ ] Gallery lightbox: `lightbox.classList.add('open')` fires on click, image loads asynchronously
- [ ] AOS: `once: true` prevents re-triggering on scroll-back (no repeat calculations)
- [ ] No synchronous XHR anywhere in `raiz.js`

## Images

- [ ] Replace all Unsplash CDN URLs with locally optimized WebP files before launch
- [ ] Compress with Squoosh (https://squoosh.app): hero < 200KB, content images < 80KB
- [ ] Name files descriptively: `hero-interior-raiz.webp`, `plato-ceviche-corvina.webp`
- [ ] OG image: 1200×630px JPEG under 300KB at `images/og-raiz.jpg`

## Fonts

Current load strategy (already in template):
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="...&display=swap" rel="stylesheet" />
```
This is correct. No further action unless self-hosting is needed.

## JavaScript

- [ ] AOS loaded from CDN with `<script src="..." defer>` (or at end of body — current approach)
- [ ] `raiz.js` loaded at end of `<body>` — does not block rendering
- [ ] Zero unused event listeners (each `initX()` function cleans up if needed)

## Running Lighthouse locally

```bash
# Option 1: Chrome DevTools
# Open DevTools → Lighthouse tab → Analyze page load

# Option 2: CLI
npx -y lighthouse https://drame31.github.io/raiz/ --view

# Option 3: LHCI (matches CI config)
npm install -g @lhci/cli
npx serve . -p 8080 &
lhci autorun --config=docs/lighthouse-ci.yml
```

## Target scores

| Category       | Target | Minimum |
|----------------|--------|---------|
| Performance    | 95+    | 90      |
| Accessibility  | 98+    | 95      |
| Best Practices | 100    | 95      |
| SEO            | 100    | 100     |
