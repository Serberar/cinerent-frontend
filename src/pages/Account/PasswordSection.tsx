import { useState, type FormEvent } from 'react'
import Message, { failed, ok, type Notice } from '../../components/Message'
import { api } from '../../services/api'
import { errorMessage } from '../../services/http'

const EMPTY = { current: '', next: '', confirm: '' }
const FIELDS = [
  ['current', 'Contraseña actual', 'current-password'], ['next', 'Nueva contraseña', 'new-password'], ['confirm', 'Confirmar nueva contraseña', 'new-password'],
] as const

const PasswordSection = () => {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [notice, setNotice] = useState<Notice | null>(null)

  const close = () => { setOpen(false); setForm(EMPTY) }
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (form.next !== form.confirm) { setNotice(failed('Las contraseñas no coinciden.')); return }
    if (form.next.length < 8) { setNotice(failed('La nueva contraseña debe tener al menos 8 caracteres.')); return }
    try {
      await api.changePassword(form.current, form.next)
      close()
      setNotice(ok('Contraseña actualizada correctamente.'))
    } catch (error) {
      setNotice(failed(errorMessage(error, 'Error al cambiar la contraseña.')))
    }
  }

  return (
    <div className='personalDataContainer cardSection'>
      <h2>Contraseña</h2>
      <div className='cardMasked'>
        <span className='cardIcon'>🔒</span>
        <span>••••••••</span>
        {!open && <button className='editBtn' onClick={() => { setNotice(null); setOpen(true) }}>Cambiar contraseña</button>}
      </div>
      {open && (
        <form className='cardForm' onSubmit={(e) => void submit(e)}>
          {FIELDS.map(([name, label, autoComplete]) => (
            <div className='editableField' key={name}>
              <label htmlFor={`clave-${name}`}>{label}</label>
              <input id={`clave-${name}`} type='password' value={form[name]} autoComplete={autoComplete} required
                onChange={(e) => setForm((prev) => ({ ...prev, [name]: e.target.value }))} />
            </div>
          ))}
          <div className='cardFormActions'>
            <button type='button' className='cancelBtn' onClick={() => { close(); setNotice(null) }}>Cancelar</button>
            <button type='submit' className='saveBtn'>Guardar contraseña</button>
          </div>
        </form>
      )}
      <Message notice={notice} className='saveMessage' />
    </div>
  )
}

export default PasswordSection
