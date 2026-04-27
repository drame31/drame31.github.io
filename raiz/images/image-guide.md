# Image Guide — Raíz Restaurant Site

## Current placeholder images (Unsplash CDN)

These work for development and portfolio review. Before a real client launch, replace with licensed or original photography.

| Slot | Current URL | Unsplash Search Terms | Aspect Ratio | Size Target |
|------|-------------|----------------------|--------------|-------------|
| Hero background | `photo-1414235077428-338989a2e8c0` | "restaurant interior moody warm" | 16:9 | < 200KB |
| About / Chef | `photo-1466978913421-dad2ebd01d17` | "chef kitchen preparing food" | 3:4 | < 80KB |
| Experience BG | `photo-1504674900247-0877df9cc836` | "food plated overhead warm light" | 16:9 | < 150KB |
| Gallery 1 | `photo-1555396273-367ea4eb4db5` | "restaurant interior tables ambient" | 4:3 | < 80KB |
| Gallery 2 | `photo-1565299585323-38d6b0865b47` | "food close up plated restaurant" | 4:3 | < 80KB |
| Gallery 3 | `photo-1567620905732-2d1ec7ab7445` | "plated dish gourmet presentation" | 4:3 | < 80KB |
| Gallery 4 | `photo-1484980972926-edee96e0960d` | "restaurant table setting elegant" | 4:3 | < 80KB |
| Gallery 5 | `photo-1414235077428-338989a2e8c0` | "restaurant night ambiance" | 4:3 | < 80KB |
| Gallery 6 | `photo-1559339352-11d035aa65de` | "cocktail artisan bar tropical" | 4:3 | < 80KB |

## OG image

**Must create manually:** `images/og-raiz.jpg`
- Dimensions: exactly 1200 × 630px
- Content: restaurant interior shot or signature dish, landscape
- File size: under 300KB (JPEG at ~80% quality)
- No important content within 50px of edges (social platforms crop differently)
- Test at: https://www.opengraph.xyz

## Production image workflow

1. Download high-res from Unsplash (free license for commercial use)
2. Compress to WebP using [Squoosh](https://squoosh.app):
   - Format: WebP
   - Quality: 80–85
   - Resize to max 1920px wide for hero, 1200px for content
3. Name files: `hero-interior-raiz.webp`, `galeria-plato-ceviche.webp` (kebab-case, descriptive)
4. Update `<img src>` attributes in `index.html`
5. Update `<link rel="preload">` in `<head>` to point to local hero file
6. Verify CLS is still 0 after replacing (widths/heights must match actual file dimensions)
