import React, { useState } from 'react';
import '../styles/ScanPage.css';

// Material UI Icons
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ShieldIcon from '@mui/icons-material/Shield';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CircularProgress from '@mui/material/CircularProgress';
import SourceIcon from '@mui/icons-material/Code';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';

const ScanPage = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Resets icon after 2 seconds
  };
  const handleRunAnalysis = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockResponse = {
        "folder": [
          "auth_controller.js", // Simulated Source Name
          "const password = '12345';\nloginUser(username, password);", 
          "const password = process.env.USER_PWD;\nloginUser(username, password);", 
          "Hardcoded credentials detected. Storing secrets in plain text allows anyone with access to the source code to compromise user accounts. This violates security best practices regarding secret management."
        ]
      };
      setResults(mockResponse.folder);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="scan-page-root">
      <header className="scan-header">
        <div className="title-group">
          <h1>Security Analysis Engine</h1>
          <p>Review and fix vulnerabilities across your project files.</p>
        </div>
        <button 
          className={`btn-run-analysis ${loading ? 'loading' : ''}`} 
          onClick={handleRunAnalysis}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
          <span>{loading ? 'Analyzing...' : 'Run Analysis'}</span>
        </button>
      </header>

      {!results && !loading && (
        <div className="empty-state">
          <ShieldIcon className="shield-placeholder" />
          <p>Ready to scan. Click the button above to start the engine.</p>
        </div>
      )}

      {results && !loading && (
        <div className="analysis-container animate-slide-up">
          <div className="results-header">
            <h3><ErrorOutlineIcon /> Vulnerability Detected</h3>
            <span className="severity-tag">High Risk</span>
          </div>

          {/* ROW 1: Source, Actual Code, Suggested Fix */}
          <div className="analysis-top-row">
            <div className="analysis-col">
              <label>Source File</label>
              <div className="source-info-box">
                <SourceIcon className="src-icon" />
                <span>{results[0]}</span>
              </div>
            </div>

            <div className="analysis-col">
              <label>Actual Code</label>
              <div className="code-block original">
                <pre><code>{results[1]}</code></pre>
              </div>
            </div>

            <div className="analysis-col">
              <label>Suggested Fix</label>
              <div className="code-block suggestion relative-container">
                {/* New Copy Button */}
                <pre><code>{results[2]}</code></pre><br/>
                <button 
                  className={`copy-btn-mini ${copied ? 'copied' : ''}`} 
                  onClick={() => handleCopy(results[2])}
                  title="Copy Fix"
                >
                  {copied ? <DoneIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                </button>
                <div className="fix-check"><CheckCircleOutlineIcon /> Secure Pattern</div>
              </div>
            </div>
          </div>

          {/* ROW 2: Why this code? (Full Width) */}
          <div className="analysis-bottom-row">
            <div className="explanation-section">
              <label>Why this code?</label>
              <div className="explanation-content">
                <p>{results[3]}</p>
                <div className="cwe-meta">Industry Reference: <strong>CWE-798</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanPage;