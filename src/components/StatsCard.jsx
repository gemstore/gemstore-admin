import React from 'react';

function StatsCard({ label, value, icon, color }) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-card-label">{label}</span>
        <div className="stat-card-icon" style={{ background: `${color}20`, color }}>
          {icon}
        </div>
      </div>
      <div className="stat-card-value">{value ?? '—'}</div>
    </div>
  );
}

export default StatsCard;