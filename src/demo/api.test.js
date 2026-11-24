import { expect, it } from 'vitest'
import { demoResponse } from './api'

it('el catálogo de la demo tiene películas con su género y precio', () => {
  const { movieList } = demoResponse('get', '/api/movie/all-movies')
  expect(movieList.length).toBeGreaterThan(0)
  for (const movie of movieList) expect(movie.genres[0].price).toBeGreaterThan(0)
})

it('un alquiler aparece en el historial y se puede devolver', () => {
  const { alquiler } = demoResponse('post', 'http://x/api/product/rent', { movieId: 'm0', dias: 2 })
  expect(demoResponse('get', '/api/product/history')).toContainEqual(expect.objectContaining({ id: alquiler.id, returnedAt: null }))
  expect(demoResponse('patch', `/api/product/${alquiler.id}/return`).rent.returnedAt).toBeInstanceOf(Date)
})

it('una ruta desconocida no responde', () => {
  expect(demoResponse('get', '/api/admin/lista-de-usuarios')).toBeUndefined()
})
