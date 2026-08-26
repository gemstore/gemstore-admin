import { API_BASE_URL, getAuthHeaders, handleResponse } from './config';

// Dashboard stats
export async function getStats() {
  const res = await fetch(`${API_BASE_URL}/api/admin/stats`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

// Users
export async function getUsers(page = 0, size = 20, status = '', search = '') {
  const params = new URLSearchParams({ page, size });
  if (status) params.append('status', status);
  if (search) params.append('search', search);
  const res = await fetch(`${API_BASE_URL}/api/admin/users?${params}`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function getUserDetail(id) {
  const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function updateUserStatus(id, status) {
  const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}/status/${status}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function updateUserRole(id, role) {
  const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}/role/${role}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// Listings
export async function getListings(page = 0, size = 20, status = '', search = '') {
  const params = new URLSearchParams({ page, size });
  if (status) params.append('status', status);
  if (search) params.append('search', search);
  const res = await fetch(`${API_BASE_URL}/api/admin/listings?${params}`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function updateListingStatus(id, status) {
  const res = await fetch(`${API_BASE_URL}/api/admin/listings/${id}/status/${status}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}