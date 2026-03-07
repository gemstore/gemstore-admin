import React from 'react';
import AdminSidebar from './AdminSidebar';

function AdminLayout({ activeTab, onChangeTab, pendingReports, onLogout, children }) {
  return (
    <div className="admin-layout">
      <AdminSidebar
        activeTab={activeTab}
        onChangeTab={onChangeTab}
        pendingReports={pendingReports}
        onLogout={onLogout}
      />
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;