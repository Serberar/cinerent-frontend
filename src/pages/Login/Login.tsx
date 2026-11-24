import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { errorMessage as messageOf, errorStatus } from '../../services/http'
import { useStore } from '../../store/store'
import './Login.css'

const Login = () => {
  const { login } = useStore()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  const [notVerified, setNotVerified] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setErrorMessage('')
    setNotVerified(false)
    try {
      const user = await login(String(form.get('email')), String(form.get('password')))
      void navigate(user.role === 'ADMIN' ? '/admin' : '/')
    } catch (err) {
      if (errorStatus(err) === 403) setNotVerified(true)
      else setErrorMessage(messageOf(err, 'Error al iniciar sesión.'))
    }
  }

  return (
    <div className='loginContainer'>
      <form className='loginForm' onSubmit={(e) => void handleSubmit(e)}>
        <h1>Iniciar sesión</h1>

        <div className='loginField'>
          <label htmlFor='email'>Email</label>
          <input className='loginInput' id='email' type='email' name='email' autoComplete='username' required />
        </div>

        <div className='loginField'>
          <label htmlFor='password'>Contraseña</label>
          <input className='loginInput' id='password' type='password' name='password' autoComplete='current-password' required />
        </div>

        {notVerified && (
          <div className='loginNotVerified'>
            <strong>Cuenta no verificada.</strong>
            <p>Por favor revisa tu correo de verificación o contacta al administrador.</p>
          </div>
        )}

        {errorMessage && (
          <p className='loginError' role='alert'>{errorMessage}</p>
        )}

        <button className='loginBtn' type='submit'>Iniciar sesión</button>

        <p className='loginRegisterLink'>
          ¿No tienes cuenta? <Link to='/register'>Regístrate</Link>
        </p>
      </form>
    </div>
  )
}

export default Login
