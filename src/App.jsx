import { useState, useEffect } from 'react'

function App() {
  useEffect(() => {
    console.log("App mounted. Removing loader.");
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = 'none';
  }, []);

  return (
    <div className="w-full min-h-screen text-white p-10">
      <h1 className="text-4xl text-green-500">App.jsx is Working</h1>
      <p>Dashboard import was removed.</p>
    </div>
  )
}

export default App
