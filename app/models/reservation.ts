export interface ReservationEntry {
    name: string,
    phone_number: string,
    service: string,
    datetime: string
}

export function createReservation (name: string, phone_number: string, service: string, datetime: string) : ReservationEntry {
    return {
      name: name,
      phone_number: phone_number,
      service: service,
      datetime: datetime
    }
  }