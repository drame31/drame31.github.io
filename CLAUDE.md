# CLAUDE.md — AI Assistant Guide for drame31.github.io

## Repository Overview

This is a **vanilla static website** serving as a personal portfolio for Derek Muñoz Solís, a Computer Engineering student. It is deployed via GitHub Pages and requires **no build step, no package manager, and no external dependencies**.

---

## Codebase Structure

```
drame31.github.io/
├── index.html           # Main portfolio (Spanish version, primary file)
├── index eng.html       # Alternate/English version (same content as index.html)
├── password-checker.html# CyberLock — standalone password strength analyzer app
├── README.md            # Minimal repo description
└── CLAUDE.md            # This file
```

### File Roles

| File | Purpose |
|------|---------|
| `index.html` | Single-page portfolio: hero, about, skills, experience, projects, contact |
| `index eng.html` | Duplicate of `index.html`; intended as an English variation |
| `password-checker.html` | Self-contained cybersecurity tool: boot animation, HUD UI, entropy analysis |

---

## Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Embedded `<style>` blocks in each HTML file; no external stylesheets
- **Vanilla JavaScript (ES6+)** — Embedded `<script>` blocks; no frameworks, no libraries
- **No build tools** — No npm, webpack, babel, TypeScript, or bundlers
- **No testing framework** — No test files or test runners

---

## Architecture & Conventions

### Self-Contained Files
Each HTML file is fully self-contained with all CSS and JavaScript inlined. There are no shared stylesheets or shared JS modules. When editing one file, changes do not affect others.

### CSS Design System (index.html)
All visual tokens are defined in `:root` CSS custom properties:

```css
:root {
  /* Backgrounds */
  --bg-deep: #04060b;
  --bg-primary: #080b14;
  --bg-secondary: #0c1021;
  --bg-card: #0f1528;

  /* Accent colors */
  --accent-1: #00f0ff;   /* Cyan — primary */
  --accent-2: #7b61ff;   /* Purple — secondary */
  --accent-3: #00ff88;   /* Green — success/highlight */
  --accent-4: #ff3d71;   /* Pink/Red — alerts/danger */

  /* Gradient */
  --gradient-main: linear-gradient(135deg, #00f0ff, #7b61ff);

  /* Typography */
  --text-primary: #e6eaf3;
  --text-secondary: #7d8597;
  --text-muted: #3d4455;

  /* Layout */
  --border: rgba(255,255,255,0.06);
  --border-hover: rgba(0,240,255,0.25);
  --radius: 16px;
  --radius-sm: 10px;
}
```

**Always use these variables** when adding or modifying colors, borders, or radii. Do not hard-code hex values for themed elements.

### Responsive Breakpoints
```css
@media (max-width: 900px)  { /* tablets */ }
@media (max-width: 768px)  { /* small tablets / large phones */ }
@media (max-width: 480px)  { /* small phones */ }
```

### Typography
The site uses system/Google fonts loaded via `@import` or `@font-face`:
- **Sora** — headings
- **Outfit** — body text
- **JetBrains Mono** — code/terminal displays

Use `clamp()` for fluid responsive font sizes, e.g.:
```css
font-size: clamp(2.8rem, 5.5vw, 4.5rem);
```

### JavaScript Patterns
- All JS is ES6+ (`const`, `let`, arrow functions, template literals, classes)
- Animations use `requestAnimationFrame()` loops
- Scroll-triggered reveals use `IntersectionObserver`
- No jQuery or utility libraries

---

## Key Sections (index.html)

| Section ID | Description |
|------------|-------------|
| `#home` | Hero with animated particle canvas and terminal typing effect |
| `#about` | Personal background, education, experience stats |
| `#skills` | 4-tile grid: Python, Web Dev, Cybersecurity, Soft Skills |
| `#experience` | Timeline: Computer Engineering (2025–) + Call Center (2023–2025) |
| `#projects` | Cards for Portfolio and CyberLock projects |
| `#contact` | Email, GitHub, LinkedIn links |

---

## password-checker.html Specifics

This file is a standalone cybersecurity showcase tool with:
- **Boot screen** with animated progress bar
- **HUD-style neon interface** (Orbitron font, scanning line animations, corner decorations)
- **Real-time password analysis**: entropy calculation, crack time estimation, composition breakdown
- **Canvas particle effects** tied to password strength state

The color palette here differs from `index.html` — it uses harsher neon tones for the cybersecurity theme. Keep them separate.

---

## Development Workflow

### Making Changes
1. Edit HTML files directly — no compilation needed
2. Open in a browser to preview (or use a local HTTP server)
3. Test on multiple viewport widths (mobile, tablet, desktop)

### Local Preview
Since there is no dev server, use any of:
```bash
# Python
python3 -m http.server 8080

# Node (if available)
npx serve .
```

Then open `http://localhost:8080` in a browser.

### No Build Step
There is nothing to compile, bundle, or transpile. Edits to `.html` files are immediately reflected on refresh.

---

## Git Workflow

- **Primary branch**: `master` (deployed to GitHub Pages)
- **Feature/AI branches**: `claude/<task>` prefixed branches for AI-assisted work
- Commits should be descriptive and scoped (e.g., `Fix responsive layout in skills section`)

### Deploying
GitHub Pages auto-deploys the `master` branch. Push to `master` to publish changes to the live site.

---

## Conventions for AI Assistants

1. **Do not introduce build tools or package managers** unless explicitly requested. This project intentionally uses zero dependencies.
2. **Keep CSS inline** in the respective HTML file. Do not extract to external `.css` files unless asked.
3. **Keep JavaScript inline** in the respective HTML file. Do not extract to external `.js` files unless asked.
4. **Respect the CSS variable system** — use `var(--accent-1)` etc. instead of raw hex values.
5. **Maintain the cyberpunk/neon aesthetic** — dark backgrounds, neon accent colors, glow effects, glassmorphism.
6. **Do not add external library CDN links** without explicit approval (Bootstrap, jQuery, etc.).
7. **Test responsiveness** — the site targets mobile, tablet, and desktop. Verify changes work at all breakpoints.
8. **`index.html` and `index eng.html` are kept in sync** — if content changes are made to one, consider whether the other needs updating too.
9. **`password-checker.html` is standalone** — do not link its styles or scripts with `index.html`.
10. **No linter or formatter is configured** — maintain consistent indentation (2 spaces) and code style matching the existing files.

---

## Common Tasks

### Add a new project card
Find the `#projects` section in `index.html` and duplicate an existing `.project-card` element. Update the title, description, tech tags, and links.

### Update contact links
Search for `href="mailto:"`, `href="https://github.com/drame31"`, or `href="https://linkedin.com"` in `index.html` and update the values.

### Change accent colors
Modify the CSS custom properties in `:root` at the top of the `<style>` block in each file.

### Add a new section
1. Add a `<section id="new-section">` in the HTML body
2. Add a nav link in the `<nav>` element
3. Add matching CSS in the `<style>` block
4. Ensure the section has the `reveal` class for scroll animation (handled by `IntersectionObserver`)

---

## Known Issues / Notes

- `index eng.html` appears to be an identical copy of `index.html` with no language differentiation implemented yet
- No favicon is defined — a `<link rel="icon">` tag could be added to `<head>`
- No `<meta>` OG tags for social sharing previews
- No analytics or tracking scripts present
