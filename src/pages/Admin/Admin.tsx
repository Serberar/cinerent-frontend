import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useStore } from '../../store/store'
import GenresTab from './GenresTab'
import MoviesTab from './MoviesTab'
import RentalsTab from './RentalsTab'
import UsersTab from './UsersTab'
import './Admin.css'

const TABS = [
  { id: 'users', label: 'Usuarios', Content: UsersTab },
  { id: 'movies', label: 'Películas', Content: MoviesTab },
  { id: 'genres', label: 'Géneros', Content: GenresTab },
  { id: 'rentals', label: 'Alquileres activos', Content: RentalsTab },
] as const

const Admin = () => {
  const { user, ready } = useStore()
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('users')

  if (!ready) return null
  if (!user) return <Navigate to='/login' replace />
  if (user.role !== 'ADMIN') return <Navigate to='/' replace />

  return (
    <div className='adminContainer'>
      <h1 className='adminTitle'>Panel de administración</h1>
      <div className='adminTabs' role='tablist'>
        {TABS.map(({ id, label }) => (
          <button key={id} role='tab' aria-selected={tab === id} className={`adminTab ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>
      {TABS.map(({ id, Content }) => tab === id && <Content key={id} />)}
    </div>
  )
}

export default Admin
