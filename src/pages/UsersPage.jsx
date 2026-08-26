import React, { useEffect, useState, useCallback } from 'react';
import { FiSearch } from 'react-icons/fi';
import { getUsers, updateUserStatus, updateUserRole } from '../api/admin';
import { toast } from 'sonner';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actionModal, setActionModal] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUsers(page, 20, statusFilter, search);
      const data = res.data;
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await updateUserStatus(userId, newStatus);
      toast.success(`User status updated to ${newStatus}`);
      fetchUsers();
      setActionModal(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
      setActionModal(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>User Management</h1>
        <p>{totalElements} total users</p>
      </div>

      <div className="admin-table-wrapper">
        <div className="admin-table-toolbar">
          <div className="admin-table-search">
            <FiSearch size={16} />
            <input
              placeholder="Search by name, email, username..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div className="admin-table-filters">
            <select
              className="admin-filter-select"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="LOCKED">Locked</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="BANNED">Banned</option>
              <option value="DELETED">Deleted</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="admin-loading">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="admin-empty">
            <span>👤</span>
            <p>No users found</p>
          </div>
        ) : (
          <>
            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Username</th>
                    <th>Provider</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-cell">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt="" className="user-cell-avatar" />
                          ) : (
                            <div className="user-cell-avatar-placeholder">
                              {(user.displayName || user.username || '?')[0].toUpperCase()}
                            </div>
                          )}
                          <div className="user-cell-info">
                            <span className="user-cell-name">{user.displayName || '—'}</span>
                            <span className="user-cell-email">{user.email || '—'}</span>
                          </div>
                        </div>
                      </td>
                      <td>@{user.username || '—'}</td>
                      <td>{user.provider}</td>
                      <td>
                        <span className={`role-badge ${user.role?.toLowerCase()}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${user.status?.toLowerCase()}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className="action-btn primary"
                            onClick={() => setActionModal(user)}
                          >
                            Manage
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-pagination">
              <span className="admin-pagination-info">
                Page {page + 1} of {totalPages} ({totalElements} users)
              </span>
              <div className="admin-pagination-btns">
                <button disabled={page === 0} onClick={() => setPage(page - 1)}>
                  Previous
                </button>
                <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {actionModal && (
        <div className="admin-modal-overlay" onClick={() => setActionModal(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Manage User: {actionModal.displayName || actionModal.username}</h3>
              <button className="admin-modal-close" onClick={() => setActionModal(null)}>✕</button>
            </div>

            <div className="admin-modal-field">
              <label>Current Status</label>
              <span className={`status-badge ${actionModal.status?.toLowerCase()}`}>
                {actionModal.status}
              </span>
            </div>

            <div className="admin-modal-field">
              <label>Current Role</label>
              <span className={`role-badge ${actionModal.role?.toLowerCase()}`}>
                {actionModal.role}
              </span>
            </div>

            <div className="admin-modal-field">
              <label>Change Status</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                {['ACTIVE', 'SUSPENDED', 'BANNED', 'LOCKED'].map((s) => (
                  <button
                    key={s}
                    className={`action-btn ${s === 'BANNED' ? 'danger' : s === 'ACTIVE' ? 'success' : ''}`}
                    onClick={() => handleStatusChange(actionModal.id, s)}
                    disabled={actionModal.status === s}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="admin-modal-field">
              <label>Change Role</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                {['USER', 'ADMIN'].map((r) => (
                  <button
                    key={r}
                    className={`action-btn ${r === 'ADMIN' ? 'primary' : ''}`}
                    onClick={() => handleRoleChange(actionModal.id, r)}
                    disabled={actionModal.role === r}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="admin-modal-actions">
              <button className="admin-modal-btn cancel" onClick={() => setActionModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersPage;