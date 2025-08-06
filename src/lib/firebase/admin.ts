
import * as admin from 'firebase-admin';

if (admin.apps.length === 0) {
    try {
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

        if (!projectId) {
            throw new Error('FIREBASE_PROJECT_ID is not set.');
        }
        if (!privateKey) {
            throw new Error('FIREBASE_PRIVATE_KEY is not set.');
        }
        if (!clientEmail) {
            throw new Error('FIREBASE_CLIENT_EMAIL is not set.');
        }

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                privateKey: privateKey.replace(/\\n/g, '\n'),
                clientEmail,
            }),
        });
    } catch (error: any) {
        console.error('Firebase admin initialization error:', error.message);
        throw new Error(`Could not initialize Firebase Admin SDK. Please check your service account credentials. Details: ${error.message}`);
    }
}

export const db = admin.firestore();
