export interface Review {
  nama_user: string,
  rating: number,
  comment: string
}

export function createReview (nama_user: string, rating: number, comment: string) : Review {
  return {
    nama_user: nama_user,
    rating: rating,
    comment: comment
  }
}