# milfsplaza.com — Deploy on Cloudflare Pages

This project is a **static export** Next.js site (no server needed). Ideal for Cloudflare Pages.

## Local dev

```bash
npm install
npm run dev
# open http://localhost:3000/en/
```

## Build

```bash
npm run build
```

Output folder: `out/`

## Cloudflare Pages (recommended)

1. Push this repo to GitHub.
2. Cloudflare Dashboard → Pages → Create a project → Connect to Git.
3. Build settings:
   - Framework preset: **None** (static)
   - Build command: `npm run build`
   - Build output directory: `out`
4. Add custom domain:
   - Pages project → Custom domains → add `milfsplaza.com`
   - Cloudflare will guide DNS records.

## Notes
- Root `/` redirects users to `/en/` via client-side redirect.
- The APK download redirect page is: `/[locale]/download/apk/`
  which then sends users to the CDN link.
