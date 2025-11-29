import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Force rebuild: Diagnostic Mode
import React from 'react';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red', backgroundColor: 'black', height: '100vh', overflow: 'auto' }}>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error && this.state.error.toString()}</pre>
          <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

console.log("Booting React App...");

try {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <GlobalErrorBoundary>
        <App />
      </GlobalErrorBoundary>
    </StrictMode>,
  );
  console.log("React App mounted successfully.");
} catch (e) {
  console.error("Fatal Error during mount:", e);
  document.body.innerHTML = `<div style="color:red; padding:20px;"><h1>Fatal Mount Error</h1><pre>${e.toString()}</pre></div>`;
}
