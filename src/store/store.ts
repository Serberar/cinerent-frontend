import { createContext, useContext } from 'react'
import type { CartItem, Genre, Movie, Profile, Rental, UserDetails } from '../types'

export interface Store {
  movies: Movie[]
  genres: Genre[]
  featuredMovies: Movie[]
  items: CartItem[]
  user: UserDetails | null
  /** Ya se sabe si hay sesión */
  ready: boolean
  rentals: Rental[]
  loadError: string
  addToCart(movie: Movie, days: number, pricePerDay: number): void
  removeFromCart(id: string): void
  confirmRental(): Promise<void>
  login(email: string, password: string): Promise<UserDetails>
  logout(): Promise<void>
  refreshUser(): Promise<void>
  saveProfile(profile: Profile): Promise<void>
  saveCard(cardNumber: string): Promise<void>
  fetchRentals(): Promise<void>
  returnMovie(id: string): Promise<void>
  createGenre(name: string, price: number): Promise<void>
  updateGenre(id: string, name: string, price: number): Promise<void>
  deleteGenre(id: string): Promise<void>
  toggleFeatured(id: string): Promise<void>
}

export const StoreContext = createContext<Store | null>(null)

export function useStore(): Store {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore necesita StoreProvider')
  return store
}
