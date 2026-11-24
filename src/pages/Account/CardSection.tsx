import { useState, type FormEvent } from 'react'
import CardPreview from '../../components/CardPreview/CardPreview'
import Message, { failed, ok, type Notice } from '../../components/Message'
import { errorMessage } from '../../services/http'
import { useStore } from '../../store/store'
import type { UserDetails } from '../../types'
import { formatCardNumber } from '../../utils/card'

const CardSection = ({ user }: { user: UserDetails }) => {
  const { saveCard } = useStore()
  const [open, setOpen] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [notice, setNotice] = useState<Notice | null>(null)

  const close = () => { setOpen(false); setCardNumber('') }
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const digits = cardNumber.replace(/\s/g, '')
    if (digits.length !== 16) { setNotice(failed('El número de tarjeta debe tener 16 dígitos.')); return }
    try {
      await saveCard(digits)
      close()
      setNotice(ok('Tarjeta actualizada correctamente.'))
    } catch (error) {
      setNotice(failed(errorMessage(error, 'Error al actualizar la tarjeta.')))
    }
  }

  return (
    <div className='personalDataContainer cardSection'>
      <h2>Datos bancarios</h2>
      <div className='cardMasked'>
        <span className='cardIcon'>💳</span>
        <span>**** **** **** {user.cardLast4}</span>
        {!open && <button className='editBtn' onClick={() => { setNotice(null); setOpen(true) }}>Actualizar tarjeta</button>}
      </div>
      {open && (
        <form className='cardForm' onSubmit={(e) => void submit(e)}>
          <CardPreview cardNumber={cardNumber} cardHolder={`${user.firstName} ${user.lastName}`.trim()} />
          <div className='editableField' style={{ marginTop: '1rem' }}>
            <label htmlFor='cuenta-tarjeta'>Número de tarjeta</label>
            <input id='cuenta-tarjeta' value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder='0000 0000 0000 0000' maxLength={19} autoComplete='cc-number' />
          </div>
          <div className='cardFormActions'>
            <button type='button' className='cancelBtn' onClick={() => { close(); setNotice(null) }}>Cancelar</button>
            <button type='submit' className='saveBtn'>Guardar tarjeta</button>
          </div>
        </form>
      )}
      <Message notice={notice} className='saveMessage' />
    </div>
  )
}

export default CardSection
