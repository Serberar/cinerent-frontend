import type { ChangeEvent } from 'react'
import GenrePicker from '../../components/GenrePicker/GenrePicker'
import type { Genre } from '../../types'
import type { MovieForm } from './movieForm'

interface Props {
  idPrefix: string
  movieForm: MovieForm
  genres: Genre[]
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onGenreChange: (ids: string[]) => void
}

const MovieFormFields = ({ movieForm, genres, onChange, onGenreChange, idPrefix }: Props) => (
  <>
    <div className='movieFormRow'>
      <div className='fieldGroup'>
        <label htmlFor={`${idPrefix}-movieTitle`}>Título *</label>
        <input id={`${idPrefix}-movieTitle`} className='adminInput' name='movieTitle' value={movieForm.movieTitle} onChange={onChange} required />
      </div>
      <div className='fieldGroup fieldSmall'>
        <label htmlFor={`${idPrefix}-year`}>Año</label>
        <input id={`${idPrefix}-year`} className='adminInput' name='year' type='number' value={movieForm.year} onChange={onChange} />
      </div>
      <div className='fieldGroup fieldSmall'>
        <label htmlFor={`${idPrefix}-runtime`}>Duración (min)</label>
        <input id={`${idPrefix}-runtime`} className='adminInput' name='runtime' value={movieForm.runtime} onChange={onChange} />
      </div>
    </div>
    <div className='movieFormRow'>
      <div className='fieldGroup'>
        <label htmlFor={`${idPrefix}-director`}>Director</label>
        <input id={`${idPrefix}-director`} className='adminInput' name='director' value={movieForm.director} onChange={onChange} />
      </div>
      <div className='fieldGroup'>
        <span className='fieldLabel'>Géneros</span>
        <GenrePicker genres={genres} selected={movieForm.genreIds} onChange={onGenreChange} />
      </div>
    </div>
    <div className='fieldGroup'>
      <label htmlFor={`${idPrefix}-actors`}>Actores</label>
      <input id={`${idPrefix}-actors`} className='adminInput' name='actors' value={movieForm.actors} onChange={onChange} />
    </div>
    <div className='fieldGroup'>
      <label htmlFor={`${idPrefix}-posterUrl`}>URL del póster</label>
      <input id={`${idPrefix}-posterUrl`} className='adminInput' name='posterUrl' value={movieForm.posterUrl} onChange={onChange} placeholder='https://...' />
    </div>
    <div className='fieldGroup'>
      <label htmlFor={`${idPrefix}-desc`}>Descripción *</label>
      <textarea id={`${idPrefix}-desc`} className='adminInput adminTextarea' name='desc' value={movieForm.desc} onChange={onChange} required />
    </div>
  </>
)

export default MovieFormFields
