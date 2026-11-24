import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { api } from '../../services/api'
import './VerifyEmail.css'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(token ? 'loading' : 'error')

  useEffect(() => {
    if (!token) return

    api.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [token])

  if (status === 'loading') return (
    <div className='verifyContainer'>
      <p className='verifyMessage'>Verificando tu cuenta…</p>
    </div>
  )

  if (status === 'success') return (
    <div className='verifyContainer'>
      <div className='verifyBox success'>
        <div className='verifyIcon'>✓</div>
        <h2>¡Email verificado!</h2>
        <p>Tu cuenta está activa. Ya puedes iniciar sesión.</p>
        <Link className='verifyBtn' to='/login'>Ir al login</Link>
      </div>
    </div>
  )

  return (
    <div className='verifyContainer'>
      <div className='verifyBox error'>
        <div className='verifyIcon'>✕</div>
        <h2>Enlace inválido o expirado</h2>
        <p>El enlace de verificación no es válido o ha caducado.</p>
        <Link className='verifyBtn' to='/register'>Volver al registro</Link>
      </div>
    </div>
  )
}

export default VerifyEmail
