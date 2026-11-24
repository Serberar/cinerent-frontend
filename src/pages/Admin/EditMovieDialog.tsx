import { useState, type ChangeEvent, type FormEvent } from 'react'
import Dialog from '../../components/Dialog'
import Message, { failed, ok, type Notice } from '../../components/Message'
import { api } from '../../services/api'
import { errorMessage } from '../../services/http'
import { useStore } from '../../store/store'
import type { Movie } from '../../types'
import { formOf, inputOf } from './movieForm'
import MovieFormFields from './MovieFormFields'

interface Props { movie: Movie; onChanged: () => Promise<void>; onClose: () => void }

const EditMovieDialog = ({ movie, onChanged, onClose }: Props) => {
  const { genres, toggleFeatured } = useStore()
  const [form, setForm] = useState(() => formOf(movie))
  const [notice, setNotice] = useState<Notice | null>(null)

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((prev) => ({ ...prev, [target.name]: target.value }))
  const run = async (action: () => Promise<unknown>, done: string) => {
    try {
      await action()
      await onChanged()
      setNotice(ok(done))
    } catch (error) {
      setNotice(failed(errorMessage(error, 'Error al guardar la película.')))
    }
  }
  const submit = (e: FormEvent) => {
    e.preventDefault()
    void run(() => api.admin.updateMovie(movie.id, inputOf(form)), 'Película actualizada correctamente.')
  }

  return (
    <Dialog label={`Editar ${movie.title}`} className='editMovieModal' onClose={onClose}>
      <button className='modalCloseBtn' aria-label='Cerrar' onClick={onClose}>✕</button>
      <h2 className='editMovieTitle'>Editar: {movie.title}</h2>
      <form onSubmit={submit}>
        <MovieFormFields idPrefix='editar' movieForm={form} genres={genres} onChange={handleChange} onGenreChange={(genreIds) => setForm((prev) => ({ ...prev, genreIds }))} />
        <Message notice={notice} />
        <div className='editModalActions'>
          <div className='editModalStatusBtns'>
            <button type='button' className={`toggleBtn ${movie.active ? 'deactivate' : 'activate'}`}
              onClick={() => void run(() => api.admin.toggleMovie(movie.id), movie.active ? 'Película desactivada.' : 'Película activada.')}>
              {movie.active ? 'Desactivar' : 'Activar'}
            </button>
            <button type='button' className={`featuredBtn ${movie.featured ? 'featuredOn' : ''}`}
              onClick={() => void run(() => toggleFeatured(movie.id), movie.featured ? 'Quitada de portada.' : 'En portada.')}>
              {movie.featured ? '★ Quitar de portada' : '☆ Poner en portada'}
            </button>
          </div>
          <div className='editModalMainBtns'>
            <button type='button' className='cancelBtn' onClick={onClose}>Cerrar</button>
            <button type='submit' className='submitBtn'>Guardar cambios</button>
          </div>
        </div>
      </form>
    </Dialog>
  )
}

export default EditMovieDialog
