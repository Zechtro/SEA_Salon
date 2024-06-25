// BARU CONTOH YA INI
// utils/firestore.server.ts 
import { db, Table_Review } from "./db.server";
import { Review } from "../models/reviews";

export async function addReview(reviewData: Review): Promise<string | null> {
  try {
    const reviewRef = db.doc(`${Table_Review.path}/${reviewData.nama_user}`);

    // Ensure the user doesn't already have a review

    await reviewRef.set(reviewData);
    console.log("Review added with ID:", reviewData.nama_user);
    return reviewData.nama_user; // Return the document ID (nama_user) on success
  } catch (error) {
    console.error("Error adding review:", error);
    return null; // Return null to indicate failure
  }
}
