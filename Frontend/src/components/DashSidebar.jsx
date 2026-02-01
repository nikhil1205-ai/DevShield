import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/DashSidebar.css';

// Material UI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ShieldIcon from '@mui/icons-material/Shield';

import NewScanModal from './NewScanModal';

const DashSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: <DashboardIcon />, path: '/dash' },

    {
      name: 'New Scan',
      icon: <RocketLaunchIcon />,
      action: () => setIsModalOpen(true),
    },
    { name: 'Reports', icon: <AssignmentIcon />, path: '/reports' },
    { name: 'Settings', icon: <SettingsSuggestIcon />, path: '/settings' },
  ];

  return (
    <>
      <aside className={`sidebar-root ${collapsed ? 'collapsed' : ''}`}>

        {/* SIDEBAR HEADER */}
        <div className="sidebar-header">
          <div className="brand-icon-wrapper">
            <ShieldIcon className="brand-logo-icon" />
          </div>
          {!collapsed && <span className="brand-name">ShieldNet</span>}
        </div>

        {/* NAVIGATION */}
        <nav className="sidebar-nav">
          <div className="nav-label">{!collapsed && 'Platform'}</div>

          {menuItems.map((item, index) => {
            // 👉 ACTION ITEM (New Scan)
            if (item.action) {
              return (
                <div
                  key={index}
                  className={`nav-item-link ${
                    isModalOpen ? 'action-active' : ''
                  }`}
                  onClick={item.action}
                  role="button"
                  title={collapsed ? item.name : ''}
                >
                  <div className="icon-box">{item.icon}</div>
                  {!collapsed && (
                    <span className="item-text">{item.name}</span>
                  )}
                  {isModalOpen && <div className="active-indicator" />}
                </div>
              );
            }

            // 👉 ROUTE ITEM
            return (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item-link ${isActive ? 'active' : ''}`
                }
                title={collapsed ? item.name : ''}
              >
                <div className="icon-box">{item.icon}</div>
                {!collapsed && (
                  <span className="item-text">{item.name}</span>
                )}
                <div className="active-indicator" />
              </NavLink>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="sidebar-footer">
          <button
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </button>
        </div>
      </aside>

      {/* NEW SCAN MODAL */}
      <NewScanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onScanSuccess={(scanId) => {
          setIsModalOpen(false);
          navigate(`/scan/${scanId}`);
        }}
      />
    </>
  );
};

export default DashSidebar;
