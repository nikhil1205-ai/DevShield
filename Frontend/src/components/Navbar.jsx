import React from 'react';
import '../styles/NavBar.css';

// Material UI Icons
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TuneIcon from '@mui/icons-material/Tune';
import HubIcon from '@mui/icons-material/Hub'; // Alternative project icon

const NavBar = () => {
  return (
    <nav className="header-root">
      <div className="header-inner">
        
        {/* 1. BRAND & PROJECT CONTEXT */}
        <div className="header-group-left">
          <div className="header-logo-stack">
            <div className="logo-accent">S</div>
            <span className="logo-text">DevShield</span>
          </div>
          
          <div className="header-v-divider" />
          
          <div className="project-context-menu">
            <div className="status-indicator-pulse" />
            <div className="context-meta">
              <span className="context-label">Current Project</span>
              <span className="context-title">My Web App</span>
            </div>
            <KeyboardArrowDownIcon className="ui-icon-xs" />
          </div>
        </div>

        {/* 2. GLOBAL SEARCH / COMMAND CENTER */}
        <div className="header-group-center">
          <div className="global-command-bar">
            <SearchIcon className="ui-icon-sm" />
            <input type="text" placeholder="Search vulnerabilities, docs, or files..." />
            <div className="keyboard-shortcut">
              <span className="k-key">Ctrl</span>
              <span className="k-key">K</span>
            </div>
          </div>
        </div>

        {/* 3. NOTIFICATIONS & USER IDENTITY */}
        <div className="header-group-right">
          <div className="utility-actions">
            <div className="action-trigger">
              <NotificationsNoneIcon />
              <span className="count-dot">3</span>
            </div>
            <div className="action-trigger">
              <TuneIcon />
            </div>
          </div>
          
          <div className="header-v-divider" />
          
          <div className="identity-block">
            <div className="identity-text">
              <span className="user-display-name">John Developer</span>
              <span className="user-tier-badge">Free Tier</span>
            </div>
            <div className="user-avatar-wrap">
              <img src="https://ui-avatars.com/api/?name=JD&background=3b82f6&color=fff" alt="User Avatar" />
              <div className="online-status" />
            </div>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default NavBar;