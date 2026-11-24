import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, it } from 'vitest'
import App from './App'
import { demoResponse, enableDemo } from './demo/api'

beforeEach(() => {
  localStorage.clear()
  window.history.pushState({}, '', '/')
  enableDemo()
  demoResponse('post', '/api/user/logout')
})

async function login(email: string) {
  await userEvent.click(await screen.findByRole('link', { name: 'Iniciar sesión' }))
  await userEvent.type(screen.getByLabelText('Email'), email)
  await userEvent.type(screen.getByLabelText('Contraseña'), 'una-clave-cualquiera')
  await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
}

it('muestra el catálogo y añade una película al carrito con el precio del género', async () => {
  render(<App />)
  await userEvent.click((await screen.findAllByRole('button', { name: /Nebulosa/ }))[0]!)
  expect(screen.getByRole('dialog', { name: 'Nebulosa' })).toBeInTheDocument()
  await userEvent.keyboard('{Escape}')
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  await userEvent.click(screen.getAllByRole('button', { name: /Nebulosa/ })[0]!)
  await userEvent.click(screen.getByRole('button', { name: '+' }))
  expect(screen.getByText(/Total: 5\.98€/)).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Alquilar' }))
  expect(JSON.parse(localStorage.getItem('cart') ?? '[]')).toMatchObject([{ id: 'm0', days: 2, total: 5.98 }])
})

it('entrar, alquilar, verlo en la cuenta y devolverlo, sin guardar la sesión en el navegador', async () => {
  render(<App />)
  await login('ana@example.com')
  await screen.findByRole('link', { name: /Ana/ })
  await userEvent.click((await screen.findAllByRole('button', { name: /Faro norte/ }))[0]!)
  await userEvent.click(screen.getByRole('button', { name: 'Alquilar' }))
  await userEvent.click(screen.getByRole('link', { name: /Carrito/ }))
  await userEvent.click(screen.getByRole('button', { name: 'Confirmar alquiler' }))
  expect(await screen.findByText(/Alquiler confirmado/)).toBeInTheDocument()
  await userEvent.click(screen.getByRole('link', { name: /Ana/ }))
  await userEvent.click(await screen.findByRole('button', { name: 'Devolver' }))
  await waitFor(() => expect(screen.queryByRole('button', { name: 'Devolver' })).not.toBeInTheDocument())
  expect(Object.keys(localStorage)).toEqual(['cart'])
})

it('el panel de administración solo lo ve un administrador', async () => {
  window.history.pushState({}, '', '/admin')
  render(<App />)
  expect(await screen.findByRole('button', { name: 'Iniciar sesión' })).toBeInTheDocument()
  await userEvent.type(screen.getByLabelText('Email'), 'admin@example.com')
  await userEvent.type(screen.getByLabelText('Contraseña'), 'una-clave-cualquiera')
  await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
  expect(await screen.findByText('Luis Vega')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('tab', { name: 'Géneros' }))
  await userEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[0]!)
  expect(screen.getByRole('dialog', { name: 'Eliminar género' })).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Eliminar género' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('No disponible en la demo')
})
