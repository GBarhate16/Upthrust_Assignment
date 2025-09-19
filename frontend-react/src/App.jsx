import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import LoginPage from './components/LoginPage'
import AuthCallback from './components/AuthCallback'
import MainApp from './components/MainApp'
import { Loader2 } from 'lucide-react'

function App() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="glass rounded-2xl p-8 shadow-2xl">
            <Loader2 className="w-12 h-12 text-accent-primary mx-auto animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Loading...</h2>
            <p className="text-text-secondary">Checking authentication status</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated() ? <MainApp /> : <LoginPage />} 
        />
        <Route 
          path="/auth/callback" 
          element={<AuthCallback />} 
        />
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>
    </Router>
  )
}

export default App