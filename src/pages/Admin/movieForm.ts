import type { Movie, MovieInput } from '../../types'

export interface MovieForm {
  movieTitle: string
  desc: string
  year: string
  posterUrl: string
  genreIds: string[]
  director: string
  actors: string
  runtime: string
}

export const EMPTY_FORM: MovieForm = { movieTitle: '', desc: '', year: '', posterUrl: '', genreIds: [], director: '', actors: '', runtime: '' }

export const formOf = (movie: Movie): MovieForm => ({
  movieTitle: movie.title,
  desc: movie.plot,
  year: movie.year,
  posterUrl: movie.posterUrl,
  genreIds: movie.genres.map((genre) => genre.id),
  director: movie.director,
  actors: movie.actors,
  runtime: movie.runtime,
})

export const inputOf = ({ movieTitle, desc, year, posterUrl, genreIds, director, actors, runtime }: MovieForm): MovieInput => ({
  movieTitle,
  desc,
  genreIds,
  year: year ? Number.parseInt(year, 10) : null,
  posterUrl: posterUrl || null,
  director: director || null,
  actors: actors || null,
  runtime: runtime || null,
})
