# Blog Posts

This directory contains all blog posts in MDX format. MDX allows you to use JSX components within Markdown, making it perfect for technical writing.

## Adding a New Post

1. Create a new `.mdx` file in this directory
2. Add frontmatter with required metadata
3. Write your content using Markdown
4. The post will automatically appear on the blog page

## Frontmatter Format

```mdx
---
title: "Your Post Title"
description: "A brief description for SEO and preview cards"
date: "2026-01-13"
tags: ["Tag1", "Tag2", "Tag3"]
published: true
---

Your content here...
```

### Required Fields

- `title`: The post title (displayed on the blog and post page)
- `description`: Brief summary for SEO and social sharing
- `date`: Publication date in YYYY-MM-DD format
- `tags`: Array of relevant tags
- `published`: Boolean to control visibility (set to false for drafts)

## Writing Tips

### Code Blocks

Use triple backticks with language specification:

\`\`\`python
def hello():
    print("Hello, world!")
\`\`\`

### Links

- Internal: `[Link text](/path)`
- External: `[Link text](https://example.com)`

### Images

Place images in `/public/blog-images/` and reference them:

```mdx
![Alt text](/blog-images/your-image.png)
```

## Free Maintenance Options

### Option 1: GitHub-based (Current Setup)
- Write MDX files directly in this directory
- Commit and push to deploy
- Free, version-controlled, no external dependencies
- **Best for**: Technical writers comfortable with Git

### Option 2: CMS Integration (Future)
If you want a visual editor, you could add:
- **Tina CMS** (free tier, Git-based)
- **Sanity** (free tier, hosted)
- **Contentful** (free tier, hosted)

For now, the Git-based approach is the simplest and most cost-effective.

## Deployment

Changes are automatically deployed via Vercel:
1. Commit your MDX file to the repo
2. Push to GitHub
3. Vercel rebuilds and deploys
4. Your post is live!

## SEO Features

Your blog posts automatically get:
- ✅ Meta tags for SEO
- ✅ Open Graph tags for social sharing
- ✅ RSS feed generation
- ✅ Sitemap inclusion
- ✅ JSON-LD structured data
- ✅ Reading time calculation

No additional configuration needed!
