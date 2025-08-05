
"use client";

import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import nookies from 'nookies';
import { AuthContextType } from '@/lib/types';
import { usePathname, useRouter } from 'next/navigation';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        const token = await user.getIdToken();
        nookies.set(undefined, 'firebaseIdToken', token, { path: '/' });
        if (pathname === '/login' || pathname === '/signup') {
          router.push('/');
        }
      } else {
        nookies.destroy(undefined, 'firebaseIdToken', { path: '/' });
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);
  
  const signIn = async (email: string, password: string): Promise<void> => {
     const { signInWithEmailAndPassword } = await import('firebase/auth');
     try {
        await signInWithEmailAndPassword(auth, email, password);
     } catch (error) {
        throw error;
     }
  }
  
  const signUp = async (email: string, password: string): Promise<void> => {
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (error) {
        throw error;
      }
  }
  
  const signOut = async (): Promise<void> => {
      await auth.signOut();
      router.push('/login');
  }

  const value = { user, loading, signIn, signUp, signOut };

  // Don't render layout for login/signup pages
  if (pathname === '/login' || pathname === '/signup') {
      return <>{children}</>;
  }
  
  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
