import { AxiosError, AxiosHeaders } from 'axios'
import { describe, expect, it } from 'vitest'
import { adaptMovie } from '../services/movieService'
import { getPrice } from './price'
import { isSessionExpired } from './session'

describe('getPrice', () => {
  it('usa el precio por defecto sin géneros', () => {
    expect(getPrice({ genres: [] })).toBe(2)
    expect(getPrice({})).toBe(2)
  })

  it('usa el género más caro', () => {
    expect(getPrice({ genres: [{ price: 1.5 }, { price: 2.99 }] })).toBe(2.99)
  })
})

describe('isSessionExpired', () => {
  const error = (status: number, url: string) => {
    const config = { url, headers: new AxiosHeaders() }
    return new AxiosError('', '', config, null, { status, data: {}, statusText: '', headers: {}, config })
  }

  it('un 401 en una ruta privada es sesión caducada', () => {
    expect(isSessionExpired(error(401, 'http://api/api/user/me'))).toBe(true)
  })

  it('una contraseña mal escrita no cierra la sesión', () => {
    expect(isSessionExpired(error(401, 'http://api/api/user/login'))).toBe(false)
    expect(isSessionExpired(error(401, 'http://api/api/user/me/password'))).toBe(false)
    expect(isSessionExpired(error(401, '/api/user/me?inicio'))).toBe(false)
  })

  it('otros errores no son sesión caducada', () => {
    expect(isSessionExpired(error(500, 'http://api/api/user/me'))).toBe(false)
    expect(isSessionExpired(new Error('sin red'))).toBe(false)
  })
})

describe('adaptMovie', () => {
  it('traduce la película de la API y rellena lo que falta', () => {
    expect(adaptMovie({ id: '1', movieTitle: 'Alien', desc: 'Terror', year: 1979 })).toMatchObject({
      id: '1', title: 'Alien', plot: 'Terror', year: '1979', genres: [], posterUrl: '', active: true, featured: false,
    })
  })
})
