export type Role = 'USER' | 'ADMIN'

export interface Genre { id: string; name: string; price: number }

/** Película tal como la manda la API */
export interface ApiMovie {
  id: string
  movieTitle: string
  desc: string
  year?: number | null
  posterUrl?: string | null
  genres?: Genre[]
  director?: string | null
  actors?: string | null
  runtime?: string | null
  active?: boolean
  featured?: boolean
}

/** Película tal como la usa la interfaz */
export interface Movie {
  id: string
  title: string
  plot: string
  year: string
  posterUrl: string
  genres: Genre[]
  director: string
  actors: string
  runtime: string
  active: boolean
  featured: boolean
}

export interface MovieInput {
  movieTitle: string
  desc: string
  year: number | null
  posterUrl: string | null
  genreIds: string[]
  director: string | null
  actors: string | null
  runtime: string | null
}

export interface Profile { firstName: string; lastName: string; phone: string; address: string }

export interface UserDetails extends Profile {
  id: string
  dni: string
  email: string
  role: Role
  isEmailVerified: boolean
  cardLast4: string
}

export interface NewUser extends Profile { dni: string; email: string; password: string; cardNumber: string }

export interface AdminUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: Role
  createdAt: string
  suspended: boolean
  suspensionNote: string | null
}

export interface Rental {
  id: string
  movieId: string
  userId?: string
  movieTitle: string
  dias: number
  rentedAt: string
  returnedAt: string | null
}

export interface CartItem { id: string; title: string; posterUrl: string; days: number; pricePerDay: number; total: number }
