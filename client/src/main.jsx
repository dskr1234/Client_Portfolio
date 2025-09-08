
import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tailwind.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<div className="p-10 text-center">Loading…</div>}>
      <App />
    </Suspense>
  </React.StrictMode>
)
