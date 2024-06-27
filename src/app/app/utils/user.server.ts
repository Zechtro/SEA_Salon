import { db, Table_User } from './db.server'
import { User } from '../models/user'

export async function addUser(newUser: User, email:string) {
    try {
        const reviewRef = db.doc(`${Table_User.path}/${email}`);
    
        await reviewRef.set(newUser);
        console.log("User added with ID:", `${email}`);
        return `${email}`;
    } catch (error) {
        console.error("Error adding User:", error);
        return null;
    }
}

export async function isUserAdmin(email:string){
    return(await Table_User.doc(email).get()).data()?.admin
}