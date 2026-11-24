import { useState, useRef, useEffect } from 'react'
import type { Genre } from '../../types'
import './GenrePicker.css'

interface Props { genres: Genre[]; selected: string[]; onChange: (ids: string[]) => void }

const GenrePicker = ({ genres, selected, onChange }: Props) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const isSelected = (id: string) => selected.includes(id)

  const toggle = (id: string) => {
    onChange(isSelected(id) ? selected.filter(g => g !== id) : [...selected, id])
  }

  const selectedGenres = genres.filter(g => selected.includes(g.id))

  return (
    <div className='genrePicker' ref={ref}>
      <button type='button' className='genrePickerTrigger' aria-expanded={open} onClick={() => setOpen(o => !o)}>
        {selectedGenres.length === 0
          ? <span className='genrePlaceholder'>Seleccionar géneros…</span>
          : <span className='genreTags'>{selectedGenres.map(g => <span key={g.id} className='genreTag'>{g.name}</span>)}</span>
        }
        <span className='genreArrow'>{open ? '▴' : '▾'}</span>
      </button>

      {open && (
        <div className='genreDropdown'>
          {genres.map(genre => (
            <label key={genre.id} className='genreOption'>
              <input type='checkbox' checked={isSelected(genre.id)} onChange={() => toggle(genre.id)} />
              {genre.name}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default GenrePicker
