import { db, Table_Branch } from "./db.server";
import { BranchInfo } from "../models/branch";

export async function addBranch(newBranch: BranchInfo): Promise<string | null> {
  try {
    const branchRef = db.doc(`${Table_Branch.path}/${newBranch.branch_name}`);

    await branchRef.set(newBranch);
    console.log("Branch added with ID:", newBranch.branch_name);
    return newBranch.branch_name
  } catch (error) {
    console.error("Error adding Branch:", error);
    return null
  }
}