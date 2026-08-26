import React from 'react';
import { FiGrid, FiUsers, FiAlertTriangle, FiPackage, FiLogOut } from 'react-icons/fi';

function AdminSidebar({ activeTab, onChangeTab, pendingReports, onLogout }) {
  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <FiGrid /> },
    { key: 'users', label: 'Users', icon: <FiUsers /> },
    { key: 'reports', label: 'Reports', icon: <FiAlertTriangle />, badge: pendingReports },
    { key: 'listings', label: 'Listings', icon: <FiPackage /> },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <h2>
          💎 Gemstore <span className="brand-badge">Admin</span>
        </h2>
      </div>

      <nav className="admin-sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`admin-nav-item ${activeTab === item.key ? 'active' : ''}`}
            onClick={() => onChangeTab(item.key)}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.badge > 0 && <span className="admin-nav-badge">{item.badge}</span>}
          </button>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <button className="admin-logout-btn" onClick={onLogout}>
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;