import React, { useState } from "react";
import "../styles/NewScanModal.css";
import GitHubIcon from "@mui/icons-material/GitHub";
import ComputerIcon from "@mui/icons-material/Computer";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import api from "../utils/api";
import { useScanContext } from "../context/ScanContext";
import { useToast } from "../context/ToastContext";

const NewScanModal = ({ isOpen, onClose,onScanSuccess }) => {
  const [step, setStep] = useState(1);
  const [modalError, setModalError] = useState(null);

  // STEP-1 data
  const [projectName, setProjectName] = useState("");
  const [sourceType, setSourceType] = useState(null);

  // STEP-2 data
  const [repoUrl, setRepoUrl] = useState("");
  const [zipFile, setZipFile] = useState(null);

  // UX lock
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { scanId, setScanId } = useScanContext();
  const { showToast } = useToast();

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
    setModalError(null);

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
      Array.from(zipFile || []).forEach((file) => {
        formData.append("files", file);
      });
    }

    try {
      const response = await api.post("/api/scan", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const scanId = response.data.scanId;
      setScanId(scanId);
      showToast("Scan workspace created successfully!", "success");
      onScanSuccess(scanId);
    } catch (error) {
      console.error("Scan failed:", error.response?.data || error.message);
      const detail = error.response?.data?.detail;
      const message = error.response?.data?.message || error.message;

      let errText = "Failed to create scan workspace.";
      if (error.code === "ERR_NETWORK" || error.message?.includes("Network Error")) {
        errText = "Cannot connect to backend API server at http://localhost:5000. Please verify backend is running.";
      } else if (detail) {
        errText = typeof detail === "string" ? detail : JSON.stringify(detail);
      } else if (message) {
        errText = message;
      }

      setModalError(errText);
      showToast(errText, "error");
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

          {modalError && (
            <div className="bg-red-950/50 border border-red-500/50 text-red-200 p-3 rounded-xl mb-4 text-xs flex items-center justify-between">
              <span>{modalError}</span>
              <button onClick={() => setModalError(null)} className="text-red-400 font-bold ml-2">✕</button>
            </div>
          )}

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
