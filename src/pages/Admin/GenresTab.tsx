import { useState, type FormEvent } from 'react'
import Dialog from '../../components/Dialog'
import Message, { failed, ok, type Notice } from '../../components/Message'
import { errorMessage } from '../../services/http'
import { useStore } from '../../store/store'
import type { Genre } from '../../types'

const EMPTY = { name: '', price: '2.00' }

const GenresTab = () => {
  const { genres, createGenre, updateGenre, deleteGenre } = useStore()
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState<Genre | null>(null)
  const [deleting, setDeleting] = useState<Genre | null>(null)
  const [notice, setNotice] = useState<Notice | null>(null)

  const reset = () => { setEditing(null); setForm(EMPTY) }
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      if (editing) await updateGenre(editing.id, form.name, Number(form.price))
      else await createGenre(form.name, Number(form.price))
      setNotice(ok(editing ? 'Género actualizado.' : 'Género creado.'))
      reset()
    } catch (error) {
      setNotice(failed(errorMessage(error, 'Error al guardar.')))
    }
  }
  const remove = async (genre: Genre) => {
    setDeleting(null)
    try { await deleteGenre(genre.id); setNotice(ok('Género eliminado.')) }
    catch (error) { setNotice(failed(errorMessage(error, 'Error al eliminar.'))) }
  }

  return (
    <div className='adminSection'>
      <form className='movieForm' onSubmit={(e) => void submit(e)}>
        <h2>{editing ? 'Editar género' : 'Nuevo género'}</h2>
        <div className='movieFormRow'>
          <div className='fieldGroup'>
            <label htmlFor='genero-nombre'>Nombre</label>
            <input id='genero-nombre' className='adminInput' value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder='Ej: Ciencia Ficción' required />
          </div>
          <div className='fieldGroup fieldSmall'>
            <label htmlFor='genero-precio'>Precio/día (€)</label>
            <input id='genero-precio' className='adminInput' type='number' min='0' step='0.01' value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} required />
          </div>
        </div>
        <Message notice={notice} />
        <div className='movieFormActions'>
          {editing && <button type='button' className='cancelBtn' onClick={() => { reset(); setNotice(null) }}>Cancelar</button>}
          <button type='submit' className='submitBtn'>{editing ? 'Guardar' : 'Crear género'}</button>
        </div>
      </form>

      <div className='adminCardList'>
        {genres.map((g) => (
          <div key={g.id} className='adminCard'>
            <div className='adminCardBody'><h3 className='adminCardTitle'>{g.name}</h3></div>
            <span className='adminCardPrice'>{g.price.toFixed(2)} €/día</span>
            <div className='adminCardActions row'>
              <button className='editBtn' onClick={() => { setEditing(g); setForm({ name: g.name, price: g.price.toFixed(2) }); setNotice(null) }}>Editar</button>
              <button className='deleteBtn' onClick={() => setDeleting(g)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {deleting && (
        <Dialog label='Eliminar género' className='suspendModal' onClose={() => setDeleting(null)}>
          <h3>¿Eliminar el género «{deleting.name}»?</h3>
          <p>Las películas que lo usan se quedan sin él.</p>
          <div className='movieFormActions'>
            <button className='cancelBtn' onClick={() => setDeleting(null)}>Cancelar</button>
            <button className='deleteBtn' onClick={() => void remove(deleting)}>Eliminar género</button>
          </div>
        </Dialog>
      )}
    </div>
  )
}

export default GenresTab
