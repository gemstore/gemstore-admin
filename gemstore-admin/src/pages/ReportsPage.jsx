import React, { useEffect, useState, useCallback } from 'react';
import { getReports, updateReport } from '../api/reports';
import { toast } from 'sonner';

const REPORT_ACTIONS = [
  { value: '', label: 'Select Action...' },
  { value: 'NO_ACTION', label: 'No Action' },
  { value: 'WARNING_ISSUED', label: 'Issue Warning' },
  { value: 'LISTING_REMOVED', label: 'Remove Listing' },
  { value: 'LISTING_SUSPENDED', label: 'Suspend Listing' },
  { value: 'USER_WARNED', label: 'Warn User' },
  { value: 'USER_SUSPENDED', label: 'Suspend User' },
  { value: 'USER_BANNED', label: 'Ban User' },
  { value: 'MESSAGE_DELETED', label: 'Delete Message' },
];

function ReportsPage({ onReportResolved }) {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewData, setReviewData] = useState({ status: '', actionTaken: '', adminNotes: '' });

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getReports(page, 20, statusFilter, typeFilter);
      const data = res.data;
      setReports(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, typeFilter]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const openReview = (report) => {
    setReviewModal(report);
    setReviewData({
      status: report.status || 'REVIEWING',
      actionTaken: report.actionTaken || '',
      adminNotes: report.adminNotes || '',
    });
  };

  const handleSubmitReview = async () => {
    if (!reviewData.status) {
      toast.error('Please select a status');
      return;
    }

    try {
      await updateReport(reviewModal.id, {
        status: reviewData.status,
        actionTaken: reviewData.actionTaken || null,
        adminNotes: reviewData.adminNotes || null,
      });
      toast.success('Report updated successfully');
      setReviewModal(null);
      fetchReports();
      if (onReportResolved) onReportResolved();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getReportTarget = (report) => {
    if (report.reportedListingTitle) return `Listing: ${report.reportedListingTitle}`;
    if (report.reportedUsername) return `User: @${report.reportedUsername}`;
    if (report.reportedMessageId) return `Message #${report.reportedMessageId}`;
    return '—';
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Report Management</h1>
        <p>{totalElements} total reports</p>
      </div>

      <div className="admin-table-wrapper">
        <div className="admin-table-toolbar">
          <div className="admin-table-filters">
            <select
              className="admin-filter-select"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="REVIEWING">Reviewing</option>
              <option value="RESOLVED">Resolved</option>
              <option value="DISMISSED">Dismissed</option>
            </select>

            <select
              className="admin-filter-select"
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}
            >
              <option value="">All Types</option>
              <option value="LISTING">Listing</option>
              <option value="USER">User</option>
              <option value="MESSAGE">Message</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="admin-loading">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="admin-empty">
            <span>🎉</span>
            <p>No reports found</p>
          </div>
        ) : (
          <>
            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Reason</th>
                    <th>Target</th>
                    <th>Reporter</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id}>
                      <td>#{report.id}</td>
                      <td>
                        <span className={`status-badge ${report.reportType?.toLowerCase()}`}>
                          {report.reportType}
                        </span>
                      </td>
                      <td>{report.reason?.replace(/_/g, ' ')}</td>
                      <td>{getReportTarget(report)}</td>
                      <td>@{report.reporterUsername || '—'}</td>
                      <td>
                        <span className={`status-badge ${report.status?.toLowerCase()}`}>
                          {report.status}
                        </span>
                      </td>
                      <td>{report.createdAt ? new Date(report.createdAt).toLocaleDateString() : '—'}</td>
                      <td>
                        <div className="actions-cell">
                          <button className="action-btn primary" onClick={() => openReview(report)}>
                            Review
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
                Page {page + 1} of {totalPages} ({totalElements} reports)
              </span>
              <div className="admin-pagination-btns">
                <button disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
                <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</button>
              </div>
            </div>
          </>
        )}
      </div>

      {reviewModal && (
        <div className="admin-modal-overlay" onClick={() => setReviewModal(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Review Report #{reviewModal.id}</h3>
              <button className="admin-modal-close" onClick={() => setReviewModal(null)}>✕</button>
            </div>

            <div className="admin-modal-field">
              <label>Type</label>
              <p style={{ margin: 0, fontSize: '0.88rem' }}>{reviewModal.reportType}</p>
            </div>
            <div className="admin-modal-field">
              <label>Reason</label>
              <p style={{ margin: 0, fontSize: '0.88rem' }}>{reviewModal.reason?.replace(/_/g, ' ')}</p>
            </div>
            <div className="admin-modal-field">
              <label>Target</label>
              <p style={{ margin: 0, fontSize: '0.88rem' }}>{getReportTarget(reviewModal)}</p>
            </div>
            {reviewModal.description && (
              <div className="admin-modal-field">
                <label>Description</label>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {reviewModal.description}
                </p>
              </div>
            )}
            <div className="admin-modal-field">
              <label>Reporter</label>
              <p style={{ margin: 0, fontSize: '0.88rem' }}>@{reviewModal.reporterUsername}</p>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-soft)', margin: '16px 0' }} />

            <div className="admin-modal-field">
              <label>Status</label>
              <select
                value={reviewData.status}
                onChange={(e) => setReviewData({ ...reviewData, status: e.target.value })}
              >
                <option value="PENDING">Pending</option>
                <option value="REVIEWING">Reviewing</option>
                <option value="RESOLVED">Resolved</option>
                <option value="DISMISSED">Dismissed</option>
              </select>
            </div>

            <div className="admin-modal-field">
              <label>Action to Take</label>
              <select
                value={reviewData.actionTaken}
                onChange={(e) => setReviewData({ ...reviewData, actionTaken: e.target.value })}
              >
                {REPORT_ACTIONS.map((a) => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
            </div>

            <div className="admin-modal-field">
              <label>Admin Notes</label>
              <textarea
                value={reviewData.adminNotes}
                onChange={(e) => setReviewData({ ...reviewData, adminNotes: e.target.value })}
                placeholder="Add notes about this report..."
              />
            </div>

            <div className="admin-modal-actions">
              <button className="admin-modal-btn cancel" onClick={() => setReviewModal(null)}>
                Cancel
              </button>
              <button className="admin-modal-btn submit" onClick={handleSubmitReview}>
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportsPage;