import type { ApiMovie, Movie } from '../types'

export const adaptMovie = (m: ApiMovie): Movie => ({
  id: m.id,
  title: m.movieTitle,
  plot: m.desc,
  year: m.year ? String(m.year) : '',
  posterUrl: m.posterUrl ?? '',
  genres: m.genres ?? [],
  director: m.director ?? '',
  actors: m.actors ?? '',
  runtime: m.runtime ?? '',
  active: m.active ?? true,
  featured: m.featured ?? false,
})
