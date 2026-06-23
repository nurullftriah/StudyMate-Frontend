import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api, { setAuthToken } from '../api/axios.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('studymate_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    setAuthToken(token);
    if (!token) {
      setLoading(false);
      return;
    }

    api.get('/auth/me')
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        localStorage.removeItem('studymate_token');
        setToken(null);
        setUser(null);
        setAuthToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  async function saveSession(authResponse) {
    const nextToken = authResponse.token;
    localStorage.setItem('studymate_token', nextToken);
    setAuthToken(nextToken);
    setToken(nextToken);
    setUser(authResponse.user);
  }

  async function login(payload) {
    const response = await api.post('/auth/login', payload);
    await saveSession(response.data);
  }

  async function register(payload) {
    const response = await api.post('/auth/register', payload);
    await saveSession(response.data);
  }

  function logout() {
    localStorage.removeItem('studymate_token');
    setAuthToken(null);
    setToken(null);
    setUser(null);
  }

  function updateUser(nextUser) {
    setUser(nextUser);
  }

  const value = useMemo(() => ({
    token,
    user,
    loading,
    isAuthenticated: Boolean(token && user),
    login,
    register,
    logout,
    updateUser
  }), [token, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
}
