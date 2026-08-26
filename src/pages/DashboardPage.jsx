import React, { useEffect, useState } from 'react';
import { FiUsers, FiPackage, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { getStats } from '../api/admin';
import StatsCard from '../components/StatsCard';

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="admin-loading">Loading dashboard...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p>Overview of your gemstone marketplace</p>
      </div>

      <div className="stats-grid">
        <StatsCard label="Total Users" value={stats?.totalUsers} icon={<FiUsers />} color="#3b82f6" />
        <StatsCard label="Active Listings" value={stats?.activeListings} icon={<FiPackage />} color="#22c55e" />
        <StatsCard label="Pending Reports" value={stats?.pendingReports} icon={<FiAlertTriangle />} color="#f59e0b" />
        <StatsCard label="Total Sold" value={stats?.totalSold} icon={<FiCheckCircle />} color="#8b5cf6" />
        <StatsCard label="Reviewing" value={stats?.reviewingReports} icon={<FiAlertTriangle />} color="#ef4444" />
        <StatsCard label="Suspended Listings" value={stats?.suspendedListings} icon={<FiPackage />} color="#ef4444" />
        <StatsCard label="Resolved Reports" value={stats?.resolvedReports} icon={<FiCheckCircle />} color="#10b981" />
        <StatsCard label="Total Reports" value={stats?.totalReports} icon={<FiAlertTriangle />} color="#6366f1" />
      </div>
    </div>
  );
}

export default DashboardPage;