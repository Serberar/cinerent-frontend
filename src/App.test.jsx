import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import { beforeEach, expect, it, vi } from 'vitest'
import App from './App'

const MOVIE = { id: 'm1', movieTitle: 'Nebulosa', desc: 'Un viaje', year: 2020, genres: [{ id: 'g1', name: 'Drama', price: 2.5 }] }

beforeEach(() => {
  localStorage.clear()
  vi.spyOn(axios, 'get').mockImplementation(async (url) => {
    if (url.endsWith('/api/movie/all-movies')) return { data: { movieList: [MOVIE] } }
    if (url.endsWith('/api/genre')) return { data: MOVIE.genres }
    return { data: [] }
  })
})

it('muestra el catálogo y añade una película al carrito con el precio del género', async () => {
  render(<App />)
  await userEvent.click((await screen.findAllByText('Nebulosa'))[0])
  await userEvent.click(screen.getByRole('button', { name: '+' }))
  expect(screen.getByText(/Total: 5\.00€/)).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Alquilar' }))
  expect(JSON.parse(localStorage.getItem('cart'))).toMatchObject([{ id: 'm1', days: 2, total: 5 }])
})
