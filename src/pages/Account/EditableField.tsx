import type { ChangeEvent } from 'react'
import type { Profile } from '../../types'

interface Props {
  label: string
  name: keyof Profile
  value: string
  isEditing: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSave: () => void
  onCancel: () => void
  onEdit: (name: keyof Profile) => void
}

const EditableField = ({ label, name, value, isEditing, onChange, onSave, onCancel, onEdit }: Props) => (
  <div className='editableField'>
    <label htmlFor={`cuenta-${name}`}>{label}:</label>
    {isEditing
      ? (
        <>
          <input id={`cuenta-${name}`} name={name} value={value} onChange={onChange} />
          <button className='saveBtn' onClick={onSave}>Guardar</button>
          <button className='cancelBtn' onClick={onCancel}>Cancelar</button>
        </>
        )
      : (
        <>
          <span>{value || 'No disponible'}</span>
          <button className='editBtn' onClick={() => onEdit(name)}>Editar</button>
        </>
        )}
  </div>
)

export default EditableField
