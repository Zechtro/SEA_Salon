import dotenv from 'dotenv';
import { initializeApp, getApps } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';
import admin from "firebase-admin";
import { CollectionReference, DocumentData } from 'firebase-admin/firestore';
import { applicationDefault, initializeApp as initializeAdminApp, } from 'firebase-admin/app'; 
import { ReservasiLayanan } from '../models/reservasi';
import { Review } from '../models/reviews';

dotenv.config()

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

if (!getApps().length) {
    initializeAdminApp({
      credential: applicationDefault(),
      databaseURL: `https://${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseio.com`,
    });
  }
  
export const db = admin.firestore();
// const adminAuth = admin.auth();

// let app;
if (!getApps().length) { 
  initializeApp(firebaseConfig);
}

// const analytics = getAnalytics(app);

const createCollection = <T = DocumentData>(collectionName: string): CollectionReference<T> => {
    return db.collection(collectionName) as CollectionReference<T>;
}

export const Table_ReservasiLayanan = createCollection<ReservasiLayanan>('reservasi')
export const Table_Review = createCollection<Review>('reviews')