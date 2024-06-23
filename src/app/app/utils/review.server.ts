// BARU CONTOH YA INI
// utils/firestore.server.ts 
import { firestore } from "firebase-admin";
import { db } from './db.server';

interface ReviewData {
  nama_user: string;
  rating: number;
  comment: string;
  date: Date; // Add a timestamp to track when the review was created
}

export async function addReview(reviewData: ReviewData): Promise<string | null> {
  try {
    const reviewRef = doc(db, "reviews", reviewData.nama_user);

    // Ensure the user doesn't already have a review
    const docSnap = await reviewRef.get();
    if (docSnap.exists()) {
      throw new Error(`Review for user ${reviewData.nama_user} already exists.`);
    }

    await setDoc(reviewRef, reviewData);
    console.log("Review added with ID:", reviewData.nama_user);
    return reviewData.nama_user; // Return the document ID (nama_user) on success
  } catch (error) {
    console.error("Error adding review:", error);
    return null; // Return null to indicate failure
  }
}
