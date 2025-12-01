# Migrating to Content Directory Structure

This guide helps existing MarkSite users upgrade to the new content directory structure.

## Why Migrate?

The new structure separates your blog content from the MarkSite framework, making it:

- ✅ **Easy to Update** - Pull new MarkSite features without merge conflicts
- ✅ **Cleaner** - Clear separation between framework and content
- ✅ **Flexible** - Run multiple blogs from one MarkSite installation
- ✅ **Future-Proof** - Ready for long-term maintenance

## Current Structure

Before migration, your repository looks like:

```
your-repo/
├── cli.js
├── lib/
├── templates/
├── assets/
├── config.yaml              ← Your site config
├── content/                 ← Your posts & pages
│   ├── index.md
│   ├── about.md
│   └── posts/
│       └── *.md
└── _site/                   ← Build output
```

## New Structure

After migration:

```
your-repo/
├── cli.js                   ← Framework code
├── lib/
├── templates/               ← Default templates
├── assets/                  ← Default assets
├── package.json
│
└── blog-data/               ← NEW: Your content directory
    ├── config.yaml          ← Moved from root
    ├── content/             ← Moved from root
    │   ├── index.md
    │   ├── about.md
    │   └── posts/
    │       └── *.md
    ├── templates/           ← OPTIONAL: custom templates
    ├── assets/              ← OPTIONAL: custom assets
    └── _site/               ← Build output
```

## Automatic Migration

The easiest way to migrate:

```bash
node cli.js migrate
```

This command:
1. Creates `blog-data/` directory
2. Copies `config.yaml` → `blog-data/config.yaml`
3. Copies `content/` → `blog-data/content/`
4. Copies custom templates/assets if present
5. Displays migration summary

**Note**: Original files are NOT deleted. You can remove them after verifying the migration.

### Customize Migration

```bash
# Use different directory name
node cli.js migrate --name my-content

# Migrate in different project
node cli.js migrate --dir /path/to/repo
```

## Manual Migration

If you prefer manual control:

### Step 1: Create Content Directory

```bash
mkdir blog-data
```

### Step 2: Move Configuration

```bash
cp config.yaml blog-data/config.yaml
```

### Step 3: Move Content

```bash
cp -r content blog-data/
```

### Step 4: Move Custom Templates (if any)

If you have custom templates in `templates/`:

```bash
cp -r templates blog-data/
```

### Step 5: Move Custom Assets (if any)

If you have custom assets in `assets/`:

```bash
cp -r assets blog-data/
```

### Step 6: Test Build

```bash
node cli.js build --content-dir blog-data
```

If successful, proceed to cleanup.

## Cleanup (After Verification)

After successful migration and testing, remove old files:

```bash
# Remove old config
rm config.yaml

# Remove old content
rm -rf content/

# Remove old templates (if you copied them)
# rm -rf templates/

# Remove old assets (if you copied them)
# rm -rf assets/

# Remove old build output
rm -rf _site/
```

## Update Git Repository

Update your `.gitignore`:

```diff
  node_modules/
  _site/
+ blog-data/_site/
  .DS_Store
  *.log
```

Commit changes:

```bash
git add -A
git commit -m "Migrate to content directory structure"
git push origin main
```

## Update Your Scripts

Update `package.json` to use content directory:

```json
{
  "scripts": {
    "build": "node cli.js build --content-dir blog-data",
    "serve": "node cli.js serve --content-dir blog-data",
    "new": "node cli.js new --content-dir blog-data",
    "init": "node cli.js init --content-dir blog-data"
  }
}
```

Or use environment variable in deployment scripts:

```bash
export MARKSITE_CONTENT_DIR=blog-data
npm run build
npm run serve
```

## Update GitHub Actions

If you have deployment workflow, update it:

```yaml
- name: Build site
  run: npm run build

- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./blog-data/_site  # Update this path
```

## Verify Everything Works

After migration:

```bash
# Build with new structure
npm run build

# Start dev server
npm run serve

# Create new post
npm run new "Test Post"

# Check that everything looks correct
# Visit http://localhost:3000 in browser
```

## Pulling MarkSite Updates

Now the main benefit: you can safely update MarkSite!

```bash
# Add upstream (if not already done)
git remote add upstream https://github.com/kadin/marksite.git

# Fetch updates
git fetch upstream main

# Merge (no conflicts with your content!)
git merge upstream/main

# Test
npm run build
npm run serve
```

## Rollback (If Needed)

If something goes wrong, you can roll back:

```bash
# Restore from git
git checkout HEAD -- .

# Or manually restore old files
git show HEAD:config.yaml > config.yaml
git show HEAD:content/ > content/

# Verify
node cli.js build  # Old command without --content-dir
```

## Multiple Blog Instances

One benefit of the new structure: run multiple blogs!

```bash
mkdir blog-2
cp blog-data/config.yaml blog-2/
cp -r blog-data/content blog-2/

# Customize blog-2/config.yaml

# Build both
node cli.js build --content-dir blog-data
node cli.js build --content-dir blog-2

# Serve separately
node cli.js serve --content-dir blog-data --port 3000 &
node cli.js serve --content-dir blog-2 --port 3001 &
```

## Troubleshooting

**Build fails after migration?**
- Verify `blog-data/config.yaml` exists
- Check template path: should be `blog-data/templates/`
- Run: `node cli.js build --content-dir blog-data`

**"Config file not found" error?**
- Ensure `blog-data/config.yaml` exists
- Check file is valid YAML (use `yaml` validator online)

**Old structure still being used?**
- Remove `./content/` directory completely
- Use `--content-dir` flag explicitly or set `MARKSITE_CONTENT_DIR`

**Deploy workflow failing?**
- Update `.github/workflows/*.yml` to use new paths
- Ensure publish_dir is `./blog-data/_site`
- Rebuild and test locally first

## Need Help?

- Check [CLI Reference](./cli-reference.md) for command options
- Review [Content Directory Structure](./content-directory.md) for details
- See [Configuration](./configuration.md) for config options
