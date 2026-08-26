import React, { useState, useEffect } from 'react';
import useAdminAuth from './hooks/useAdminAuth';
import AdminSidebar from './components/AdminSidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import ReportsPage from './pages/ReportsPage';
import ListingsPage from './pages/ListingsPage';
import { getPendingCount } from './api/reports';
import { Toaster } from 'sonner';
import './styles/admin.css';

function App() {
  const { user, loading, error, login, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pendingReports, setPendingReports] = useState(0);

  // Fetch pending reports count
  useEffect(() => {
    if (user) {
      getPendingCount()
        .then((res) => setPendingReports(res.count || 0))
        .catch(() => setPendingReports(0));
    }
  }, [user, activeTab]);

  const refreshPendingCount = () => {
    getPendingCount()
      .then((res) => setPendingReports(res.count || 0))
      .catch(() => setPendingReports(0));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'var(--text-muted)' }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <LoginPage onLogin={login} error={error} />
        <Toaster position="top-center" richColors />
      </>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        pendingReports={pendingReports}
        onLogout={logout}
      />

      <main className="admin-main">
        {activeTab === 'dashboard' && <DashboardPage />}
        {activeTab === 'users' && <UsersPage />}
        {activeTab === 'reports' && <ReportsPage onReportResolved={refreshPendingCount} />}
        {activeTab === 'listings' && <ListingsPage />}
      </main>

      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;