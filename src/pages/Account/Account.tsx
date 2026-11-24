import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '../../store/store'
import CardSection from './CardSection'
import PasswordSection from './PasswordSection'
import ProfileSection from './ProfileSection'
import RentalHistory from './RentalHistory'
import './Account.css'

const Account = () => {
  const { user, ready, refreshUser, fetchRentals, logout } = useStore()
  const navigate = useNavigate()
  const isCustomer = user?.role === 'USER'

  useEffect(() => {
    if (!isCustomer) return
    Promise.all([refreshUser(), fetchRentals()]).catch(() => {}) // si falla, se ve lo último conocido
  }, [isCustomer]) // eslint-disable-line react-hooks/exhaustive-deps -- solo al entrar

  if (!ready) return null
  if (!user) return <Navigate to='/login' replace />

  const handleLogout = () => {
    logout().catch(() => {})
    void navigate('/')
  }

  return (
    <div className='accountContainer'>
      <div className='accountHeader'>
        <h1>Mi cuenta</h1>
        <button className='logoutBtn' onClick={handleLogout}>Cerrar sesión</button>
      </div>
      <p className='welcome'>Hola, <strong>{user.firstName} {user.lastName}</strong></p>
      {isCustomer && <ProfileSection user={user} />}
      <PasswordSection />
      {isCustomer && <CardSection user={user} />}
      {isCustomer && <RentalHistory />}
    </div>
  )
}

export default Account
