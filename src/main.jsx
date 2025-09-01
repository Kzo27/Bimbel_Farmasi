import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx' // <-- Import AuthProvider
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* <-- Bungkus App dengan AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
)