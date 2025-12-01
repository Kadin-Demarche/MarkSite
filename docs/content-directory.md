# Content Directory Structure

This document explains the organization of your MarkSite project and the new content directory model.

## Overview

MarkSite separates framework code from user content:

- **Framework** (repository root) - Core engine, CLI, default templates/assets
- **Content Directory** (default: `blog-data/`) - Your site configuration and content

This separation allows you to:
- Update the framework without affecting your content
- Manage content independently
- Run multiple blogs from one installation
- Keep repositories clean and organized

## Directory Structure

### Project Root

```
your-repo/
├── cli.js                       # MarkSite command-line interface
├── lib/                         # Core modules
│   ├── builder.js              # Site builder engine
│   ├── markdown.js             # Markdown processor
│   ├── posts.js                # Post collection & processing
│   ├── template.js             # Template renderer
│   ├── server.js               # Development server
│   ├── scaffold.js             # Project scaffolding
│   ├── rss.js                  # RSS feed generator
│   ├── sitemap.js              # Sitemap generator
│   ├── search.js               # Search index generator
│   └── migrate.js              # Migration utility
├── templates/                   # Default templates
│   ├── base.html               # Base layout
│   ├── page.html               # Page template
│   ├── post.html               # Blog post template
│   ├── blog.html               # Blog listing
│   ├── tag.html                # Tag page
│   └── search.html             # Search page
├── assets/                      # Default assets
│   ├── css/
│   │   └── style.css           # Default styles
│   ├── js/
│   │   └── main.js             # Default scripts
│   └── images/                 # Default images
├── .github/                     # GitHub workflows
│   ├── workflows/
│   │   └── deploy.yml          # CI/CD deployment
│   └── issue-templates/
├── package.json                 # Node.js dependencies
├── package-lock.json
├── config.yaml                  # Site configuration (legacy)
├── content/                     # Content (legacy structure)
│   ├── posts/
│   └── *.md
└── README.md                    # Project documentation
```

### Content Directory

Default location: `blog-data/` (customizable)

```
blog-data/
├── config.yaml                  # REQUIRED: Site configuration
├── content/                     # REQUIRED: Content files
│   ├── index.md                # Homepage
│   ├── about.md                # About page
│   ├── contact.md              # Contact page
│   └── posts/                  # Blog posts
│       ├── 2025-11-30-first-post.md
│       ├── 2025-11-29-second-post.md
│       └── ...
├── templates/                   # OPTIONAL: Custom templates
│   ├── base.html               # Override default layout
│   ├── page.html               # Override page template
│   ├── post.html               # Override post template
│   ├── blog.html               # Override blog listing
│   ├── tag.html                # Override tag page
│   └── search.html             # Override search page
├── assets/                      # OPTIONAL: Custom assets
│   ├── css/
│   │   └── style.css           # Custom or extended styles
│   ├── js/
│   │   └── main.js             # Custom or extended scripts
│   └── images/                 # Your images
│       ├── logo.png
│       ├── favicon.ico
│       └── ...
└── _site/                       # OUTPUT: Generated static site
    ├── index.html              # Homepage
    ├── about/index.html
    ├── contact/index.html
    ├── blog/index.html         # Blog listing
    ├── blog/page/2/index.html  # Blog pagination
    ├── blog/post-slug/index.html
    ├── tag/                    # Tag pages
    ├── search/index.html       # Search page
    ├── feed.xml                # RSS feed
    ├── sitemap.xml             # XML sitemap
    ├── search-index.json       # Search index
    └── assets/                 # Compiled assets
```

## File Descriptions

### Core Configuration

**`blog-data/config.yaml`** (Required)

Site configuration in YAML format. Includes title, description, navigation, social links, and build settings.

Example:
```yaml
site:
  title: "My Blog"
  description: "My thoughts and ideas"
  url: "https://myblog.com"
  author: "Your Name"

blog:
  postsPerPage: 10

navigation:
  - label: "Home"
    url: "/"
  - label: "Blog"
    url: "/blog/"
```

See [Configuration](./configuration.md) for all options.

### Content Files

**`blog-data/content/`** (Required)

Contains all your Markdown content:

- **Root-level `.md` files** - Pages (index.md, about.md, contact.md, etc.)
- **`posts/` directory** - Blog posts

Each file starts with YAML front matter:

```markdown
---
title: "Page Title"
description: "Optional page description"
layout: "page"  # or "post"
date: "2025-11-30"  # Required for posts
author: "Author Name"
tags: ["tag1", "tag2"]  # Optional
excerpt: "Brief excerpt"  # Optional
---

# Your content in Markdown
```

See [Content Format](./content-format.md) for details.

### Naming Conventions

**Pages**: `blog-data/content/{name}.md` → `/`{name}`/index.html`
- `index.md` → `/index.html` (homepage)
- `about.md` → `/about/index.html`
- `contact.md` → `/contact/index.html`

**Posts**: `blog-data/content/posts/{date}-{slug}.md` → `/blog/{slug}/index.html`
- `2025-11-30-hello-world.md` → `/blog/hello-world/index.html`
- Date format: `YYYY-MM-DD`
- Slug auto-generated from title or specified in front matter

### Templates

**`blog-data/templates/`** (Optional)

Override default templates by creating files here. Files in this directory take precedence over core templates.

Available templates:

| Template | Purpose |
|----------|---------|
| `base.html` | Base layout wrapper |
| `page.html` | Static pages |
| `post.html` | Blog posts |
| `blog.html` | Blog listing/index |
| `tag.html` | Tag archive pages |
| `search.html` | Search page |

Templates use Nunjucks syntax with access to:
- `site` - Site configuration
- `navigation` - Navigation menu
- `social` - Social media links
- `posts` - All posts (for listing)
- `post` - Current post (for post page)
- `content` - Rendered content
- `title`, `date`, `tags`, etc. - Front matter fields

See [Templates](./templates.md) for detailed template guide.

### Assets

**`blog-data/assets/`** (Optional)

Custom stylesheets, scripts, and media:

```
assets/
├── css/
│   └── style.css           # Custom CSS (extends default)
├── js/
│   └── main.js             # Custom JavaScript
└── images/
    ├── logo.png
    ├── favicon.ico
    ├── hero.jpg
    └── ...
```

Files are copied to `_site/assets/` during build.

**Tip**: Reference assets using absolute paths:
```html
<img src="/assets/images/logo.png" alt="Logo">
<link rel="stylesheet" href="/assets/css/style.css">
<script src="/assets/js/main.js"></script>
```

### Build Output

**`blog-data/_site/`** (Generated)

Generated static HTML files. **Do not edit directly** - regenerated on each build.

Contents include:
- Compiled HTML pages
- Processed CSS and JavaScript
- Generated XML files (sitemap, RSS feed)
- Search index (JSON)
- Copied assets

This directory is:
- 🔴 **Git ignored** - Not committed to repository
- 🔴 **Not version controlled** - Regenerated during build
- ✅ **Ready to deploy** - Serve this directory publicly

## Specifying Content Directory

### Command-Line Flag

```bash
node cli.js build --content-dir ./blog-data
node cli.js serve --content-dir ./custom-blog
node cli.js new "Post" --content-dir ./another-blog
```

### Environment Variable

```bash
export MARKSITE_CONTENT_DIR=blog-data
node cli.js build
node cli.js serve
node cli.js new "Post"
```

### Config File

In root-level `config.yaml`:

```yaml
contentDir: ./blog-data
```

### NPM Scripts

In `package.json`:

```json
{
  "scripts": {
    "build": "node cli.js build --content-dir blog-data",
    "serve": "node cli.js serve --content-dir blog-data",
    "new": "node cli.js new --content-dir blog-data"
  }
}
```

## Resolution Order

When content directory is not specified, MarkSite checks in this order:

1. `--content-dir` flag (CLI option)
2. `MARKSITE_CONTENT_DIR` environment variable
3. `contentDir` in root `config.yaml`
4. Check for `./content/` (legacy structure)
5. Default to `./blog-data/`

## Best Practices

### File Organization

- Keep blog posts organized by year: `posts/2025/`, `posts/2024/`
- Use consistent naming: `YYYY-MM-DD-slug.md`
- Group related pages: `documentation/`, `tutorials/`, etc.

### Git Workflow

```gitignore
# Ignore build output
blog-data/_site/

# Ignore dependencies
node_modules/

# Ignore environment files
.env
```

Commit:
- ✅ `config.yaml`
- ✅ `content/`
- ✅ `templates/`
- ✅ `assets/`
- 🔴 `_site/` (build output)
- 🔴 `node_modules/`

### Multiple Blogs

Manage multiple independent blogs:

```
your-repo/
├── blog-main/
│   ├── config.yaml
│   └── content/
├── blog-project/
│   ├── config.yaml
│   └── content/
└── blog-archive/
    ├── config.yaml
    └── content/
```

Build all:
```bash
node cli.js build --content-dir blog-main
node cli.js build --content-dir blog-project
node cli.js build --content-dir blog-archive
```

## Migration from Old Structure

If you have the legacy structure with content at root:

```bash
node cli.js migrate
```

This automatically moves everything to `blog-data/`. See [Migration Guide](./migration.md) for details.

## Troubleshooting

**"Config not found" error?**
- Verify `{contentDir}/config.yaml` exists
- Check spelling of content directory

**Build not picking up new posts?**
- Ensure posts are in `{contentDir}/content/posts/`
- Check file extension is `.md` or `.markdown`
- Rebuild after adding files

**Templates not working?**
- Put custom templates in `{contentDir}/templates/`
- Framework looks in custom templates first, then core
- Verify template file names match exactly

**Assets not loading?**
- Copy to `{contentDir}/assets/`
- Use absolute paths: `/assets/...`
- Rebuild after adding files
