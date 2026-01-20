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
    // Ensure token is a plain string without quotes or JSON encoding
    let cleanToken = userToken;
    
    // Remove outer quotes if present
    while (cleanToken.startsWith('"') || cleanToken.startsWith("'")) {
      cleanToken = cleanToken.slice(1);
    }
    while (cleanToken.endsWith('"') || cleanToken.endsWith("'")) {
      cleanToken = cleanToken.slice(0, -1);
    }
    
    // Try to parse if it's JSON-encoded
    try {
      if (cleanToken.startsWith('{') || cleanToken.startsWith('[')) {
        const parsed = JSON.parse(cleanToken);
        cleanToken = parsed.token || parsed.message || cleanToken;
      }
    } catch {
      // Not JSON, continue with cleaning
    }
    
    // Final check for remaining quotes
    cleanToken = cleanToken.replace(/^["']|["']$/g, '');
    
    console.log('[AuthContext.login] Setting token:', {
      original: userToken.substring(0, 50) + '...',
      cleaned: cleanToken.substring(0, 50) + '...',
      hasQuotes: cleanToken.includes('"'),
      startsWithBearer: cleanToken.startsWith('Bearer ')
    });

    setUser(userData);
    setToken(cleanToken);
    setIsAuthenticated(true);

    // Persist to localStorage (plain string, no JSON.stringify)
    localStorage.setItem('customer_user', JSON.stringify(userData));
    localStorage.setItem('customer_token', cleanToken);
    localStorage.setItem('auth_token', cleanToken);
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
