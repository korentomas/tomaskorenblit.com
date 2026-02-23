const fs = require("fs");
const PDFDocument = require("pdfkit");

// ============================================================
// DESIGN — identical palette & philosophy to build_resume.cjs
// ============================================================

const INK = "#2D2D2B";
const STONE = "#55524E";
const MIST = "#8A8785";
const CLOUD = "#D5D2CC";
const ACCENT = "#3D5167";

const FONT_REGULAR = "/System/Library/Fonts/Supplemental/Georgia.ttf";
const FONT_BOLD = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf";

// --- PAGE SETUP ---
const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN_TOP = 54;
const MARGIN_BOTTOM = 45;
const MARGIN_LEFT = 60;
const MARGIN_RIGHT = 60;
const CONTENT_W = PAGE_W - MARGIN_LEFT - MARGIN_RIGHT;

const LEFT_W = 310;
const GAP = 20;
const RIGHT_X = MARGIN_LEFT + LEFT_W + GAP;
const RIGHT_W = CONTENT_W - LEFT_W - GAP;

// ============================================================
// CONTENT DATA
// ============================================================

const experience = [
  {
    title: "Partner, Data Scientist & Full-Stack Engineer",
    company: "Ascendancy",
    date: "Jan 2026 \u2013 Present",
    bullets: [
      "Building a network intelligence platform that maps and scores relationship paths for institutional clients\u2014from investor dinners to Fortune 500 event targeting.",
      "Designed LinkedIn data ingestion backend, email connection pipeline, and investment data import system powering network analysis.",
      "Established engineering foundations: CI/CD pipelines, development standards, and automated workflows for a greenfield team.",
    ],
  },
  {
    title: "Software Engineer",
    company: "Invisible Technologies",
    date: "Jun \u2013 Dec 2025",
    bullets: [
      "Shipped an interactive AI-assisted interface design platform for RLHF, serving Google, Meta, Anthropic, and OpenAI.",
      "Built versioning, self-healing features, and GCP integration for batch/campaign bucket management.",
    ],
  },
  {
    title: "Coding QC Analyst & AI Data Trainer",
    company: "Invisible Technologies",
    date: "Dec 2022 \u2013 Jun 2025",
    bullets: [
      "Created dashboards (Looker, Apps Script, Python) to validate coding training data\u2014adopted company-wide for daily workflows.",
      "Oversaw quality for 150+ agents across coding quality operations.",
    ],
  },
  {
    title: "Lead Generator & Data Scientist",
    company: "Klouser",
    date: "Nov 2021 \u2013 Oct 2022",
    bullets: [
      "Built a prospect generation system increasing daily lead capacity from 0\u201310 to 40\u201350 (Python, PostgreSQL, Flask, Scikit-learn).",
      "Assembled text classifier from 6,000 client profiles; automated billing integrated with Xero.",
    ],
  },
];

const projects = [
  {
    title: "V\u00e9lez Sarsfield \u2014 Player Skill Estimation",
    company: "Hierarchical Bayesian Models \u00B7 PyMC",
    date: "2025",
    bullets: [
      "Built hierarchical models to estimate player skill; analyzed V\u00e9lez\u2019s sharp point drop in early 2025. Contributed to TrueSkillThroughTime (originally Julia).",
    ],
  },
  {
    title: "NBA TrailBlazers \u2014 Exploration vs. Exploitation",
    company: "Thompson Sampling \u00B7 Live Experiment",
    date: "2025",
    bullets: [
      "Developed Thompson sampling models for young player development with stint-based lineup recommendations. In conversation with Tom Haberstroh.",
    ],
  },
];

const skills = {
  "Data Science": [
    "Statistical Modeling \u00B7 GLMs",
    "Causal Inference \u00B7 Bayesian",
    "Hierarchical Models \u00B7 PyMC",
    "Thompson Sampling",
    "Regression \u00B7 Hypothesis Testing",
  ],
  "Programming": [
    "Proficient: Python \u00B7 SQL",
    "Experienced: C++ \u00B7 JavaScript",
    "Node.js \u00B7 React \u00B7 Shell",
  ],
  "Libraries": [
    "PyMC \u00B7 Pandas \u00B7 NumPy",
    "Scikit-Learn \u00B7 StatsModels",
    "Matplotlib \u00B7 Plotly \u00B7 Flask",
  ],
  "Tools": [
    "Git \u00B7 Docker \u00B7 GCP",
    "GitHub Actions \u00B7 CI/CD",
    "PowerBI \u00B7 Vercel",
  ],
  "Languages": [
    "English \u2013 bilingual",
    "Spanish \u2013 native",
    "Hebrew \u2013 beginner",
  ],
};

// ============================================================
// PDF GENERATION
// ============================================================

const doc = new PDFDocument({
  size: "LETTER",
  margins: { top: MARGIN_TOP, bottom: MARGIN_BOTTOM, left: MARGIN_LEFT, right: MARGIN_RIGHT },
  info: {
    Title: "Tom\u00e1s Pablo Korenblit \u2013 Resume",
    Author: "Tom\u00e1s Pablo Korenblit",
  },
});

const OUTPUT_PATH = process.argv[2] || "./Korenblit_Resume_2026.pdf";
doc.pipe(fs.createWriteStream(OUTPUT_PATH));

doc.registerFont("Georgia", FONT_REGULAR);
doc.registerFont("Georgia-Bold", FONT_BOLD);

// --- HELPERS ---
// All helpers use explicit x, y positioning to avoid PDFKit cursor issues.

function drawText(text, x, y, opts = {}) {
  const font = opts.bold ? "Georgia-Bold" : "Georgia";
  const size = opts.size || 8;
  const color = opts.color || STONE;
  const width = opts.width;

  doc.font(font).fontSize(size).fillColor(color);
  const textOpts = {};
  if (width) textOpts.width = width;
  if (opts.link) textOpts.link = opts.link;
  doc.text(text, x, y, textOpts);

  if (width) {
    return doc.heightOfString(text, { width });
  }
  return doc.currentLineHeight();
}

function drawLine(x1, y, x2) {
  doc.strokeColor(CLOUD).lineWidth(0.4);
  doc.moveTo(x1, y).lineTo(x2, y).stroke();
}

function sectionTitle(text, x, yPos, maxW) {
  const upper = text.toUpperCase();
  // Use hair spaces for gentle letter-spacing
  const tracked = upper.split("").join(String.fromCharCode(0x200A));
  const h = drawText(tracked, x, yPos, { bold: true, size: 8.5, color: STONE, width: maxW });
  drawLine(x, yPos + h + 3, x + maxW);
  return yPos + h + 9;
}

function roleBlock(role, x, yPos, maxW) {
  // Title
  const titleH = drawText(role.title, x, yPos, { bold: true, size: 9.5, color: INK, width: maxW });
  yPos += titleH + 1;

  // Company · Date
  const meta = `${role.company}  \u00B7  ${role.date}`;
  doc.font("Georgia").fontSize(8);
  // Draw company in STONE
  const companyW = doc.widthOfString(role.company);
  drawText(role.company, x, yPos, { size: 8, color: STONE });
  // Draw separator and date in MIST
  drawText(`  \u00B7  ${role.date}`, x + companyW, yPos, { size: 8, color: MIST });
  yPos += doc.currentLineHeight() + 3;

  // Bullets
  const bulletIndent = 10;
  for (const b of role.bullets) {
    // Draw bullet character
    drawText("\u2022", x, yPos, { size: 8, color: MIST });
    // Draw bullet text indented
    const textH = drawText(b, x + bulletIndent, yPos, { size: 8, color: STONE, width: maxW - bulletIndent });
    yPos += textH + 2;
  }

  return yPos + 4;
}

function sidebarLabel(text, x, yPos, maxW) {
  const upper = text.toUpperCase();
  const tracked = upper.split("").join(String.fromCharCode(0x2009));
  const h = drawText(tracked, x, yPos, { bold: true, size: 7.5, color: STONE, width: maxW });
  return yPos + h + 2;
}

function sidebarText(text, x, yPos, maxW) {
  const h = drawText(text, x, yPos, { size: 7.5, color: STONE, width: maxW });
  return yPos + h + 1;
}

// ============================================================
// RENDER
// ============================================================

let y = MARGIN_TOP;

// --- NAME ---
const nameH = drawText("Tom\u00e1s Pablo Korenblit", MARGIN_LEFT, y, { bold: true, size: 20, color: INK });
y += nameH + 4;

// --- SUBTITLE ---
const subH = drawText("Bayesian Data Scientist & Engineer", MARGIN_LEFT, y, { size: 9.5, color: ACCENT });
y += subH + 8;

// --- CONTACT LINE ---
doc.font("Georgia").fontSize(7.5);
const contactParts = [
  { text: "Buenos Aires, Argentina", color: MIST },
  { text: "  \u00B7  ", color: CLOUD },
  { text: "tomaskorenblit@gmail.com", color: STONE },
  { text: "  \u00B7  ", color: CLOUD },
  { text: "+54 11 2156 1770", color: STONE },
  { text: "  \u00B7  ", color: CLOUD },
  { text: "GitHub", color: ACCENT, link: "https://github.com/tomaskorenblit" },
  { text: "  \u00B7  ", color: CLOUD },
  { text: "LinkedIn", color: ACCENT, link: "https://linkedin.com/in/tomaskorenblit" },
];

let cx = MARGIN_LEFT;
const lineH = doc.currentLineHeight();
for (const part of contactParts) {
  doc.font("Georgia").fontSize(7.5);
  const w = doc.widthOfString(part.text);
  doc.fillColor(part.color);
  doc.text(part.text, cx, y, { lineBreak: false });
  // Add link annotation separately so PDFKit gets valid rect coords
  if (part.link) {
    doc.link(cx, y, w, lineH, part.link);
  }
  cx += w;
}
y += lineH + 10;

// --- DIVIDER ---
doc.strokeColor(CLOUD).lineWidth(0.5);
doc.moveTo(MARGIN_LEFT, y).lineTo(PAGE_W - MARGIN_RIGHT, y).stroke();
y += 10;

// ============================================================
// TWO-COLUMN LAYOUT
// ============================================================

let leftY = y;
let rightY = y;

// --- LEFT COLUMN ---

leftY = sectionTitle("Experience", MARGIN_LEFT, leftY, LEFT_W);

for (const role of experience) {
  leftY = roleBlock(role, MARGIN_LEFT, leftY, LEFT_W);
}

leftY = sectionTitle("Bayesian Projects", MARGIN_LEFT, leftY + 4, LEFT_W);

for (const proj of projects) {
  leftY = roleBlock(proj, MARGIN_LEFT, leftY, LEFT_W);
}

// --- RIGHT COLUMN ---

rightY = sectionTitle("Skills", RIGHT_X, rightY, RIGHT_W);

for (const [label, items] of Object.entries(skills)) {
  rightY = sidebarLabel(label, RIGHT_X, rightY + 4, RIGHT_W);
  for (const item of items) {
    rightY = sidebarText(item, RIGHT_X, rightY, RIGHT_W);
  }
}

// Education
rightY = sectionTitle("Education", RIGHT_X, rightY + 4, RIGHT_W);

rightY += drawText("UNSAM", RIGHT_X, rightY, { bold: true, size: 8.5, color: INK, width: RIGHT_W }) + 1;
rightY += drawText("BSc Data Science", RIGHT_X, rightY, { size: 7.5, color: STONE, width: RIGHT_W }) + 1;
rightY += drawText("Expected Jun 2027", RIGHT_X, rightY, { size: 7, color: MIST, width: RIGHT_W }) + 6;

// Reference
rightY = sectionTitle("Reference", RIGHT_X, rightY, RIGHT_W);

rightY += drawText("Kamron Palizban", RIGHT_X, rightY, { bold: true, size: 8, color: INK, width: RIGHT_W }) + 1;
rightY += drawText("CEO, Ascendancy", RIGHT_X, rightY, { size: 7.5, color: STONE, width: RIGHT_W }) + 1;
drawText("kamron@ascendancy.co", RIGHT_X, rightY, { size: 7.5, color: STONE, width: RIGHT_W });

// ============================================================
// OUTPUT
// ============================================================

doc.end();
console.log(`\u2713 PDF created: ${OUTPUT_PATH}`);
