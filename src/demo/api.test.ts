import { expect, it } from 'vitest'
import type { ApiMovie, Rental } from '../types'
import { demoResponse } from './api'

it('el catálogo de la demo tiene películas con su género y precio', () => {
  const { movieList } = demoResponse('get', '/api/movie/all-movies') as { movieList: ApiMovie[] }
  expect(movieList.length).toBeGreaterThan(0)
  for (const movie of movieList) expect(movie.genres?.[0]?.price).toBeGreaterThan(0)
})

it('un alquiler aparece en el historial y se puede devolver', () => {
  const { alquiler } = demoResponse('post', 'http://x/api/product/rent', { movieId: 'm0', dias: 2 }) as { alquiler: Rental }
  expect(demoResponse('get', '/api/product/history')).toContainEqual(expect.objectContaining({ id: alquiler.id, returnedAt: null }))
  const { rent } = demoResponse('patch', `/api/product/${alquiler.id}/return`) as { rent: Rental }
  expect(rent.returnedAt).toEqual(expect.any(String))
})

it('sin entrar no hay sesión', () => {
  demoResponse('post', '/api/user/logout')
  expect(demoResponse('get', '/api/user/me')).toBeUndefined()
  demoResponse('post', '/api/user/login', { email: 'ana@example.com' })
  expect(demoResponse('get', '/api/user/me')).toMatchObject({ role: 'USER' })
})

it('una ruta desconocida no responde', () => {
  expect(demoResponse('get', '/api/otra')).toBeUndefined()
})
