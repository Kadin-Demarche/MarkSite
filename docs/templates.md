# Template Customization Guide

Learn how to customize MarkSite templates to match your design.

## Overview

MarkSite uses [Nunjucks](https://mozilla.github.io/nunjucks/) for templating. Templates define the HTML structure of your site.

### Template Locations

- **Core templates** (framework defaults): `templates/` at project root
- **Custom templates** (your overrides): `{contentDir}/templates/`

Files in `{contentDir}/templates/` override core templates automatically.

## Available Templates

### `base.html`

Master template that wraps all pages. Defines HTML structure, header, footer, navigation.

Used by all other templates as the base layout.

**Key variables**:
- `site` - Site configuration
- `title` - Page title
- `content` - Rendered content
- `navigation` - Navigation menu

### `page.html`

Template for regular pages (about, contact, etc.).

**Key variables**:
- `title` - Page title
- `content` - Page content (HTML)
- `description` - Page description

### `post.html`

Template for blog posts.

**Key variables**:
- `post` - Post object with metadata
- `title` - Post title
- `content` - Post content (HTML)
- `date` - Post date
- `author` - Post author
- `tags` - Post tags (array)
- `readingTime` - Estimated reading time
- `prevPost` - Previous post link
- `nextPost` - Next post link

### `blog.html`

Blog listing page at `/blog/`.

**Key variables**:
- `title` - Page title ("Blog")
- `posts` - Array of posts for current page
- `pagination` - Pagination info
  - `number` - Current page number
  - `totalPages` - Total number of pages
  - `prevUrl` - URL to previous page
  - `nextUrl` - URL to next page

### `tag.html`

Tag archive page at `/tag/{tag-name}/`.

**Key variables**:
- `tag` - Tag name
- `posts` - Posts with this tag

### `search.html`

Search page at `/search/`.

**Key variables**:
- `title` - "Search"
- `tags` - All tags for filtering

---

## Customizing Templates

### Step 1: Copy Template

Copy the template file you want to customize to your content directory:

```bash
# Copy to custom location
cp templates/post.html blog-data/templates/post.html
```

### Step 2: Edit Template

Edit `blog-data/templates/post.html` to customize the design.

### Step 3: Rebuild

Rebuild your site to see changes:

```bash
node cli.js build --content-dir blog-data
```

### Step 4: Test

Check the result locally:

```bash
node cli.js serve --content-dir blog-data
```

---

## Template Syntax

### Variables

Access variables with `{{ }}`:

```html
<h1>{{ title }}</h1>
<p>{{ post.excerpt }}</p>
```

### Conditionals

```html
{% if post %}
  <article>{{ post.content }}</article>
{% else %}
  <p>No post found</p>
{% endif %}

{% if isDraft %}
  <p class="draft-notice">This is a draft</p>
{% endif %}
```

### Loops

```html
<ul>
  {% for item in navigation %}
    <li><a href="{{ item.url }}">{{ item.label }}</a></li>
  {% endfor %}
</ul>
```

### Filters

```html
<!-- Date formatting -->
<time>{{ post.date | date('MMMM dd, yyyy') }}</time>

<!-- String filters -->
<p>{{ description | upper }}</p>

<!-- Array filters -->
<p>Latest 5 posts: {{ posts | limit(5) }}</p>

<!-- JSON escaping -->
<script>
  var title = "{{ post.title | jsonEscape }}";
</script>
```

### Template Inheritance

Base template (`base.html`):
```html
<html>
  <head>
    <title>{% block title %}{{ site.title }}{% endblock %}</title>
  </head>
  <body>
    {% block content %}{% endblock %}
  </body>
</html>
```

Child template:
```html
{% extends "base.html" %}

{% block title %}{{ post.title }} - {{ site.title }}{% endblock %}

{% block content %}
  <article>
    <h1>{{ post.title }}</h1>
    {{ post.content }}
  </article>
{% endblock %}
```

### Includes

Include other templates:

```html
{% include "header.html" %}

<main>
  {{ content }}
</main>

{% include "footer.html" %}
```

---

## Available Variables

### Global Variables

Available in all templates:

```html
{{ site.title }}              <!-- Site title -->
{{ site.description }}        <!-- Site description -->
{{ site.url }}                <!-- Site URL -->
{{ site.author }}             <!-- Default author -->
{{ site.email }}              <!-- Site email -->

{{ navigation }}              <!-- Navigation menu -->
{{ social }}                  <!-- Social links -->
{{ features }}                <!-- Feature flags -->
{{ seo }}                      <!-- SEO settings -->
```

### Page Variables

Available in page templates:

```html
{{ title }}                   <!-- Page title -->
{{ content }}                 <!-- Rendered HTML content -->
{{ description }}             <!-- Page description -->
{{ layout }}                  <!-- Layout name -->
```

### Post Variables

Available in post template:

```html
{{ post.title }}              <!-- Post title -->
{{ post.content }}            <!-- Post content (HTML) -->
{{ post.date }}               <!-- Post date (Date object) -->
{{ post.author }}             <!-- Post author -->
{{ post.excerpt }}            <!-- Post excerpt -->
{{ post.tags }}               <!-- Array of tags -->
{{ post.slug }}               <!-- Post slug (URL-friendly) -->
{{ post.url }}                <!-- Post URL -->
{{ post.readingTime }}        <!-- Estimated reading time -->
{{ post.toc }}                <!-- Table of contents -->
{{ post.formattedDate }}      <!-- Formatted date string -->

{{ prevPost }}                <!-- Previous post info -->
{{ nextPost }}                <!-- Next post info -->
```

### Blog Listing Variables

Available in `blog.html`:

```html
{{ posts }}                   <!-- Array of posts for this page -->
{{ pagination.number }}       <!-- Current page number -->
{{ pagination.totalPages }}   <!-- Total pages -->
{{ pagination.isFirst }}      <!-- Is first page? -->
{{ pagination.isLast }}       <!-- Is last page? -->
{{ pagination.prevUrl }}      <!-- URL to prev page -->
{{ pagination.nextUrl }}      <!-- URL to next page -->
```

### Tag Archive Variables

Available in `tag.html`:

```html
{{ tag }}                     <!-- Tag name -->
{{ posts }}                   <!-- Posts with this tag -->
```

---

## Custom Filters

MarkSite provides custom filters:

### `date`

Format dates:

```html
{{ post.date | date('MMMM dd, yyyy') }}       <!-- November 30, 2025 -->
{{ post.date | date('MMM dd, yy') }}          <!-- Nov 30, 25 -->
{{ post.date | date('yyyy-MM-dd') }}          <!-- 2025-11-30 -->
```

### `limit`

Limit array items:

```html
{% for post in posts | limit(5) %}
  <h2>{{ post.title }}</h2>
{% endfor %}
```

### `where`

Filter array by property:

```html
{% for post in posts | where('featured', true) %}
  <h2>{{ post.title }}</h2>
{% endfor %}
```

### `sort_by`

Sort array by property:

```html
{% for post in posts | sort_by('date') %}
  <h2>{{ post.title }}</h2>
{% endfor %}
```

### `slug`

Create URL slug:

```html
<a href="/blog/{{ post.title | slug }}/">
  {{ post.title }}
</a>
```

### `urlencode`

URL encode string:

```html
<a href="/search/?q={{ query | urlencode }}">
  Search
</a>
```

### `jsonEscape`

Escape for JSON:

```html
<script>
  var post = {
    title: "{{ post.title | jsonEscape }}"
  };
</script>
```

---

## Example Templates

### Simple Post Template

```html
{% extends "base.html" %}

{% block content %}
<article>
  <header>
    <h1>{{ post.title }}</h1>
    <time>{{ post.date | date('MMMM dd, yyyy') }}</time>
    {% if post.author %}
      by <span>{{ post.author }}</span>
    {% endif %}
    <span class="reading-time">{{ post.readingTime }} min read</span>
  </header>

  <main>
    {{ post.content }}
  </main>

  {% if post.tags %}
  <footer>
    <p>Tags:</p>
    <ul>
      {% for tag in post.tags %}
        <li><a href="/tag/{{ tag | slug }}/">{{ tag }}</a></li>
      {% endfor %}
    </ul>
  </footer>
  {% endif %}

  <nav>
    {% if post.prevPost %}
      <a href="{{ post.prevPost.url }}">← {{ post.prevPost.title }}</a>
    {% endif %}
    {% if post.nextPost %}
      <a href="{{ post.nextPost.url }}">{{ post.nextPost.title }} →</a>
    {% endif %}
  </nav>
</article>
{% endblock %}
```

### Blog Listing with Pagination

```html
{% extends "base.html" %}

{% block content %}
<div class="blog-listing">
  <h1>{{ title }}</h1>

  <div class="posts">
    {% for post in posts %}
      <article>
        <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
        <time>{{ post.date | date('MMMM dd, yyyy') }}</time>
        <p>{{ post.excerpt }}</p>
        <a href="{{ post.url }}" class="read-more">Read More →</a>
      </article>
    {% endfor %}
  </div>

  <!-- Pagination -->
  {% if pagination.totalPages > 1 %}
  <nav class="pagination">
    {% if pagination.prevUrl %}
      <a href="{{ pagination.prevUrl }}" class="prev">← Newer Posts</a>
    {% endif %}
    
    <span class="current">
      Page {{ pagination.number }} of {{ pagination.totalPages }}
    </span>
    
    {% if pagination.nextUrl %}
      <a href="{{ pagination.nextUrl }}" class="next">Older Posts →</a>
    {% endif %}
  </nav>
  {% endif %}
</div>
{% endblock %}
```

### Navigation Component

```html
<nav class="navigation">
  <ul>
    {% for item in navigation %}
      <li>
        <a href="{{ item.url }}" title="{{ item.title or item.label }}">
          {{ item.label }}
        </a>
      </li>
    {% endfor %}
  </ul>
</nav>
```

### Footer with Social Links

```html
<footer class="site-footer">
  <p>{{ footer.text }}</p>

  {% if social %}
  <div class="social-links">
    {% if social.github %}
      <a href="{{ social.github }}" title="GitHub">GitHub</a>
    {% endif %}
    {% if social.twitter %}
      <a href="{{ social.twitter }}" title="Twitter">Twitter</a>
    {% endif %}
    {% if social.linkedin %}
      <a href="{{ social.linkedin }}" title="LinkedIn">LinkedIn</a>
    {% endif %}
    {% if social.email %}
      <a href="mailto:{{ social.email }}" title="Email">Email</a>
    {% endif %}
  </div>
  {% endif %}

  {% if footer.showPoweredBy %}
    <p>
      <a href="https://marksite.dev" rel="noopener">
        Powered by MarkSite
      </a>
    </p>
  {% endif %}
</footer>
```

### SEO Meta Tags

```html
<head>
  <title>{% block title %}{{ site.title }}{% endblock %}</title>
  <meta name="description" content="{% block description %}{{ description or site.description }}{% endblock %}">
  <meta name="author" content="{{ site.author }}">

  <!-- Open Graph -->
  <meta property="og:title" content="{{ title or site.title }}">
  <meta property="og:description" content="{{ description or site.description }}">
  <meta property="og:url" content="{{ site.url }}{{ page.url or '' }}">
  {% if seo.ogImage %}
    <meta property="og:image" content="{{ seo.ogImage }}">
  {% endif %}

  <!-- Twitter Card -->
  {% if seo.twitterHandle %}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:creator" content="{{ seo.twitterHandle }}">
    <meta name="twitter:title" content="{{ title or site.title }}">
    <meta name="twitter:description" content="{{ description or site.description }}">
  {% endif %}
</head>
```

---

## Best Practices

### Template Organization

```
blog-data/templates/
├── base.html           # Master layout
├── page.html           # Regular pages
├── post.html           # Blog posts
├── blog.html           # Blog listing
├── tag.html            # Tag pages
├── search.html         # Search page
├── components/         # Reusable components
│   ├── header.html
│   ├── footer.html
│   ├── navigation.html
│   └── sidebar.html
└── partials/           # Template pieces
    ├── post-card.html
    └── pagination.html
```

### Using Includes

```html
<!-- base.html -->
<html>
  <head>{% include "components/header.html" %}</head>
  <body>
    {% include "components/navigation.html" %}
    <main>{% block content %}{% endblock %}</main>
    {% include "components/footer.html" %}
  </body>
</html>
```

### Reusable Components

```html
<!-- partials/post-card.html -->
<article class="post-card">
  <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
  <time>{{ post.date | date('MMMM dd, yyyy') }}</time>
  <p>{{ post.excerpt }}</p>
</article>

<!-- blog.html -->
{% for post in posts %}
  {% include "partials/post-card.html" %}
{% endfor %}
```

### Accessibility

```html
<!-- Use semantic HTML -->
<article>
  <header>
    <h1>{{ title }}</h1>
  </header>
  <main>{{ content }}</main>
</article>

<!-- Add alt text to images -->
<img src="/assets/images/hero.jpg" alt="Description of image">

<!-- Use labels with forms -->
<label for="search">Search:</label>
<input id="search" type="search" placeholder="...">

<!-- Proper heading hierarchy -->
<h1>Main Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>
```

### Performance

```html
<!-- Lazy load images -->
<img src="/assets/images/image.jpg" loading="lazy" alt="...">

<!-- Defer non-critical CSS/JS -->
<script src="/assets/js/main.js" defer></script>

<!-- Minimize DOM depth -->
<!-- Use semantic HTML for structure -->
```

---

## Debugging Templates

### Print Variables

```html
<!-- Show all available variables -->
{{ dump() }}

<!-- Show specific variable -->
{{ dump(post) }}

<!-- Pretty print -->
{{ post | dump }}
```

### Debug Mode

Check browser console for errors:

```bash
# Build with verbose output
node cli.js build --content-dir blog-data

# Check generated HTML
cat blog-data/_site/index.html | head -50
```

---

## Resources

- [Nunjucks Documentation](https://mozilla.github.io/nunjucks/)
- [MarkSite Template Examples](https://github.com/kadin/marksite/tree/main/templates)
- [Template Filters Reference](https://mozilla.github.io/nunjucks/templating.html#filters)

---

## See Also

- [Getting Started](./getting-started.md) - Quick tutorial
- [Content Directory](./content-directory.md) - Template locations
- [Configuration](./configuration.md) - Site configuration
- [Content Format](./content-format.md) - Front matter variables
