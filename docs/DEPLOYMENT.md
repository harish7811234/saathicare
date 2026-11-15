# SaathiCare — Deployment Guide

This guide describes how to deploy **SaathiCare** to **Vercel** or any modern static web hosting provider (Netlify, Cloudflare Pages, GitHub Pages).

---

## 1. Deploying to Vercel (Recommended)

SaathiCare is pre-configured for Vercel with single-page application routing in `vercel.json`.

### Option A: Via GitHub Integration (Automated CI/CD)

1. Push this repository to your GitHub account:
   ```bash
   git remote add origin https://github.com/<your-username>/saathicare.git
   git branch -M main
   git push -u origin main
   ```
2. Go to the [Vercel Dashboard](https://vercel.com/new).
3. Click **Import Project** and select your `saathicare` repository.
4. Vercel will automatically detect the configuration:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Deploy**.

Every push to `main` will trigger a production deployment; pull requests and other branches will generate preview deployments.

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy preview
vercel

# Deploy to production
vercel --prod
```

---

## 2. Configuration Reference (`vercel.json`)

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 3. Alternative Static Hosts

- **Netlify:** Set build command `npm run build`, publish directory `dist`, add `_redirects` file with `/* /index.html 200`.
- **Cloudflare Pages:** Set framework preset to **Vite**, build command `npm run build`, output directory `dist`.
