# Y2K Bento Redesign + Blog CMS

## Summary

Redesign the portfolio from a two-column split layout into a Dynamic Bento tile grid with frosted-glass Y2K minimalism, adding an MDX-based blog. Tiles expand in-place to full viewport for blog posts using Framer Motion layout animations.

## Inspiration Sources

- **Steve Jobs / Apple (2000-2004):** Hero-driven confidence, one thing per view, negative space as frame, restraint as signal of quality
- **Kenya Hara:** Emptiness as potential (ma), exformation (show just enough to intrigue), warm receptive surfaces
- **Naoto Fukasawa:** "Without Thought" (zero-learning navigation), "Super Normal" (familiar patterns elevated through refinement)
- **Jun'ichiro Tanizaki:** Pensive lustre over shallow brilliance, push back what comes forward too clearly, shadows create beauty
- **Butterick's Practical Typography:** 45-90 char line length, 15-25px body, 120-145% line height, modest heading increments, dark gray not pure black

## Layout: Dynamic Bento Grid

```
┌───────────────────┬─────────────────┐
│                   │                 │
│  TOMÁS KORENBLIT  │  Latest essay   │
│  bio line         │  title          │
│                   │  excerpt...     │
│  GH · LI · ✉     │            date │
│                   │                 │
├─────────┬─────────┴─────────────────┤
│         │                           │
│  Note   │   Second essay            │
│  (small)│   (medium, receding)      │
│         │                           │
├─────────┼──────────┬────────────────┤
│         │          │                │
│  Note   │  Note    │  View all →    │
│         │          │                │
└─────────┴──────────┴────────────────┘
```

Mobile: single-column stack. Tablet: 2 columns. Desktop: full bento.

## Typography

- Font: Charter (Bitstream Charter, Iowan Old Style, Georgia fallback)
- Body: 18px, line-height 1.4
- Text color: #3A3A38 (warm dark gray)
- Secondary/metadata: #8A8A85
- Heading weight: 600, sizes 1.15-1.3x body
- Letter-spacing on caps: 0.08em
- Left-aligned, no centered body text
- text-rendering: optimizeLegibility

## Color Palette

- Background: #F7F6F3 (warm paper)
- Tile: rgba(255,255,255,0.65) + backdrop-filter: blur(16px)
- Tile border: 1px solid rgba(255,255,255,0.35)
- Tile shadow: 0 2px 12px rgba(0,0,0,0.04)
- Accent (links only): #4A90D9
- Hover glow: 0 4px 20px rgba(74,144,217,0.08)

## Animation

- Tile expand: Framer Motion layoutId, spring(stiffness:200, damping:30)
- Other tiles: opacity → 0 over 200ms
- Blog content: fade in at ~80% expansion
- Hover: scale 1.015, shadow deepens, 200ms ease-out
- Body scroll lock when expanded
- Close: reverse animation

## Blog / MDX

- MDX files in app/blog/ with frontmatter: title, date, type (essay|note), excerpt
- @mdx-js/rollup for Vite integration
- Route: /blog/:slug renders MDX
- But primary interaction is tile-expand on index, not direct navigation
- URL updates via Remix for shareability

## Content (simplified)

- Identity tile: name, one-line bio, three social links inline
- Blog tiles: title, type label, one-line excerpt, date (bottom-right, muted)
- "View all" tile: minimal text link
- No project cards, no skills section, no detailed bio

## Tech Stack Changes

- Add: @mdx-js/rollup, @mdx-js/react (or remark/rehype plugins)
- Keep: Remix, Framer Motion (already installed), Vite
- Remove: ThemeContext (no dark/light toggle), imageOptimizer (no profile image), edge route
- Charter font: self-hosted or system (available on macOS/iOS natively)
