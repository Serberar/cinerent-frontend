import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../../store/store'
import './Nav.css'

const Nav = () => {
  const { user, items, logout } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const totalItems = items.length

  const handleLogout = () => {
    logout().catch(() => {}) // sin red: la sesión ya está cerrada en esta pantalla
    setMenuOpen(false)
    void navigate('/')
  }

  return (
    <nav className='nav'>
      <div className='navLogo'>
        <Link to='/'>🎬 Cine<span>Rent</span></Link>
      </div>

      <button
        className='hamburger'
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label='Menú'
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>

      <ul className={`navLinks ${menuOpen ? 'open' : ''}`}>
        {user?.role !== 'ADMIN' && (
          <li>
            <Link to='/' onClick={() => setMenuOpen(false)}>Catálogo</Link>
          </li>
        )}
        {user?.role !== 'ADMIN' && (
          <li>
            <Link to='/carrito' className='cartLink' onClick={() => setMenuOpen(false)}>
              🛒 Carrito
              {totalItems > 0 && <span className='badge'>{totalItems}</span>}
            </Link>
          </li>
        )}

        {user
          ? (
            <>
              {user.role === 'ADMIN' && (
                <li>
                  <Link to='/admin' onClick={() => setMenuOpen(false)}>Admin</Link>
                </li>
              )}
              <li>
                <Link to='/cliente' onClick={() => setMenuOpen(false)}>
                  👤 {user.firstName}
                </Link>
              </li>
              <li>
                <button className='navLogoutBtn' onClick={handleLogout}>Cerrar sesión</button>
              </li>
            </>
            )
          : (
            <>
              <li>
                <Link to='/register' className='navRegisterLink' onClick={() => setMenuOpen(false)}>
                  Registrarse
                </Link>
              </li>
              <li>
                <Link to='/login' className='navLoginLink' onClick={() => setMenuOpen(false)}>
                  Iniciar sesión
                </Link>
              </li>
            </>
            )}
      </ul>
    </nav>
  )
}

export default Nav
