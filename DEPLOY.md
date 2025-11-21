# Deployment Guide

## GitHub Pages (Recommended)

### Method 1: GitHub Actions (Automatic)

1. **Create GitHub repository**

2. **Push your code:**
   ```bash
   git remote add origin https://github.com/username/repo.git
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to repo Settings → Pages
   - Source: GitHub Actions

4. **Done!** Your site deploys automatically on every push.

The included `.github/workflows/deploy.yml` handles everything.

### Method 2: Manual Deploy

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Deploy `_site/` folder:**
   ```bash
   cd _site
   git init
   git add .
   git commit -m "Deploy"
   git push -f https://github.com/username/repo.git main:gh-pages
   ```

3. **Enable GitHub Pages:**
   - Settings → Pages
   - Source: Branch `gh-pages`, folder `/` (root)

## Netlify

1. **Connect your repo** on Netlify

2. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `_site`

3. **Deploy!**

## Vercel

1. **Import your repo** on Vercel

2. **Build settings:**
   - Framework: Other
   - Build command: `npm run build`
   - Output directory: `_site`

3. **Deploy!**

## Custom Server

Upload `_site/` contents to any web server.

Requirements:
- Static file hosting
- Optional: Gzip compression for better performance

## Custom Domain

### On GitHub Pages

1. Add `CNAME` file to project root:
   ```
   yourdomain.com
   ```

2. Update `config.yaml`:
   ```yaml
   site:
     url: "https://yourdomain.com"
   ```

3. Configure DNS:
   - A record: `185.199.108.153`
   - A record: `185.199.109.153`
   - A record: `185.199.110.153`
   - A record: `185.199.111.153`

## Troubleshooting

**404 on GitHub Pages?**
- Wait a few minutes for deployment
- Check Settings → Pages is enabled
- Verify `config.yaml` URL matches your repo

**CSS not loading?**
- Check `config.yaml` baseUrl setting
- For `username.github.io/repo`, set `baseUrl: "/repo"`
- For `username.github.io`, leave `baseUrl: ""`

**Build fails?**
- Check GitHub Actions logs
- Ensure Node.js version is 18+
- Verify all dependencies install correctly

