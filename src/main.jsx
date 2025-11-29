import { createRoot } from 'react-dom/client'
import React from 'react';

console.log("Main.jsx starting...");

try {
  const root = createRoot(document.getElementById('root'));
  // Pure JS, no JSX
  root.render(
    React.createElement('div', { style: { color: 'white', padding: '20px' } },
      React.createElement('h1', null, 'System Check: Main.jsx is running (Pure JS)')
    )
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
