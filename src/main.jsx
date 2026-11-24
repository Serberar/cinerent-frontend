import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { enableDemo } from './demo/api'

if (import.meta.env.VITE_DEMO === 'true') enableDemo()

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
