import { useState, type FormEvent } from 'react'
import Dialog from '../../components/Dialog'
import Message, { failed, ok, type Notice } from '../../components/Message'
import { api } from '../../services/api'
import { errorMessage } from '../../services/http'
import type { AdminUser, Profile } from '../../types'

interface Props {
  user: AdminUser
  profile: Profile
  onSaved: (profile: Profile) => void
  onToggleSuspension: () => void
  onClose: () => void
}

const ROWS: [keyof Profile, string, boolean][][] = [
  [['firstName', 'Nombre', true], ['lastName', 'Apellido', true]],
  [['phone', 'Teléfono', false], ['address', 'Dirección', false]],
]

const EditUserDialog = ({ user, profile, onSaved, onToggleSuspension, onClose }: Props) => {
  const { firstName, lastName, phone, address } = profile
  const [form, setForm] = useState<Profile>({ firstName, lastName, phone, address })
  const [notice, setNotice] = useState<Notice | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      onSaved(await api.admin.updateUser(user.id, form))
      setNotice(ok('Datos actualizados correctamente.'))
    } catch (error) {
      setNotice(failed(errorMessage(error, 'Error al actualizar.')))
    }
  }

  return (
    <Dialog label='Editar usuario' className='suspendModal' onClose={onClose}>
      <h3>Editar usuario</h3>
      <p><strong>{user.email}</strong></p>
      <form onSubmit={(e) => void submit(e)}>
        {ROWS.map((row) => (
          <div className='movieFormRow' key={row[0]?.[0]} style={{ marginTop: '0.8rem' }}>
            {row.map(([name, label, required]) => (
              <div className='fieldGroup' key={name}>
                <label htmlFor={`usuario-${name}`}>{label}</label>
                <input id={`usuario-${name}`} className='adminInput' value={form[name]} required={required}
                  onChange={(e) => setForm((prev) => ({ ...prev, [name]: e.target.value }))} />
              </div>
            ))}
          </div>
        ))}
        <Message notice={notice} />
        <div className='movieFormActions'>
          <button type='button' className={`toggleBtn ${user.suspended ? 'activate' : 'deactivate'}`} style={{ marginRight: 'auto' }} onClick={onToggleSuspension}>
            {user.suspended ? 'Reactivar cuenta' : 'Suspender cuenta'}
          </button>
          <button type='button' className='cancelBtn' onClick={onClose}>Cerrar</button>
          <button type='submit' className='submitBtn'>Guardar</button>
        </div>
      </form>
    </Dialog>
  )
}

export default EditUserDialog
