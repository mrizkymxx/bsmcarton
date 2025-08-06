
'use server';

import 'server-only';
import { cookies } from 'next/headers';
import { db } from '@/lib/firebase/admin';
import { User } from '../types';
import { encrypt } from '@/lib/session';
import { redirect } from 'next/navigation';

const usersCollection = db.collection('users');

export async function login(_: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Username and password are required.' };
  }

  try {
    const userQuery = await usersCollection.where('username', '==', username).limit(1).get();

    if (userQuery.empty) {
      return { error: 'Invalid username or password.' };
    }

    const userDoc = userQuery.docs[0];
    const user = { id: userDoc.id, ...userDoc.data() } as User;

    // IMPORTANT: This is a placeholder for password comparison.
    // In a real application, you should use a secure password hashing library like bcrypt.
    const isPasswordValid = password === user.password;
    
    if (!isPasswordValid) {
      return { error: 'Invalid username or password.' };
    }
    
    // Create session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const sessionPayload = {
        userId: user.id,
        name: user.name,
        email: user.email,
    };
    const session = await encrypt(sessionPayload);

    cookies().set('session', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });

    redirect('/');

  } catch (error) {
    console.error('Login error:', error);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}

// This function is for one-time use to create the initial admin user.
export async function createAdminUser() {
    const username = 'admin';
    const password = 'password'; 
    const name = 'Admin User';
    const email = 'admin@example.com';

    try {
        const userQuery = await usersCollection.where('username', '==', username).get();
        if (!userQuery.empty) {
            console.log('Admin user already exists.');
            return { message: 'Admin user already exists.' };
        }

        // IMPORTANT: In a real app, hash the password before saving.
        const newUser: Omit<User, 'id'> = {
            username,
            password: password, // Store plain text password
            name,
            email,
        };

        const docRef = await usersCollection.add(newUser);
        console.log('Admin user created with ID:', docRef.id);
        return { message: 'Admin user created successfully.' };
    } catch (error) {
        console.error('Error creating admin user:', error);
        throw new Error('Failed to create admin user.');
    }
}
