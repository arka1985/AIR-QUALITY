import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Force rebuild: 2025-11-30 Emergency Restore

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
