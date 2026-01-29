import React, { useState } from 'react';
import '../styles/NewScanModal.css';

// Material UI Icons
import GitHubIcon from '@mui/icons-material/GitHub';
import ComputerIcon from '@mui/icons-material/Computer';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const NewScanModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    setStep(1);
    setProjectName('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        {/* Header Logic */}
        <div className="modal-header">
          {step > 1 && (
            <button className="back-btn" onClick={() => setStep(step - 1)}>
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
              <p className="step-sub">What project are we securing today?</p>
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
              <p className="step-sub">Select the location of your codebase.</p>
              <div className="source-options">
                <div className="source-item" onClick={() => setStep(3)}>
                  <div className="icon-circle github"><GitHubIcon /></div>
                  <span>GitHub Repository</span>
                </div>
                <div className="source-item" onClick={() => setStep(4)}>
                  <div className="icon-circle local"><ComputerIcon /></div>
                  <span>Local Machine</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: GITHUB PATH */}
          {step === 3 && (
            <div className="step-content animate-fade">
              <h2 className="step-title">GitHub Connection</h2>
              <p className="step-sub">Paste the public or private URL.</p>
              <div className="input-group">
                <input type="text" placeholder="https://github.com/username/repo" />
              </div>
              <button className="btn-process" onClick={handleClose}>
                Start Security Scan
              </button>
            </div>
          )}

          {/* STEP 4: LOCAL PATH */}
          {step === 4 && (
            <div className="step-content animate-fade">
              <h2 className="step-title">Local Folder</h2>
              <p className="step-sub">Upload your project folder securely.</p>
              <div className="drop-zone">
                <FolderZipIcon className="drop-icon" />
                <p>Drag & drop or <span>Browse files</span></p>
              </div>
              <button className="btn-process" onClick={handleClose}>
                Upload and Process
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewScanModal;