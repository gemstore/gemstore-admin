export const API_BASE_URL = 'http://localhost:8080';

export const getAuthToken = () => localStorage.getItem('adminToken');
export const setAuthToken = (token) => localStorage.setItem('adminToken', token);
export const removeAuthToken = () => localStorage.removeItem('adminToken');

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const handleResponse = async (response) => {
  if (!response.ok) {
    let message = 'Request failed';
    try {
      const errorBody = await response.json();
      message = errorBody.message || errorBody.error || message;
    } catch (e) {
      // JSON parse failed, use default message
      console.warn('Could not parse error response:', e);
    }

    if (response.status === 401) {
      removeAuthToken();
      window.location.href = '/login';
    }

    if (response.status === 403) {
      throw new Error('Access denied. Admin role required.');
    }

    throw new Error(message);
  }
  return response.json();
};