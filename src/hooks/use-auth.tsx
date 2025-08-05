
"use client";

import React, { createContext, useContext, useMemo } from 'react';
import type { User } from "firebase/auth";

// A mock user object for demonstration purposes
const mockUser = {
    uid: 'mock-uid-123',
    email: 'admin@example.com',
    displayName: 'Admin User',
    photoURL: '',
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    refreshToken: '',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => '',
    getIdTokenResult: async () => ({} as any),
    reload: async () => {},
    toJSON: () => ({}),
} as User;


type AuthContextType = {
  user: User | null;
};

const AuthContext = createContext<AuthContextType>({ user: null });

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // We'll use a mock user for now. In a real app, you'd fetch this.
  const user = useMemo(() => mockUser, []);

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
