import React from 'react';
import './Landing.css';

const Landing = () => {
  return (
    <div className="shieldnet-app">
      {/* SECTION: NAVBAR */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <span className="logo-icon">🛡️</span>
            <span className="logo-text">ShieldNet</span>
            <span className="logo-tagline">Developer-First Security</span>
          </div>
          <div className="nav-links">
            <a href="#overview">Overview</a>
            <a href="#features">Features</a>
            <a href="#how-it-works">Process</a>
            <a href="#privacy">Privacy</a>
          </div>
          <div className="nav-auth">
            <button className="btn-ghost">Login</button>
            <button className="btn-neon">Get Started</button>
          </div>
        </div>
      </nav>

      {/* SECTION: HERO */}
      <header className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="badge">v1.0 Now Live</div>
          <h1>Secure your code <br/><span className="text-gradient">Without the complexity</span></h1>
          <p>ShieldNet scans your projects, detects leaks, and suggests fixes in plain English. Built for students, startups, and developers who just want to ship safe apps.</p>
          <div className="hero-buttons">
            <button className="btn-neon-large">Scan Your First Project</button>
            <button className="btn-outline">How it works</button>
          </div>
        </div>
      </header>

      {/* SECTION: FEATURES GRID */}
      <section id="features" className="features">
        <div className="container">
          <h2 className="section-title">Everything you need, nothing you don't</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="f-icon">💻</div>
              <h3>Static Code Analysis</h3>
              <p>We scan your source code for unsafe patterns before you ever hit "deploy."</p>
            </div>
            <div className="feature-card">
              <div className="f-icon">📦</div>
              <h3>Dependency Check</h3>
              <p>Detect risky third-party libraries and outdated packages instantly.</p>
            </div>
            <div className="feature-card">
              <div className="f-icon">⚡</div>
              <h3>Runtime Testing</h3>
              <p>We test your live website to find issues that only appear when the app is running.</p>
            </div>
            <div className="feature-card">
              <div className="f-icon">🔓</div>
              <h3>Data Leak Shield</h3>
              <p>Stop accidental exposure of private emails, tokens, and passwords in your API.</p>
            </div>
            <div className="feature-card">
              <div className="f-icon">🤖</div>
              <h3>AI Fixes</h3>
              <p>ShieldNet doesn't just find problems; it shows you exactly how to fix them.</p>
            </div>
            <div className="feature-card">
              <div className="f-icon">📈</div>
              <h3>Security Score</h3>
              <p>Get a simple letter grade for your project's health. Clear and actionable.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: STEP BY STEP */}
      <section id="how-it-works" className="steps-section">
        <div className="container">
          <h2 className="section-title">Start scanning in seconds</h2>
          <div className="steps-wrapper">
            <div className="step-box">
              <span className="step-no">01</span>
              <h4>Connect</h4>
              <p>Input your GitHub URL or upload a ZIP file of your code.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-box">
              <span className="step-no">02</span>
              <h4>Analyze</h4>
              <p>Our engine automatically checks every line and library.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-box">
              <span className="step-no">03</span>
              <h4>Secure</h4>
              <p>Review your score and apply our suggested code fixes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: PRIVACY & TRUST */}
      <section id="privacy" className="privacy-banner">
        <div className="privacy-card">
          <h3>Your data is safe with us</h3>
          <p>We scan your code in a private environment. No production data is ever stored, and no credentials are shared. You are always in control.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-info">
            <h4>ShieldNet</h4>
            <p>Simple, developer-first security for the next generation of creators.</p>
          </div>
          <div className="footer-copy">
            <p>© 2026 ShieldNet Platform. Built for developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;