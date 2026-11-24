import axios from 'axios'

// En estas rutas un 401 es una contraseña mal escrita o alguien que aún no ha entrado, no una sesión caducada
const QUIET_ROUTES = ['/api/user/login', '/api/user/me/password', '/api/user/me?inicio']

export const isSessionExpired = (error: unknown) => (
  axios.isAxiosError(error) && error.response?.status === 401 && !QUIET_ROUTES.some((route) => error.config?.url?.endsWith(route))
)
