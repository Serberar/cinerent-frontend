import { useState } from 'react'
import Message, { failed, type Notice } from '../../components/Message'
import { errorMessage } from '../../services/http'
import { useStore } from '../../store/store'
import formatDate from '../../utils/formatDate'

const RentalHistory = () => {
  const { rentals, returnMovie } = useStore()
  const [notice, setNotice] = useState<Notice | null>(null)

  const handleReturn = async (id: string) => {
    setNotice(null)
    try { await returnMovie(id) }
    catch (error) { setNotice(failed(errorMessage(error, 'Error al devolver la película.'))) }
  }

  return (
    <div className='historyContainer'>
      <h2>Historial de alquileres</h2>
      <Message notice={notice} className='saveMessage' />
      {rentals.length === 0
        ? <p className='historyEmpty'>No hay alquileres registrados.</p>
        : (
          <table className='historyTable'>
            <thead>
              <tr><th>Película</th><th>Días</th><th>Alquilada</th><th>Devuelta</th><th><span hidden>Acciones</span></th></tr>
            </thead>
            <tbody>
              {rentals.map((rental) => (
                <tr key={rental.id}>
                  <td>{rental.movieTitle}</td>
                  <td>{rental.dias}</td>
                  <td>{formatDate(rental.rentedAt)}</td>
                  <td>{rental.returnedAt ? formatDate(rental.returnedAt) : <span className='activeStatus'>Activo</span>}</td>
                  <td>{!rental.returnedAt && <button className='returnBtn' onClick={() => void handleReturn(rental.id)}>Devolver</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
    </div>
  )
}

export default RentalHistory
