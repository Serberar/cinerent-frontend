import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Message, { failed, ok, type Notice } from '../../components/Message'
import { errorMessage } from '../../services/http'
import { useStore } from '../../store/store'
import './Cart.css'

const Cart = () => {
  const { items, user, removeFromCart, confirmRental } = useStore()
  const navigate = useNavigate()
  const [notice, setNotice] = useState<Notice | null>(null)
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if (!user) {
      void navigate('/login')
      return
    }
    setLoading(true)
    setNotice(null)
    try {
      await confirmRental()
      setNotice(ok('¡Alquiler confirmado! Puedes ver tu historial en el área personal.'))
    } catch (err) {
      setNotice(failed(errorMessage(err, 'Error al confirmar el alquiler.')))
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className='cart'>
        <h2>Tu carrito de alquiler</h2>
        {notice
          ? <Message notice={notice} className='cartMessage' />
          : (
            <p className='cartEmpty'>
              No tienes películas en el carrito.{' '}
              <Link to='/'>Ver catálogo</Link>
            </p>
            )}
      </div>
    )
  }

  return (
    <div className='cart'>
      <h2>Tu carrito de alquiler</h2>
      <ul className='cartList'>
        {items.map((item) => (
          <li key={item.id}>
            <div className='cartItem'>
              <img
                src={item.posterUrl}
                alt={item.title}
                className='cartImage'
              />
              <div className='cartInfo'>
                <span className='cartItemName'>{item.title}</span>
                <span className='cartItemDays'>{item.days} {item.days === 1 ? 'día' : 'días'} · {item.pricePerDay}€/día</span>
              </div>
              <span className='cartItemTotal'>{item.total.toFixed(2)}€</span>
            </div>
            <button className='removeBtn' onClick={() => removeFromCart(item.id)}>Eliminar</button>
          </li>
        ))}
      </ul>

      <p className='cartTotal'>Total: {items.reduce((acc, i) => acc + i.total, 0).toFixed(2)}€</p>

      {!user && (
        <p className='cartLoginNotice'>
          <Link to='/login'>Inicia sesión</Link> para confirmar el alquiler
        </p>
      )}

      <Message notice={notice} className='cartMessage' />

      <button className='checkoutBtn' onClick={() => void handleConfirm()} disabled={loading}>
        {loading ? 'Procesando...' : 'Confirmar alquiler'}
      </button>
    </div>
  )
}

export default Cart
