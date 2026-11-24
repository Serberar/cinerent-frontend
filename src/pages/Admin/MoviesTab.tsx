import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import Message, { failed, ok, type Notice } from '../../components/Message'
import { api } from '../../services/api'
import { errorMessage } from '../../services/http'
import { useStore } from '../../store/store'
import type { Movie } from '../../types'
import EditMovieDialog from './EditMovieDialog'
import { EMPTY_FORM, inputOf } from './movieForm'
import MovieFormFields from './MovieFormFields'

const MoviesTab = () => {
  const { genres } = useStore()
  const [movies, setMovies] = useState<Movie[]>([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [notice, setNotice] = useState<Notice | null>(null)
  const editing = movies.find(({ id }) => id === editingId)

  const reload = useCallback(async () => setMovies(await api.admin.movies()), [])
  useEffect(() => {
    reload().catch(() => setNotice(failed('Error al cargar las películas.')))
  }, [reload])

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((prev) => ({ ...prev, [target.name]: target.value }))
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await api.admin.createMovie(inputOf(form))
      setForm(EMPTY_FORM)
      setNotice(ok('Película creada correctamente.'))
      await reload()
    } catch (error) {
      setNotice(failed(errorMessage(error, 'Error al guardar la película.')))
    }
  }

  return (
    <div className='adminSection'>
      <form className='movieForm' onSubmit={(e) => void submit(e)}>
        <h2>Nueva película</h2>
        <MovieFormFields idPrefix='nueva' movieForm={form} genres={genres} onChange={handleChange} onGenreChange={(genreIds) => setForm((prev) => ({ ...prev, genreIds }))} />
        <Message notice={notice} />
        <div className='movieFormActions'><button type='submit' className='submitBtn'>Crear película</button></div>
      </form>

      {editing && <EditMovieDialog key={editing.id} movie={editing} onChanged={reload} onClose={() => setEditingId(null)} />}

      <div className='adminCardList'>
        {movies.map((m) => (
          <div key={m.id} className={`adminCard ${m.active ? '' : 'adminCardInactive'}`}>
            <div style={{ width: 72, height: 108, flexShrink: 0, overflow: 'hidden', borderRadius: 6 }}>
              <img src={m.posterUrl} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div className='adminCardBody'>
              <div className='adminCardHeader'>
                <h3 className='adminCardTitle'>{m.title}</h3>
                <div className='adminCardBadges'>
                  <span className={`activeBadge ${m.active ? 'on' : 'off'}`}>{m.active ? 'Activa' : 'Inactiva'}</span>
                  {m.featured && <span className='featuredBadge on'>★ En portada</span>}
                </div>
              </div>
              <p className='adminCardMeta'>{[m.year, m.runtime && `${m.runtime} min`, m.director].filter(Boolean).join(' · ')}</p>
              {m.plot && <p className='adminCardDesc'>{m.plot}</p>}
              {m.actors && <p className='adminCardMeta'><strong>Reparto:</strong> {m.actors}</p>}
              {m.genres.length > 0 && <div className='adminCardGenres'>{m.genres.map((g) => <span key={g.id} className='genreBadge'>{g.name}</span>)}</div>}
            </div>
            <div className='adminCardActions'><button className='editBtn' onClick={() => setEditingId(m.id)}>Editar</button></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MoviesTab
