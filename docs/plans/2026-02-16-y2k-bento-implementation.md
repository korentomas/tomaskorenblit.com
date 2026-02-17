# Y2K Bento Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the portfolio as a frosted-glass bento tile grid with MDX blog, where blog tiles expand in-place to fill the viewport with butter-smooth Framer Motion animations.

**Architecture:** Replace the current two-column split layout with a single-page bento grid. Blog posts are MDX files loaded at build time. Clicking a blog tile triggers a `layoutId`-driven expand animation to a full-viewport reading view without a page redirect — URL updates silently via browser history. Framer Motion handles all transitions.

**Tech Stack:** Remix 2.10, React 18, Framer Motion 12, Vite 5, MDX via @mdx-js/rollup, Charter font (system), deployed on Vercel.

---

### Task 1: Install MDX dependencies and configure Vite

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Modify: `tsconfig.json`

**Step 1: Install MDX packages**

Run: `cd /Users/tk/Documents/Personal/remix-portfolio-1 && npm install @mdx-js/rollup @mdx-js/react remark-frontmatter remark-mdx-frontmatter`

**Step 2: Add MDX plugin to Vite config**

In `vite.config.ts`, add the mdx import and plugin:

```ts
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import { vercelPreset } from "@vercel/remix/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

installGlobals();

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    }),
    remix({ presets: [vercelPreset()] }),
    tsconfigPaths(),
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
```

Note: `mdx()` must come BEFORE `remix()` in the plugins array.

**Step 3: Add MDX to tsconfig**

In `tsconfig.json`, add `"**/*.mdx"` to the `include` array:

```json
"include": ["**/*.ts", "**/*.tsx", "**/*.mdx"]
```

**Step 4: Verify build works**

Run: `npm run build`
Expected: Build succeeds with no errors.

**Step 5: Commit**

```bash
git add package.json package-lock.json vite.config.ts tsconfig.json
git commit -m "feat: add MDX support with Vite plugin and frontmatter"
```

---

### Task 2: Create sample MDX blog posts

**Files:**
- Create: `app/blog/hello-world.mdx`
- Create: `app/blog/on-telescopes.mdx`
- Create: `app/blog/quick-note-1.mdx`
- Create: `app/blog/tools-i-use.mdx`
- Create: `app/blog/quick-note-2.mdx`

**Step 1: Create blog directory and first essay**

Create `app/blog/hello-world.mdx`:

```mdx
---
title: "Starting something new"
date: "2026-02-16"
type: "essay"
excerpt: "On rebuilding a personal site and why it matters to have a place that's yours."
---

There is something clarifying about starting over. Not because the old thing was bad, but because you have learned enough to know what you actually want.

This site is that. A place to write, to think out loud, to share what I'm working on. No analytics dashboards, no engagement metrics. Just words on a screen that feels like mine.

I've been thinking about what Kenya Hara calls *emptiness as potential* — the idea that a vessel is useful not because of its walls, but because of the space inside. That's what I want this to be. A container, not a display case.

More soon.
```

**Step 2: Create second essay**

Create `app/blog/on-telescopes.mdx`:

```mdx
---
title: "Building telescopes for everyone"
date: "2026-02-10"
type: "essay"
excerpt: "How 3D printing made astronomy accessible and what I learned along the way."
---

The first telescope I built cost twelve dollars in filament and took six hours to print. It wasn't good. The focuser wobbled, the mirror mount was too tight, and the whole thing looked like it was designed by someone who had never seen a telescope.

It was. I hadn't.

But here's the thing about telescopes: even a bad one shows you Saturn's rings. Even a twelve-dollar one makes a kid gasp. And that gasp — that moment where the universe stops being abstract and becomes *real* — that's worth every failed print.

UNICOPE started as a homework project. It became something I think about every week. The goal is simple: make telescopes so cheap and so easy to build that anyone with a 3D printer can point one at the sky.

We're not there yet. But we're closer than twelve dollars ago.
```

**Step 3: Create short notes**

Create `app/blog/quick-note-1.mdx`:

```mdx
---
title: "Bayesian thinking"
date: "2026-02-12"
type: "note"
excerpt: "Everything is a prior."
---

The best thing about studying Bayesian statistics isn't the math. It's the habit of asking: what did I believe before I saw this evidence? And how much should this change my mind?

Turns out, not as much as you'd think. Most of the time.
```

Create `app/blog/tools-i-use.mdx`:

```mdx
---
title: "Tools that disappeared"
date: "2026-02-05"
type: "note"
excerpt: "The best tools are the ones you forget you're using."
---

Naoto Fukasawa talks about design that dissolves in behavior. I keep a list of tools that do this. Git. A good terminal. A sharp knife. They become invisible, which is the highest compliment.
```

Create `app/blog/quick-note-2.mdx`:

```mdx
---
title: "On shadows"
date: "2026-01-28"
type: "note"
excerpt: "Tanizaki was right about everything."
---

Reading *In Praise of Shadows* while redesigning a website is either very productive or very dangerous. Every CSS value suddenly feels like an aesthetic commitment.
```

**Step 4: Commit**

```bash
git add app/blog/
git commit -m "content: add sample blog posts — essays and notes"
```

---

### Task 3: Create blog post loader utility

**Files:**
- Create: `app/utils/blog.server.ts`

**Step 1: Create the blog loader**

Create `app/utils/blog.server.ts`:

```ts
export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  type: "essay" | "note";
  excerpt: string;
}

// Import all MDX files from the blog directory
const modules = import.meta.glob("../blog/*.mdx", { eager: true });

export function getAllPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  for (const [path, mod] of Object.entries(modules)) {
    const slug = path.replace("../blog/", "").replace(".mdx", "");
    const module = mod as { frontmatter: Omit<BlogPost, "slug"> };

    if (module.frontmatter) {
      posts.push({
        slug,
        ...module.frontmatter,
      });
    }
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPost(slug: string) {
  const path = `../blog/${slug}.mdx`;
  const mod = modules[path] as
    | { frontmatter: Omit<BlogPost, "slug">; default: React.ComponentType }
    | undefined;

  if (!mod) return null;

  return {
    frontmatter: { slug, ...mod.frontmatter },
    Component: mod.default,
  };
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add app/utils/blog.server.ts
git commit -m "feat: add blog post loader with frontmatter parsing"
```

---

### Task 4: Rewrite global.css with new design system

**Files:**
- Rewrite: `app/styles/global.css`

**Step 1: Replace the entire CSS file**

Replace `app/styles/global.css` with the new design system. Key design tokens:

```css
/* Design System */
:root {
  /* Typography — Butterick */
  --font-body: Charter, 'Bitstream Charter', 'Iowan Old Style', Georgia, serif;
  --font-size-body: 18px;
  --line-height-body: 1.4;

  /* Colors — Tanizaki warmth + Y2K frost */
  --bg: #F7F6F3;
  --text: #3A3A38;
  --text-secondary: #8A8A85;
  --accent: #4A90D9;

  /* Tiles — frosted glass */
  --tile-bg: rgba(255, 255, 255, 0.65);
  --tile-border: 1px solid rgba(255, 255, 255, 0.35);
  --tile-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  --tile-shadow-hover: 0 4px 20px rgba(74, 144, 217, 0.08);
  --tile-radius: 16px;
  --tile-gap: 16px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-body);
  font-size: var(--font-size-body);
  line-height: var(--line-height-body);
  color: var(--text);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* Scroll lock when post is expanded */
body.scroll-locked {
  overflow: hidden;
}

/* Bento Grid */
.bento {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(160px, auto);
  gap: var(--tile-gap);
  max-width: 960px;
  margin: 0 auto;
  padding: clamp(16px, 4vw, 48px);
  min-height: 100vh;
  align-content: center;
}

/* Tiles */
.tile {
  background: var(--tile-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: var(--tile-border);
  border-radius: var(--tile-radius);
  box-shadow: var(--tile-shadow);
  padding: clamp(20px, 3vw, 32px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: default;
  transition: box-shadow 0.2s ease-out, transform 0.2s ease-out;
}

.tile--clickable {
  cursor: pointer;
}

.tile--clickable:hover {
  box-shadow: var(--tile-shadow-hover);
  transform: scale(1.015);
}

/* Identity tile — spans 2 columns, row 1 */
.tile--identity {
  grid-column: 1 / 2;
  grid-row: 1 / 3;
}

/* Latest essay — hero position */
.tile--hero {
  grid-column: 2 / 4;
  grid-row: 1 / 3;
}

/* Smaller tiles fill remaining space */
.tile--small {
  grid-column: span 1;
}

/* View all tile */
.tile--viewall {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Identity content */
.identity-name {
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.01em;
  margin-bottom: 0.5rem;
}

.identity-bio {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.4;
  margin-bottom: auto;
}

.identity-links {
  display: flex;
  gap: 1.25rem;
  margin-top: 1.5rem;
}

.identity-links a {
  color: var(--text-secondary);
  transition: color 0.2s ease-out;
  display: flex;
}

.identity-links a:hover {
  color: var(--accent);
}

.identity-links svg {
  width: 20px;
  height: 20px;
}

/* Blog tile content */
.tile-type {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.tile-title {
  font-size: clamp(1.1rem, 1.5vw, 1.3rem);
  font-weight: 600;
  line-height: 1.25;
  margin-bottom: 0.5rem;
}

.tile-excerpt {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.4;
}

.tile-date {
  color: var(--text-secondary);
  font-size: 0.8rem;
  margin-top: auto;
  padding-top: 1rem;
  text-align: right;
}

/* View all link */
.viewall-text {
  font-size: 0.95rem;
  color: var(--text-secondary);
  letter-spacing: 0.02em;
  transition: color 0.2s ease-out;
}

.tile--viewall:hover .viewall-text {
  color: var(--accent);
}

/* Expanded post overlay */
.post-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.post-overlay-bg {
  position: fixed;
  inset: 0;
  background: var(--bg);
  z-index: -1;
}

.post-expanded {
  background: var(--tile-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: var(--tile-radius);
  width: 100%;
  max-width: 680px;
  min-height: 100vh;
  padding: clamp(32px, 6vw, 64px) clamp(24px, 5vw, 48px);
}

/* Close button */
.post-close {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 101;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: var(--tile-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: var(--tile-shadow);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 1.25rem;
  transition: color 0.2s ease-out, box-shadow 0.2s ease-out;
}

.post-close:hover {
  color: var(--text);
  box-shadow: var(--tile-shadow-hover);
}

/* Post content typography — Butterick rules */
.post-header {
  margin-bottom: 2.5rem;
}

.post-meta {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

.post-title {
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

/* MDX rendered content */
.post-content p {
  margin-bottom: 1.25rem;
  max-width: 65ch; /* Butterick: 45-90 chars */
}

.post-content em {
  font-style: italic;
}

.post-content strong {
  font-weight: 600;
}

.post-content h2 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.post-content h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.post-content a {
  color: var(--accent);
  text-decoration: none;
}

.post-content a:hover {
  text-decoration: underline;
}

.post-content blockquote {
  border-left: 2px solid var(--text-secondary);
  padding-left: 1.25rem;
  margin: 1.5rem 0;
  color: var(--text-secondary);
  font-style: italic;
}

.post-content ul,
.post-content ol {
  padding-left: 1.5rem;
  margin-bottom: 1.25rem;
}

.post-content li {
  margin-bottom: 0.5rem;
}

.post-content code {
  font-size: 0.9em;
  background: rgba(0, 0, 0, 0.04);
  padding: 0.15em 0.4em;
  border-radius: 4px;
}

.post-content pre {
  background: rgba(0, 0, 0, 0.04);
  padding: 1.25rem;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 1.25rem;
  font-size: 0.85rem;
  line-height: 1.5;
}

.post-content pre code {
  background: none;
  padding: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .bento {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
    align-content: start;
    padding-top: clamp(24px, 6vw, 48px);
  }

  .tile--identity,
  .tile--hero,
  .tile--small,
  .tile--viewall {
    grid-column: 1;
    grid-row: auto;
  }

  .post-close {
    top: 16px;
    right: 16px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .bento {
    grid-template-columns: repeat(2, 1fr);
  }

  .tile--identity {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }

  .tile--hero {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
  }
}

/* Focus states */
a:focus-visible,
button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

a:focus:not(:focus-visible),
button:focus:not(:focus-visible) {
  outline: none;
}
```

**Step 2: Verify the CSS compiles with Vite**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add app/styles/global.css
git commit -m "style: replace entire CSS with Y2K bento design system"
```

---

### Task 5: Rewrite root.tsx — strip ThemeProvider, update font

**Files:**
- Modify: `app/root.tsx`

**Step 1: Rewrite root.tsx**

Replace `app/root.tsx` with:

```tsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/react";
import styles from "./styles/global.css?url";

export const links = () => [
  { rel: "stylesheet", href: styles },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <Analytics />
      </body>
    </html>
  );
}
```

This removes: ThemeProvider, Google Fonts link (Charter is a system font), theme detection script.

**Step 2: Commit**

```bash
git add app/root.tsx
git commit -m "refactor: strip ThemeProvider and Google Fonts from root"
```

---

### Task 6: Rewrite index route — bento grid with blog tiles

**Files:**
- Rewrite: `app/routes/_index.tsx`

**Step 1: Rewrite the index route**

Replace `app/routes/_index.tsx` with the new bento layout. This is the core of the site — it loads blog posts, renders the tile grid, and handles the expand animation.

```tsx
import type { MetaFunction } from "@vercel/remix";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllPosts, getPost } from "~/utils/blog.server";
import type { BlogPost } from "~/utils/blog.server";

export const loader = async () => {
  const posts = getAllPosts();
  return json({ posts });
};

export const meta: MetaFunction = () => [
  { title: "Tomás Korenblit" },
  {
    name: "description",
    content: "Writing and work by Tomás Korenblit.",
  },
];

export default function Index() {
  const { posts } = useLoaderData<typeof loader>();
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [PostComponent, setPostComponent] = useState<React.ComponentType | null>(null);
  const [postMeta, setPostMeta] = useState<BlogPost | null>(null);

  const openPost = useCallback(async (slug: string) => {
    // Dynamic import of the MDX component
    const mod = await import(`../blog/${slug}.mdx`);
    setPostComponent(() => mod.default);
    setPostMeta(posts.find((p) => p.slug === slug) || null);
    setExpandedSlug(slug);
    document.body.classList.add("scroll-locked");
    window.history.pushState(null, "", `/blog/${slug}`);
  }, [posts]);

  const closePost = useCallback(() => {
    setExpandedSlug(null);
    document.body.classList.remove("scroll-locked");
    window.history.pushState(null, "", "/");
    // Delay clearing component so exit animation plays
    setTimeout(() => {
      setPostComponent(null);
      setPostMeta(null);
    }, 400);
  }, []);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      if (expandedSlug) {
        closePost();
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [expandedSlug, closePost]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && expandedSlug) {
        closePost();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expandedSlug, closePost]);

  const hero = posts[0];
  const rest = posts.slice(1, 5);

  return (
    <>
      <motion.div
        className="bento"
        animate={{ opacity: expandedSlug ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Identity Tile */}
        <div className="tile tile--identity">
          <div>
            <h1 className="identity-name">Tomás Korenblit</h1>
            <p className="identity-bio">
              Building things with data, code, and occasionally 3D-printed
              plastic. Based in Buenos Aires.
            </p>
          </div>
          <div className="identity-links">
            <a href="https://github.com/tomaskorenblit" target="_blank" rel="noreferrer" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
            </a>
            <a href="https://linkedin.com/in/tomaskorenblit" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
            </a>
            <a href="mailto:tomaskorenblit@gmail.com" aria-label="Email">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
            </a>
          </div>
        </div>

        {/* Hero blog tile — latest post */}
        {hero && (
          <motion.div
            className="tile tile--hero tile--clickable"
            layoutId={`tile-${hero.slug}`}
            onClick={() => openPost(hero.slug)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && openPost(hero.slug)}
          >
            <div>
              <span className="tile-type">{hero.type}</span>
              <h2 className="tile-title">{hero.title}</h2>
              <p className="tile-excerpt">{hero.excerpt}</p>
            </div>
            <span className="tile-date">
              {new Date(hero.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </motion.div>
        )}

        {/* Remaining tiles */}
        {rest.map((post) => (
          <motion.div
            key={post.slug}
            className="tile tile--small tile--clickable"
            layoutId={`tile-${post.slug}`}
            onClick={() => openPost(post.slug)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && openPost(post.slug)}
          >
            <div>
              <span className="tile-type">{post.type}</span>
              <h2 className="tile-title">{post.title}</h2>
              <p className="tile-excerpt">{post.excerpt}</p>
            </div>
            <span className="tile-date">
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </motion.div>
        ))}

        {/* View all tile */}
        {posts.length > 5 && (
          <div className="tile tile--small tile--viewall tile--clickable">
            <span className="viewall-text">View all writing →</span>
          </div>
        )}
      </motion.div>

      {/* Expanded post overlay */}
      <AnimatePresence>
        {expandedSlug && (
          <>
            <motion.div
              className="post-overlay-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="post-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                className="post-close"
                onClick={closePost}
                aria-label="Close post"
              >
                ×
              </button>
              <motion.article
                className="post-expanded"
                layoutId={`tile-${expandedSlug}`}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 30,
                }}
              >
                {postMeta && (
                  <header className="post-header">
                    <div className="post-meta">
                      {postMeta.type} ·{" "}
                      {new Date(postMeta.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <h1 className="post-title">{postMeta.title}</h1>
                  </header>
                )}
                <div className="post-content">
                  {PostComponent && <PostComponent />}
                </div>
              </motion.article>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
```

**Step 2: Verify dev server runs**

Run: `npm run dev`
Expected: Site loads at localhost with bento grid visible, blog tiles clickable, expand animation works.

**Step 3: Commit**

```bash
git add app/routes/_index.tsx
git commit -m "feat: bento grid index with tile-expand blog animation"
```

---

### Task 7: Clean up — remove dead code

**Files:**
- Delete: `app/context/ThemeContext.tsx`
- Delete: `app/types/theme.ts`
- Delete: `app/utils/imageOptimizer.ts`
- Delete: `app/routes/edge.tsx`

**Step 1: Delete unused files**

Run:
```bash
rm app/context/ThemeContext.tsx app/types/theme.ts app/utils/imageOptimizer.ts app/routes/edge.tsx
```

**Step 2: Remove sharp from dependencies (no longer needed)**

Run: `npm uninstall sharp`

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds with no missing import errors.

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove ThemeContext, imageOptimizer, edge route, sharp"
```

---

### Task 8: Add direct blog route for shareability

**Files:**
- Create: `app/routes/blog.$slug.tsx`

**Step 1: Create the catch route for /blog/:slug**

Create `app/routes/blog.$slug.tsx`:

```tsx
import type { LoaderFunctionArgs, MetaFunction } from "@vercel/remix";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPost } from "~/utils/blog.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const slug = params.slug;
  if (!slug) throw redirect("/");

  const post = getPost(slug);
  if (!post) throw redirect("/");

  return json({
    frontmatter: post.frontmatter,
    slug,
  });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [{ title: "Tomás Korenblit" }];
  return [
    { title: `${data.frontmatter.title} — Tomás Korenblit` },
    { name: "description", content: data.frontmatter.excerpt },
  ];
};

export default function BlogPost() {
  const { slug, frontmatter } = useLoaderData<typeof loader>();

  // Dynamically render the MDX component
  // We need to use a client-side import since loader can't serialize components
  return <BlogContent slug={slug} frontmatter={frontmatter} />;
}

function BlogContent({
  slug,
  frontmatter,
}: {
  slug: string;
  frontmatter: { title: string; date: string; type: string; excerpt: string };
}) {
  const { useState, useEffect } = require("react");
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    import(`../blog/${slug}.mdx`).then((mod) => {
      setComponent(() => mod.default);
    });
  }, [slug]);

  return (
    <div className="post-overlay" style={{ position: "relative" }}>
      <article className="post-expanded">
        <header className="post-header">
          <div className="post-meta">
            {frontmatter.type} ·{" "}
            {new Date(frontmatter.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <h1 className="post-title">{frontmatter.title}</h1>
        </header>
        <div className="post-content">
          {Component ? <Component /> : null}
        </div>
        <nav style={{ marginTop: "3rem" }}>
          <a href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
            ← Back
          </a>
        </nav>
      </article>
    </div>
  );
}
```

**Step 2: Verify the route works**

Run: `npm run dev`
Navigate to: `http://localhost:5173/blog/hello-world`
Expected: Post renders with proper typography and back link.

**Step 3: Commit**

```bash
git add app/routes/blog.\$slug.tsx
git commit -m "feat: add direct /blog/:slug route for shareability"
```

---

### Task 9: Final polish and verification

**Files:**
- Various touch-ups

**Step 1: Test full flow**

Run: `npm run dev`
Verify:
1. Landing page shows bento grid with identity tile and blog tiles
2. Clicking a blog tile expands it smoothly to full viewport
3. Blog content renders with proper Charter typography
4. Close button and Escape key collapse the post back
5. Browser back button works
6. Direct navigation to /blog/hello-world renders the post
7. Mobile layout stacks tiles in single column
8. Hover effects are subtle (scale 1.015, shadow shift)

**Step 2: Build for production**

Run: `npm run build`
Expected: Clean build, no errors.

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete Y2K bento redesign with MDX blog"
```
