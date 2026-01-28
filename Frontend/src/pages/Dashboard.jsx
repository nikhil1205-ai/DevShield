import React, { useState } from 'react';
import '../styles/Dashboard.css';

import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import GitHubIcon from '@mui/icons-material/GitHub';
import HistoryIcon from '@mui/icons-material/History';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="shieldnet-dashboard">
        <main className="main-content">
          
          {/* 1. WELCOME & SECURITY STATUS */}
          <section className="dashboard-section welcome-area">
            <div className="welcome-header">
              <h1>Welcome back 👋</h1>
              <p>Here’s the current security health of your application.</p>
            </div>
            <div className="health-card-glass">
              <h3>Security Health Score</h3>
              <div className="health-viz">
                <div className="score-circle">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle-active" strokeDasharray="84, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <span className="score-number">84</span>
                </div>
                <div className="score-info">
                  <span className="status-badge moderate">Moderate Risk</span>
                  <p>3 active critical issues</p>
                </div>
              </div>
            </div>
          </section>

          {/* 2. QUICK ACTIONS */}
          <section className="dashboard-section quick-actions-grid">
            <div className="action-tile highlight"><RocketLaunchIcon /> <span>Start New Scan</span></div>
            <div className="action-tile"><HistoryIcon /> <span>View Last Results</span></div>
            <div className="action-tile"><FolderZipIcon /> <span>Upload Project</span></div>
            <div className="action-tile"><GitHubIcon /> <span>Connect GitHub</span></div>
          </section>

          {/* 3. VULNERABILITY SUMMARY */}
          <section className="dashboard-section summary-grid">
            <div className="stat-pill crit"><h3>02</h3><p>Critical</p></div>
            <div className="stat-pill high"><h3>05</h3><p>High</p></div>
            <div className="stat-pill med"><h3>12</h3><p>Medium</p></div>
            <div className="stat-pill low"><h3>08</h3><p>Low</p></div>
          </section>

          {/* 4. RECENT SCANS */}
          <section className="dashboard-section glass-container">
            <h3>Recent Scans</h3>
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Project</th>
                    <th>Type</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Jan 28, 2026</td>
                    <td>My Web App</td>
                    <td>Full Scan</td>
                    <td><span className="score-tag">84</span></td>
                    <td><span className="status-pill">Completed</span></td>
                    <td><button className="btn-link">View Details</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <div className="dashboard-footer-row">
            {/* 5. RISK INSIGHTS (PLAIN ENGLISH) */}
            <section className="dashboard-section glass-container insight-panel">
              <h3>What Needs Attention</h3>
              <div className="insight-card">
                <ErrorOutlineIcon className="icon-crit" />
                <div>
                  <strong>Broken Auth:</strong> User input is not validated in login API.
                  <p>Attackers could bypass your login screen.</p>
                </div>
              </div>
              <div className="insight-card">
                <ErrorOutlineIcon className="icon-high" />
                <div>
                  <strong>Data Leak:</strong> Sensitive data is exposed in API response.
                  <p>Tokens found in JSON metadata.</p>
                </div>
              </div>
            </section>

            <div className="side-column">
              {/* 6. SECURITY TREND */}
              <section className="dashboard-section glass-container trend-panel">
                <h3>Security Trend</h3>
                <div className="mock-chart">
                  <div className="chart-bar" style={{height: '45%'}}></div>
                  <div className="chart-bar" style={{height: '65%'}}></div>
                  <div className="chart-bar active" style={{height: '84%'}}></div>
                </div>
              </section>

              {/* 7. DEVELOPER TIPS */}
              <section className="dashboard-section glass-container tip-panel">
                <h3><LightbulbIcon /> Tip of the Day</h3>
                <p>Always validate and sanitize user input to prevent injection attacks.</p>
              </section>
            </div>
          </div>
        </main>
    </div>
  );
};

export default Dashboard;