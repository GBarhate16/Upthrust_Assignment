import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, Sparkles, Github, Cloud, Newspaper, Settings, History, X, Loader2, User, LogOut } from 'lucide-react'
import WorkflowForm from './WorkflowForm'
import ResultDisplay from './ResultDisplay'
import HistoryPanel from './HistoryPanel'
import Modal from './Modal'
import { useAuth } from '../contexts/AuthContext'
import apiService from '../services/api'

function MainApp() {
  const { user, logout } = useAuth()
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [appLoading, setAppLoading] = useState(true)
  
  // Timers for auto-hiding
  const [resultTimer, setResultTimer] = useState(null)
  const [statusTimer, setStatusTimer] = useState(null)
  const [resultTimeLeft, setResultTimeLeft] = useState(0)
  const [statusTimeLeft, setStatusTimeLeft] = useState(0)

  // Auto-hide functions
  const autoHideResult = () => {
    if (resultTimer) {
      clearTimeout(resultTimer)
    }
    
    // Set initial time
    setResultTimeLeft(30)
    
    // Update countdown every second
    const countdownInterval = setInterval(() => {
      setResultTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    const timer = setTimeout(() => {
      setResult(null)
      setResultTimeLeft(0)
      clearInterval(countdownInterval)
    }, 30000) // 30 seconds
    
    setResultTimer(timer)
  }

  const autoHideStatus = () => {
    if (statusTimer) {
      clearTimeout(statusTimer)
    }
    
    // Set initial time
    setStatusTimeLeft(5)
    
    // Update countdown every second
    const countdownInterval = setInterval(() => {
      setStatusTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    const timer = setTimeout(() => {
      setStatus('')
      setStatusTimeLeft(0)
      clearInterval(countdownInterval)
    }, 5000) // 5 seconds
    
    setStatusTimer(timer)
  }

  // Initialize app and load initial data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Initializing Mini Workflow Automation...')
        // Load initial history
        await loadHistory()
        console.log('✅ App initialized successfully')
      } catch (error) {
        console.error('❌ App initialization error:', error)
      } finally {
        setAppLoading(false)
      }
    }

    initializeApp()
  }, [])

  // Cleanup timers on component unmount
  useEffect(() => {
    return () => {
      if (resultTimer) clearTimeout(resultTimer)
      if (statusTimer) clearTimeout(statusTimer)
    }
  }, [resultTimer, statusTimer])

  const runWorkflow = async (formData) => {
    setLoading(true)
    setStatus('Running workflow...')
    setResult(null)
    
    // Clear any existing timers
    if (resultTimer) clearTimeout(resultTimer)
    if (statusTimer) clearTimeout(statusTimer)

    try {
      const data = await apiService.runWorkflow(formData)
      setResult(data)
      setStatus('Completed successfully!')
      
      // Start auto-hide timers
      autoHideResult()
      autoHideStatus()
      
      // Refresh history after successful run
      setTimeout(() => loadHistory(), 500)
    } catch (error) {
      console.error('Error running workflow:', error)
      const errorMessage = `Error: ${error.message}`
      setStatus(errorMessage)
      
      // Auto-hide error status after 5 seconds
      autoHideStatus()
    } finally {
      setLoading(false)
    }
  }

  const loadHistory = async () => {
    try {
      const data = await apiService.getHistory()
      setHistory(data || [])
    } catch (error) {
      console.error('Error loading history:', error)
    }
  }

  const deleteHistoryItem = async (id) => {
    try {
      await apiService.deleteHistoryItem(id)
      const successMessage = 'History item deleted successfully!'
      setStatus(successMessage)
      autoHideStatus()
      
      // Remove the item from local state immediately for better UX
      setHistory(prev => prev.filter(item => item.id !== id))
      // Also refresh history to ensure sync
      setTimeout(() => loadHistory(), 500)
    } catch (error) {
      console.error('Error deleting history item:', error)
      const errorMessage = `Error: Failed to delete history item`
      setStatus(errorMessage)
      autoHideStatus()
    }
  }

  const deleteAllHistory = async () => {
    try {
      await apiService.deleteAllHistory()
      const successMessage = 'All history deleted successfully!'
      setStatus(successMessage)
      autoHideStatus()
      
      // Clear local state immediately
      setHistory([])
      // Also refresh to ensure sync
      setTimeout(() => loadHistory(), 500)
    } catch (error) {
      console.error('Error deleting all history:', error)
      const errorMessage = `Error: Failed to delete all history`
      setStatus(errorMessage)
      autoHideStatus()
    }
  }

  const openHistoryModal = (item) => {
    setSelectedHistoryItem(item)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedHistoryItem(null)
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  if (appLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div 
            className="glass rounded-2xl p-8 shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Loader2 className="w-12 h-12 text-accent-primary mx-auto animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Loading...</h2>
            <p className="text-text-secondary">Initializing Mini Workflow Automation</p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute w-48 h-48 top-[10%] left-[10%] rounded-full bg-gradient-to-r from-accent-primary/30 to-accent-secondary/30 blur-3xl animate-float"></div>
        <div className="absolute w-72 h-72 top-[60%] right-[10%] rounded-full bg-gradient-to-r from-accent-secondary/30 to-accent-primary/30 blur-3xl animate-float" style={{ animationDelay: '-2s' }}></div>
        <div className="absolute w-36 h-36 bottom-[20%] left-[50%] rounded-full bg-gradient-to-r from-accent-primary/30 to-accent-secondary/30 blur-3xl animate-float" style={{ animationDelay: '-4s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header with user info and logout */}
        <motion.header 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-accent-primary drop-shadow-lg" />
            <h1 className="text-2xl font-extrabold text-white">
              Mini Workflow <span className="text-gradient">Automation</span>
            </h1>
            <div className="flex items-center gap-2 ml-4">
              <Sparkles className="w-5 h-5 text-accent-secondary animate-pulse-slow" />
              <span className="text-lg text-text-secondary font-medium">AI-Powered Assistant</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 glass rounded-lg px-4 py-2">
              {user.avatar_url && (
                <img 
                  src={user.avatar_url} 
                  alt={user.username}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div className="text-white">
                <p className="font-semibold">{user.username}</p>
                <p className="text-xs text-text-secondary">{user.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </motion.header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          {/* Left Column - Workflow Form and Results */}
          <div className="lg:col-span-7 space-y-6">
            {/* Workflow Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="glass rounded-2xl p-6 shadow-2xl"
            >
              <WorkflowForm onSubmit={runWorkflow} loading={loading} />
            </motion.div>

            {/* Status Message */}
            {status && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass rounded-xl p-4 shadow-lg flex items-center justify-between ${
                  status.includes('Error') 
                    ? 'border-red-500/50 bg-red-500/10' 
                    : 'border-green-500/50 bg-green-500/10'
                }`}
              >
                <span className={`font-medium ${
                  status.includes('Error') ? 'text-red-300' : 'text-green-300'
                }`}>
                  {status}
                </span>
                {statusTimeLeft > 0 && (
                  <span className="text-text-secondary text-sm">
                    Auto-hide in {statusTimeLeft}s
                  </span>
                )}
              </motion.div>
            )}

            {/* Results Display */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl shadow-2xl overflow-hidden"
              >
                <ResultDisplay 
                  result={result} 
                  timeLeft={resultTimeLeft}
                  onKeepVisible={() => {
                    if (resultTimer) {
                      clearTimeout(resultTimer)
                      setResultTimer(null)
                      setResultTimeLeft(0)
                    }
                  }}
                  onClose={() => setResult(null)}
                />
              </motion.div>
            )}
          </div>

          {/* Right Column - History Panel */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass rounded-2xl shadow-2xl h-full"
            >
              <HistoryPanel 
                history={history}
                onItemClick={openHistoryModal}
                onDeleteItem={deleteHistoryItem}
                onDeleteAll={deleteAllHistory}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedHistoryItem && (
        <Modal
          isOpen={showModal}
          onClose={closeModal}
          title={selectedHistoryItem.title}
        >
          <ResultDisplay result={selectedHistoryItem} isModal={true} />
        </Modal>
      )}
    </div>
  )
}

export default MainApp