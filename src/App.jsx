import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'

function App() {
  useEffect(() => {
    console.log("App mounted. Removing loader.");
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = 'none';
  }, []);

  return (
    <div className="w-full min-h-screen text-white">
      <Dashboard />
    </div>
  )
}

export default App
