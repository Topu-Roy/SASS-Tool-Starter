# SEO Reference Guide

A complete, implementation-ready reference for modern SEO. Covers everything from HTML basics to technical signals, written for Astro but applies to any framework.

---

## 1. `<head>` Essentials

Every page must have these. No exceptions.

```html
<!-- Title: most important on-page signal. Keep under 60 chars -->
<title>Primary Keyword – Brand Name</title>

<!-- Description: shown in search results. 150–160 chars max -->
<meta name="description" content="Clear, compelling summary of the page." />

<!-- Canonical: tells Google which URL is the "real" one -->
<link rel="canonical" href="https://yourdomain.com/page/" />

<!-- Language -->
<html lang="en">
  <!-- Viewport (required for mobile) -->
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <!-- Robots: control indexing per page -->
  <meta name="robots" content="index, follow" />
  <!-- To block a page: -->
  <meta name="robots" content="noindex, nofollow" />
</html>
```

---

## 2. Open Graph (Social Previews)

Controls how your page looks when shared on WhatsApp, Messenger, Twitter, LinkedIn, Discord, Slack, etc.

```html
<meta property="og:title" content="Page Title" />
<meta property="og:description" content="Short description." />
<meta property="og:image" content="https://yourdomain.com/og/page.jpg" />
<meta property="og:url" content="https://yourdomain.com/page/" />
<meta property="og:type" content="website" />
<!-- For blog posts, use: og:type = "article" -->
```

### Rules for og:image

- Must be an **absolute URL** — `https://...`, never `/relative/path`
- Size: **1200×630px** (standard) — min 600×315px
- Under 8MB, preferably under 1MB
- Use `.jpg` or `.png`

### Twitter / X cards

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Page Title" />
<meta name="twitter:description" content="Short description." />
<meta name="twitter:image" content="https://yourdomain.com/og/page.jpg" />
<!-- Optional: -->
<meta name="twitter:site" content="@yourhandle" />
```

> **Cache note:** WhatsApp and Facebook cache previews heavily. Use the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) to force a refresh after updates.

---

## 3. Astro-Specific Setup

### Set `site` in config — everything depends on this

```js
// astro.config.mjs
export default defineConfig({
  site: "https://yourdomain.com",
  trailingSlash: "always", // pick one, stay consistent
});
```

### Sitemap (auto-generated)

```bash
npx astro add sitemap
```

```js
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://yourdomain.com",
  integrations: [sitemap()],
});
```

Generates `/sitemap-index.xml` at build time. Submit this URL in Google Search Console.

### Reusable SEO Component

```astro
---
// src/components/SEO.astro
interface Props {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
  type?: 'website' | 'article';
}

const { title, description, image, canonical, type = 'website' } = Astro.props;
const url = canonical ?? new URL(Astro.url.pathname, Astro.site).href;
const ogImage = image ? new URL(image, Astro.site).href : undefined;
---

<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={url} />

<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={url} />
<meta property="og:type" content={type} />
{ogImage && <meta property="og:image" content={ogImage} />}

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
{ogImage && <meta name="twitter:image" content={ogImage} />}
```

Usage in layout:

```astro
<SEO
  title="Tool Name – Short Benefit"
  description="What this page does in one sentence."
  image="/og/home.jpg"
/>
```

---

## 4. `robots.txt`

Note: Auto generated if astro-robots-txt is installed and setup

Place at `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap-index.xml
```

To block specific paths:

```
Disallow: /admin/
Disallow: /thank-you/
```

---

## 5. Structured Data (JSON-LD)

Helps Google understand your content and can unlock rich results (star ratings, FAQs, breadcrumbs in search).

### Website / Homepage

```astro
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Your Site Name",
  "url": "https://yourdomain.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://yourdomain.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
})} />
```

### Blog Post / Article

```astro
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title,
  "description": description,
  "image": ogImage,
  "datePublished": pubDate,
  "dateModified": updatedDate ?? pubDate,
  "author": {
    "@type": "Person",
    "name": "Your Name",
    "url": "https://yourdomain.com/about"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Your Site",
    "logo": { "@type": "ImageObject", "url": "https://yourdomain.com/logo.png" }
  },
  "mainEntityOfPage": canonicalUrl
})} />
```

### FAQ

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is this tool?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It does X by doing Y."
      }
    }
  ]
}
```

> Test structured data at [schema.org validator](https://validator.schema.org/) or [Google's Rich Results Test](https://search.google.com/test/rich-results).

---

## 6. On-Page SEO

### Heading structure

```html
<h1>One per page — primary keyword here</h1>
<h2>Section heading</h2>
<h3>Subsection</h3>
```

- Never skip levels (h1 → h3 with no h2)
- `<h1>` should match or be close to your `<title>`

### URL structure

- Lowercase, hyphenated: `/pdf-to-excel-converter/`
- Short and descriptive — avoid `/page?id=123`
- Include the primary keyword
- Consistent trailing slash (pick one via `trailingSlash` in Astro config)

### Images

```astro
<!-- In Astro, always use <Image /> from astro:assets -->
import { Image } from 'astro:assets';

<Image
  src={myImage}
  alt="Descriptive alt text — what is in the image"
  width={800}
  height={450}
/>
```

- `alt` text: describe the image for screen readers and crawlers
- Use `astro:assets` — it auto-optimizes, adds `width`/`height` (prevents layout shift), and converts to WebP
- Lazy load below-the-fold images: `loading="lazy"`
- Preload hero/above-fold image: `<link rel="preload" as="image" href="..." />`

### Internal linking

- Link related pages to each other using descriptive anchor text
- "Click here" = bad. "PDF to Excel converter guide" = good
- Every page should be reachable within 3 clicks from the homepage

---

## 7. Core Web Vitals (Performance SEO)

Google uses CWV as a ranking signal. Target:

| Metric | Target  | What it is                                             |
| ------ | ------- | ------------------------------------------------------ |
| LCP    | < 2.5s  | Largest Contentful Paint — how fast main content loads |
| CLS    | < 0.1   | Cumulative Layout Shift — page jumping around          |
| INP    | < 200ms | Interaction to Next Paint — responsiveness             |

### In Astro:

- Use `<Image />` from `astro:assets` — fixes CLS by setting dimensions automatically
- Avoid `client:load` unless necessary — use `client:idle` or `client:visible`
- Inline critical CSS, defer everything else
- Use `font-display: swap` for web fonts
- Preconnect to external origins: `<link rel="preconnect" href="https://fonts.googleapis.com" />`

### Measure with:

- [PageSpeed Insights](https://pagespeed.web.dev/)
- Chrome DevTools → Lighthouse tab
- [web.dev/measure](https://web.dev/measure/)

---

## 8. Technical SEO Checklist

| Item                                      | Status |
| ----------------------------------------- | ------ |
| `site` set in `astro.config.mjs`          | ☐      |
| Sitemap generated + submitted to GSC      | ☐      |
| `robots.txt` exists and is correct        | ☐      |
| Canonical tag on every page               | ☐      |
| No duplicate `<title>` tags across pages  | ☐      |
| `<html lang="...">` set                   | ☐      |
| 404 page exists (`src/pages/404.astro`)   | ☐      |
| HTTPS only (no mixed content)             | ☐      |
| Trailing slash consistent across all URLs | ☐      |
| No broken internal links                  | ☐      |
| Images have `alt` text                    | ☐      |
| One `<h1>` per page                       | ☐      |
| og:image is absolute URL, 1200×630px      | ☐      |
| Structured data validated                 | ☐      |
| Core Web Vitals passing (LCP, CLS, INP)   | ☐      |
| Site submitted to Google Search Console   | ☐      |

---

## 9. Google Search Console

Free tool by Google — essential after launch.

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add your property (domain or URL prefix)
3. Verify ownership (HTML tag method easiest in Astro — add to `<head>`)
4. Submit your sitemap URL: `https://yourdomain.com/sitemap-index.xml`
5. Monitor: Coverage errors, Core Web Vitals report, Search queries

---

## 10. Common Mistakes

| Mistake                         | Fix                                              |
| ------------------------------- | ------------------------------------------------ |
| Same `<title>` on every page    | Write unique titles per page                     |
| `og:image` as relative path     | Always use full `https://...` URL                |
| No canonical on paginated pages | Add `rel="canonical"` pointing to page 1 or self |
| Missing `lang` on `<html>`      | `<html lang="en">`                               |
| Blocking CSS/JS in robots.txt   | Never block resources Googlebot needs to render  |
| Thin content pages indexed      | Add `noindex` or beef up the content             |
| No internal links               | Link related content together                    |
| Slow og:image server            | Host images on CDN                               |
