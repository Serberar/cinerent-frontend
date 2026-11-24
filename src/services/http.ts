// Cliente de la API. La sesión va en una cookie HttpOnly: aquí no hay ningún token que guardar ni que robar.
import axios from 'axios'
import { API } from '../config'
import { isSessionExpired } from '../utils/session'

export const http = axios.create({ baseURL: API, withCredentials: true })

let onExpired = () => {}
export const whenSessionExpires = (callback: () => void) => { onExpired = callback }

http.interceptors.response.use(undefined, (error: unknown) => {
  if (isSessionExpired(error)) onExpired()
  return Promise.reject(error)
})

export function errorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError<{ error?: string }>(error)) return fallback
  return error.response?.data?.error || fallback
}

export const errorStatus = (error: unknown) => (axios.isAxiosError(error) ? error.response?.status : undefined)
