import type { AdminUser, ApiMovie, Genre, MovieInput, NewUser, Profile, Rental, UserDetails } from '../types'
import { http } from './http'
import { adaptMovie } from './movieService'

const data = <T>(request: Promise<{ data: T }>) => request.then((response) => response.data)

export const api = {
  movies: async () => (await data(http.get<{ movieList?: ApiMovie[] }>('/api/movie/all-movies'))).movieList?.map(adaptMovie) ?? [],
  featured: async () => (await data(http.get<ApiMovie[]>('/api/movie/featured'))).map(adaptMovie),
  genres: () => data(http.get<Genre[]>('/api/genre')),

  login: (email: string, password: string) => data(http.post('/api/user/login', { email, password })),
  logout: () => data(http.post('/api/user/logout')),
  register: (user: NewUser) => data(http.post('/api/user/register', user)),
  verifyEmail: (token: string) => data(http.get('/api/user/verify-email', { params: { token } })),
  me: () => data(http.get<UserDetails>('/api/user/me')),
  currentSession: () => data(http.get<UserDetails>('/api/user/me?inicio')),
  saveProfile: (profile: Profile) => data(http.patch<Profile>('/api/user/me', profile)),
  saveCard: (cardNumber: string) => data(http.patch('/api/user/me/card', { cardNumber })),
  changePassword: (currentPassword: string, newPassword: string) => data(http.patch('/api/user/me/password', { currentPassword, newPassword })),

  rent: (movieId: string, dias: number) => data(http.post('/api/product/rent', { movieId, dias })),
  rentals: () => data(http.get<Rental[]>('/api/product/history')),
  returnMovie: (id: string) => data(http.patch(`/api/product/${id}/return`)),

  admin: {
    users: async () => (await data(http.get<{ users: AdminUser[] }>('/api/admin/lista-de-usuarios'))).users,
    user: (id: string) => data(http.get<Profile>(`/api/admin/${id}`)),
    updateUser: (id: string, profile: Profile) => data(http.put<Profile>(`/api/admin/${id}`, profile)),
    suspend: (id: string, note: string) => data(http.patch<Pick<AdminUser, 'id' | 'suspended' | 'suspensionNote'>>(`/api/admin/${id}/suspend`, { note })),
    rentals: () => data(http.get<Rental[]>('/api/admin/alquileres')),
    movies: async () => (await data(http.get<ApiMovie[]>('/api/admin/all-movies'))).map(adaptMovie),
    createMovie: (movie: MovieInput) => data(http.post<ApiMovie>('/api/movie/create-a-new-movie', movie)),
    updateMovie: (id: string, movie: MovieInput) => data(http.put<ApiMovie>(`/api/movie/${id}`, movie)),
    toggleMovie: (id: string) => data(http.patch(`/api/movie/${id}/toggle`)),
    toggleFeatured: (id: string) => data(http.patch(`/api/movie/${id}/toggle-featured`)),
    createGenre: (name: string, price: number) => data(http.post<Genre>('/api/genre', { name, price })),
    updateGenre: (id: string, name: string, price: number) => data(http.put<Genre>(`/api/genre/${id}`, { name, price })),
    deleteGenre: (id: string) => data(http.delete(`/api/genre/${id}`)),
  },
}
