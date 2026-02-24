import type { MetaFunction, LoaderFunction } from "@vercel/remix";
import { useTheme } from "../context/ThemeContext";
import { useEffect, useRef } from "react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useDialKit } from "dialkit";
import { optimizeImage } from "~/utils/imageOptimizer";
import Navigation from "~/components/Navigation";

export const loader: LoaderFunction = async () => {
  const optimizedImagePath = await optimizeImage('also_me.png', {
    width: 800,
    quality: 90,
    format: 'webp'
  });

  // Ensure the path starts with a forward slash
  const imagePath = optimizedImagePath.startsWith('/') ? optimizedImagePath : `/${optimizedImagePath}`;

  return json({ optimizedImagePath: imagePath });
};

export const meta: MetaFunction = () => {
  const siteUrl = "https://tkoren.com";
  const title = "Tomás Korenblit | Bayesian Data Scientist & Engineer";
  const description = "Tomás Korenblit — Bayesian data scientist and software engineer. Partner at Ascendancy building network intelligence systems. Specializing in hierarchical modeling, causal inference, and production data pipelines in Python, SQL, and GCP.";
  const image = `${siteUrl}/optimized-images/also_me-800w-90q.webp`;

  return [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: "Tomás Korenblit, Tomas Korenblit, Bayesian Data Scientist, Data Science, Statistical Modeling, PyMC, Python, Machine Learning, Causal Inference, Software Engineer, Buenos Aires" },
    { name: "author", content: "Tomás Korenblit" },
    { tagName: "link", rel: "canonical", href: siteUrl },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: siteUrl },
    { property: "og:image", content: image },
    { property: "og:site_name", content: "Tomás Korenblit" },
    { property: "og:locale", content: "en_US" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];
};

export default function Index() {
  const { theme, toggleTheme } = useTheme();
  const imageRef = useRef<HTMLDivElement>(null);
  const { optimizedImagePath } = useLoaderData<{ optimizedImagePath: string }>();

  /* ─────────────────────────────────────────────────────────
   * 3D IMAGE EFFECT — DialKit live controls
   *
   * perspective    — camera distance (lower = more dramatic)
   * rotateXMax     — vertical tilt range in degrees
   * rotateYMax     — horizontal tilt range in degrees
   * translateZMax  — depth push in pixels
   * damping        — smoothing factor (0 = frozen, 1 = instant)
   * ───────────────────────────────────────────────────────── */
  const params = useDialKit("3D Image", {
    perspective: [1000, 200, 2000, 50],
    rotateXMax: [20, 0, 45],
    rotateYMax: [30, 0, 60],
    translateZMax: [20, 0, 50],
    damping: [0.08, 0.01, 0.3, 0.01],
  });

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;

    let currentX = 0;
    let currentY = 0;
    let currentZ = 0;
    let targetX = 0;
    let targetY = 0;
    let targetZ = 0;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = image.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      targetX = -(deltaY / window.innerHeight) * params.rotateXMax;
      targetY = (deltaX / window.innerWidth) * params.rotateYMax;

      const distanceFromCenter = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = Math.sqrt(window.innerWidth * window.innerWidth + window.innerHeight * window.innerHeight) / 2;
      targetZ = (distanceFromCenter / maxDistance) * params.translateZMax;
    };

    const animate = () => {
      currentX += (targetX - currentX) * params.damping;
      currentY += (targetY - currentY) * params.damping;
      currentZ += (targetZ - currentZ) * params.damping;

      image.style.transform = `perspective(${params.perspective}px) rotateX(${currentX}deg) rotateY(${currentY}deg) translateZ(${currentZ}px)`;

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [params.perspective, params.rotateXMax, params.rotateYMax, params.translateZMax, params.damping]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Tomás Pablo Korenblit",
    alternateName: "Tomas Korenblit",
    givenName: "Tomás",
    familyName: "Korenblit",
    jobTitle: "Bayesian Data Scientist & Software Engineer",
    worksFor: {
      "@type": "Organization",
      name: "Ascendancy"
    },
    url: "https://tkoren.com",
    image: "https://tkoren.com/optimized-images/also_me-800w-90q.webp",
    email: "tomaskorenblit@gmail.com",
    sameAs: [
      "https://github.com/korentomas",
      "https://www.linkedin.com/in/tomaskorenblit/"
    ],
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Universidad Nacional de San Martín (UNSAM)",
      address: { "@type": "PostalAddress", addressLocality: "Buenos Aires", addressCountry: "AR" }
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Buenos Aires",
      addressCountry: "AR"
    },
    knowsAbout: [
      "Bayesian Inference",
      "Hierarchical Modeling",
      "Causal Inference",
      "Statistical Modeling",
      "Thompson Sampling",
      "PyMC",
      "Python",
      "Data Science",
      "Machine Learning",
      "Full-Stack Development",
      "Graph Systems",
      "Network Intelligence"
    ],
    description: "Bayesian data scientist and software engineer specializing in hierarchical modeling, causal inference, and production data pipelines. Partner at Ascendancy building network intelligence systems."
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 main-content-with-nav">
        <div className="theme-toggle flex justify-end gap-2 mb-8">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-bg-element transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-pressed={theme === 'dark'}
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>
        </div>

        <div className="split-layout">
          {/* Left Side */}
          <div className="left-side">
            <h1 className="name">Tomás Pablo Korenblit</h1>
            <h2 className="title">Partner at Ascendancy</h2>
            <h3 className="subtitle">Data Scientist & Software Engineer</h3>
            <div className="profile-image" ref={imageRef}>
              <img
                src={optimizedImagePath}
                alt="Tomás Korenblit"
                draggable="false"
              />
            </div>

            <div className="social-icons">
              <a href="https://github.com/korentomas" target="_blank" rel="noreferrer" aria-label="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/tomaskorenblit/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="mailto:tomaskorenblit@gmail.com" aria-label="Email">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </a>
            </div>

            <div className="built-with">
              <p>
                Built with{' '}
                <a href="https://remix.run" target="_blank" rel="noreferrer" className="tech-link">
                  Remix
                </a>, deployed on{' '}
                <a href="https://vercel.com" target="_blank" rel="noreferrer" className="tech-link">
                  Vercel
                </a>.
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="right-side">
            <div className="hero-text">
              <p>I'm <span className="gradient-text">Tomás</span>, building AI-native systems that turn relationship data into strategic advantage. At Ascendancy, we're creating a new category: relationship intelligence infrastructure that compounds network capital at scale. From graph algorithms to full-stack applications, I architect systems where human connection drives measurable business outcomes.</p>
            </div>

            <div className="sections-grid">
              <section className="current-status">
                <h2>What I'm up to</h2>
                <ul>
                  <li>
                    <span className="highlight">Partner, Data Scientist & Software Engineer</span> @ Ascendancy
                    <span className="status">(current)</span>
                  </li>
                  <li>
                    <span className="highlight">BSc. Data Science</span> @ UNSAM
                    <span className="status">(ongoing)</span>
                  </li>
                </ul>
              </section>

              <section className="what-i-do">
                <h2>Technical Focus</h2>
                <ul>
                  <li>Graph systems & relationship intelligence platforms</li>
                  <li>ML/AI pipelines for network capital optimization</li>
                  <li>Full-stack development (React, TypeScript, Python)</li>
                  <li>Data architecture for high-dimensional relationship data</li>
                </ul>
              </section>
            </div>

            <section className="projects">
              <h2>Selected Work</h2>
              <div className="project-grid">
                <div className="project-card">
                  <div>
                    <h3>Ascendancy Platform</h3>
                    <p>Building AI-native relationship intelligence infrastructure that turns network data into strategic advantage. Graph-based architecture processes multi-source relationship data to surface high-value connections, optimize introduction paths, and compound network capital at scale.</p>
                    <div className="project-tags">
                      <span className="tag">Graph Systems</span>
                      <span className="tag">ML Pipelines</span>
                      <span className="tag">Full-Stack</span>
                      <span className="tag">TypeScript</span>
                    </div>
                  </div>
                </div>

                <div className="project-card">
                  <a href="https://easy-fix-nine.vercel.app/" target="_blank" rel="noreferrer">
                    <h3>EasyFix</h3>
                    <p>Constraint optimization system for sports scheduling. Handles complex multi-objective problems (venue availability, resource allocation, weather conditions) using custom algorithms. Reduced manual scheduling time by 90% for club managers.</p>
                    <div className="project-tags">
                      <span className="tag">Optimization</span>
                      <span className="tag">Algorithms</span>
                      <span className="tag">React</span>
                      <span className="tag">Vercel</span>
                    </div>
                  </a>
                </div>

                <div className="project-card">
                  <a href="https://drive.google.com/drive/folders/1aDnCO67zldJ9amt-db_Z7r7aldit_hnA?usp=sharing" target="_blank" rel="noreferrer">
                    <h3>UNICOPE Telescopes</h3>
                    <p>Open-source 3D-printed telescope system designed for accessibility. Complete CAD designs for mirror supports, focusers, and mounts. Goal: Make astronomy accessible worldwide through low-cost, DIY-friendly designs that anyone can replicate.</p>
                    <div className="project-tags">
                      <span className="tag">Hardware Design</span>
                      <span className="tag">CAD</span>
                      <span className="tag">Open Source</span>
                      <span className="tag">3D Printing</span>
                    </div>
                  </a>
                </div>

                <div className="project-card">
                  <a href="https://github.com/korentomas" target="_blank" rel="noreferrer">
                    <h3>More on GitHub</h3>
                    <p>Additional projects including data visualization dashboards, ML experiments, and technical explorations. From Bayesian causal inference to NLP pipelines—always learning, always building.</p>
                    <div className="project-tags">
                      <span className="tag">Data Science</span>
                      <span className="tag">Python</span>
                      <span className="tag">Experiments</span>
                    </div>
                  </a>
                </div>
              </div>
            </section>

            <section className="skills">
              <h2>Technical Stack</h2>
              <div className="skills-grid">
                <div className="skill-category">
                  <h3>Graph & Data Systems</h3>
                  <div className="skill-tags">
                    <span className="tag">Graph Algorithms</span>
                    <span className="tag">NetworkX</span>
                    <span className="tag">Neo4j</span>
                    <span className="tag">SQL/NoSQL</span>
                  </div>
                </div>
                <div className="skill-category">
                  <h3>ML & AI</h3>
                  <div className="skill-tags">
                    <span className="tag">LLM Systems</span>
                    <span className="tag">Scikit-Learn</span>
                    <span className="tag">PyMC</span>
                    <span className="tag">Bayesian Methods</span>
                  </div>
                </div>
                <div className="skill-category">
                  <h3>Full-Stack Development</h3>
                  <div className="skill-tags">
                    <span className="tag">TypeScript</span>
                    <span className="tag">React</span>
                    <span className="tag">Remix</span>
                    <span className="tag">Python</span>
                  </div>
                </div>
                <div className="skill-category">
                  <h3>Infrastructure</h3>
                  <div className="skill-tags">
                    <span className="tag">Vercel</span>
                    <span className="tag">Docker</span>
                    <span className="tag">Google Cloud</span>
                    <span className="tag">Git</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
