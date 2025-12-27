import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock Users
const MOCK_RESPONDER: User = {
  id: 'resp-001',
  name: 'Chief Sarah Connor',
  email: 'admin@prometeo.com',
  role: UserRole.RESPONDER,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
};

const MOCK_CITIZEN: User = {
  id: 'cit-001',
  name: 'John Doe',
  email: 'citizen@prometeo.com',
  role: UserRole.CITIZEN,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const storedUser = localStorage.getItem('prometeo_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock Login Logic
    if (email === 'admin@prometeo.com' && password === 'admin123') {
      const user = MOCK_RESPONDER;
      setUser(user);
      localStorage.setItem('prometeo_user', JSON.stringify(user));
      setIsLoading(false);
      return true;
    }

    if (email === 'citizen@prometeo.com' && password === 'user123') {
      const user = MOCK_CITIZEN;
      setUser(user);
      localStorage.setItem('prometeo_user', JSON.stringify(user));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('prometeo_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
