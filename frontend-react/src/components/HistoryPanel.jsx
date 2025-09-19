import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Cloud, Github, Newspaper, Zap, Trash2, Trash, Loader2 } from 'lucide-react'

const actionIcons = {
  weather: Cloud,
  github: Github,
  news: Newspaper
}

function HistoryPanel({ history, onItemClick, onDeleteItem, onDeleteAll }) {
  const [deletingItems, setDeletingItems] = useState(new Set())
  const [deletingAll, setDeletingAll] = useState(false)

  const generateHistoryTitle = (item) => {
    switch (item.action) {
      case 'weather':
        try {
          const weatherData = JSON.parse(item.api_response)
          return `${weatherData.location} Weather`
        } catch {
          const match = item.api_response.match(/(.+), [\d.]+°C/)
          return match ? `${match[1]} Weather` : 'Weather Report'
        }
      case 'github':
        return 'GitHub Trending'
      case 'news':
        return 'Tech Headlines'
      default:
        return `${item.action.charAt(0).toUpperCase() + item.action.slice(1)} Result`
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60))
      return `${diffMins}m ago`
    } else if (diffHours < 24) {
      return `${diffHours}h ago`
    } else if (diffDays < 7) {
      return `${diffDays}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const handleDeleteItem = async (e, itemId) => {
    e.stopPropagation() // Prevent triggering the item click
    
    if (!onDeleteItem) return
    
    setDeletingItems(prev => new Set([...prev, itemId]))
    
    try {
      await onDeleteItem(itemId)
    } catch (error) {
      console.error('Failed to delete item:', error)
    } finally {
      setDeletingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const handleDeleteAll = async () => {
    if (!onDeleteAll || deletingAll) return
    
    if (!window.confirm('Are you sure you want to delete all history? This action cannot be undone.')) {
      return
    }
    
    setDeletingAll(true)
    
    try {
      await onDeleteAll()
    } catch (error) {
      console.error('Failed to delete all history:', error)
    } finally {
      setDeletingAll(false)
    }
  }

  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center text-gray-500">
        <Zap className="w-12 h-12 mb-4 text-gray-500 opacity-50" />
        <p className="mb-2 text-lg font-medium text-gray-300">No workflow history yet</p>
        <span className="text-sm text-gray-400 mb-4">Run your first workflow to see it here!</span>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-xs text-blue-400">
          💡 <strong>Tip:</strong> Results auto-hide after 30 seconds. Access them anytime through history!
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Delete All Button */}
      {history.length > 0 && (
        <div className="mb-4 pb-4 border-b border-white/10">
          <motion.button
            className="w-full flex items-center justify-center gap-2 p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-xl text-red-400 hover:text-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleDeleteAll}
            disabled={deletingAll}
            whileHover={{ scale: deletingAll ? 1 : 1.02 }}
            whileTap={{ scale: deletingAll ? 1 : 0.98 }}
          >
            {deletingAll ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">Deleting All...</span>
              </>
            ) : (
              <>
                <Trash className="w-4 h-4" />
                <span className="text-sm font-medium">Delete All History</span>
              </>
            )}
          </motion.button>
        </div>
      )}

      <div className="flex-1 max-h-[600px] overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent hover:scrollbar-thumb-primary/50">
        {history.map((item, index) => {
          const Icon = actionIcons[item.action] || Zap
          const title = generateHistoryTitle(item)
          const isDeleting = deletingItems.has(item.id)
          
          return (
            <motion.div
              key={item.id || index}
              className={`group relative bg-gray-800 border border-gray-600 rounded-xl p-4 transition-all duration-200 overflow-hidden ${
                isDeleting 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer hover:bg-blue-900/20 hover:border-blue-500/30 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={isDeleting ? undefined : () => onItemClick(item)}
              whileHover={isDeleting ? {} : { scale: 1.02 }}
              whileTap={isDeleting ? {} : { scale: 0.98 }}
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2 flex-shrink-0">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white mb-1 leading-tight">{title}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span className="font-medium">{formatDate(item.created_at)}</span>
                    <span className="opacity-50">•</span>
                    <span className="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide">{item.action}</span>
                  </div>
                </div>
                
                {/* Delete Button */}
                <motion.button
                  className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                    isDeleting 
                      ? 'bg-red-500/20 text-red-400 cursor-not-allowed' 
                      : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100'
                  }`}
                  onClick={(e) => handleDeleteItem(e, item.id)}
                  disabled={isDeleting}
                  whileHover={isDeleting ? {} : { scale: 1.1 }}
                  whileTap={isDeleting ? {} : { scale: 0.9 }}
                  title="Delete this item"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </motion.button>
              </div>
              
              <div className="text-xs text-gray-300 leading-relaxed pt-2 border-t border-white/5">
                {item.final_result && item.final_result.length > 100 
                  ? `${item.final_result.substring(0, 100)}...`
                  : item.final_result || 'Click to view details'
                }
              </div>
            </motion.div>
          )
        })}
      </div>

      {history.length >= 10 && (
        <div className="mt-4 pt-3 text-center border-t border-white/10">
          <p className="text-xs text-gray-400 italic">Showing last 10 workflows</p>
        </div>
      )}
    </div>
  )
}

export default HistoryPanel