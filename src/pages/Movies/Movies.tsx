import { useState, useMemo, useRef, useEffect } from 'react'
import Dialog from '../../components/Dialog'
import { useStore } from '../../store/store'
import type { Genre, Movie } from '../../types'
import { getPrice } from '../../utils/price'
import './Movies.css'

const MovieCard = ({ movie, onClick }: { movie: Movie; onClick: () => void }) => (
  <button type='button' className='movieCard' onClick={onClick}>
    <div className='movieImageWrapper'>
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className='movieImage'
      />
      <div className='movieOverlay'><span>Ver detalles</span></div>
    </div>
    <span className='movieTitle'>{movie.title}</span>
  </button>
)

/* ── Horizontal row with scroll arrows ── */
const GenreRow = ({ genre, movies, openModal }: { genre: Genre; movies: Movie[]; openModal: (movie: Movie) => void }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const scroll = (dir: 1 | -1) => scrollRef.current?.scrollBy({ left: dir * 640, behavior: 'smooth' })

  return (
    <section className='genreRow'>
      <h2 className='genreRowTitle'>{genre.name}</h2>
      <div className='genreRowWrapper'>
        <button aria-label='Anterior' className='scrollArrow scrollArrowLeft' onClick={() => scroll(-1)}>‹</button>
        <div className='genreRowScroll' ref={scrollRef}>
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} onClick={() => openModal(movie)} />
          ))}
        </div>
        <button aria-label='Siguiente' className='scrollArrow scrollArrowRight' onClick={() => scroll(1)}>›</button>
      </div>
    </section>
  )
}

const Modal = ({ movie, onClose, onRent }: { movie: Movie; onClose: () => void; onRent: (movie: Movie, days: number, pricePerDay: number) => void }) => {
  const [days, setDays] = useState(1)
  const pricePerDay = getPrice(movie)

  return (
    <Dialog label={movie.title} className='modalContent' onClose={onClose}>
        <button className='modalClose' aria-label='Cerrar' onClick={onClose}>✕</button>
        <div className='modalBody'>
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className='modalImage'
          />
          <div className='modalInfo'>
            <h2>{movie.title}</h2>
            <p className='modalMeta'>{movie.year} · {movie.runtime} min · {movie.director}</p>
            <p className='modalGenres'>{movie.genres.map(g => g.name).join(', ')}</p>
            <p className='modalPlot'>{movie.plot}</p>
            <p className='modalActors'><strong>Reparto:</strong> {movie.actors}</p>
            <div className='rentSection'>
              <label>Días de alquiler:</label>
              <div className='daysControl'>
                <button className='daysBtn' onClick={() => setDays(d => Math.max(1, d - 1))}>−</button>
                <span className='daysValue'>{days}</span>
                <button className='daysBtn' onClick={() => setDays(d => Math.min(7, d + 1))}>+</button>
              </div>
              <p className='price'>Total: {(days * pricePerDay).toFixed(2)}€ <span>({pricePerDay.toFixed(2)}€/día)</span></p>
              <button className='rentBtn' onClick={() => onRent(movie, days, pricePerDay)}>Alquilar</button>
            </div>
          </div>
        </div>
    </Dialog>
  )
}

const Movies = () => {
  const { movies, genres, featuredMovies, loadError, addToCart } = useStore()
  const [selected, setSelected] = useState<Movie | null>(null)
  const [search, setSearch] = useState('')
  const [selectedGenreId, setSelectedGenreId] = useState<string | null>(null)
  const [yearFrom, setYearFrom] = useState('')
  const [yearTo, setYearTo] = useState('')
  const [heroIndex, setHeroIndex]         = useState(0)
  const [heroPaused, setHeroPaused]       = useState(false)

  const currentFeatured = featuredMovies[heroIndex % featuredMovies.length]

  useEffect(() => {
    if (featuredMovies.length <= 1 || heroPaused) return
    const t = setInterval(() => setHeroIndex(i => (i + 1) % featuredMovies.length), 5500)
    return () => clearInterval(t)
  }, [featuredMovies.length, heroPaused])

  const years = useMemo(() => {
    const set = new Set(movies.map(m => m.year).filter(Boolean))
    return [...set].sort()
  }, [movies])

  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      const matchesGenre  = !selectedGenreId || movie.genres.some(g => g.id === selectedGenreId)
      const matchesSearch = !search || movie.title.toLowerCase().includes(search.toLowerCase())
      const year          = Number(movie.year)
      const matchesFrom   = !yearFrom || year >= Number(yearFrom)
      const matchesTo     = !yearTo   || year <= Number(yearTo)
      return matchesGenre && matchesSearch && matchesFrom && matchesTo
    })
  }, [movies, search, selectedGenreId, yearFrom, yearTo])

  const moviesByGenre = useMemo(() => {
    return genres
      .map(genre => ({
        genre,
        movies: movies.filter(m => m.genres.some(g => g.id === genre.id))
      }))
      .filter(row => row.movies.length > 0)
  }, [movies, genres])

  const isFiltering = search || selectedGenreId || yearFrom || yearTo

  return (
    <div className='moviesPage'>
      {loadError && <p className='noResults' role='alert'>{loadError}</p>}

      {currentFeatured && !isFiltering && (
        <section
          className='hero'
          onMouseEnter={() => setHeroPaused(true)}
          onMouseLeave={() => setHeroPaused(false)}
        >
          <div className='heroBg' style={{ backgroundImage: `url(${currentFeatured.posterUrl})` }} />
          <div className='heroGradient' />
          <div className='heroContent'>
            <div className='heroText' key={currentFeatured.id}>
              {currentFeatured.genres?.[0] && (
                <span className='heroEyebrow'>{currentFeatured.genres[0].name}</span>
              )}
              <h1 className='heroTitle'>{currentFeatured.title}</h1>
              {currentFeatured.plot && <p className='heroPlot'>{currentFeatured.plot}</p>}
              <div className='heroMeta'>
                {currentFeatured.year     && <span>{currentFeatured.year}</span>}
                {currentFeatured.runtime  && <span>{currentFeatured.runtime} min</span>}
                {currentFeatured.director && <span>{currentFeatured.director}</span>}
              </div>
              <button className='heroBtn' onClick={() => setSelected(currentFeatured)}>
                ▶&nbsp; Ver detalles
              </button>
            </div>
            <img
              className='heroPoster'
              src={currentFeatured.posterUrl}
              alt={currentFeatured.title}
            />
          </div>

          {featuredMovies.length > 1 && (
            <div className='heroDots'>
              {featuredMovies.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Destacada ${i + 1}`}
                  className={`heroDot ${i === heroIndex % featuredMovies.length ? 'heroDotActive' : ''}`}
                  onClick={() => setHeroIndex(i)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      <div className='controls'>
        <div className='controlsTop'>
          <div className='searchBar'>
            <span className='searchIcon'>🔍</span>
            <input
              type='text'
              className='searchInput'
              placeholder='Buscar película...'
              aria-label='Buscar película'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button className='searchClear' onClick={() => setSearch('')}>✕</button>}
          </div>
          <select aria-label='Desde el año' className='yearPill' value={yearFrom} onChange={e => setYearFrom(e.target.value)}>
            <option value=''>Desde</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select aria-label='Hasta el año' className='yearPill' value={yearTo} onChange={e => setYearTo(e.target.value)}>
            <option value=''>Hasta</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          {(yearFrom || yearTo) && (
            <button className='clearFiltersBtn' onClick={() => { setYearFrom(''); setYearTo('') }}>✕</button>
          )}
        </div>

        <div className='genreChips'>
          <button
            className={`chip ${!selectedGenreId ? 'active' : ''}`}
            onClick={() => setSelectedGenreId(null)}
          >Todos</button>
          {genres.map(genre => (
            <button
              key={genre.id}
              className={`chip ${selectedGenreId === genre.id ? 'active' : ''}`}
              onClick={() => setSelectedGenreId(genre.id)}
            >{genre.name}</button>
          ))}
        </div>
      </div>

      {isFiltering ? (
        filteredMovies.length === 0
          ? <p className='noResults'>No se encontraron películas.</p>
          : (
            <div className='moviesGrid'>
              {filteredMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} onClick={() => setSelected(movie)} />
              ))}
            </div>
          )
      ) : (
        <div className='genreRows'>
          {moviesByGenre.map(({ genre, movies }) => (
            <GenreRow
              key={genre.id}
              genre={genre}
              movies={movies}
              openModal={setSelected}
            />
          ))}
        </div>
      )}

      {selected && (
        <Modal
          movie={selected}
          onClose={() => setSelected(null)}
          onRent={(movie, days, pricePerDay) => { addToCart(movie, days, pricePerDay); setSelected(null) }}
        />
      )}
    </div>
  )
}

export default Movies
