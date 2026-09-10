import React, { useState } from "react";
import "../styles/SASTPage.css";

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
import { useScanContext } from "../context/ScanContext";
import { useToast } from "../context/ToastContext";

const SASTPage = () => {
  const { scanId, SATSresults, SATSsetResults } = useScanContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const { showToast } = useToast();

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunAnalysis = async () => {
    if (!scanId) {
      const msg = "No active scan ID found. Please upload a project or start a scan first.";
      setError(msg);
      showToast(msg, "warning");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.get(`/api/scan/staticscan/${scanId}`);
      console.log("Scan response:", res.data);

      if (!res.data || res.data.ans === undefined) {
        const msg = "Received an invalid scan response from the server.";
        setError(msg);
        showToast(msg, "error");
        return;
      }

      const ansEntries = Object.entries(res.data.ans || {});

      if (ansEntries.length === 0) {
        showToast("Analysis complete: No security vulnerabilities found in this code!", "info");
        SATSsetResults([]);
        setError(null);
        return;
      }

      const formatted = ansEntries.map(([filePath, sections]) => ({
        file: filePath,
        sections: (sections || []).map((sec) => ({
          section: sec[0] || "",
          fix: sec[1] || "",
          why: sec[2] || "Potential security risk detected.",
          type: "VULNERABILITY",
          severity: "HIGH"
        }))
      }));

      SATSsetResults(formatted);
      setError(null);
      showToast(`Analysis complete! Found issues in ${formatted.length} file(s).`, "success");
    } catch (err) {
      console.error("Failed to fetch scan results:", err);
      
      let userFriendlyError = "Failed to run static analysis scan.";
      const status = err.response?.status;
      const detail = err.response?.data?.detail;
      const message = err.response?.data?.message || err.message;

      if (err.code === "ERR_NETWORK" || err.message?.includes("Network Error")) {
        userFriendlyError = "Cannot reach backend server. Please verify the Python backend is running at http://localhost:5000.";
      } else if (status === 404) {
        userFriendlyError = `Scan workspace (ID: ${scanId}) was not found on the backend server. Please upload or clone your project again from the Dashboard.`;
      } else if (status === 500) {
        userFriendlyError = detail || `Internal server error during static analysis: ${message}`;
      } else if (detail) {
        userFriendlyError = typeof detail === "string" ? detail : JSON.stringify(detail);
      } else if (message) {
        userFriendlyError = message;
      }

      setError(userFriendlyError);
      showToast(userFriendlyError, "error");
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

      {error && (
        <div className="bg-red-950/40 border border-red-500/50 p-5 rounded-2xl text-red-200 my-6 flex items-start gap-4 shadow-xl backdrop-blur-md">
          <ErrorOutlineIcon className="text-red-400 mt-1 flex-shrink-0" sx={{ fontSize: 28 }} />
          <div className="flex-1">
            <h3 className="text-base font-bold text-red-300 mb-1">Analysis Error</h3>
            <p className="text-sm text-red-200/90 leading-relaxed">{error}</p>
            <button
              onClick={handleRunAnalysis}
              className="mt-3 px-4 py-1.5 bg-red-600/30 hover:bg-red-600/60 border border-red-500/50 rounded-xl text-xs font-bold text-red-100 transition-all cursor-pointer"
            >
              Retry Analysis
            </button>
          </div>
        </div>
      )}

      {!SATSresults.length && !loading && !error && (
        <div className="empty-state">
          <ShieldIcon className="shield-placeholder" />
          <p>Ready to analyze project security sections.</p>
        </div>
      )}

      {/* FILE LOOP */}
      {SATSresults.map((fileResult, fileIdx) => (
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

export default SASTPage;
