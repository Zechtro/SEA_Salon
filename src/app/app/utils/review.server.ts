import { db, Table_Review } from "./db.server";
import { Review } from "../models/reviews";

export async function addReview(reviewData: Review): Promise<string | null> {
  try {
    const reviewRef = db.doc(`${Table_Review.path}/${reviewData.nama_user}`);

    await reviewRef.set(reviewData);
    console.log("Review added with ID:", reviewData.nama_user);
    return reviewData.nama_user;
  } catch (error) {
    console.error("Error adding review:", error);
    return null;
  }
}
