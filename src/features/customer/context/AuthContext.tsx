import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Load auth data from localStorage on mount
    const storedUser = localStorage.getItem('customer_user');
    const storedToken = localStorage.getItem('customer_token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        setIsAuthenticated(true);
      } catch (err) {
        // Clear invalid data
        localStorage.removeItem('customer_user');
        localStorage.removeItem('customer_token');
      }
    }
  }, []);

  const login = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    setIsAuthenticated(true);

    // Persist to localStorage - token without JSON.stringify to avoid extra quotes
    if (userData.id) {
      localStorage.setItem('customer_user', JSON.stringify(userData));
    }
    localStorage.setItem('customer_token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);

    // Clear localStorage
    localStorage.removeItem('customer_user');
    localStorage.removeItem('customer_token');
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('customer_user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
