import axios from 'axios'
import catalog from './catalog.json'

// Demo sin servidor: responde a las mismas rutas que la API con datos en memoria. Nada sale del navegador.
const { genres } = catalog
const movies = catalog.movies.map((movie, index) => ({
  ...movie, id: `m${index}`, active: true, genres: genres.filter((genre) => movie.genres.includes(genre.name)),
}))
const user = {
  id: 'demo', firstName: 'Ana', lastName: 'Ruiz', dni: '00000000T', phone: '600000000', address: 'Calle 1',
  email: 'ana@example.com', isEmailVerified: true, role: 'USER', cardLast4: '1234',
}
const rentals = []

const routes = {
  'GET /api/movie/all-movies': () => ({ movieList: movies }),
  'GET /api/movie/featured': () => movies.filter((movie) => movie.featured),
  'GET /api/genre': () => genres,
  'POST /api/user/login': () => ({ token: 'demo' }),
  'POST /api/user/register': () => ({ id: user.id, email: user.email }),
  'GET /api/user/me': () => user,
  'PATCH /api/user/me': (body) => Object.assign(user, body),
  'PATCH /api/user/me/card': ({ cardNumber }) => { user.cardLast4 = cardNumber.slice(-4); return { message: 'Tarjeta actualizada correctamente' } },
  'PATCH /api/user/me/password': () => ({ ok: true }),
  'GET /api/product/history': () => rentals,
  'POST /api/product/rent': ({ movieId, dias }) => {
    const movie = movies.find((item) => item.id === movieId)
    const alquiler = { id: crypto.randomUUID(), movieId, movieTitle: movie.movieTitle, dias, rentedAt: new Date(), returnedAt: null }
    rentals.push(alquiler)
    return { alquiler }
  },
}

export function demoResponse(method, url, body) {
  const path = new URL(url, 'http://demo').pathname
  const returned = path.match(/^\/api\/product\/([^/]+)\/return$/)
  if (returned) {
    const rental = rentals.find((item) => item.id === returned[1])
    rental.returnedAt = new Date()
    return { rent: rental }
  }
  return routes[`${method.toUpperCase()} ${path}`]?.(body ?? {})
}

export function enableDemo() {
  axios.defaults.adapter = async (config) => {
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data
    const data = demoResponse(config.method, config.url, body)
    const response = { data: structuredClone(data ?? { error: 'No disponible en la demo' }), status: data ? 200 : 404, statusText: '', headers: {}, config }
    if (!data) throw new axios.AxiosError('No disponible en la demo', 'ERR_DEMO', config, null, response)
    return response
  }
}
