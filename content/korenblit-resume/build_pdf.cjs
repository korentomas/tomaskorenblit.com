const fs = require("fs");
const PDFDocument = require("pdfkit");

// ============================================================
// DESIGN — identical to build_resume.cjs
// ============================================================

const INK = "#2D2D2B";
const STONE = "#55524E";
const MIST = "#8A8785";
const CLOUD = "#D5D2CC";
const ACCENT = "#3D5167";

const FONT_REG = "/System/Library/Fonts/Supplemental/Georgia.ttf";
const FONT_BOLD = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf";

const PAGE_W = 612;
const MARGIN = { top: 54, bottom: 45, left: 60, right: 60 };
const CONTENT_W = PAGE_W - MARGIN.left - MARGIN.right;
const LEFT_W = 305;
const COL_GAP = 22;
const RIGHT_X = MARGIN.left + LEFT_W + COL_GAP;
const RIGHT_W = CONTENT_W - LEFT_W - COL_GAP;

// ============================================================
// HELPERS — all return the new Y position after drawing
// ============================================================

let doc; // set in main()

function textHeight(text, font, size, width) {
  doc.font(font).fontSize(size);
  return doc.heightOfString(text, { width });
}

function drawSection(label, x, y, w) {
  const tracked = label.toUpperCase().split("").join("\u200A");
  doc.font(FONT_BOLD).fontSize(8.5).fillColor(STONE);
  doc.text(tracked, x, y, { width: w });
  const h = doc.heightOfString(tracked, { width: w });
  const lineY = y + h + 3;
  doc.save().strokeColor(CLOUD).lineWidth(0.4)
    .moveTo(x, lineY).lineTo(x + w, lineY).stroke().restore();
  return lineY + 6;
}

function drawRole(title, company, date, bullets, x, y, w) {
  // Title
  doc.font(FONT_BOLD).fontSize(9.5).fillColor(INK);
  doc.text(title, x, y, { width: w });
  y += doc.heightOfString(title, { width: w }) + 1;

  // Meta line
  doc.font(FONT_REG).fontSize(8);
  const metaText = company + "  \u00B7  " + date;
  doc.fillColor(STONE).text(metaText, x, y, { width: w });
  y += doc.heightOfString(metaText, { width: w }) + 3;

  // Bullets
  const bulletIndent = 11;
  for (const b of bullets) {
    const fullText = "\u2022  " + b;
    doc.font(FONT_REG).fontSize(8).fillColor(STONE);
    doc.text(fullText, x, y, { width: w, indent: 0 });
    y += doc.heightOfString(fullText, { width: w }) + 2;
  }

  return y + 3;
}

function drawSidebarLabel(text, x, y, w) {
  const tracked = text.toUpperCase().split("").join("\u2009");
  doc.font(FONT_BOLD).fontSize(7.5).fillColor(STONE);
  doc.text(tracked, x, y, { width: w });
  return y + doc.heightOfString(tracked, { width: w }) + 2;
}

function drawSidebarItem(text, x, y, w) {
  doc.font(FONT_REG).fontSize(7.5).fillColor(STONE);
  doc.text(text, x, y, { width: w });
  return y + doc.heightOfString(text, { width: w }) + 1;
}

// ============================================================
// MAIN
// ============================================================

function main() {
  doc = new PDFDocument({
    size: "LETTER",
    margins: MARGIN,
    info: {
      Title: "Tom\u00e1s Pablo Korenblit \u2013 Resume",
      Author: "Tom\u00e1s Pablo Korenblit",
    },
  });

  const OUTPUT = process.argv[2] || "./Korenblit_Resume_2026.pdf";
  doc.pipe(fs.createWriteStream(OUTPUT));

  doc.registerFont("Georgia", FONT_REG);
  doc.registerFont("Georgia-Bold", FONT_BOLD);

  let y = MARGIN.top;

  // ── NAME ──
  doc.font(FONT_BOLD).fontSize(20).fillColor(INK);
  doc.text("Tom\u00e1s Pablo Korenblit", MARGIN.left, y, { width: CONTENT_W });
  y += doc.heightOfString("Tom\u00e1s Pablo Korenblit", { width: CONTENT_W }) + 4;

  // ── SUBTITLE ──
  doc.font(FONT_REG).fontSize(9.5).fillColor(ACCENT);
  doc.text("Bayesian Data Scientist & Engineer", MARGIN.left, y, { width: CONTENT_W });
  y += doc.heightOfString("Bayesian Data Scientist & Engineer", { width: CONTENT_W }) + 8;

  // ── CONTACT ──
  const contact = "Buenos Aires, Argentina  \u00B7  tomaskorenblit@gmail.com  \u00B7  +54 11 2156 1770  \u00B7  GitHub  \u00B7  LinkedIn";
  doc.font(FONT_REG).fontSize(7.5).fillColor(MIST);
  doc.text(contact, MARGIN.left, y, { width: CONTENT_W });
  y += doc.heightOfString(contact, { width: CONTENT_W }) + 10;

  // ── DIVIDER ──
  doc.save().strokeColor(CLOUD).lineWidth(0.5)
    .moveTo(MARGIN.left, y).lineTo(PAGE_W - MARGIN.right, y).stroke().restore();
  y += 8;

  // ============================================================
  // LEFT COLUMN
  // ============================================================
  let lY = y;

  lY = drawSection("Experience", MARGIN.left, lY, LEFT_W);

  lY = drawRole(
    "Partner, Data Scientist & Full-Stack Engineer",
    "Ascendancy", "Jan 2026 \u2013 Present",
    [
      "Building a network intelligence platform that maps and scores relationship paths for institutional clients\u2014from investor dinners to Fortune 500 event targeting.",
      "Designed LinkedIn data ingestion backend, email connection pipeline, and investment data import system powering network analysis.",
      "Established engineering foundations: CI/CD pipelines, development standards, and automated workflows for a greenfield team.",
    ],
    MARGIN.left, lY, LEFT_W,
  );

  lY = drawRole(
    "Software Engineer",
    "Invisible Technologies", "Jun \u2013 Dec 2025",
    [
      "Shipped an interactive AI-assisted interface design platform for RLHF, serving Google, Meta, Anthropic, and OpenAI.",
      "Built versioning, self-healing features, and GCP integration for batch/campaign bucket management.",
    ],
    MARGIN.left, lY, LEFT_W,
  );

  lY = drawRole(
    "Coding QC Analyst & AI Data Trainer",
    "Invisible Technologies", "Dec 2022 \u2013 Jun 2025",
    [
      "Created dashboards (Looker, Apps Script, Python) to validate coding training data\u2014adopted company-wide for daily workflows.",
      "Oversaw quality for 150+ agents across coding quality operations.",
    ],
    MARGIN.left, lY, LEFT_W,
  );

  lY = drawRole(
    "Lead Generator & Data Scientist",
    "Klouser", "Nov 2021 \u2013 Oct 2022",
    [
      "Built a prospect generation system increasing daily lead capacity from 0\u201310 to 40\u201350 (Python, PostgreSQL, Flask, Scikit-learn).",
      "Assembled text classifier from 6,000 client profiles; automated billing integrated with Xero.",
    ],
    MARGIN.left, lY, LEFT_W,
  );

  lY = drawSection("Bayesian Projects", MARGIN.left, lY + 2, LEFT_W);

  lY = drawRole(
    "V\u00e9lez Sarsfield \u2014 Player Skill Estimation",
    "Hierarchical Bayesian Models \u00B7 PyMC", "2025",
    [
      "Built hierarchical models to estimate player skill; analyzed V\u00e9lez\u2019s sharp point drop in early 2025. Contributed to TrueSkillThroughTime (originally Julia).",
    ],
    MARGIN.left, lY, LEFT_W,
  );

  lY = drawRole(
    "NBA TrailBlazers \u2014 Exploration vs. Exploitation",
    "Thompson Sampling \u00B7 Live Experiment", "2025",
    [
      "Developed Thompson sampling models for young player development with stint-based lineup recommendations. In conversation with Tom Haberstroh.",
    ],
    MARGIN.left, lY, LEFT_W,
  );

  // ============================================================
  // RIGHT COLUMN
  // ============================================================
  let rY = y;

  rY = drawSection("Skills", RIGHT_X, rY, RIGHT_W);

  const skillGroups = [
    ["Data Science", ["Statistical Modeling \u00B7 GLMs", "Causal Inference \u00B7 Bayesian", "Hierarchical Models \u00B7 PyMC", "Thompson Sampling", "Regression \u00B7 Hypothesis Testing"]],
    ["Programming", ["Proficient: Python \u00B7 SQL", "Experienced: C++ \u00B7 JavaScript", "Node.js \u00B7 React \u00B7 Shell"]],
    ["Libraries", ["PyMC \u00B7 Pandas \u00B7 NumPy", "Scikit-Learn \u00B7 StatsModels", "Matplotlib \u00B7 Plotly \u00B7 Flask"]],
    ["Tools", ["Git \u00B7 Docker \u00B7 GCP", "GitHub Actions \u00B7 CI/CD", "PowerBI \u00B7 Vercel"]],
    ["Languages", ["English \u2013 bilingual", "Spanish \u2013 native", "Hebrew \u2013 beginner"]],
  ];

  for (const [label, items] of skillGroups) {
    rY = drawSidebarLabel(label, RIGHT_X, rY + 4, RIGHT_W);
    for (const item of items) {
      rY = drawSidebarItem(item, RIGHT_X, rY, RIGHT_W);
    }
  }

  // Education
  rY = drawSection("Education", RIGHT_X, rY + 4, RIGHT_W);

  doc.font(FONT_BOLD).fontSize(8.5).fillColor(INK);
  doc.text("UNSAM", RIGHT_X, rY, { width: RIGHT_W });
  rY += doc.heightOfString("UNSAM", { width: RIGHT_W }) + 1;

  doc.font(FONT_REG).fontSize(7.5).fillColor(STONE);
  doc.text("BSc Data Science", RIGHT_X, rY, { width: RIGHT_W });
  rY += doc.heightOfString("BSc Data Science", { width: RIGHT_W }) + 1;

  doc.font(FONT_REG).fontSize(7).fillColor(MIST);
  doc.text("Expected Jun 2027", RIGHT_X, rY, { width: RIGHT_W });
  rY += doc.heightOfString("Expected Jun 2027", { width: RIGHT_W }) + 6;

  // Reference
  rY = drawSection("Reference", RIGHT_X, rY, RIGHT_W);

  doc.font(FONT_BOLD).fontSize(8).fillColor(INK);
  doc.text("Kamron Palizban", RIGHT_X, rY, { width: RIGHT_W });
  rY += doc.heightOfString("Kamron Palizban", { width: RIGHT_W }) + 1;

  doc.font(FONT_REG).fontSize(7.5).fillColor(STONE);
  doc.text("CEO, Ascendancy", RIGHT_X, rY, { width: RIGHT_W });
  rY += doc.heightOfString("CEO, Ascendancy", { width: RIGHT_W }) + 1;

  doc.font(FONT_REG).fontSize(7.5).fillColor(STONE);
  doc.text("kamron@ascendancy.co", RIGHT_X, rY, { width: RIGHT_W });

  doc.end();
  console.log(`\u2713 PDF created: ${OUTPUT}`);
}

main();
