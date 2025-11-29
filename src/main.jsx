import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// Force rebuild: Simplified Mount
import React from 'react';

try {
  const root = createRoot(document.getElementById('root'));
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );

  // Remove loading overlay
  const overlay = document.getElementById('loading-overlay');
  if (overlay) overlay.style.display = 'none';

  console.log("React App mounted successfully.");
} catch (e) {
  console.error("Fatal Error during mount:", e);
  document.body.innerHTML = `<div style="color:red; padding:20px; background:black; height:100vh;">
    <h1>Fatal Mount Error</h1>
    <pre>${e.toString()}</pre>
    <pre>${e.stack}</pre>
  </div>`;
}
