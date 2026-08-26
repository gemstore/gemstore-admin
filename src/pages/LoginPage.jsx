import React, { useState } from 'react';
import '../styles/login.css';

function LoginPage({ onLogin, error }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onLogin(username, password);
    setLoading(false);
  };

  return (
    <div className="ig-root">
      <div className="ig-single-layout">
        <form className="ig-card" onSubmit={handleSubmit}>
          <div className="ig-logo">
            💎 Gemstore <span className="ig-admin-badge">Admin</span>
          </div>
          <p className="ig-subtitle">Sign in to access the admin dashboard</p>

          {error && <div className="ig-error">{error}</div>}

          <div className="ig-form">
            <input
              className="ig-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username or email"
              required
            />
            <input
              className="ig-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button type="submit" className="ig-primary-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>

          <div className="ig-footer">
            Admin access only • Gemstore © 2026
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;