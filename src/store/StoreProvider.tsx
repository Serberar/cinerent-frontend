import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api } from '../services/api'
import { whenSessionExpires } from '../services/http'
import type { CartItem, Genre, Movie, Profile, Rental, UserDetails } from '../types'
import { StoreContext, type Store } from './store'

const CART = 'cart'

function savedCart(): CartItem[] {
  try {
    const items: unknown = JSON.parse(localStorage.getItem(CART) ?? '[]')
    return Array.isArray(items) ? items as CartItem[] : []
  } catch {
    return [] // carrito ilegible: se empieza de cero
  }
}

const byName = (a: Genre, b: Genre) => a.name.localeCompare(b.name)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([])
  const [items, setItems] = useState<CartItem[]>(savedCart)
  const [user, setUser] = useState<UserDetails | null>(null)
  const [ready, setReady] = useState(false)
  const [rentals, setRentals] = useState<Rental[]>([])
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    // Restos de versiones anteriores, que guardaban la sesión en el navegador
    localStorage.removeItem('token')
    localStorage.removeItem('userData')
    whenSessionExpires(() => setUser(null))

    api.currentSession().then(setUser, () => setUser(null)).finally(() => setReady(true))
    Promise.all([api.movies(), api.genres(), api.featured()])
      .then(([allMovies, allGenres, featured]) => { setMovies(allMovies); setGenres(allGenres); setFeaturedMovies(featured) })
      .catch(() => setLoadError('No se pudo cargar el catálogo. Comprueba tu conexión y recarga la página.'))
  }, [])

  const saveCart = useCallback((next: CartItem[]) => {
    localStorage.setItem(CART, JSON.stringify(next))
    setItems(next)
  }, [])
  const fetchRentals = useCallback(async () => setRentals(await api.rentals()), [])

  const store = useMemo<Store>(() => ({
    movies, genres, featuredMovies, items, user, ready, rentals, loadError,

    addToCart(movie, days, pricePerDay) {
      const item = { id: movie.id, title: movie.title, posterUrl: movie.posterUrl, days, pricePerDay, total: days * pricePerDay }
      saveCart(items.some(({ id }) => id === movie.id) ? items.map((old) => (old.id === movie.id ? item : old)) : [...items, item])
    },
    removeFromCart: (id) => saveCart(items.filter((item) => item.id !== id)),

    // Uno a uno: si alguno falla, los ya alquilados salen del carrito y los demás se quedan
    async confirmRental() {
      let left = items
      for (const item of items) {
        await api.rent(item.id, item.days)
        left = left.filter(({ id }) => id !== item.id)
        saveCart(left)
      }
      await fetchRentals()
    },

    async login(email, password) {
      await api.login(email, password)
      const details = await api.me()
      setUser(details)
      return details
    },
    async logout() {
      setUser(null)
      setRentals([])
      await api.logout()
    },
    async refreshUser() { setUser(await api.me()) },
    async saveProfile(profile: Profile) {
      const saved = await api.saveProfile(profile)
      setUser((current) => current && { ...current, ...saved })
    },
    async saveCard(cardNumber) {
      await api.saveCard(cardNumber)
      setUser((current) => current && { ...current, cardLast4: cardNumber.slice(-4) })
    },

    fetchRentals,
    async returnMovie(id) {
      await api.returnMovie(id)
      await fetchRentals()
    },

    async createGenre(name, price) {
      const genre = await api.admin.createGenre(name, price)
      setGenres((list) => [...list, genre].sort(byName))
    },
    async updateGenre(id, name, price) {
      const genre = await api.admin.updateGenre(id, name, price)
      setGenres((list) => list.map((old) => (old.id === id ? genre : old)).sort(byName))
    },
    async deleteGenre(id) {
      await api.admin.deleteGenre(id)
      setGenres((list) => list.filter((genre) => genre.id !== id))
    },
    async toggleFeatured(id) {
      await api.admin.toggleFeatured(id)
      setFeaturedMovies(await api.featured())
    },
  }), [movies, genres, featuredMovies, items, user, ready, rentals, loadError, saveCart, fetchRentals])

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}
