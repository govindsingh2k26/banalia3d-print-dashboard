# Images Folder

Drop your image files here. They'll be served from the site root.

## Recommended files

| File | Used for | Suggested size |
|------|----------|----------------|
| `og-banner.jpg` | Social share preview (Open Graph / Twitter) | 1200 × 630 |
| `logo.png` | Logo (SEO structured data) | 512 × 512 |
| `favicon.ico` | Browser tab icon → place in `/src/app/favicon.ico` | 48 × 48 |

## Product images

Place product photos in `public/images/products/` and reference them in
`src/data/products.json` like:

```json
"image": "/images/products/your-photo.jpg"
```

If an image is missing, the product card shows a branded gradient placeholder
automatically — so the site never breaks.

## Blog cover images

Place blog covers in `public/images/blog/` and reference them in the post's
front-matter `cover:` field.

## Tips

- Use **JPG** for photos, **PNG** for logos/transparency, **WebP** for best compression.
- Keep images under ~300 KB each for fast loading and a high Lighthouse score.
