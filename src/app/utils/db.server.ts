import dotenv from 'dotenv';
import { initializeApp, getApps } from 'firebase/app';
import admin from "firebase-admin";
import { CollectionReference, DocumentData } from 'firebase-admin/firestore';
import { applicationDefault, initializeApp as initializeAdminApp, } from 'firebase-admin/app'; 
import { ReservationEntry } from '../models/reservation';
import { Review } from '../models/reviews';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  signOut,
} from "firebase/auth";
import { User } from '../models/user';
import { ServiceInfo } from '..//models/service';

dotenv.config()

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

if (!getApps().length) {
    initializeAdminApp({
      credential: admin.credential.cert({
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        projectId: process.env.FIREBASE_PROJECT_ID
      }),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
    });
  }
  
export const db = admin.firestore();
export const adminAuth = admin.auth();

if (!getApps().length) { 
  initializeApp(firebaseConfig);
}

const createCollection = <T = DocumentData>(collectionName: string): CollectionReference<T> => {
    return db.collection(collectionName) as CollectionReference<T>;
}

export async function signIn(email:string, password:string) {
  const auth = getAuth();
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUp(email:string, password:string) {
  const auth = getAuth();
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function getSessionToken(idToken: string) {
  const decodedToken = await adminAuth.verifyIdToken(idToken);
  if (new Date().getTime() / 1000 - decodedToken.auth_time > 5 * 60) {
    throw new Error("Recent sign in required");
  }
  const twoWeeks = 60 * 60 * 24 * 14 * 1000;
  return adminAuth.createSessionCookie(idToken, { expiresIn: twoWeeks });
}

export async function signOutFirebase() {
  await signOut(getAuth());
}

export const Table_Review = createCollection<Review>('reviews')
export const Table_Service = createCollection<ServiceInfo>('services')
export const Table_User = createCollection<User>('users')
export function getTableCustomerReservation(email:string) {
  return createCollection<ReservationEntry>(`reservation-${email}`)
}