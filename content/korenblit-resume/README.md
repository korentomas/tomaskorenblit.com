# Korenblit Resume Builder

## Design Philosophy
Japanese minimalist principles applied to resume design:
- **Ma (間)** — Intentional whitespace as active design element
- **Kanso (簡素)** — Every element earns its place
- **Shibui (渋い)** — Subtle sophistication, high contrast with restraint

Inspired by Josh Puckett's product design approach: clarity of purpose, bold typography, functional beauty.

## Usage

```bash
npm install docx
node build_resume.cjs [output_path]
```

Default output: `./Korenblit_Resume_2026.docx`

## Customization
The script is organized into clearly labeled sections:
- **PALETTE** — Colors (single accent + neutrals)
- **TYPOGRAPHY** — Font choices
- **SPACING** — Page margins and column proportions
- **DESIGN COMPONENTS** — Reusable formatting functions
- **CONTENT** — All resume text (easy to edit)

## Dependencies
- `docx` (npm package, v9+)
- Node.js 18+
