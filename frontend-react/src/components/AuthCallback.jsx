import React, { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

function AuthCallback() {
  const { login } = useAuth()

  useEffect(() => {
    const handleAuthCallback = () => {
      try {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')
        const userStr = urlParams.get('user')
        const error = urlParams.get('message')

        if (error) {
          console.error('❌ Auth error:', error)
          // Redirect to login with error
          window.location.href = '/?auth_error=' + encodeURIComponent(error)
          return
        }

        if (token && userStr) {
          try {
            const userData = JSON.parse(decodeURIComponent(userStr))
            console.log('✅ Auth successful, logging in user:', userData.username)
            
            // Login user with token and data
            login(token, userData)
            
            // Redirect to main app
            window.location.href = '/'
          } catch (parseError) {
            console.error('❌ Error parsing user data:', parseError)
            window.location.href = '/?auth_error=Invalid user data'
          }
        } else {
          console.error('❌ Missing token or user data')
          window.location.href = '/?auth_error=Missing authentication data'
        }
      } catch (error) {
        console.error('❌ Auth callback error:', error)
        window.location.href = '/?auth_error=Authentication failed'
      }
    }

    handleAuthCallback()
  }, [login])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
      <div className="glass rounded-2xl p-8 shadow-2xl text-center max-w-md w-full mx-4">
        <div className="mb-6">
          <Loader2 className="w-12 h-12 text-accent-primary mx-auto animate-spin" />
        </div>
        
        <h2 className="text-xl font-semibold text-white mb-2">
          Completing Authentication...
        </h2>
        
        <p className="text-text-secondary">
          Please wait while we finish setting up your account.
        </p>

        <div className="mt-6 text-sm text-text-secondary">
          If this takes too long, you'll be redirected automatically.
        </div>
      </div>
    </div>
  )
}

export default AuthCallback