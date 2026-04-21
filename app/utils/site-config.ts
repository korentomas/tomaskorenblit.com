export const SITE_URL = "https://tkoren.com";

export const SITE = {
  name: "Tomás Korenblit",
  alternateName: "Tomas Korenblit",
  title: "Causal & Bayesian Data Scientist",
  bio: "Causal & Bayesian data scientist. Buenos Aires.",
  email: "tomaskorenblit@gmail.com",
  image: "/optimized-images/also_me-800w-90q.webp",
  resumeUrl: "/resume/16-04-2026.pdf",
  description:
    "Tomás Korenblit, causal and Bayesian data scientist. Notes on books, ideas, and what I'm working on.",
  shortDescription: "Causal and Bayesian data scientist.",
  knowsAbout: [
    "Causal inference",
    "Bayesian statistics",
    "Data science",
    "AI safety",
    "Software engineering",
  ],
  social: {
    github: "https://github.com/korentomas",
    linkedin: "https://linkedin.com/in/tomaskorenblit",
  },
} as const;

/* Books
   Short, opinionated. Add/remove freely.
   "note" is your one-line take on why it's here. */
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

/* Interests
   Plain list. Each entry is a heading + short paragraph. */
export type Interest = { title: string; body: string };

export const INTERESTS: Interest[] = [
  {
    title: "Bayesian workflows",
    body: "Priors as hypotheses, posteriors as arguments. I'm interested in pipelines that make uncertainty a first-class output, not an afterthought.",
  },
  {
    title: "Causal inference in business",
    body: "Most decisions inside companies are causal questions in disguise. DAGs, difference-in-differences, synthetic controls, whatever the setting demands.",
  },
  {
    title: "AI safety",
    body: "How do we keep increasingly capable systems reliably doing what we actually want? I'm drawn to the measurement and evaluation side: telling whether a model has internalized a rule versus pattern-matched around it.",
  },
  {
    title: "Writing tools for thinking",
    body: "Plain text, local files, a few well-aimed scripts. Less magic, more leverage.",
  },
];

/* Now
   A snapshot of what I'm up to. Edit often. */
export type NowSection = {
  heading: string;
  body: string;
  link?: { href: string; label: string };
};

export type NowSnapshot = {
  date: string;
  sections: NowSection[];
};

export const NOW: NowSnapshot = {
  date: "2026-04-21",
  sections: [
    {
      heading: "Work",
      body: "Applying to AI safety fellowships and working through BlueDot Impact courses.",
    },
    {
      heading: "Reading",
      body: "Cannery Row by John Steinbeck.",
    },
    {
      heading: "Writing",
      body: "Drafting a paper on which instructions LLMs actually retain across long coding sessions (Not All Instructions Are Forgotten Equal). Bayesian ordered logistic over 244 compliance observations; treatment effects span an order of magnitude across instruction types.",
      link: {
        href: "/papers/not_all_instructions.pdf",
        label: "Read the draft (PDF)",
      },
    },
    {
      heading: "Thinking about",
      body: "AI safety, particularly how you tell whether a system has internalized a rule versus pattern-matched around it.",
    },
  ],
};

/* Then
   Archive of past /now snapshots. Most recent first.
   When you update NOW, push the previous snapshot to the top of this array. */
export const THEN: NowSnapshot[] = [];
