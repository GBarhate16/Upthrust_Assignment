import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import apiService from './services/api.js'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

// Environment validation and configuration logging
if (import.meta.env.VITE_DEBUG_MODE === 'true') {
  console.log('🔧 Environment Configuration:', {
    mode: import.meta.env.NODE_ENV,
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
    appTitle: import.meta.env.VITE_APP_TITLE,
    debug: import.meta.env.VITE_DEBUG_MODE
  })
  
  console.log('🌐 API Service Configuration:', apiService.getConfig())
  
  // Check backend connectivity
  apiService.healthCheck().then(isHealthy => {
    console.log(`🏥 Backend Health Check: ${isHealthy ? '✅ Connected' : '❌ Disconnected'}`)
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)