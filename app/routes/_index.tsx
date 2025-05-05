import type { MetaFunction } from "@vercel/remix";
import { useTheme } from "~/context/ThemeContext";

export const meta: MetaFunction = () => {
  return [
    { title: "Tomás Korenblit | Data Scientist & Bayesian Specialist" },
    { name: "description", content: "Data Scientist specializing in Bayesian methods and Machine Learning. Portfolio showcasing projects in data analysis, machine learning, and statistical modeling." },
    { name: "keywords", content: "Data Science, Machine Learning, Bayesian Statistics, PyMC, Data Analysis" },
    { name: "author", content: "Tomás Korenblit" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { property: "og:title", content: "Tomás Korenblit | Data Scientist & Bayesian Specialist" },
    { property: "og:description", content: "Data Scientist specializing in Bayesian methods and Machine Learning. Portfolio showcasing projects in data analysis, machine learning, and statistical modeling." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "Tomás Korenblit | Data Scientist & Bayesian Specialist" },
    { name: "twitter:description", content: "Data Scientist specializing in Bayesian methods and Machine Learning. Portfolio showcasing projects in data analysis, machine learning, and statistical modeling." }
  ];
};

export default function Index() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="main-container" role="main">
      <div className="theme-toggle">
        <button 
          onClick={toggleTheme} 
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          aria-pressed={theme === 'dark'}
        >
          {theme === 'light' ? (
            <svg className="moon-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            <svg className="sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          )}
        </button>
      </div>
      
      <div className="asymmetric-wrapper">
        {/* Left Column - Info Panel */}
        <div className="left-column" role="complementary">
          {/* Hero Section */}
          <section className="hero-section" aria-labelledby="hero-title">
            <h1 className="hero-title" id="hero-title">Tomás Korenblit</h1>
            <div className="hero-tagline">
              <span className="highlight">Data Scientist & Problem Solver</span>
            </div>
            
            <p className="hero-intro">
            Driven by curiosity, I’ve spent years crafting solutions to complex problems—whether it’s developing apps or applying machine learning models. Now, as a data scientist, I continue to innovate and create technologies that transform ideas into results.
            </p>
            
            <div className="contact-info">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink: 0}} aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <a href="mailto:tomaskorenblit@gmail.com" rel="noreferrer" aria-label="Send email to tomaskorenblit@gmail.com">tomaskorenblit@gmail.com</a>
            </div>
          </section>
          
          {/* Education Section */}
          <section className="education-container" aria-labelledby="education-title">
            <h2 className="section-title" id="education-title">Education</h2>
            <div className="education-content">
              <h3>BSc in Data Science</h3>
              <p>Universidad Nacional de San Martín (UNSAM)<br />
                Currently in third year<br />
                <a href="https://unsam.edu.ar/escuelas/ecyt/661/ciencia/ciencia-de-datos" target="_blank" rel="noreferrer" aria-label="View Data Science curriculum at UNSAM">
                  View Curriculum
                </a>
              </p>
            </div>
          </section>
          
          {/* Current Focus Section */}
          <section className="focus-section" aria-labelledby="focus-title">
            <h2 className="section-title" id="focus-title">Current Focus</h2>
            <div className="focus-content">
              <p>Deepening my knowledge in:</p>
              <ul className="focus-list">
                <li>Bayesian statistical modeling with PyMC</li>
                <li>Advanced ML optimization techniques</li>
                <li>GPU-accelerated model training</li>
              </ul>
            </div>
          </section>
        </div>
        
        {/* Right Column - Content Panel */}
        <div className="right-column">
          {/* Skills Section */}
          <section className="skills-section" aria-labelledby="skills-title">
            <h2 className="section-title" id="skills-title">Technical Skills</h2>
            <div className="skills-grid">
              <div>
                <h3 className="skill-category">Machine Learning</h3>
                <ul className="skills-list">
                  <li><strong>Bayesian:</strong> PyMC</li>
                  <li><strong>Gradient Boosting:</strong> CatBoost, LightGBM, XGBoost</li>
                  <li><strong>Optimization:</strong> Optuna, GPU acceleration</li>
                </ul>
              </div>
              
              <div>
                <h3 className="skill-category">Data Engineering</h3>
                <ul className="skills-list">
                  <li><strong>Analysis:</strong> Pandas, NumPy, Scikit-learn</li>
                  <li><strong>Visualization:</strong> Plotly, Matplotlib</li>
                  <li><strong>Web Development:</strong> Flask, Remix, React</li>
                </ul>
              </div>
            </div>
          </section>
          
          {/* Projects Section */}
          <section className="projects-section" aria-labelledby="projects-title">
            <h2 className="section-title" id="projects-title">Featured Projects</h2>
            
            <div className="projects-grid">
              <div className="project-card">
                <h3 className="project-title">
                  <a href="https://boston-crime-deploy.herokuapp.com/" target="_blank" rel="noreferrer" aria-label="View Boston Crime Analysis project">
                    Boston Crime Analysis
                  </a>
                </h3>
                <div className="project-content">
                  <div className="project-description">
                    <p>Interactive visualizations of Boston crime report data using Pandas, Plotly and Streamlit.</p>
                  </div>
                  <div className="project-tags" role="list">
                    <span className="tag" role="listitem">Data Visualization</span>
                    <span className="tag" role="listitem">Pandas</span>
                    <span className="tag" role="listitem">Streamlit</span>
                  </div>
                </div>
              </div>
              
              <div className="project-card">
                <h3 className="project-title">
                  <a href="https://koren-rev-analysis.herokuapp.com/" target="_blank" rel="noreferrer" aria-label="View Movie Review Sentiment Analysis project">
                    Movie Review Sentiment Analysis
                  </a>
                </h3>
                <div className="project-content">
                  <div className="project-description">
                    <p>Text classification and sentiment analysis on IMDb reviews with regex preprocessing, TfidfVectorizer, and sklearn.</p>
                  </div>
                  <div className="project-tags" role="list">
                    <span className="tag" role="listitem">NLP</span>
                    <span className="tag" role="listitem">Machine Learning</span>
                    <span className="tag" role="listitem">Flask</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        
        <footer className="asymmetric-footer" role="contentinfo">
          <p>
            Built with <a href="https://remix.run/" target="_blank" rel="noreferrer" aria-label="Learn more about Remix">Remix</a> and
            deployed by <a href="https://vercel.com/" target="_blank" rel="noreferrer" aria-label="Learn more about Vercel">Vercel</a>
          </p>
        </footer>
      </div>
    </div>
  );
}
