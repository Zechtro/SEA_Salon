interface Customer {
    nama_customer: string,
    phone_number: number
}

interface MenitReservasi {
    menit: number,
    customer: Customer
}

interface JamReservasi {
    jam: number,
    menit: MenitReservasi[]
}

interface TanggalReservasi {
    tanggal: number,
    jam: JamReservasi[]
}

interface BulanReservasi {
    bulan: number,
    tanggal: TanggalReservasi[]
}

interface TahunReservasi {
    tahun: number,
    bulan: BulanReservasi[]
}

export interface ReservasiLayanan {
    nama_layanan: string,
    tahun: TahunReservasi[]
}