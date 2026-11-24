import { useState, type ChangeEvent } from 'react'
import Message, { failed, ok, type Notice } from '../../components/Message'
import { errorMessage } from '../../services/http'
import { useStore } from '../../store/store'
import type { Profile, UserDetails } from '../../types'
import EditableField from './EditableField'

const FIELDS: [keyof Profile, string][] = [['firstName', 'Nombre'], ['lastName', 'Apellido'], ['phone', 'Teléfono'], ['address', 'Dirección']]

const ProfileSection = ({ user }: { user: UserDetails }) => {
  const { saveProfile } = useStore()
  const [editing, setEditing] = useState<keyof Profile | null>(null)
  const [draft, setDraft] = useState<Partial<Profile>>({})
  const [notice, setNotice] = useState<Notice | null>(null)

  const { firstName, lastName, phone, address } = user
  const form: Profile = { firstName, lastName, phone, address, ...draft }
  const stop = () => { setEditing(null); setDraft({}) }

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => setDraft((prev) => ({ ...prev, [target.name]: target.value }))
  const handleSave = async () => {
    try {
      await saveProfile(form)
      stop()
      setNotice(ok('Datos guardados correctamente.'))
    } catch (error) {
      setNotice(failed(errorMessage(error, 'Error al guardar los datos.')))
    }
  }

  return (
    <>
      <div className='personalDataContainer'>
        <h2>Datos personales</h2>
        {FIELDS.map(([name, label]) => (
          <EditableField
            key={name} name={name} label={label} value={form[name]} isEditing={editing === name}
            onChange={handleChange} onSave={() => void handleSave()} onCancel={stop}
            onEdit={(field) => { setDraft({}); setNotice(null); setEditing(field) }}
          />
        ))}
        <div className='editableField readonlyField'><label>Email:</label><span>{user.email}</span></div>
        <div className='editableField readonlyField'><label>DNI:</label><span>{user.dni}</span></div>
      </div>
      <Message notice={notice} className='saveMessage' />
    </>
  )
}

export default ProfileSection
