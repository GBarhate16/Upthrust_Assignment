import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Cloud, Github, Newspaper, Send, MapPin } from 'lucide-react'

const actionIcons = {
  weather: Cloud,
  github: Github,
  news: Newspaper
}

const actionLabels = {
  weather: 'Weather',
  github: 'GitHub Trending',
  news: 'Top Headlines'
}

function WorkflowForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    prompt: '',
    action: 'weather',
    location: ''
  })

  const [showLocation, setShowLocation] = useState(true)

  useEffect(() => {
    setShowLocation(formData.action === 'weather')
  }, [formData.action])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.prompt.trim()) return
    
    const submitData = { ...formData }
    if (formData.action === 'weather') {
      submitData.location = formData.location.trim() || 'Delhi'
    }
    
    onSubmit(submitData)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Prompt Input */}
      <motion.div 
        className="flex flex-col gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label className="text-sm font-semibold text-text-secondary">
          What would you like me to help you with?
        </label>
        <textarea
          className="form-input resize-y min-h-[80px]"
          value={formData.prompt}
          onChange={(e) => handleInputChange('prompt', e.target.value)}
          placeholder="e.g., Write a tweet about today's weather in Mumbai"
          rows={3}
          required
        />
      </motion.div>

      {/* Action Selection */}
      <motion.div 
        className="flex flex-col gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label className="text-sm font-semibold text-text-secondary">
          Choose an action
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.entries(actionLabels).map(([value, label]) => {
            const Icon = actionIcons[value]
            return (
              <motion.button
                key={value}
                type="button"
                className={`bg-bg-tertiary border border-white/10 rounded-xl p-4 flex flex-col sm:flex-col items-center gap-2 cursor-pointer transition-all duration-150 ${
                  formData.action === value
                    ? 'border-accent-primary bg-accent-primary/10 text-accent-primary shadow-lg shadow-accent-primary/20'
                    : 'text-text-secondary hover:border-accent-primary hover:bg-accent-primary/5 hover:text-text-primary'
                }`}
                onClick={() => handleInputChange('action', value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium text-center">{label}</span>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Location Input (for weather) */}
      {showLocation && (
        <motion.div 
          className="flex flex-col gap-2"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <label className="text-sm font-semibold text-text-secondary flex items-center gap-2">
            <MapPin className="w-4 h-4 text-accent-primary" />
            Location (optional)
          </label>
          <input
            type="text"
            className="form-input"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="e.g., Mumbai, Delhi, Pune..."
          />
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.button
        type="submit"
        className={`bg-gradient-primary text-white border-none px-6 py-4 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider relative overflow-hidden ${
          loading ? 'bg-gradient-secondary opacity-60 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:shadow-glow active:translate-y-0'
        }`}
        disabled={loading || !formData.prompt.trim()}
        whileHover={!loading ? { scale: 1.02 } : {}}
        whileTap={!loading ? { scale: 0.98 } : {}}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-500"></div>
        <Send className={`w-4 h-4 transition-transform duration-150 ${!loading ? 'group-hover:translate-x-0.5' : ''}`} />
        {loading ? 'Running Workflow...' : 'Run Workflow'}
      </motion.button>
    </form>
  )
}

export default WorkflowForm