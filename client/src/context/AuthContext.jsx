import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getProfile, loginUser, registerUser } from '../services/authService';

const AuthContext = createContext(null);
const TOKEN_KEY = 'library_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await getProfile(token);
        setUser(profile);
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, [token]);

  const login = async (formData) => {
    const data = await loginUser(formData);
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);

    const profile = await getProfile(data.token);
    setUser(profile);

    return profile;
  };

  const register = async (formData) => {
    await registerUser(formData);
    return login({ email: formData.email, password: formData.password });
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
    }),
    [token, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
