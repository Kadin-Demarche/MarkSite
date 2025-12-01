# Advanced Topics

Advanced techniques and troubleshooting for MarkSite.

## Multiple Blog Instances

Run multiple independent blogs from one MarkSite installation.

### Directory Structure

```
your-repo/
├── cli.js
├── lib/
├── templates/
├── assets/
├── package.json
│
├── blog-main/
│   ├── config.yaml
│   ├── content/
│   │   ├── index.md
│   │   └── posts/
│   └── _site/
│
├── blog-project/
│   ├── config.yaml
│   ├── content/
│   │   ├── index.md
│   │   └── posts/
│   └── _site/
│
└── blog-archive/
    ├── config.yaml
    ├── content/
    │   ├── index.md
    │   └── posts/
    └── _site/
```

### Building All Blogs

```bash
# Build all manually
node cli.js build --content-dir blog-main
node cli.js build --content-dir blog-project
node cli.js build --content-dir blog-archive

# Or create a script: build-all.sh
#!/bin/bash
for dir in blog-*/; do
  echo "Building $dir..."
  node cli.js build --content-dir "$dir"
done
```

### NPM Scripts

```json
{
  "scripts": {
    "build:all": "npm run build:main && npm run build:project && npm run build:archive",
    "build:main": "node cli.js build --content-dir blog-main",
    "build:project": "node cli.js build --content-dir blog-project",
    "build:archive": "node cli.js build --content-dir blog-archive",
    "serve:main": "node cli.js serve --content-dir blog-main --port 3000",
    "serve:project": "node cli.js serve --content-dir blog-project --port 3001",
    "serve:archive": "node cli.js serve --content-dir blog-archive --port 3002"
  }
}
```

### Deployment

Each blog generates independent `_site/` directories:

```bash
# Deploy to different locations
cp -r blog-main/_site /var/www/example.com
cp -r blog-project/_site /var/www/project.example.com
cp -r blog-archive/_site /var/www/archive.example.com
```

Or with GitHub Pages:

```yaml
# Different repositories
# repo 1: example.com
publish_dir: ./blog-main/_site

# repo 2: project.example.com
publish_dir: ./blog-project/_site
```

---

## Custom Themes

Create and maintain custom themes by organizing templates.

### Theme Structure

```
themes/
├── my-custom-theme/
│   ├── templates/
│   │   ├── base.html
│   │   ├── page.html
│   │   ├── post.html
│   │   ├── blog.html
│   │   ├── tag.html
│   │   ├── search.html
│   │   └── components/
│   ├── assets/
│   │   ├── css/
│   │   │   └── theme.css
│   │   └── js/
│   │       └── theme.js
│   └── README.md
```

### Using a Theme

```bash
# Copy theme templates to content directory
cp -r themes/my-custom-theme/templates blog-data/templates/
cp -r themes/my-custom-theme/assets blog-data/assets/

# Build with theme
node cli.js build --content-dir blog-data
```

### Sharing Themes

Create a standalone theme package:

```bash
# Publish to npm
npm publish my-custom-theme

# Or distribute as git repo
git clone https://github.com/yourname/marksite-my-theme.git
```

---

## Custom Markdown Extensions

Extend Markdown with custom features.

### Callouts/Admonitions

In `content/post.md`:

```markdown
> **Note**: This is important information
> 
> Continue the blockquote for multi-line callouts.

> **Warning**: Be careful with this feature!
```

Style with CSS:

```css
blockquote {
  border-left: 4px solid #ccc;
  padding-left: 1em;
  margin: 1em 0;
}

/* Special styling for callouts */
strong:first-child {
  color: #0066cc;
  font-weight: bold;
}
```

### Collapsible Sections

Use HTML in Markdown:

```markdown
<details>
<summary>Click to expand</summary>

Hidden content goes here.

- Item 1
- Item 2

</details>
```

### Custom Shortcodes

Create a pre-processor:

```javascript
// lib/shortcodes.js
export function processShortcodes(content) {
  // [youtube: VIDEO_ID] → embedded player
  content = content.replace(
    /\[youtube:\s*(\w+)\]/g,
    '<iframe src="https://www.youtube.com/embed/$1"></iframe>'
  );
  
  // [codepen: PEN_ID] → embedded pen
  content = content.replace(
    /\[codepen:\s*(\w+)\]/g,
    '<iframe src="https://codepen.io/your-name/embed/$1"></iframe>'
  );
  
  return content;
}
```

Use in builder:

```javascript
// In markdown.js or posts.js
import { processShortcodes } from './shortcodes.js';

const processed = processShortcodes(content);
```

---

## Performance Optimization

### Image Optimization

Use optimized images:

```bash
# Optimize images
imagemin assets/images --out-dir=assets/images/optimized

# WebP conversion
cwebp -q 80 image.jpg -o image.webp
```

In templates:

```html
<picture>
  <source srcset="/assets/images/image.webp" type="image/webp">
  <img src="/assets/images/image.jpg" alt="Image">
</picture>
```

### CSS Optimization

Inline critical CSS:

```html
<!-- base.html -->
<style>
  /* Critical above-the-fold styles */
  body { font: 16px sans-serif; }
  .header { background: #f0f0f0; }
</style>

<!-- Defer non-critical CSS -->
<link rel="stylesheet" href="/assets/css/style.css">
```

### Lazy Loading

```html
<!-- Lazy load images -->
<img src="/assets/images/image.jpg" loading="lazy" alt="...">

<!-- Lazy load iframes -->
<iframe src="..." loading="lazy"></iframe>
```

### Build Caching

```bash
# Only rebuild changed files
node cli.js build --content-dir blog-data

# Clear cache if needed
rm -rf blog-data/_site
node cli.js build --content-dir blog-data
```

---

## Continuous Integration/Deployment

### GitHub Actions

Deploy on push:

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build site
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./blog-data/_site
```

### GitLab CI

```yaml
# .gitlab-ci.yml
deploy:
  stage: deploy
  image: node:18
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - blog-data/_site
  only:
    - main
```

### Environment Variables

Set in CI/CD:

```bash
# GitHub Actions
export MARKSITE_CONTENT_DIR=blog-data
export SITE_URL=https://myblog.com

# Or in workflow
env:
  MARKSITE_CONTENT_DIR: blog-data
```

---

## API Extension

Extend MarkSite with custom modules.

### Creating a Plugin

```javascript
// plugins/stats-generator.js
import fs from 'fs-extra';
import path from 'path';

export async function generateStats(posts, outputDir) {
  const stats = {
    totalPosts: posts.length,
    totalTags: new Set(posts.flatMap(p => p.tags)).size,
    latestPost: posts[0],
    oldestPost: posts[posts.length - 1],
    averageReadTime: Math.round(
      posts.reduce((sum, p) => sum + (p.readingTime || 0), 0) / posts.length
    )
  };

  await fs.writeJSON(
    path.join(outputDir, 'stats.json'),
    stats
  );

  return stats;
}
```

Use in builder:

```javascript
// In lib/builder.js
import { generateStats } from './plugins/stats-generator.js';

async build() {
  // ... existing build code ...
  
  // Generate stats
  await generateStats(posts, this.config.build.destination);
}
```

---

## Troubleshooting

### Common Issues

#### "Config file not found"

```bash
# Check file exists
ls -la blog-data/config.yaml

# Verify path is correct
pwd
ls blog-data/

# Try explicit path
node cli.js build --content-dir /absolute/path/to/blog-data
```

#### "Port already in use"

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 PID

# Use different port
node cli.js serve --port 3001
```

#### Posts not showing

```bash
# Check posts directory
ls -la blog-data/content/posts/

# Check file naming
# Should be: YYYY-MM-DD-slug.md
# Example: 2025-11-30-hello-world.md

# Check front matter
head -10 blog-data/content/posts/my-post.md

# Rebuild
rm -rf blog-data/_site
node cli.js build --content-dir blog-data
```

#### Template errors

```bash
# Check template files exist
ls -la blog-data/templates/

# Check syntax in templates
# Look for mismatched {% %} tags

# Verify template names match exactly
# base.html, page.html, post.html, blog.html, etc.
```

#### Build failures

```bash
# Check YAML syntax in config.yaml
python -m yaml < blog-data/config.yaml

# Check Markdown files for issues
# Look for unclosed code blocks: ```

# Check front matter format
# Should be between --- delimiters

# Enable verbose output
set -x
node cli.js build --content-dir blog-data
set +x
```

### Debugging

```bash
# Enable bash debugging
bash -x cli.js build --content-dir blog-data

# Check generated HTML
cat blog-data/_site/index.html

# Validate HTML
tidy -q blog-data/_site/index.html

# Monitor file changes
watch -n 1 'ls -la blog-data/_site/'
```

---

## Security Considerations

### Content Security

```bash
# Keep secrets out of content
# Don't commit API keys, passwords, etc.

# Use environment variables
export API_KEY=secret123

# Reference in config (if needed)
api_key: ${API_KEY}
```

### GitHub Pages Security

```yaml
# .github/workflows/deploy.yml
- name: Deploy
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}  # Safe!
    # NEVER use personal access tokens or hardcoded secrets
```

### Dependency Security

```bash
# Keep dependencies updated
npm update

# Audit for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## Performance Monitoring

### Build Time Analysis

```bash
# Time build process
time node cli.js build --content-dir blog-data

# Profile with node
node --prof cli.js build --content-dir blog-data
node --prof-process isolate-*.log > profile.txt
```

### Site Size Analysis

```bash
# Check generated site size
du -sh blog-data/_site/

# Find large files
find blog-data/_site -type f -size +100k

# Optimize images
du -sh blog-data/_site/assets/images/
```

---

## Maintenance

### Regular Tasks

```bash
# Update dependencies
npm update

# Check for vulnerabilities
npm audit

# Rebuild to refresh indexes
node cli.js build --content-dir blog-data

# Backup content
tar -czf backup-$(date +%Y%m%d).tar.gz blog-data/

# Clean old builds (if needed)
rm -rf blog-data/_site
```

### Version Control

```bash
# Commit content regularly
git add blog-data/
git commit -m "New posts and updates"

# Pull framework updates
git remote add upstream https://github.com/kadin/marksite.git
git fetch upstream
git merge upstream/main

# Keep separated to avoid conflicts with --content-dir
```

---

## Automation Scripts

### Auto-deploy on Schedule

```bash
#!/bin/bash
# deploy.sh
cd /path/to/blog
git pull origin main
npm install
npm run build
# Deploy blog-data/_site to server
rsync -av blog-data/_site/ user@server:/var/www/myblog/
```

### Backup Script

```bash
#!/bin/bash
# backup.sh
BACKUP_DIR="/backups/myblog"
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" \
  blog-data/config.yaml \
  blog-data/content/ \
  blog-data/templates/ \
  blog-data/assets/
```

### Watch and Rebuild

```bash
#!/bin/bash
# watch.sh
while true; do
  inotifywait -r blog-data/ -e modify,create,delete && \
  echo "Changes detected, rebuilding..." && \
  node cli.js build --content-dir blog-data
done
```

---

## See Also

- [CLI Reference](./cli-reference.md) - Command options
- [Templates](./templates.md) - Template customization
- [Configuration](./configuration.md) - Config options
- [Content Directory](./content-directory.md) - Project structure
