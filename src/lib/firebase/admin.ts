
'use server';

import 'server-only';
import * as admin from 'firebase-admin';

// Check if Firebase Admin SDK has already been initialized
if (admin.apps.length === 0) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        'Missing required Firebase admin credentials. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables.'
      );
    }
    
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error: any) {
    let detail = error.message;
    if (error instanceof SyntaxError) {
      detail = "Failed to parse service account. Please ensure the environment variables are set correctly.";
    }
    // Provide a more detailed error message to help with debugging
    console.error('Firebase admin initialization error:', detail);
    throw new Error(`Could not initialize Firebase Admin SDK. Please check your service account credentials. Details: ${detail}`);
  }
}

export const db = admin.firestore();
