import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../../services/api'
import { errorMessage } from '../../services/http'
import { formatCardNumber } from '../../utils/card'
import CardPreview from '../../components/CardPreview/CardPreview'
import './Register.css'

const EMPTY_FORM = {
  firstName: '', lastName: '', dni: '', phone: '', address: '', email: '',
  password: '', confirmPassword: '',
}

const EMPTY_CARD = {
  cardNumber: '', cardHolder: '', expiry: '', cvv: '',
}

const Register = () => {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [form, setForm] = useState(EMPTY_FORM)
  const [card, setCard] = useState(EMPTY_CARD)
  const [stepError, setStepError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleCardChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'cardNumber') {
      setCard(prev => ({ ...prev, cardNumber: formatCardNumber(value) }))
    } else if (name === 'expiry') {
      const digits = value.replace(/\D/g, '').slice(0, 4)
      const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
      setCard(prev => ({ ...prev, expiry: formatted }))
    } else if (name === 'cvv') {
      setCard(prev => ({ ...prev, cvv: value.replace(/\D/g, '').slice(0, 3) }))
    } else {
      setCard(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleNextStep = () => {
    setStepError('')
    const { firstName, lastName, dni, phone, address, email, password, confirmPassword } = form
    if (!firstName || !lastName || !dni || !phone || !address || !email || !password) {
      setStepError('Todos los campos son obligatorios.')
      return
    }
    if (password !== confirmPassword) {
      setStepError('Las contraseñas no coinciden.')
      return
    }
    setStep(2)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitError('')

    const { cardNumber, cardHolder, expiry, cvv } = card
    if (!cardNumber || !cardHolder || !expiry || !cvv) {
      setSubmitError('Todos los campos de la tarjeta son obligatorios.')
      return
    }

    setLoading(true)
    try {
      await api.register({
        firstName: form.firstName,
        lastName: form.lastName,
        dni: form.dni,
        phone: form.phone,
        address: form.address,
        email: form.email,
        password: form.password,
        cardNumber: cardNumber.replace(/\s/g, ''),
      })
      setSuccess(true)
      setTimeout(() => { void navigate('/login') }, 4000)
    } catch (err) {
      setSubmitError(errorMessage(err, 'Error en el registro. Inténtalo de nuevo.'))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className='registerContainer'>
        <div className='registerSuccess'>
          <div className='successIcon'>✓</div>
          <h2>¡Cuenta creada!</h2>
          <p>Enviamos un email de verificación a <strong>{form.email}</strong>.</p>
          <p>Haz clic en el enlace del email para activar tu cuenta antes de iniciar sesión.</p>
          <p className='redirectNote'>Redirigiendo al inicio de sesión…</p>
        </div>
      </div>
    )
  }

  return (
    <div className='registerContainer'>
      <div className='stepIndicator'>
        <div className={`stepDot ${step >= 1 ? 'active' : ''}`}>1</div>
        <div className='stepLine' />
        <div className={`stepDot ${step >= 2 ? 'active' : ''}`}>2</div>
      </div>

      {step === 1 && (
        <form className='registerForm' onSubmit={e => { e.preventDefault(); handleNextStep() }}>
          <h1>Crear cuenta</h1>
          <p className='registerSubtitle'>Paso 1 de 2 — Datos personales</p>

          <div className='registerGrid'>
            <div className='loginField'>
              <label htmlFor='registro-firstName'>Nombre</label>
              <input id='registro-firstName' className='loginInput' name='firstName' value={form.firstName} onChange={handleFormChange} required />
            </div>
            <div className='loginField'>
              <label htmlFor='registro-lastName'>Apellido</label>
              <input id='registro-lastName' className='loginInput' name='lastName' value={form.lastName} onChange={handleFormChange} required />
            </div>
            <div className='loginField'>
              <label htmlFor='registro-dni'>DNI</label>
              <input id='registro-dni' className='loginInput' name='dni' value={form.dni} onChange={handleFormChange} required />
            </div>
            <div className='loginField'>
              <label htmlFor='registro-phone'>Teléfono</label>
              <input id='registro-phone' className='loginInput' name='phone' value={form.phone} onChange={handleFormChange} required />
            </div>
          </div>

          <div className='loginField'>
            <label htmlFor='registro-address'>Dirección</label>
            <input id='registro-address' className='loginInput' name='address' value={form.address} onChange={handleFormChange} required />
          </div>
          <div className='loginField'>
            <label htmlFor='registro-email'>Email</label>
            <input id='registro-email' className='loginInput' type='email' name='email' value={form.email} onChange={handleFormChange} required />
          </div>
          <div className='loginField'>
            <label htmlFor='registro-password'>Contraseña</label>
            <input id='registro-password' className='loginInput' type='password' name='password' value={form.password} onChange={handleFormChange} required />
          </div>
          <div className='loginField'>
            <label htmlFor='registro-confirmPassword'>Confirmar contraseña</label>
            <input id='registro-confirmPassword' className='loginInput' type='password' name='confirmPassword' value={form.confirmPassword} onChange={handleFormChange} required />
          </div>

          {stepError && <p className='loginError'>{stepError}</p>}

          <button className='loginBtn' type='submit'>Siguiente →</button>
          <p className='registerLoginLink'>¿Ya tienes cuenta? <Link to='/login'>Iniciar sesión</Link></p>
        </form>
      )}

      {step === 2 && (
        <form className='registerForm' onSubmit={(e) => void handleSubmit(e)}>
          <h1>Datos de pago</h1>
          <p className='registerSubtitle'>Paso 2 de 2 — Registro seguro de tarjeta</p>

          <CardPreview
            cardNumber={card.cardNumber}
            cardHolder={card.cardHolder}
            expiry={card.expiry}
          />

          <div className='loginField'>
            <label htmlFor='registro-cardNumber'>Número de tarjeta</label>
            <input
              id='registro-cardNumber'
              className='loginInput cardInput'
              name='cardNumber'
              value={card.cardNumber}
              onChange={handleCardChange}
              placeholder='0000 0000 0000 0000'
              maxLength={19}
              required
            />
          </div>

          <div className='loginField'>
            <label htmlFor='registro-cardHolder'>Nombre del titular</label>
            <input
              id='registro-cardHolder'
              className='loginInput'
              name='cardHolder'
              value={card.cardHolder}
              onChange={handleCardChange}
              placeholder='Nombre tal como aparece en la tarjeta'
              required
            />
          </div>

          <div className='cardDetailsRow'>
            <div className='loginField'>
              <label htmlFor='registro-expiry'>Fecha de vencimiento</label>
              <input
                id='registro-expiry'
                className='loginInput'
                name='expiry'
                value={card.expiry}
                onChange={handleCardChange}
                placeholder='MM/YY'
                maxLength={5}
                required
              />
            </div>
            <div className='loginField'>
              <label htmlFor='registro-cvv'>CVV</label>
              <input
                id='registro-cvv'
                className='loginInput'
                name='cvv'
                value={card.cvv}
                onChange={handleCardChange}
                placeholder='•••'
                maxLength={3}
                type='password'
                required
              />
            </div>
          </div>

          <div className='secureNote'>
            <span className='lockIcon'>🔒</span> Solo se guardan los cuatro últimos dígitos de la tarjeta.
          </div>

          {submitError && <p className='loginError'>{submitError}</p>}

          <div className='registerActions'>
            <button type='button' className='backBtn' onClick={() => setStep(1)}>← Atrás</button>
            <button type='submit' className='loginBtn' disabled={loading}>
              {loading ? 'Registrando…' : 'Completar registro'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default Register
