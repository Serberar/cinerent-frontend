import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { enableDemo } from './demo/api'

if (import.meta.env.VITE_DEMO === 'true') enableDemo()

const container = document.getElementById('root')
if (!container) throw new Error('Falta #root en index.html')
const root = ReactDOM.createRoot(container)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
