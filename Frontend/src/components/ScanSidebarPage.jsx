import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import '../styles/ScanSidebarPage.css';

// Material UI Icons
import TerminalIcon from '@mui/icons-material/Terminal';
import BugReportIcon from '@mui/icons-material/BugReport';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import SecurityIcon from '@mui/icons-material/Security';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

const ScanSidebarPage = () => {
  const { scanId } = useParams();
  const location = useLocation();  

  const menuItems = [
    {
      id: 'sast',
      path: `/scan/${scanId}/sast`,
      label: 'Static Analysis',
      sub: 'Source Code (SAST)',
      icon: <TerminalIcon />,
      glow: '#6366f1'
    },
    {
      id: 'dast',
      path: `/scan/${scanId}/dast`,
      label: 'Dynamic Testing',
      sub: 'Runtime Scan (DAST)',
      icon: <BugReportIcon />,
      glow: '#0ea5e9'
    },
    {
      id: 'reports',
      path: `/scan/${scanId}/reports`,
      label: 'Detailed Reports',
      sub: 'Security Analytics',
      icon: <AutoGraphIcon />,
      glow: '#10b981'
    }
  ];

  return (
    <aside className="glass-sidebar">
      
      {/* BRANDING */}
      <div className="sidebar-brand">
        <div className="brand-glow-circle">
          <SecurityIcon className="brand-icon" />
        </div>
        <span>Security Suite</span>
      </div>

      {/* ROUTED NAVIGATION */}
      <nav className="analysis-nav">
        {menuItems.map((item) => {
          const isActive = location.pathname + location.search === item.path;

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-node ${isActive ? 'active' : ''}`}
              style={{ '--node-glow': item.glow }}
            >
              <div className="node-icon">{item.icon}</div>

              <div className="node-text">
                <span className="node-title">{item.label}</span>
                <span className="node-desc">{item.sub}</span>
              </div>

              {isActive && <div className="active-beam" />}
            </Link>
          );
        })}
      </nav>

      {/* SYSTEM STATUS FOOTER */}
      <div className="system-status-card">
        <div className="status-indicator">
          <RadioButtonCheckedIcon className="pulse-dot" />
          <span>Engine Online</span>
        </div>
        <div className="mini-progress-track">
          <div className="mini-progress-fill" />
        </div>
      </div>
    </aside>
  );
};

export default ScanSidebarPage;
