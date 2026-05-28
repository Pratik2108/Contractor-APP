'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Role = 'OWNER' | 'EMPLOYEE';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // For this demo, we'll check localStorage on mount to persist login
  useEffect(() => {
    const storedUser = localStorage.getItem('demo_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from local storage', e);
      }
    }
  }, []);

  const login = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('demo_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('demo_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
