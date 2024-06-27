import { db, Table_Service } from "./db.server";
import { ServiceInfo } from "../models/service";

export async function addService(newService: ServiceInfo): Promise<string | null> {
  try {
    const serviceRef = db.doc(`${Table_Service.path}/${newService.service_name}`);

    await serviceRef.set(newService);
    console.log("Service added with ID:", newService.service_name);
    return newService.service_name
  } catch (error) {
    console.error("Error adding Service:", error);
    return null
  }
}