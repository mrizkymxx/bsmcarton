
import * as admin from 'firebase-admin';

if (admin.apps.length === 0) {
    try {
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;

        if (!projectId || !clientEmail || !privateKey) {
            throw new Error('Missing Firebase credentials. Please ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set.');
        }

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey: privateKey.replace(/\\n/g, '\n'),
            }),
        });

    } catch (error: any) {
        console.error('Firebase admin initialization error:', error.message);
        let detail = error.message;
        if (error instanceof SyntaxError) {
            detail = "Failed to parse service account. Please ensure the environment variables are set correctly.";
        }
        throw new Error(`Could not initialize Firebase Admin SDK. Please check your service account credentials. Details: ${detail}`);
    }
}

export const db = admin.firestore();
