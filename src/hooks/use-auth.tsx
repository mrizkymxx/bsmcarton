
"use client";

import React, { createContext, useContext } from 'react';
import { AuthUser } from '@/lib/types';

type AuthContextType = {
  user: AuthUser | null;
};

const AuthContext = createContext<AuthContextType>({ user: null });

export const AuthProvider = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: AuthUser | null;
}) => {
  return (
    <AuthContext.Provider value={{ user }}>
        {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
