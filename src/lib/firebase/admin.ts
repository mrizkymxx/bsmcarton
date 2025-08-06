
import * as admin from 'firebase-admin';

if (admin.apps.length === 0) {
    try {
        const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

        if (!serviceAccountEnv) {
            throw new Error('The FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set.');
        }

        const serviceAccount = JSON.parse(serviceAccountEnv);

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });

    } catch (error: any) {
        console.error('Firebase admin initialization error:', error.message);
        let detail = error.message;
        if (error instanceof SyntaxError) {
            detail = "Failed to parse service account JSON. Please ensure it's a valid, single-line JSON string.";
        }
        throw new Error(`Could not initialize Firebase Admin SDK. Please check your service account credentials. Details: ${detail}`);
    }
}

export const db = admin.firestore();
