import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'

function App() {
  useEffect(() => {
    console.log("App mounted. Removing loader.");
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = 'none';
  }, []);

  return (
    <div className="w-full min-h-screen text-white p-10">
      <h1 className="text-4xl text-green-500">App is Working</h1>
      <p>If you see this, Dashboard.jsx is the problem.</p>
      {/* <Dashboard /> */}
    </div>
  )
}

export default App
