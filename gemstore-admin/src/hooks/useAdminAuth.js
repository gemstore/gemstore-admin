import { useState, useEffect, useCallback } from 'react';
import { loginAdmin, getCurrentUser } from '../api/auth';
import { getAuthToken, setAuthToken, removeAuthToken } from '../api/config';

export default function useAdminAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      getCurrentUser(token)
        .then((data) => {
          if (data.role !== 'ADMIN') {
            removeAuthToken();
            setError('Access denied. Admin role required.');
            setUser(null);
          } else {
            setUser(data);
          }
        })
        .catch(() => {
          removeAuthToken();
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (identifier, password) => {
    setError('');
    try {
      const data = await loginAdmin(identifier, password);
      const token = data.token;

      if (!token) throw new Error('No token received');

      const userData = await getCurrentUser(token);
      if (userData.role !== 'ADMIN') {
        throw new Error('Access denied. Admin role required.');
      }

      setAuthToken(token);
      setUser(userData);
      return true;
    } catch (err) {
      setError(err.message || 'Login failed');
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    removeAuthToken();
    setUser(null);
  }, []);

  return { user, loading, error, login, logout };
}