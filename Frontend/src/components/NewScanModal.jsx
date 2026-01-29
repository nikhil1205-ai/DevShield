import React, { useState } from "react";
import "../styles/NewScanModal.css";

import GitHubIcon from "@mui/icons-material/GitHub";
import ComputerIcon from "@mui/icons-material/Computer";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import api from "../utils/api";

const NewScanModal = ({ isOpen, onClose,onScanSuccess }) => {
  const [step, setStep] = useState(1);

  // STEP-1 data
  const [projectName, setProjectName] = useState("");
  const [sourceType, setSourceType] = useState(null);

  // STEP-2 data
  const [repoUrl, setRepoUrl] = useState("");
  const [zipFile, setZipFile] = useState(null);

  // UX lock
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const resetState = () => {
    setStep(1);
    setProjectName("");
    setSourceType(null);
    setRepoUrl("");
    setZipFile(null);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (isSubmitting) return; // ⛔ prevent close while scanning
    resetState();
    onClose();
  };

  /* ===============================
     SEND DATA TO BACKEND
     =============================== */
  const startScan = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("projectName", projectName);
    formData.append("sourceType", sourceType);

    if (sourceType === "github") {
      formData.append("repoUrl", repoUrl);
    }

    if (sourceType === "zip") {
      formData.append("file", zipFile);
    }

    if (sourceType === "folder") {
      Array.from(zipFile).forEach((file) => {
        formData.append("files", file);
      });
    }

    try {
      const response = await api.post("/api/scan", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const scanId = response.data.scanId;
      onScanSuccess(scanId);
    } catch (error) {
      console.error(
        "Scan failed:",
        error.response?.data || error.message
      );
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        {/* HEADER */}
        <div className="modal-header">
          {step > 1 && !isSubmitting && (
            <button
              className="back-btn"
              onClick={() => setStep(step - 1)}
            >
              <ChevronLeftIcon /> Back
            </button>
          )}

          <button className="close-btn" onClick={handleClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="modal-body">

          {/* STEP 1: PROJECT NAME */}
          {step === 1 && (
            <div className="step-content animate-fade">
              <h2 className="step-title">Project Identity</h2>
              <p className="step-sub">
                What project are we securing today?
              </p>

              <div className="input-group">
                <input
                  type="text"
                  placeholder="Enter project name..."
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  autoFocus
                />
              </div>

              <button
                className="btn-next"
                disabled={!projectName}
                onClick={() => setStep(2)}
              >
                Next Step <ArrowForwardIcon />
              </button>
            </div>
          )}

          {/* STEP 2: SOURCE SELECTION */}
          {step === 2 && (
            <div className="step-content animate-fade">
              <h2 className="step-title">Choose Source</h2>
              <p className="step-sub">
                Select the location of your codebase.
              </p>

              <div className="source-options">
                <div
                  className="source-item"
                  onClick={() => {
                    setSourceType("github");
                    setStep(3);
                  }}
                >
                  <div className="icon-circle github">
                    <GitHubIcon />
                  </div>
                  <span>GitHub Repository</span>
                </div>

                <div
                  className="source-item"
                  onClick={() => setStep(4)}
                >
                  <div className="icon-circle local">
                    <ComputerIcon />
                  </div>
                  <span>Local Upload</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: GITHUB INPUT */}
          {step === 3 && (
            <div className="step-content animate-fade">
              <h2 className="step-title">GitHub Repository</h2>
              <p className="step-sub">
                Paste the repository URL.
              </p>

              <div className="input-group">
                <input
                  type="text"
                  placeholder="https://github.com/username/repo"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                />
              </div>

              <button
                className="btn-process"
                disabled={!repoUrl || isSubmitting}
                onClick={startScan}
              >
                {isSubmitting ? "Scanning..." : "Start Security Scan"}
              </button>
            </div>
          )}

          {/* STEP 4: ZIP / FOLDER UPLOAD */}
          {step === 4 && (
            <div className="step-content animate-fade">
              <h2 className="step-title">Upload ZIP or Folder</h2>
              <p className="step-sub">
                Upload your project as a ZIP file or select a folder.
              </p>

              <div className="drop-zone">
                <FolderZipIcon className="drop-icon" />

                <input
                  type="file"
                  className="file-input"
                  webkitdirectory="true"
                  directory="true"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (!files || files.length === 0) return;

                    // ZIP file
                    if (files.length === 1 && files[0].name.endsWith(".zip")) {
                      setZipFile(files[0]);
                      setSourceType("zip");
                      return;
                    }

                    // Folder upload
                    setZipFile(files);
                    setSourceType("folder");
                  }}
                />
              </div>

              <button
                className="btn-process"
                disabled={!zipFile || isSubmitting}
                onClick={startScan}
              >
                {isSubmitting ? "Uploading..." : "Upload & Scan"}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default NewScanModal;
