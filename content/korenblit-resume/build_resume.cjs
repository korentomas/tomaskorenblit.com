const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType,
  ExternalHyperlink, TabStopType, TabStopPosition,
} = require("docx");

// ============================================================
// DESIGN PHILOSOPHY
// ============================================================
// Inspired by Japanese minimalism (ma, kanso, shibui) and
// Josh Puckett's product design sensibility:
//
// MA (間)   — Intentional whitespace. Space is not absence,
//             it is an active design element. Generous margins,
//             breathing room between sections.
//
// KANSO (簡素) — Simplicity. Every element earns its place.
//                No decorative noise. Clean hierarchy.
//
// SHIBUI (渋い) — Subtle sophistication. High contrast with
//                  restraint. One accent color, used sparingly.
//                  Typography does the heavy lifting.
//
// Josh Puckett's approach: clarity of purpose, bold typography,
// functional beauty, nothing flashy but everything intentional.
// ============================================================

// --- PALETTE ---
// Warm, restrained. Matches the portfolio's Tanizaki warmth.
// One accent (ai-iro indigo), everything else warm neutral.
const INK = "2D2D2B";       // Warm near-black — not pure black, it breathes
const STONE = "55524E";     // Warm dark gray — earthy, not clinical
const MIST = "8A8785";      // Warm medium gray — for dates, tertiary
const CLOUD = "D5D2CC";     // Warm light gray — subtle dividers
const ACCENT = "3D5167";    // Ai-iro (藍色) — deep indigo slate, used sparingly

// --- TYPOGRAPHY ---
// Georgia throughout — kanso. One font, one voice.
// Warmth, humanity, gravitas. Matches the portfolio's serif soul.
const DISPLAY_FONT = "Georgia";
const BODY_FONT = "Georgia";

// --- SPACING (DXA units, 1440 = 1 inch) ---
const PAGE_W = 12240;       // US Letter
const PAGE_H = 15840;
const MARGIN_TOP = 1080;    // 0.75" — generous top margin
const MARGIN_BOTTOM = 900;  // 0.625"
const MARGIN_LEFT = 1200;   // ~0.83"
const MARGIN_RIGHT = 1200;
const CONTENT_W = PAGE_W - MARGIN_LEFT - MARGIN_RIGHT; // 9840

// Two-column: left (experience) gets ~63%, right (meta) gets ~37%
const LEFT_W = 6200;
const GAP = 400;            // Column gap — ma between columns
const RIGHT_W = CONTENT_W - LEFT_W - GAP; // 3240

const noBorder = { style: BorderStyle.NONE, size: 0 };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

// ============================================================
// DESIGN COMPONENTS
// ============================================================

// Section heading — quiet authority, thin rule below
// Color is STONE not ACCENT — shibui: reserve accent for one moment
function sectionTitle(text, { first = false } = {}) {
  return new Paragraph({
    spacing: { before: first ? 40 : 300, after: 100 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: CLOUD, space: 4 } },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 17,           // 8.5pt — quiet, not shouting
        color: STONE,
        font: BODY_FONT,
        characterSpacing: 60, // Gentle tracking — ma, not megaphone
      }),
    ],
  });
}

// Job title — bold, clear hierarchy, generous ma above
function roleTitle(text) {
  return new Paragraph({
    spacing: { before: 180, after: 0 },
    children: [
      new TextRun({ text, bold: true, size: 19, color: INK, font: BODY_FONT }),
    ],
  });
}

// Company + date on same line, separated by pipe
function roleMeta(company, date) {
  return new Paragraph({
    spacing: { before: 20, after: 50 },
    children: [
      new TextRun({ text: company, size: 16, color: STONE, font: BODY_FONT }),
      new TextRun({ text: `  \u00B7  ${date}`, size: 16, color: MIST, font: BODY_FONT }),
    ],
  });
}

// Bullet — standard dot, invisible by design
function bullet(text) {
  return new Paragraph({
    spacing: { before: 30, after: 30 },
    indent: { left: 180, hanging: 180 },
    children: [
      new TextRun({ text: "\u2022  ", size: 16, color: MIST, font: BODY_FONT }),
      new TextRun({ text, size: 16, color: STONE, font: BODY_FONT }),
    ],
  });
}

// Sidebar section label — quieter tracking than main headings
function sidebarLabel(text) {
  return new Paragraph({
    spacing: { before: 200, after: 40 },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 15,
        color: STONE,
        font: BODY_FONT,
        characterSpacing: 40,
      }),
    ],
  });
}

// Sidebar body text
function sidebarText(text) {
  return new Paragraph({
    spacing: { before: 0, after: 20 },
    children: [
      new TextRun({ text, size: 15, color: STONE, font: BODY_FONT }),
    ],
  });
}

// ============================================================
// CONTENT
// ============================================================

const leftContent = [
  sectionTitle("Experience", { first: true }),

  roleTitle("Partner, Data Scientist & Full-Stack Engineer"),
  roleMeta("Ascendancy", "Jan 2026 \u2013 Present"),
  bullet("Building a network intelligence platform that maps and scores relationship paths for institutional clients\u2014from investor dinners to Fortune 500 event targeting."),
  bullet("Designed LinkedIn data ingestion backend, email connection pipeline, and investment data import system powering network analysis."),
  bullet("Established engineering foundations: CI/CD pipelines, development standards, and automated workflows for a greenfield team."),

  roleTitle("Software Engineer"),
  roleMeta("Invisible Technologies", "Jun \u2013 Dec 2025"),
  bullet("Shipped an interactive AI-assisted interface design platform for RLHF, serving Google, Meta, Anthropic, and OpenAI."),
  bullet("Built versioning, self-healing features, and GCP integration for batch/campaign bucket management."),

  roleTitle("Coding QC Analyst & AI Data Trainer"),
  roleMeta("Invisible Technologies", "Dec 2022 \u2013 Jun 2025"),
  bullet("Created dashboards (Looker, Apps Script, Python) to validate coding training data\u2014adopted company-wide for daily workflows."),
  bullet("Oversaw quality for 150+ agents across coding quality operations."),

  roleTitle("Lead Generator & Data Scientist"),
  roleMeta("Klouser", "Nov 2021 \u2013 Oct 2022"),
  bullet("Built a prospect generation system increasing daily lead capacity from 0\u201310 to 40\u201350 (Python, PostgreSQL, Flask, Scikit-learn)."),
  bullet("Assembled text classifier from 6,000 client profiles; automated billing integrated with Xero."),

  sectionTitle("Bayesian Projects"),

  roleTitle("V\u00e9lez Sarsfield \u2014 Player Skill Estimation"),
  roleMeta("Hierarchical Bayesian Models \u00B7 PyMC", "2025"),
  bullet("Built hierarchical models to estimate player skill; analyzed V\u00e9lez\u2019s sharp point drop in early 2025. Contributed to TrueSkillThroughTime (originally Julia)."),

  roleTitle("NBA TrailBlazers \u2014 Exploration vs. Exploitation"),
  roleMeta("Thompson Sampling \u00B7 Live Experiment", "2025"),
  bullet("Developed Thompson sampling models for young player development with stint-based lineup recommendations. In conversation with Tom Haberstroh."),
];

const rightContent = [
  sectionTitle("Skills", { first: true }),

  sidebarLabel("Data Science"),
  sidebarText("Statistical Modeling \u00B7 GLMs"),
  sidebarText("Causal Inference \u00B7 Bayesian"),
  sidebarText("Hierarchical Models \u00B7 PyMC"),
  sidebarText("Thompson Sampling"),
  sidebarText("Regression \u00B7 Hypothesis Testing"),

  sidebarLabel("Programming"),
  sidebarText("Proficient: Python \u00B7 SQL"),
  sidebarText("Experienced: C++ \u00B7 JavaScript"),
  sidebarText("Node.js \u00B7 React \u00B7 Shell"),

  sidebarLabel("Libraries"),
  sidebarText("PyMC \u00B7 Pandas \u00B7 NumPy"),
  sidebarText("Scikit-Learn \u00B7 StatsModels"),
  sidebarText("Matplotlib \u00B7 Plotly \u00B7 Flask"),

  sidebarLabel("Tools"),
  sidebarText("Git \u00B7 Docker \u00B7 GCP"),
  sidebarText("GitHub Actions \u00B7 CI/CD"),
  sidebarText("PowerBI \u00B7 Vercel"),

  sidebarLabel("Languages"),
  sidebarText("English \u2013 bilingual"),
  sidebarText("Spanish \u2013 native"),
  sidebarText("Hebrew \u2013 beginner"),

  sectionTitle("Education"),

  new Paragraph({
    spacing: { before: 120, after: 0 },
    children: [
      new TextRun({ text: "UNSAM", bold: true, size: 17, color: INK, font: BODY_FONT }),
    ],
  }),
  sidebarText("BSc Data Science"),
  new Paragraph({
    spacing: { before: 0, after: 20 },
    children: [
      new TextRun({ text: "Expected Jun 2027", size: 14, color: MIST, font: BODY_FONT }),
    ],
  }),

  sectionTitle("Reference"),

  new Paragraph({
    spacing: { before: 120, after: 0 },
    children: [
      new TextRun({ text: "Kamron Palizban", bold: true, size: 16, color: INK, font: BODY_FONT }),
    ],
  }),
  sidebarText("CEO, Ascendancy"),
  sidebarText("kamron@ascendancy.co"),
];

// ============================================================
// DOCUMENT ASSEMBLY
// ============================================================

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: BODY_FONT, size: 20 } },
    },
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: PAGE_W, height: PAGE_H },
          margin: {
            top: MARGIN_TOP,
            bottom: MARGIN_BOTTOM,
            left: MARGIN_LEFT,
            right: MARGIN_RIGHT,
          },
        },
      },
      children: [
        // === NAME — large, serif, grounded ===
        new Paragraph({
          spacing: { after: 0 },
          children: [
            new TextRun({
              text: "Tom\u00e1s Pablo Korenblit",
              bold: true,
              size: 40,           // 20pt — commanding but not loud
              color: INK,
              font: DISPLAY_FONT,
            }),
          ],
        }),

        // === SUBTITLE — the single accent moment ===
        new Paragraph({
          spacing: { before: 30, after: 60 },
          children: [
            new TextRun({
              text: "Bayesian Data Scientist & Engineer",
              size: 19,
              color: ACCENT,
              font: BODY_FONT,
            }),
          ],
        }),

        // === CONTACT LINE — understated ===
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: "Buenos Aires, Argentina", size: 15, color: MIST, font: BODY_FONT }),
            new TextRun({ text: "  \u00B7  ", size: 15, color: CLOUD, font: BODY_FONT }),
            new TextRun({ text: "tomaskorenblit@gmail.com", size: 15, color: STONE, font: BODY_FONT }),
            new TextRun({ text: "  \u00B7  ", size: 15, color: CLOUD, font: BODY_FONT }),
            new TextRun({ text: "+54 11 2156 1770", size: 15, color: STONE, font: BODY_FONT }),
            new TextRun({ text: "  \u00B7  ", size: 15, color: CLOUD, font: BODY_FONT }),
            new ExternalHyperlink({
              children: [new TextRun({ text: "GitHub", style: "Hyperlink", size: 15, font: BODY_FONT })],
              link: "https://github.com/tomaskorenblit",
            }),
            new TextRun({ text: "  \u00B7  ", size: 15, color: CLOUD, font: BODY_FONT }),
            new ExternalHyperlink({
              children: [new TextRun({ text: "LinkedIn", style: "Hyperlink", size: 15, font: BODY_FONT })],
              link: "https://linkedin.com/in/tomaskorenblit",
            }),
          ],
        }),

        // === DIVIDER — thin, full-width, warm gray (not accent) ===
        new Paragraph({
          spacing: { before: 40, after: 20 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: CLOUD, space: 6 } },
          children: [],
        }),

        // === TWO-COLUMN LAYOUT ===
        new Table({
          width: { size: CONTENT_W, type: WidthType.DXA },
          columnWidths: [LEFT_W, GAP, RIGHT_W],
          rows: [
            new TableRow({
              children: [
                // LEFT COLUMN
                new TableCell({
                  borders: noBorders,
                  width: { size: LEFT_W, type: WidthType.DXA },
                  margins: { top: 0, bottom: 0, left: 0, right: 0 },
                  children: leftContent,
                }),
                // GAP COLUMN — pure ma
                new TableCell({
                  borders: noBorders,
                  width: { size: GAP, type: WidthType.DXA },
                  margins: { top: 0, bottom: 0, left: 0, right: 0 },
                  children: [new Paragraph({ children: [] })],
                }),
                // RIGHT COLUMN
                new TableCell({
                  borders: noBorders,
                  width: { size: RIGHT_W, type: WidthType.DXA },
                  margins: { top: 0, bottom: 0, left: 0, right: 0 },
                  children: rightContent,
                }),
              ],
            }),
          ],
        }),
      ],
    },
  ],
});

// ============================================================
// OUTPUT
// ============================================================

const OUTPUT_PATH = process.argv[2] || "./Korenblit_Resume_2026.docx";

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(OUTPUT_PATH, buffer);
  console.log(`\u2713 Resume created: ${OUTPUT_PATH}`);
});
