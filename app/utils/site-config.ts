export const SITE_URL = "https://tkoren.com";

export const SITE = {
  name: "Tomás Korenblit",
  alternateName: "Tomas Korenblit",
  title: "Causal & Bayesian Data Scientist",
  bio: "Causal & Bayesian data scientist. Partner at Ascendancy. Buenos Aires.",
  email: "tomaskorenblit@gmail.com",
  image: "/optimized-images/also_me-800w-90q.webp",
  worksFor: "Ascendancy",
  resumeUrl: "/resume/16-04-2026.pdf",
  description:
    "Tomás Korenblit — causal and Bayesian data scientist, partner at Ascendancy. Notes on books, ideas, and what I'm working on.",
  shortDescription:
    "Causal and Bayesian data scientist, partner at Ascendancy.",
  knowsAbout: [
    "Causal inference",
    "Bayesian statistics",
    "Data science",
    "3D printing",
    "Software engineering",
  ],
  social: {
    github: "https://github.com/korentomas",
    linkedin: "https://linkedin.com/in/tomaskorenblit",
  },
} as const;

/* ─── Books ──────────────────────────────────────────
   Short, opinionated. Add/remove freely.
   "note" is your one-line take on why it's here.
*/
export type Book = {
  title: string;
  author: string;
  note?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
};

export const BOOKS: { section: string; items: Book[] }[] = [
  {
    section: "Causal & Bayesian",
    items: [
      {
        title: "The Book of Why",
        author: "Judea Pearl & Dana Mackenzie",
      },
      {
        title: "Bayesian Analysis with Python",
        author: "Osvaldo Martin",
      },
    ],
  },
  {
    section: "Non-fiction",
    items: [
      {
        title: "El nudo de la conciencia",
        author: "Enzo Tagliazucchi",
      },
    ],
  },
  {
    section: "Fiction",
    items: [
      {
        title: "The Pearl",
        author: "John Steinbeck",
      },
      {
        title: "Cat's Cradle",
        author: "Kurt Vonnegut",
      },
    ],
  },
];

/* ─── Interests ─────────────────────────────────────
   Plain list. Each entry is a heading + short paragraph.
*/
export type Interest = { title: string; body: string };

export const INTERESTS: Interest[] = [
  {
    title: "Bayesian workflows",
    body: "Priors as hypotheses, posteriors as arguments. I'm interested in pipelines that make uncertainty a first-class output — not an afterthought.",
  },
  {
    title: "Causal inference in business",
    body: "Most decisions inside companies are causal questions in disguise. DAGs, difference-in-differences, synthetic controls — whatever the setting demands.",
  },
  {
    title: "3D-printed telescopes",
    body: "Mostly Newtonians. I like the loop of design → print → observe → discover a new problem to solve.",
  },
  {
    title: "Writing tools for thinking",
    body: "Plain text, local files, a few well-aimed scripts. Less magic, more leverage.",
  },
];

/* ─── Now ───────────────────────────────────────────
   What I'm working on / reading / thinking about.
   Keep short — edit often.
*/
export const NOW = {
  updated: "2026-04-21",
  sections: [
    {
      heading: "Work",
      body: "At Ascendancy, building causal measurement for clients who care about why, not just what.",
    },
    {
      heading: "Reading",
      body: "Re-reading Hamming's The Art of Doing Science and Engineering on the train.",
    },
    {
      heading: "Tinkering",
      body: "A Newtonian telescope mount, mostly 3D-printed. Currently stuck on the altitude bearing.",
    },
  ],
};
