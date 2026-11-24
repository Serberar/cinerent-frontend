import { useEffect, useState } from 'react'
import Message, { failed, type Notice } from '../../components/Message'
import { api } from '../../services/api'
import type { Rental } from '../../types'
import formatDate from '../../utils/formatDate'

const RentalsTab = () => {
  const [rentals, setRentals] = useState<Rental[] | null>(null)
  const [notice, setNotice] = useState<Notice | null>(null)

  useEffect(() => {
    api.admin.rentals().then(setRentals, () => setNotice(failed('Error al cargar los alquileres.')))
  }, [])

  return (
    <div className='adminSection'>
      <Message notice={notice} className='adminError' />
      {rentals?.length === 0 && <p className='emptyMsg'>No hay alquileres activos en este momento.</p>}
      <div className='adminCardList'>
        {rentals?.map((r) => (
          <div key={r.id} className='adminCard'>
            <div className='adminCardBody'>
              <h3 className='adminCardTitle'>{r.movieTitle}</h3>
              <p className='adminCardMeta'>{r.dias} día{r.dias !== 1 ? 's' : ''} · Alquilada el {formatDate(r.rentedAt)}</p>
              <p className='adminCardNote'>Usuario: {r.userId}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RentalsTab
