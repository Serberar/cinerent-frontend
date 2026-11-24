import { useState } from 'react'
import Dialog from '../../components/Dialog'
import type { AdminUser } from '../../types'

interface Props { user: AdminUser; onConfirm: (note: string) => void; onClose: () => void }

const SuspendDialog = ({ user, onConfirm, onClose }: Props) => {
  const [note, setNote] = useState('')
  return (
    <Dialog label='Suspender usuario' className='suspendModal' onClose={onClose}>
      <h3>Suspender usuario</h3>
      <p><strong>{user.firstName} {user.lastName}</strong>, {user.email}</p>
      <label className='suspendLabel' htmlFor='motivo'>Motivo de la suspensión</label>
      <textarea id='motivo' className='adminInput adminTextarea' placeholder='Ej: No ha devuelto la película en el plazo acordado.' value={note} onChange={(e) => setNote(e.target.value)} />
      <div className='movieFormActions'>
        <button className='cancelBtn' onClick={onClose}>Cancelar</button>
        <button className='deleteBtn' onClick={() => onConfirm(note)}>Confirmar suspensión</button>
      </div>
    </Dialog>
  )
}

export default SuspendDialog
