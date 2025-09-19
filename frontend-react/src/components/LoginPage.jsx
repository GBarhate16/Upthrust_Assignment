import React from 'react'
import { motion } from 'framer-motion'
import { Github, Zap, Sparkles } from 'lucide-react'

function LoginPage() {
  const handleGitHubLogin = () => {
    // Redirect to GitHub OAuth
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/github`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute w-48 h-48 top-[10%] left-[10%] rounded-full bg-gradient-to-r from-accent-primary/30 to-accent-secondary/30 blur-3xl animate-float"></div>
        <div className="absolute w-72 h-72 top-[60%] right-[10%] rounded-full bg-gradient-to-r from-accent-secondary/30 to-accent-primary/30 blur-3xl animate-float" style={{ animationDelay: '-2s' }}></div>
        <div className="absolute w-36 h-36 bottom-[20%] left-[50%] rounded-full bg-gradient-to-r from-accent-primary/30 to-accent-secondary/30 blur-3xl animate-float" style={{ animationDelay: '-4s' }}></div>
      </div>

      <div className="max-w-md w-full p-6">
        <motion.div 
          className="glass rounded-2xl p-8 shadow-2xl text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo and Title */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap className="w-10 h-10 text-accent-primary drop-shadow-lg" />
              <h1 className="text-3xl font-extrabold text-white">
                Mini Workflow <span className="text-gradient">Automation</span>
              </h1>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-secondary animate-pulse-slow" />
              <span className="text-lg text-text-secondary font-medium">AI-Powered Assistant</span>
            </div>
          </motion.div>

          {/* Welcome Message */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold text-white mb-3">Welcome Back!</h2>
            <p className="text-text-secondary leading-relaxed">
              Sign in with your GitHub account to access your personal workflow automation dashboard.
            </p>
          </motion.div>

          {/* GitHub Login Button */}
          <motion.button
            onClick={handleGitHubLogin}
            className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 border border-gray-600 hover:border-gray-500 shadow-lg hover:shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Github className="w-5 h-5" />
            <span>Continue with GitHub</span>
          </motion.button>

          {/* Features List */}
          <motion.div 
            className="mt-8 pt-6 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p className="text-text-secondary text-sm mb-4">What you'll get:</p>
            <div className="space-y-2 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent-primary rounded-full"></div>
                <span>Personal workflow history</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent-primary rounded-full"></div>
                <span>Weather reports & tech news</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent-primary rounded-full"></div>
                <span>AI-powered automation</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage