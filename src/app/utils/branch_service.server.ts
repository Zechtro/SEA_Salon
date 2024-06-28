import { db, getTableBranchServices } from './db.server'
import { BranchServices } from '../models/branch_services';

export async function addBranchServices(branch_services: BranchServices, branch_name:string) {
    try {
        const branch_services_doc = db.doc(`${getTableBranchServices(branch_name).path}/${branch_services.service_name}`);
    
        await branch_services_doc.set(branch_services);
        console.log("BranchServices added with ID:", `${getTableBranchServices(branch_name).path}/${branch_services.service_name}`);
        return `${getTableBranchServices(branch_name).path}/${branch_services.service_name}`;
    } catch (error) {
        console.error("Error adding BranchServices:", error);
        return null;
    }
}