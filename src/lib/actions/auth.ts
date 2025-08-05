
"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/firebase/admin";
import { getAuth } from "firebase/auth";
import { app } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthUser } from "../types";

const clientAuth = getAuth(app);
const SESSION_COOKIE_NAME = "sessionToken";
const SESSION_DURATION_DAYS = 14;

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
    const idToken = await userCredential.user.getIdToken();
    const expiresIn = 60 * 60 * 24 * SESSION_DURATION_DAYS * 1000; // 14 days

    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    cookies().set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expiresIn,
      path: "/",
    });
    
    return { success: true };
  } catch (error: any) {
    let errorMessage = "An unknown error occurred.";
    switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            errorMessage = "Invalid email or password. Please try again.";
            break;
        case 'auth/too-many-requests':
            errorMessage = "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.";
            break;
        default:
            errorMessage = "An unexpected error occurred during login. Please try again later.";
            break;
    }
    console.error("Login Error:", error.code, error.message);
    return { success: false, error: errorMessage };
  }
}

export async function logout() {
  cookies().delete(SESSION_COOKIE_NAME);
}

export async function getAuthenticatedUser(): Promise<AuthUser | null> {
    const sessionToken = cookies().get(SESSION_COOKIE_NAME)?.value;

    if (!sessionToken) {
        return null;
    }

    try {
        const decodedToken = await auth.verifySessionCookie(sessionToken, true);
        const user = await auth.getUser(decodedToken.uid);

        return {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        } as AuthUser;

    } catch (error) {
        // Session cookie is invalid or expired.
        // It's good practice to delete the invalid cookie.
        console.warn("Invalid session cookie. Clearing cookie.");
        cookies().delete(SESSION_COOKIE_NAME);
        return null;
    }
}
