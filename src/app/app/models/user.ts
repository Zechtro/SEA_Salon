export interface User {
    // Email is implicitly a User ID, used as Document ID in Firestore
    full_name: string,
    phone_number: string,
    admin: boolean
}

export function createUser(full_name:string, phone_number:string): User{
    return {
        full_name: full_name,
        phone_number: phone_number,
        admin: false
    }
}