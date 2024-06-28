import { db, Table_Review } from "./db.server";
import { Review } from "../models/reviews";

export async function addReview(reviewData: Review, userEmail:string): Promise<string | null> {
  try {
    const reviewRef = db.doc(`${Table_Review.path}/${userEmail}`);

    await reviewRef.set(reviewData);
    console.log("Review added with ID:", userEmail);
    return userEmail
  } catch (error) {
    console.error("Error adding review:", error);
    return null
  }
}
