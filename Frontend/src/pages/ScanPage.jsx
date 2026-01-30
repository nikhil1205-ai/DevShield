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
  const [results, setResults] = useState([]); // [{ file, sections: [] }]
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunAnalysis = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/scan/staticscan/${scanId}`);
      console.log(res);
      /**
       * Convert backend ans{} into renderable structure
       */
      const formatted = Object.entries(res.data.ans || {}).map(
        ([filePath, sections]) => ({
          file: filePath,
          sections: sections.map(sec => ({
          section: sec[0],
          fix: sec[1],
          why: sec[2],

          // temporary metadata (until backend adds it)
          type: "VULNERABILITY",
          severity: "HIGH"
        }))

        })
      );

      setResults(formatted);
    } catch (err) {
      console.error("Failed to fetch scan results", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scan-page-root">
      <header className="scan-header">
        <div className="title-group">
          <h1>Security Analysis Engine</h1>
          <p>Section-based vulnerability analysis (real SAST).</p>
        </div>

        <button
          className={`btn-run-analysis ${loading ? "loading" : ""}`}
          onClick={handleRunAnalysis}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
          <span>{loading ? "Analyzing…" : "Run Analysis"}</span>
        </button>
      </header>

      {!results.length && !loading && (
        <div className="empty-state">
          <ShieldIcon className="shield-placeholder" />
          <p>Ready to analyze project security sections.</p>
        </div>
      )}

      {/* FILE LOOP */}
      {results.map((fileResult, fileIdx) => (
        <div key={fileIdx} className="analysis-container animate-slide-up">
          <div className="analysis-col full-width">
            <label>Source File</label>
            <div className="source-info-box">
              <SourceIcon className="src-icon" />
              <span>{fileResult.file}</span>
            </div>
          </div>

          {/* SECTION LOOP */}
          {fileResult.sections.map((sec, secIdx) => {
            const key = `${fileIdx}-${secIdx}`;

            return (
              <div key={key} className="issue-block">
                <div className="results-header">
                  <h3>
                    <ErrorOutlineIcon /> {sec.type.replace("_", " ")}
                  </h3>
                  <span className={`severity-tag ${sec.severity.toLowerCase()}`}>
                    {sec.severity}
                  </span>
                </div>

                {/* SECTION CODE */}
                <div className="analysis-top-row">
                  <div className="analysis-col">
                    <label>Vulnerable Section</label>
                    <div className="code-block original">
                      <pre><code>{sec.section}</code></pre>
                    </div>
                  </div>

                  <div className="analysis-col">
                    <label>Secure Fix</label>
                    <div className="code-block suggestion relative-container">
                      <pre><code>{sec.fix}</code></pre>
                      <button
                        className={`copy-btn-mini ${
                          copiedKey === key ? "copied" : ""
                        }`}
                        onClick={() => handleCopy(sec.fix, key)}
                      >
                        {copiedKey === key ? <DoneIcon /> : <ContentCopyIcon />}
                      </button>
                      <div className="fix-check">
                        <CheckCircleOutlineIcon /> Secure Pattern
                      </div>
                    </div>
                  </div>
                </div>

                {/* WHY */}
                <div className="analysis-bottom-row">
                  <div className="explanation-section">
                    <label>Why this section is risky?</label>
                    <div className="explanation-content">
                      <p>{sec.why}</p>
                    </div>
                  </div>
                </div>

                <hr className="issue-divider" />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ScanPage;
