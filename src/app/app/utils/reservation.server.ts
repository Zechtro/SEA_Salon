import { db, getTableCustomerReservation } from './db.server'
import { ReservationEntry } from '../models/reservation'

export async function addReservation(newReservation: ReservationEntry, userEmail: string) {
    try {
        const reservationRef = db.doc(`${getTableCustomerReservation(userEmail).path}/${newReservation.name}-${newReservation.phone_number}-${newReservation.service}-${newReservation.datetime}`);
    
        await reservationRef.set(newReservation);
        console.log("Reservation added with ID:", `${getTableCustomerReservation(userEmail).path}/${newReservation.name}-${newReservation.phone_number}-${newReservation.service}-${newReservation.datetime}`);
        return `${getTableCustomerReservation(userEmail).path}/${newReservation.name}-${newReservation.phone_number}-${newReservation.service}-${newReservation.datetime}`;
    } catch (error) {
        console.error("Error adding reservation:", error);
        return null;
    }
}