// VITE_API_URL es la variable actual; REACT_APP_BACK_URL se acepta por los despliegues antiguos
export const API = import.meta.env.VITE_API_URL ?? import.meta.env.REACT_APP_BACK_URL ?? 'http://localhost:4000'
