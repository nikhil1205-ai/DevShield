import React, { useState } from "react";
import "../styles/ScanPage.css";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ShieldIcon from "@mui/icons-material/Shield";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CircularProgress from "@mui/material/CircularProgress";
import SourceIcon from "@mui/icons-material/Code";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneIcon from "@mui/icons-material/Done";

import { useParams } from "react-router-dom";
import api from "../utils/api";

const ScanPage = () => {
  const { scanId } = useParams();

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]); // 👈 array of files
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunAnalysis = async () => {
    setLoading(true);
    try {
      const res = await api.get(`api/scan/staticscan/${scanId}`);

      // 🔁 Convert ans{} → array
      const formatted = Object.entries(res.data.ans || {}).map(
        ([filePath, values]) => ({
          file: filePath,
          vulnerable: values[0],
          secure: values[1],
          why: values[2]
        })
      );

      setResults(formatted);
    } catch (err) {
      console.error("Failed to fetch scan results", err);
    } finally {
      setLoading(false);
    }
  };

  const result = results[0]; // show first file for now

  return (
    <div className="scan-page-root">
      <header className="scan-header">
        <div className="title-group">
          <h1>Security Analysis Engine</h1>
          <p>Review and fix vulnerabilities across your project files.</p>
        </div>

        <button
          className={`btn-run-analysis ${loading ? "loading" : ""}`}
          onClick={handleRunAnalysis}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <PlayArrowIcon />
          )}
          <span>{loading ? "Analyzing..." : "Run Analysis"}</span>
        </button>
      </header>

      {!results.length && !loading && (
        <div className="empty-state">
          <ShieldIcon className="shield-placeholder" />
          <p>Ready to scan. Click the button above to start the engine.</p>
        </div>
      )}

      {result && !loading && (
        <div className="analysis-container animate-slide-up">
          <div className="results-header">
            <h3>
              <ErrorOutlineIcon /> Vulnerability Detected
            </h3>
            <span className="severity-tag">High Risk</span>
          </div>

          {/* ROW 1 */}
          <div className="analysis-top-row">
            <div className="analysis-col">
              <label>Source File</label>
              <div className="source-info-box">
                <SourceIcon className="src-icon" />
                <span>{result.file}</span>
              </div>
            </div>

            <div className="analysis-col">
              <label>Actual Code</label>
              <div className="code-block original">
                <pre><code>{result.vulnerable}</code></pre>
              </div>
            </div>

            <div className="analysis-col">
              <label>Suggested Fix</label>
              <div className="code-block suggestion relative-container">
                <pre><code>{result.secure}</code></pre>
                <button
                  className={`copy-btn-mini ${copied ? "copied" : ""}`}
                  onClick={() => handleCopy(result.secure)}
                >
                  {copied ? <DoneIcon /> : <ContentCopyIcon />}
                </button>
                <div className="fix-check">
                  <CheckCircleOutlineIcon /> Secure Pattern
                </div>
              </div>
            </div>
          </div>

          {/* ROW 2 */}
          <div className="analysis-bottom-row">
            <div className="explanation-section">
              <label>Why this code?</label>
              <div className="explanation-content">
                <p>{result.why}</p>
                <div className="cwe-meta">
                  Industry Reference: <strong>CWE-798</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanPage;
