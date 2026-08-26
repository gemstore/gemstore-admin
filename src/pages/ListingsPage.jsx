import React, { useEffect, useState, useCallback } from 'react';
import { FiSearch } from 'react-icons/fi';
import { getListings, updateListingStatus } from '../api/admin';
import { toast } from 'sonner';

function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actionModal, setActionModal] = useState(null);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getListings(page, 20, statusFilter, search);
      const data = res.data;
      setListings(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Debounced search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleStatusChange = async (listingId, newStatus) => {
    try {
      await updateListingStatus(listingId, newStatus);
      toast.success(`Listing status updated to ${newStatus}`);
      fetchListings();
      setActionModal(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const formatPrice = (price, currency) => {
    if (!price) return '—';
    return `${currency || 'LKR'} ${Number(price).toLocaleString()}`;
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Listing Moderation</h1>
        <p>{totalElements} total listings</p>
      </div>

      <div className="admin-table-wrapper">
        {/* Toolbar */}
        <div className="admin-table-toolbar">
          <div className="admin-table-search">
            <FiSearch size={16} />
            <input
              placeholder="Search by title, listing number..."
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
              <option value="SOLD">Sold</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="ARCHIVED">Archived</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING_REVIEW">Pending Review</option>
            </select>
          </div>
        </div>

        {/* Table with horizontal scroll */}
        {loading ? (
          <div className="admin-loading">Loading listings...</div>
        ) : listings.length === 0 ? (
          <div className="admin-empty">
            <span>💎</span>
            <p>No listings found</p>
          </div>
        ) : (
          <>
            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Listing</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Seller</th>
                    <th>Status</th>
                    <th>Reports</th>
                    <th>Views</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing) => (
                    <tr key={listing.id}>
                      <td>
                        <div className="user-cell">
                          {listing.imageUrl ? (
                            <img
                              src={listing.imageUrl}
                              alt=""
                              className="user-cell-avatar"
                              style={{ borderRadius: '8px' }}
                            />
                          ) : (
                            <div className="user-cell-avatar-placeholder" style={{ borderRadius: '8px' }}>
                              💎
                            </div>
                          )}
                          <div className="user-cell-info">
                            <span className="user-cell-name" style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                              {listing.title || '—'}
                            </span>
                            <span className="user-cell-email">{listing.listingNumber}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{listing.gemstoneType || '—'}</td>
                      <td style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                        {formatPrice(listing.price, listing.currency)}
                      </td>
                      <td style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                        @{listing.sellerUsername || '—'}
                      </td>
                      <td>
                        <span className={`status-badge ${listing.status?.toLowerCase()}`}>
                          {listing.status}
                        </span>
                      </td>
                      <td>
                        {listing.reportCount > 0 ? (
                          <span style={{ color: '#ef4444', fontWeight: 600 }}>{listing.reportCount}</span>
                        ) : (
                          <span style={{ color: 'var(--text-subtle)' }}>0</span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.82rem' }}>{listing.viewsCount || 0}</td>
                      <td style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                        {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button className="action-btn primary" onClick={() => setActionModal(listing)}>
                            Manage
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="admin-pagination">
              <span className="admin-pagination-info">
                Page {page + 1} of {totalPages} ({totalElements} listings)
              </span>
              <div className="admin-pagination-btns">
                <button disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
                <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Action Modal */}
      {actionModal && (
        <div className="admin-modal-overlay" onClick={() => setActionModal(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Manage Listing</h3>
              <button className="admin-modal-close" onClick={() => setActionModal(null)}>✕</button>
            </div>

            <div className="admin-modal-field">
              <label>Title</label>
              <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600 }}>{actionModal.title}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="admin-modal-field">
                <label>Listing Number</label>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>{actionModal.listingNumber}</p>
              </div>
              <div className="admin-modal-field">
                <label>Price</label>
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>
                  {formatPrice(actionModal.price, actionModal.currency)}
                </p>
              </div>
              <div className="admin-modal-field">
                <label>Seller</label>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>@{actionModal.sellerUsername}</p>
              </div>
              <div className="admin-modal-field">
                <label>Current Status</label>
                <span className={`status-badge ${actionModal.status?.toLowerCase()}`}>
                  {actionModal.status}
                </span>
              </div>
              <div className="admin-modal-field">
                <label>Reports</label>
                <p style={{ margin: 0, fontSize: '0.85rem', color: actionModal.reportCount > 0 ? '#ef4444' : 'var(--text-muted)' }}>
                  {actionModal.reportCount || 0} reports
                </p>
              </div>
              <div className="admin-modal-field">
                <label>Views</label>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>{actionModal.viewsCount || 0}</p>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-soft)', margin: '16px 0' }} />

            <div className="admin-modal-field">
              <label>Change Status</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                {['ACTIVE', 'SUSPENDED', 'ARCHIVED', 'DELETED'].map((s) => (
                  <button
                    key={s}
                    className={`action-btn ${s === 'DELETED' || s === 'SUSPENDED' ? 'danger' : s === 'ACTIVE' ? 'success' : ''}`}
                    onClick={() => handleStatusChange(actionModal.id, s)}
                    disabled={actionModal.status === s}
                  >
                    {s}
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

export default ListingsPage;