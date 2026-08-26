import { API_BASE_URL, getAuthHeaders, handleResponse } from './config';

export async function getReports(page = 0, size = 20, status = '', type = '') {
  const params = new URLSearchParams({ page, size });
  if (status) params.append('status', status);
  if (type) params.append('type', type);
  const res = await fetch(`${API_BASE_URL}/api/v1/reports/admin?${params}`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function getReportDetail(id) {
  const res = await fetch(`${API_BASE_URL}/api/v1/reports/admin/${id}`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function updateReport(id, data) {
  const res = await fetch(`${API_BASE_URL}/api/v1/reports/admin/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function getPendingCount() {
  const res = await fetch(`${API_BASE_URL}/api/v1/reports/admin/pending-count`, { headers: getAuthHeaders() });
  return handleResponse(res);
}