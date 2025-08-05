
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  "projectId": "cartonflow-shyw4",
  "appId": "1:142328250405:web:1939db7116e40b4cbfbfcc",
  "storageBucket": "cartonflow-shyw4.appspot.com",
  "apiKey": "AIzaSyAFUf5AUsT8fvqHYvA_vDVVjBRuVXWsxwA",
  "authDomain": "cartonflow-shyw4.firebaseapp.com",
  "messagingSenderId": "142328250405"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };
