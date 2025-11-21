# Publishing to GitHub

## Quick Setup

1. **Create a new repository on GitHub** (don't initialize with README)

2. **Update package.json** with your repository URL:
   ```bash
   # Replace 'yourusername' with your GitHub username
   sed -i '' 's/yourusername/YOUR_USERNAME/g' package.json
   ```

3. **Update README badges:**
   ```bash
   sed -i '' 's/yourusername/YOUR_USERNAME/g' README.md
   ```

4. **Push to GitHub:**
   ```bash
   cd /Users/kadin/Cursor/marksite
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/marksite.git
   git push -u origin main
   ```

5. **Add topics to your repo** for discoverability:
   - static-site-generator
   - markdown
   - blog
   - github-pages
   - nodejs
   - ssg

6. **Enable GitHub Discussions** (optional):
   - Settings → Features → Discussions

## Make it Public

If you created a private repo, make it public:
- Settings → Danger Zone → Change visibility → Make public

## Add Social Preview

1. Create a 1280x640 image showcasing MarkSite
2. Settings → General → Social preview → Upload image

## Release v1.0.0

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

Then create a release on GitHub with release notes.

## npm Package (Optional)

To publish to npm:

1. **Create npm account** at npmjs.com

2. **Login:**
   ```bash
   npm login
   ```

3. **Update package name** if 'marksite' is taken:
   ```json
   {
     "name": "@yourusername/marksite"
   }
   ```

4. **Publish:**
   ```bash
   npm publish
   ```

Then users can install with:
```bash
npx @yourusername/marksite init my-blog
```

## Promote Your Project

- Post on Reddit (r/webdev, r/javascript, r/node)
- Tweet about it
- Post on Dev.to
- Add to awesome-lists on GitHub
- Share in Discord communities

## Example README Badges

Add to your README for professionalism:

```markdown
![Build](https://github.com/USERNAME/marksite/actions/workflows/test.yml/badge.svg)
![npm version](https://img.shields.io/npm/v/marksite.svg)
![Downloads](https://img.shields.io/npm/dm/marksite.svg)
```

