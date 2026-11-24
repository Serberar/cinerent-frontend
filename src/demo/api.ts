import { AxiosError, AxiosHeaders, type AxiosAdapter } from 'axios'
import { http } from '../services/http'
import type { ApiMovie, Genre, Rental, UserDetails } from '../types'
import catalog from './catalog.json'

// Demo sin servidor: responde a las mismas rutas que la API con datos en memoria. Nada sale del navegador.
const genres: Genre[] = catalog.genres
const movies: ApiMovie[] = catalog.movies.map((movie, index) => ({
  ...movie, id: `m${index}`, active: true, genres: genres.filter((genre) => movie.genres.includes(genre.name)),
}))
const user: UserDetails = {
  id: 'demo', firstName: 'Ana', lastName: 'Ruiz', dni: '00000000T', phone: '600000000', address: 'Calle 1',
  email: 'ana@example.com', isEmailVerified: true, role: 'USER', cardLast4: '1234',
}
const rentals: Rental[] = []
let loggedIn = false

type Body = Record<string, unknown>

const routes: Record<string, (body: Body) => unknown> = {
  'GET /api/movie/all-movies': () => ({ movieList: movies.filter((movie) => movie.active) }),
  'GET /api/movie/featured': () => movies.filter((movie) => movie.featured && movie.active),
  'GET /api/genre': () => genres,
  // Con un correo que empiece por «admin» se entra en el panel de administración
  'POST /api/user/login': ({ email }) => {
    loggedIn = true
    Object.assign(user, { email, role: String(email).startsWith('admin') ? 'ADMIN' : 'USER' })
    return { user }
  },
  'POST /api/user/logout': () => { loggedIn = false; return { ok: true } },
  'POST /api/user/register': () => ({ id: user.id, email: user.email }),
  'GET /api/user/me': () => (loggedIn ? user : undefined),
  'PATCH /api/user/me': (body) => Object.assign(user, body),
  'PATCH /api/user/me/card': ({ cardNumber }) => { user.cardLast4 = String(cardNumber).slice(-4); return { message: 'Tarjeta actualizada correctamente' } },
  'PATCH /api/user/me/password': () => ({ ok: true }),
  'GET /api/product/history': () => rentals,
  'POST /api/product/rent': ({ movieId, dias }) => {
    const movie = movies.find((item) => item.id === movieId)
    if (!movie) return undefined
    const alquiler: Rental = {
      id: crypto.randomUUID(), movieId: movie.id, userId: user.id, movieTitle: movie.movieTitle, dias: Number(dias),
      rentedAt: new Date().toISOString(), returnedAt: null,
    }
    rentals.push(alquiler)
    return { alquiler }
  },
  'GET /api/admin/lista-de-usuarios': () => ({
    users: [{ id: 'u1', firstName: 'Luis', lastName: 'Vega', email: 'luis@example.com', role: 'USER', createdAt: '2026-01-15', suspended: false, suspensionNote: null }],
  }),
  'GET /api/admin/alquileres': () => rentals.filter((rental) => !rental.returnedAt),
  'GET /api/admin/all-movies': () => movies,
}

export function demoResponse(method: string, url: string, body: Body = {}): unknown {
  const { pathname } = new URL(url, 'http://demo')
  const [, id, action] = /^\/api\/(?:product|movie)\/([^/]+)\/(return|toggle|toggle-featured)$/.exec(pathname) ?? []
  if (action === 'return') {
    const rental = rentals.find((item) => item.id === id)
    if (rental) rental.returnedAt = new Date().toISOString()
    return rental && { rent: rental }
  }
  if (action) {
    const movie = movies.find((item) => item.id === id)
    if (movie) movie[action === 'toggle' ? 'active' : 'featured'] = !movie[action === 'toggle' ? 'active' : 'featured']
    return movie
  }
  return routes[`${method.toUpperCase()} ${pathname}`]?.(body)
}

const adapter: AxiosAdapter = async (config) => {
  const body: unknown = typeof config.data === 'string' ? JSON.parse(config.data) : config.data
  const data = demoResponse(config.method ?? 'get', config.url ?? '', (body ?? {}) as Body)
  const response = { data: structuredClone(data ?? { error: 'No disponible en la demo' }) as unknown, status: data ? 200 : 404, statusText: '', headers: new AxiosHeaders(), config }
  if (!data) throw new AxiosError('No disponible en la demo', 'ERR_DEMO', config, null, response)
  return response
}

export function enableDemo(): void {
  http.defaults.adapter = adapter
}
