import { db, Table_ReservasiLayanan } from './db.server'
import { ReservationEntry } from '../models/reservation'

export async function addReservation(newReservation: ReservationEntry): Promise<string | null> {
    try {
        const reviewRef = db.doc(`${Table_ReservasiLayanan.path}/${newReservation.name}-${newReservation.phone_number}-${newReservation.service}-${newReservation.datetime}`);
    
        await reviewRef.set(newReservation);
        console.log("Reservation added with ID:", `${Table_ReservasiLayanan.path}/${newReservation.name}-${newReservation.phone_number}-${newReservation.service}-${newReservation.datetime}`);
        return `${Table_ReservasiLayanan.path}/${newReservation.name}-${newReservation.phone_number}-${newReservation.service}-${newReservation.datetime}`;
    } catch (error) {
        console.error("Error adding reservation:", error);
        return null;
    }
}