import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('HackForge AI Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#0F172A', color: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ maxWidth: '480px', width: '100%', background: '#1E293B', padding: '30px', borderRadius: '24px', border: '1px solid #334155', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>HackForge AI Notice</h2>
            <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '20px' }}>A studio layout update took place. Click below to reload your creative workspace.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{ background: '#4F46E5', color: '#FFFFFF', border: 'none', padding: '10px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', width: '100%' }}
              >
                Reload Studio
              </button>
              <button
                onClick={() => {
                  try {
                    localStorage.removeItem('hackforge_projects');
                  } catch (e) {}
                  window.location.reload();
                }}
                style={{ background: 'transparent', color: '#94A3B8', border: '1px solid #334155', padding: '8px 20px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', fontSize: '12px', width: '100%' }}
              >
                Reset Studio Cache
              </button>
            </div>
            {this.state.error && (
              <details style={{ marginTop: '16px', textAlign: 'left', fontSize: '11px', color: '#64748B' }}>
                <summary style={{ cursor: 'pointer', color: '#94A3B8' }}>Technical details</summary>
                <pre style={{ marginTop: '8px', overflow: 'auto', background: '#0F172A', padding: '8px', borderRadius: '8px', color: '#F43F5E' }}>
                  {this.state.error.message || String(this.state.error)}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
