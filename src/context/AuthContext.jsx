import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, initLocalDataIfEmpty } from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      initLocalDataIfEmpty();
      const token = localStorage.getItem('terratrace_token');
      if (token) {
        try {
          const currentUser = await api.getCurrentUser();
          setUser(currentUser);
        } catch {
          setUser({ id: 'demo-user', name: 'Alex Morgan', email: 'alex.morgan@terratrace.earth' });
        }
      } else {
        // Check local saved user
        const savedUser = localStorage.getItem('terratrace_user');
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            setUser(null);
          }
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    setUser(res.user);
    return res;
  };

  const signup = async (name, email, password) => {
    const res = await api.signup(name, email, password);
    setUser(res.user);
    return res;
  };

  const exploreDemo = async () => {
    const demoUser = {
      id: 'demo-user',
      name: 'Alex Morgan (Demo)',
      email: 'alex.morgan@terratrace.earth',
      isDemo: true,
    };
    localStorage.setItem('terratrace_token', 'jwt-demo-session-token');
    localStorage.setItem('terratrace_user', JSON.stringify(demoUser));
    await api.loadDemoData();
    setUser(demoUser);
    return demoUser;
  };

  const logout = () => {
    localStorage.removeItem('terratrace_token');
    localStorage.removeItem('terratrace_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        exploreDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
