// En estas rutas un 401 es una contraseña mal escrita, no una sesión caducada
const PASSWORD_ROUTES = ['/api/user/login', '/api/user/me/password']

export const isSessionExpired = (error) => (
  error.response?.status === 401 && !PASSWORD_ROUTES.some((route) => error.config?.url?.endsWith(route))
)
