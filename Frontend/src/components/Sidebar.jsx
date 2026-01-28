import React, { useState } from 'react';
import '../styles/Sidebar.css';

// Material UI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ShieldIcon from '@mui/icons-material/Shield';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: <DashboardIcon />, active: true },
    { name: 'New Scan', icon: <RocketLaunchIcon />, active: false },
    { name: 'Scan Results', icon: <TroubleshootIcon />, active: false },
    { name: 'Reports', icon: <AssignmentIcon />, active: false },
    { name: 'Settings', icon: <SettingsSuggestIcon />, active: false },
  ];

  return (
    <aside className={`sidebar-root ${collapsed ? 'collapsed' : ''}`}>
      {/* SIDEBAR HEADER */}
      <div className="sidebar-header">
        <div className="brand-icon-wrapper">
          <ShieldIcon className="brand-logo-icon" />
        </div>
        {!collapsed && <span className="brand-name">ShieldNet</span>}
      </div>

      {/* NAVIGATION MENU */}
      <nav className="sidebar-nav">
        <div className="nav-label">{!collapsed && "Platform"}</div>
        {menuItems.map((item, index) => (
          <div 
            key={index} 
            className={`nav-item-link ${item.active ? 'active' : ''}`}
            title={collapsed ? item.name : ""}
          >
            <div className="icon-box">{item.icon}</div>
            {!collapsed && <span className="item-text">{item.name}</span>}
            {item.active && <div className="active-indicator" />}
          </div>
        ))}
      </nav>

      {/* SIDEBAR FOOTER / COLLAPSE TOGGLE */}
      <div className="sidebar-footer">
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;