# Projects, Tags & Filtering — Design

**Date:** 2026-02-25
**Status:** Approved

## Goal

Add project showcase capability, a category/tag taxonomy, and filtering to the existing bento grid. Everything stays in one unified grid — projects are just a richer post type.

## Data Model

Extend `BlogPost` frontmatter:

```yaml
type: "essay" | "note" | "project"     # new project type
category: "bayesian"                     # required — broad topic from fixed set
tags: ["pymc", "prior-elicitation"]      # optional — freeform granular tags
repo?: "https://github.com/..."          # project-only — source code link
demo?: "https://..."                     # project-only — live demo link
status?: "active" | "archived"           # project-only — current state
```

### Categories (fixed set in site-config)

Define in `CATEGORIES` array: `bayesian`, `causal-inference`, `engineering`, `data-science`, `personal`. Each has a label and slug. List is the single source of truth — filter UI derives from it.

### Tags

Freeform strings in frontmatter. Collected at build time from all posts. No predefined list — they emerge from content.

### Back-fill

Existing posts get `category` added. Tags are optional and added where relevant.

## Visual Treatment

### Project tiles in the grid

- Default layout: `wide` (same as essays)
- Type badge reads `project` instead of `essay`/`note`, styled with tile accent color
- Repo and demo links: small icon-buttons in the tile footer beside the date
- Status pill: `active` = green dot + text, `archived` = muted. Subtle, not dominant
- Same shader/cover/hue system as other tiles

### All tiles in the grid

- Type badge gains category context: `essay · bayesian`
- Tags are NOT shown on tile face (too noisy)

### Expanded post overlay

- Metadata bar under title: repo link, demo link, status, tags (all inline)
- Tags rendered as clickable pills that filter the grid on click
- On narrow screens, metadata bar stacks vertically

## Filter Bar

### Placement

Between identity tile and blog tiles. Spans all 3 grid columns. Single horizontal row of pills. Visually minimal — no background, no border.

### Behavior

- "All" pill first (default selected), then category pills, `|` divider, then tag pills
- Tags sorted by frequency, only shown if they exist on at least one post
- Click to filter, click again to clear. One filter at a time (category OR tag)
- Filtered-out tiles fade + scale-down via `AnimatePresence`, remaining tiles reflow with `layout` animation
- URL updates: `/?tag=bayesian` or `/?category=causal-inference` — shareable, loads from URL on mount
- Pills show post count: `bayesian (4)`. Pills with 0 posts are hidden
- On mobile: horizontal scroll with active pill auto-scrolled into view

## Accessibility (WCAG 2.1 AA)

### Interactive elements

- All tag pills, repo/demo links, status pills get descriptive `aria-label`s
- Tag pills: `role="button"`, `tabIndex={0}`, keyboard activation (Enter/Space)
- Active filter: `aria-pressed="true"`
- Grid updates announced via `aria-live="polite"` region: "Showing N posts"
- Status indicators never rely on color alone — paired with text

### Focus & navigation

- `focus-visible` outlines on all interactive elements using `var(--accent)`
- Skip link: "Skip to content" at top of page, jumps to grid
- Filter bar wrapped in `<nav aria-label="Filter posts">`
- Tag pills are `<button>` elements
- Repo/demo links are `<a target="_blank" rel="noopener noreferrer">`

### Responsive

- Filter bar: horizontal scroll on mobile, scroll fade on edges
- Repo/demo icon-buttons: min 44x44px touch target
- Metadata in overlay: stacks vertically on narrow screens
- Project tiles: full-width on mobile (same as `wide`)
- Filter bar hidden when only one category exists

## Semantic HTML

- Filter bar: `<nav aria-label="Filter posts">`
- Tag pills: `<button>` not `<div>` or `<span>`
- Repo/demo: `<a>` with proper rel attributes
- Skip link: `<a href="#content" class="skip-link">`
- Grid region: `<main id="content">`

## Files to modify

- `app/utils/blog.server.ts` — extend BlogPost interface
- `app/utils/site-config.ts` — add CATEGORIES array
- `app/routes/_index.tsx` — filter bar, URL state, AnimatePresence for filtering, skip link
- `app/styles/global.css` — filter bar styles, project tile variants, skip link, tag pills
- `app/components/PostArticle.tsx` — project metadata bar, clickable tags
- `app/components/FilterBar.tsx` — new component
- `app/blog/*.mdx` — back-fill category/tags on existing posts
- `app/root.tsx` — add skip link target

## Out of scope

- Interactive demo components (future per-project work)
- Full-text search (unnecessary at current post count)
- Multi-filter (category AND tag simultaneously)
- Tag management UI
