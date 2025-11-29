import { createRoot } from 'react-dom/client'
import React from 'react';

console.log("Main.jsx starting...");

try {
  const root = createRoot(document.getElementById('root'));
  root.render(
    <div style={{ color: 'white', padding: '20px' }}>
      <h1>System Check: Main.jsx is running</h1>
    </div>
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
  </div>`;
}
