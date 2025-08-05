
import * as admin from 'firebase-admin';

if (admin.apps.length === 0) {
    try {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
        if (!privateKey) {
            throw new Error('FIREBASE_PRIVATE_KEY environment variable is not set.');
        }

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                privateKey: privateKey,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            }),
        });
    } catch (error: any) {
        console.error('Firebase admin initialization error:', error.message);
        throw new Error(`Could not initialize Firebase Admin SDK. Please check your service account credentials. Details: ${error.message}`);
    }
}

export const db = admin.firestore();
