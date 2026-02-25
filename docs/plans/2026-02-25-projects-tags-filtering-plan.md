# Projects, Tags & Filtering Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add project post type, category/tag taxonomy, and a filter bar to the bento grid with full WCAG 2.1 AA accessibility.

**Architecture:** Extend the BlogPost interface with category, tags, and project-specific fields. Build a FilterBar component that reads/writes URL search params. Use Framer Motion layout animations for smooth tile reflow on filter changes.

**Tech Stack:** Remix (loader + useSearchParams), Framer Motion (AnimatePresence + layout), CSS custom properties (oklch), WCAG 2.1 AA

---

### Task 1: Extend BlogPost data model

**Files:**
- Modify: `app/utils/blog.server.ts`
- Modify: `app/utils/site-config.ts`

**Step 1: Update the BlogPost interface**

In `app/utils/blog.server.ts`, change the type union and add new fields:

```typescript
export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  type: "essay" | "note" | "project";
  excerpt: string;
  category: string;
  tags?: string[];
  shader?: string;
  shaderColors?: string[];
  hue?: number;
  cover?: string;
  layout?: "wide" | "tall" | "small";
  static?: boolean;
  repo?: string;
  demo?: string;
  status?: "active" | "archived";
}
```

**Step 2: Add CATEGORIES to site-config**

In `app/utils/site-config.ts`, add after the `SOCIAL_LINKS` export:

```typescript
export const CATEGORIES = [
  { slug: "bayesian", label: "Bayesian" },
  { slug: "causal-inference", label: "Causal Inference" },
  { slug: "engineering", label: "Engineering" },
  { slug: "data-science", label: "Data Science" },
  { slug: "personal", label: "Personal" },
] as const;
```

**Step 3: Add helper to collect all tags from posts**

In `app/utils/blog.server.ts`, add after `getPost`:

```typescript
export function getAllTags(posts: BlogPost[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}
```

**Step 4: Build and verify**

Run: `npx vite build 2>&1 | tail -5`
Expected: Build succeeds (no posts use `category` yet, it's typed as required but frontmatter spread will include it once we backfill)

**Step 5: Commit**

```bash
git add app/utils/blog.server.ts app/utils/site-config.ts
git commit -m "feat: extend BlogPost with project type, category, tags"
```

---

### Task 2: Back-fill existing posts with categories and tags

**Files:**
- Modify: `app/blog/hello-world.mdx`
- Modify: `app/blog/on-telescopes.mdx`
- Modify: `app/blog/build-night.mdx`
- Modify: `app/blog/quick-note-1.mdx`
- Modify: `app/blog/quick-note-2.mdx`
- Modify: `app/blog/tools-i-use.mdx`

**Step 1: Add category and tags to each post**

Add `category` (required) and `tags` (optional) to each post's frontmatter:

`hello-world.mdx`:
```yaml
category: "personal"
tags: ["meta", "remix"]
```

`on-telescopes.mdx`:
```yaml
category: "engineering"
tags: ["3d-printing", "optics"]
```

`build-night.mdx`:
```yaml
category: "engineering"
tags: ["hackathon", "gamedev"]
```

`quick-note-1.mdx` (Bayesian thinking):
```yaml
category: "bayesian"
```

`quick-note-2.mdx` (On shadows):
```yaml
category: "personal"
```

`tools-i-use.mdx`:
```yaml
category: "engineering"
tags: ["tools"]
```

**Step 2: Build and verify**

Run: `npx vite build 2>&1 | tail -5`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add app/blog/*.mdx
git commit -m "feat: back-fill categories and tags on existing posts"
```

---

### Task 3: Build the FilterBar component

**Files:**
- Create: `app/components/FilterBar.tsx`
- Modify: `app/styles/global.css`

**Step 1: Create the FilterBar component**

Create `app/components/FilterBar.tsx`:

```tsx
import type { BlogPost } from "~/utils/blog.server";
import { CATEGORIES } from "~/utils/site-config";
import { getAllTags } from "~/utils/blog.server";

interface FilterBarProps {
  posts: BlogPost[];
  activeFilter: { type: "category" | "tag"; value: string } | null;
  onFilter: (filter: { type: "category" | "tag"; value: string } | null) => void;
}

export function FilterBar({ posts, activeFilter, onFilter }: FilterBarProps) {
  const categoryCounts = new Map<string, number>();
  for (const post of posts) {
    if (post.category) {
      categoryCounts.set(post.category, (categoryCounts.get(post.category) ?? 0) + 1);
    }
  }

  const visibleCategories = CATEGORIES.filter((c) => (categoryCounts.get(c.slug) ?? 0) > 0);
  const tags = getAllTags(posts);

  // Don't render if only one category and no tags
  if (visibleCategories.length <= 1 && tags.length === 0) return null;

  const isActive = (type: "category" | "tag", value: string) =>
    activeFilter?.type === type && activeFilter.value === value;

  const handleClick = (type: "category" | "tag", value: string) => {
    if (isActive(type, value)) {
      onFilter(null);
    } else {
      onFilter({ type, value });
    }
  };

  return (
    <nav className="filter-bar" aria-label="Filter posts">
      <div className="filter-bar-scroll">
        <button
          className={`filter-pill${!activeFilter ? " filter-pill--active" : ""}`}
          onClick={() => onFilter(null)}
          aria-pressed={!activeFilter}
        >
          All ({posts.length})
        </button>

        {visibleCategories.map((cat) => (
          <button
            key={cat.slug}
            className={`filter-pill${isActive("category", cat.slug) ? " filter-pill--active" : ""}`}
            onClick={() => handleClick("category", cat.slug)}
            aria-pressed={isActive("category", cat.slug)}
            aria-label={`Filter by ${cat.label}`}
          >
            {cat.label} ({categoryCounts.get(cat.slug) ?? 0})
          </button>
        ))}

        {tags.length > 0 && (
          <>
            <span className="filter-divider" aria-hidden="true" />
            {tags.map(({ tag, count }) => (
              <button
                key={tag}
                className={`filter-pill filter-pill--tag${isActive("tag", tag) ? " filter-pill--active" : ""}`}
                onClick={() => handleClick("tag", tag)}
                aria-pressed={isActive("tag", tag)}
                aria-label={`Filter by ${tag}`}
              >
                {tag} ({count})
              </button>
            ))}
          </>
        )}
      </div>
    </nav>
  );
}
```

**Step 2: Add FilterBar CSS**

In `app/styles/global.css`, add before the `/* Responsive */` section:

```css
/* Filter bar */
.filter-bar {
  grid-column: 1 / -1;
  overflow: hidden;
  position: relative;
}

.filter-bar-scroll {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  padding: 0.25rem 0;
  mask-image: linear-gradient(to right, transparent, black 8px, black calc(100% - 8px), transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 8px, black calc(100% - 8px), transparent);
}

.filter-bar-scroll::-webkit-scrollbar {
  display: none;
}

.filter-pill {
  flex-shrink: 0;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  border: 1px solid oklch(0 0 0 / 0.08);
  background: var(--tile-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  font-family: var(--font-body);
  font-size: 0.8rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease-out;
  white-space: nowrap;
  min-height: 44px;
  display: flex;
  align-items: center;
}

.filter-pill:hover {
  color: var(--text);
  border-color: oklch(0 0 0 / 0.15);
}

.filter-pill--active {
  background: var(--text);
  color: var(--bg);
  border-color: var(--text);
}

.filter-pill--active:hover {
  color: var(--bg);
}

[data-theme="dark"] .filter-pill {
  border-color: oklch(1 0 0 / 0.1);
}

[data-theme="dark"] .filter-pill:hover {
  border-color: oklch(1 0 0 / 0.2);
}

[data-theme="dark"] .filter-pill--active {
  background: var(--text);
  color: var(--bg);
  border-color: var(--text);
}

.filter-pill--tag {
  font-style: italic;
}

.filter-divider {
  flex-shrink: 0;
  width: 1px;
  height: 20px;
  background: oklch(0 0 0 / 0.1);
  align-self: center;
}

[data-theme="dark"] .filter-divider {
  background: oklch(1 0 0 / 0.1);
}
```

**Step 3: Add responsive styles for filter bar**

In the `@media (max-width: 768px)` block, add:

```css
.filter-bar {
  grid-column: 1 / 3;
}
```

In the `@media (min-width: 769px) and (max-width: 1024px)` block, add:

```css
.filter-bar {
  grid-column: 1 / 3;
}
```

**Step 4: Build and verify**

Run: `npx vite build 2>&1 | tail -5`
Expected: Build succeeds (component not yet imported)

**Step 5: Commit**

```bash
git add app/components/FilterBar.tsx app/styles/global.css
git commit -m "feat: add FilterBar component with accessible pill design"
```

---

### Task 4: Integrate FilterBar into the homepage

**Files:**
- Modify: `app/routes/_index.tsx`

**Step 1: Add imports and URL state**

Add to imports:
```typescript
import { useSearchParams } from "@remix-run/react";
import { FilterBar } from "~/components/FilterBar";
```

**Step 2: Add filter state using URL search params**

Inside `Index()`, after the `useLoaderData` call, add:

```typescript
const [searchParams, setSearchParams] = useSearchParams();
const activeFilter = (() => {
  const category = searchParams.get("category");
  const tag = searchParams.get("tag");
  if (category) return { type: "category" as const, value: category };
  if (tag) return { type: "tag" as const, value: tag };
  return null;
})();

const handleFilter = useCallback((filter: { type: "category" | "tag"; value: string } | null) => {
  if (!filter) {
    setSearchParams({});
  } else {
    setSearchParams({ [filter.type]: filter.value });
  }
}, [setSearchParams]);
```

**Step 3: Filter the visible posts**

Replace `const visiblePosts = posts.slice(0, MAX_VISIBLE_POSTS);` with:

```typescript
const filteredPosts = activeFilter
  ? posts.filter((post) => {
      if (activeFilter.type === "category") return post.category === activeFilter.value;
      if (activeFilter.type === "tag") return post.tags?.includes(activeFilter.value);
      return true;
    })
  : posts;
const visiblePosts = filteredPosts.slice(0, MAX_VISIBLE_POSTS);
```

**Step 4: Add FilterBar to the JSX**

In the bento grid, between the Identity Tile closing `</div>` and the `{/* Blog tiles */}` comment, add:

```tsx
<FilterBar posts={posts} activeFilter={activeFilter} onFilter={handleFilter} />

{/* Live region for screen readers */}
<div className="sr-only" aria-live="polite" role="status">
  {activeFilter
    ? `Showing ${filteredPosts.length} post${filteredPosts.length !== 1 ? "s" : ""}`
    : `Showing all ${posts.length} posts`}
</div>
```

**Step 5: Update MAX_VISIBLE_POSTS logic**

When filtering is active, show ALL matching posts (don't cap at 5). Change:

```typescript
const visiblePosts = filteredPosts.slice(0, activeFilter ? filteredPosts.length : MAX_VISIBLE_POSTS);
```

Also update the "View all" tile condition to hide when filtering:

```tsx
{!activeFilter && posts.length > MAX_VISIBLE_POSTS && (
```

**Step 6: Add Framer Motion layout animation to tiles**

Change `layout={false}` on each `<motion.div>` tile to `layout="position"` so tiles reflow smoothly when filtering. This animates position but not size, avoiding layout thrash.

**Step 7: Add sr-only CSS utility**

In `app/styles/global.css`, add at the end:

```css
/* Screen reader only — visually hidden but accessible */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

**Step 8: Build and verify**

Run: `npx vite build 2>&1 | tail -5`
Expected: Build succeeds

**Step 9: Commit**

```bash
git add app/routes/_index.tsx app/styles/global.css
git commit -m "feat: integrate FilterBar with URL-based filtering and layout animation"
```

---

### Task 5: Update tile type badge to show category

**Files:**
- Modify: `app/routes/_index.tsx`
- Modify: `app/utils/site-config.ts`

**Step 1: Add category label lookup helper**

In `app/utils/site-config.ts`, add:

```typescript
export const CATEGORY_LABELS = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c.label])
) as Record<string, string>;
```

**Step 2: Update tile type badge in _index.tsx**

Import `CATEGORY_LABELS` and change the tile type badge from:

```tsx
<span className="tile-type">{post.type}</span>
```

to:

```tsx
<span className="tile-type">
  {post.type}{post.category && ` · ${CATEGORY_LABELS[post.category] ?? post.category}`}
</span>
```

**Step 3: Build and verify**

Run: `npx vite build 2>&1 | tail -5`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add app/routes/_index.tsx app/utils/site-config.ts
git commit -m "feat: show category label in tile type badge"
```

---

### Task 6: Project tile enhancements (repo/demo links, status pill)

**Files:**
- Modify: `app/routes/_index.tsx`
- Modify: `app/styles/global.css`

**Step 1: Add project footer links to tiles**

In `_index.tsx`, update the tile footer area. Replace the tile-date span block with a footer that conditionally shows repo/demo links for projects:

```tsx
<div className="tile-footer">
  {post.type === "project" && (
    <span className="tile-project-links">
      {post.status && (
        <span className={`tile-status tile-status--${post.status}`} aria-label={`Project status: ${post.status}`}>
          <span className="tile-status-dot" aria-hidden="true" />
          {post.status}
        </span>
      )}
      {post.repo && (
        <a href={post.repo} target="_blank" rel="noopener noreferrer" aria-label={`${post.title} source code on GitHub`} className="tile-link-icon" onClick={(e) => e.stopPropagation()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
        </a>
      )}
      {post.demo && (
        <a href={post.demo} target="_blank" rel="noopener noreferrer" aria-label={`${post.title} live demo`} className="tile-link-icon" onClick={(e) => e.stopPropagation()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
        </a>
      )}
    </span>
  )}
  <span className="tile-date">
    {new Date(post.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}
  </span>
</div>
```

**Step 2: Add project tile CSS**

In `app/styles/global.css`, add before the `/* Responsive */` section:

```css
/* Tile footer — date + project links */
.tile-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 1rem;
}

.tile-footer .tile-date {
  margin-top: 0;
  padding-top: 0;
}

.tile-project-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tile-link-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  padding: 0.5rem;
  color: var(--text-secondary);
  border-radius: 8px;
  transition: color 0.15s ease-out, background 0.15s ease-out;
}

.tile-link-icon:hover {
  color: var(--accent);
  background: oklch(0 0 0 / 0.04);
}

[data-theme="dark"] .tile-link-icon:hover {
  background: oklch(1 0 0 / 0.06);
}

/* Status pill */
.tile-status {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-secondary);
}

.tile-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-secondary);
}

.tile-status--active .tile-status-dot {
  background: oklch(0.65 0.2 145);
}

.tile-status--archived .tile-status-dot {
  background: var(--text-secondary);
}
```

**Step 3: Update tileSize default for projects**

In `_index.tsx`, update the `tileSize` function:

```typescript
const tileSize = (post: BlogPost): "wide" | "tall" | "small" => {
  if (post.layout) return post.layout;
  if (post.type === "essay" || post.type === "project") return "wide";
  return "small";
};
```

**Step 4: Build and verify**

Run: `npx vite build 2>&1 | tail -5`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add app/routes/_index.tsx app/styles/global.css
git commit -m "feat: project tile footer with repo/demo links and status pill"
```

---

### Task 7: Update PostArticle for project metadata and clickable tags

**Files:**
- Modify: `app/components/PostArticle.tsx`
- Modify: `app/styles/global.css`

**Step 1: Add project metadata bar and tags to PostArticle**

Update PostArticle to accept an optional `onTagClick` callback and render project metadata + tags:

Add to the `PostArticleProps` interface:
```typescript
onTagClick?: (filter: { type: "category" | "tag"; value: string }) => void;
```

After the `<h1>` in the header, add:

```tsx
{/* Project metadata bar */}
{frontmatter.type === "project" && (frontmatter.repo || frontmatter.demo || frontmatter.status) && (
  <div className="post-project-meta">
    {frontmatter.status && (
      <span className={`tile-status tile-status--${frontmatter.status}`} aria-label={`Project status: ${frontmatter.status}`}>
        <span className="tile-status-dot" aria-hidden="true" />
        {frontmatter.status}
      </span>
    )}
    {frontmatter.repo && (
      <a href={frontmatter.repo} target="_blank" rel="noopener noreferrer" className="post-project-link" aria-label="View source code on GitHub">
        GitHub ↗
      </a>
    )}
    {frontmatter.demo && (
      <a href={frontmatter.demo} target="_blank" rel="noopener noreferrer" className="post-project-link" aria-label="View live demo">
        Demo ↗
      </a>
    )}
  </div>
)}
```

After the Comments component, add tag pills:

```tsx
{frontmatter.tags && frontmatter.tags.length > 0 && (
  <div className="post-tags">
    {frontmatter.tags.map((tag) => (
      <button
        key={tag}
        className="post-tag-pill"
        onClick={() => onTagClick?.({ type: "tag", value: tag })}
        aria-label={`Filter by ${tag}`}
      >
        {tag}
      </button>
    ))}
  </div>
)}
```

**Step 2: Add CSS for project metadata and tags**

In `app/styles/global.css`, add after the `.post-title` rule:

```css
/* Project metadata bar */
.post-project-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.post-project-link {
  font-size: 0.8rem;
  color: var(--accent);
  text-decoration: none;
  transition: opacity 0.15s ease-out;
}

.post-project-link:hover {
  opacity: 0.7;
}

/* Post tags */
.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid oklch(0 0 0 / 0.06);
}

.post-tag-pill {
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  border: 1px solid oklch(0 0 0 / 0.08);
  background: transparent;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-style: italic;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease-out;
  min-height: 44px;
  display: flex;
  align-items: center;
}

.post-tag-pill:hover {
  color: var(--accent);
  border-color: var(--accent);
}

[data-theme="dark"] .post-tag-pill {
  border-color: oklch(1 0 0 / 0.1);
}

[data-theme="dark"] .post-tags {
  border-top-color: oklch(1 0 0 / 0.06);
}

@media (max-width: 768px) {
  .post-project-meta {
    flex-direction: column;
    align-items: flex-start;
  }
}
```

**Step 3: Wire onTagClick in _index.tsx**

Pass the callback to PostArticle in the overlay:

```tsx
<PostArticle
  frontmatter={postMeta!}
  slug={expandedSlug}
  Component={PostComponent}
  onBack={closePost}
  onTagClick={(filter) => {
    closePost();
    handleFilter(filter);
  }}
/>
```

**Step 4: Wire onTagClick in blog.$slug.tsx**

In the dedicated route, tag clicks navigate home with the filter param:

Add `useNavigate` import and wire it:

```tsx
import { useNavigate } from "@remix-run/react";

// In component:
const navigate = useNavigate();

// In JSX:
<PostArticle
  frontmatter={frontmatter as BlogPost}
  slug={slug}
  Component={Component}
  onTagClick={(filter) => navigate(`/?${filter.type}=${filter.value}`)}
/>
```

**Step 5: Build and verify**

Run: `npx vite build 2>&1 | tail -5`
Expected: Build succeeds

**Step 6: Commit**

```bash
git add app/components/PostArticle.tsx app/routes/_index.tsx app/routes/blog.\$slug.tsx app/styles/global.css
git commit -m "feat: project metadata bar and clickable tag pills in post overlay"
```

---

### Task 8: Add skip link for accessibility

**Files:**
- Modify: `app/root.tsx`
- Modify: `app/routes/_index.tsx`
- Modify: `app/styles/global.css`

**Step 1: Add skip link in root.tsx**

In `app/root.tsx`, add as the first child of `<body>`:

```tsx
<a href="#content" className="skip-link">Skip to content</a>
```

**Step 2: Add content landmark in _index.tsx**

Add `id="content"` to the bento grid's `<motion.div>`:

```tsx
<motion.div className="bento" id="content" ...>
```

**Step 3: Add skip link CSS**

In `app/styles/global.css`, add after the `.sr-only` rule:

```css
/* Skip link */
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  padding: 0.75rem 1.5rem;
  background: var(--text);
  color: var(--bg);
  font-size: 0.9rem;
  z-index: 300;
  text-decoration: none;
  border-radius: 0 0 var(--tile-radius) 0;
}

.skip-link:focus {
  top: 0;
}
```

**Step 4: Build and verify**

Run: `npx vite build 2>&1 | tail -5`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add app/root.tsx app/routes/_index.tsx app/styles/global.css
git commit -m "feat: add skip link and content landmark for accessibility"
```

---

### Task 9: Final build verification and integration test

**Step 1: Full build**

Run: `npx vite build 2>&1`
Expected: Build succeeds with no warnings

**Step 2: Run existing tests**

Run: `npx playwright test 2>&1 | tail -20`
Expected: Existing tests still pass (may need minor updates if tile count checks are strict)

**Step 3: Manual verification checklist**

- [ ] Filter bar appears between identity tile and blog tiles
- [ ] Clicking a category pill filters tiles with smooth animation
- [ ] Clicking the active pill deselects it (shows all)
- [ ] URL updates with `?category=X` or `?tag=X`
- [ ] Loading a URL with filter params pre-selects the filter
- [ ] Screen reader announces filter changes via aria-live region
- [ ] Tab through filter pills — focus outlines visible
- [ ] Type badge shows `essay · Personal` format
- [ ] Static tiles remain non-interactive
- [ ] Filter bar scrolls horizontally on mobile with no overflow

**Step 4: Commit any test fixes**

```bash
git add -A
git commit -m "fix: update tests for projects and filtering integration"
```
