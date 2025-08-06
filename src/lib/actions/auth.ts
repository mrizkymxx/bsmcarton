'use server';

import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { db } from '@/lib/firebase/admin';
import { User } from '../types';
import bcrypt from 'bcryptjs';

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);
const usersCollection = db.collection('users');

export async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.log('Failed to verify session');
    return null;
  }
}

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const userDoc = await usersCollection.doc(userId).get();
  
  if (!userDoc.exists) {
      throw new Error("User not found for session creation.");
  }
  
  const userData = userDoc.data() as Omit<User, 'id' | 'password'>;

  const sessionPayload = {
      userId,
      ...userData,
  };

  const session = await encrypt(sessionPayload);

  cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function verifySession() {
  const cookie = cookies().get('session')?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    return null;
  }

  return { isAuth: true, userId: session.userId, name: session.name, email: session.email };
}

export async function deleteSession() {
  cookies().delete('session');
}


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

    const isPasswordValid = await bcrypt.compare(password, user.password!);
    
    if (!isPasswordValid) {
      return { error: 'Invalid username or password.' };
    }
    
    await createSession(user.id);
    
    // The redirect will be handled by the middleware, so we just return success
    return { success: true };

  } catch (error) {
    console.error('Login error:', error);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}

// This function is for one-time use to create the initial admin user.
// You can call this from a temporary route or a script.
export async function createAdminUser() {
    const username = 'admin';
    const password = 'password'; // Use a strong password in a real app
    const name = 'Admin User';
    const email = 'admin@example.com';

    try {
        const userQuery = await usersCollection.where('username', '==', username).get();
        if (!userQuery.empty) {
            console.log('Admin user already exists.');
            return { message: 'Admin user already exists.' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser: Omit<User, 'id'> = {
            username,
            password: hashedPassword,
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