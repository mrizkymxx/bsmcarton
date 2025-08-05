
import * as admin from 'firebase-admin';

const privateKey = process.env.FIREBASE_PRIVATE_KEY;
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

if (!projectId || !privateKey || !clientEmail) {
    throw new Error('Firebase Admin SDK credentials are not set. Please check your environment variables.');
}

// Only initialize the app if it hasn't been initialized yet
if (admin.apps.length === 0) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: projectId,
                clientEmail: clientEmail,
                privateKey: privateKey.replace(/\\n/g, '\n'),
            }),
        });
    } catch (error: any) {
        console.error('Firebase admin initialization error:', error.message);
        // Throw a more specific error to help diagnose the issue.
        throw new Error(`Could not initialize Firebase Admin SDK. Please check your service account credentials. Details: ${error.message}`);
    }
}

export const auth = admin.auth();
export const db = admin.firestore();
