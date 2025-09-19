// API Configuration and Service Layer
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000',
  endpoints: {
    workflow: import.meta.env.VITE_API_WORKFLOW_ENDPOINT || '/run-workflow',
    history: import.meta.env.VITE_API_HISTORY_ENDPOINT || '/history',
    deleteHistory: import.meta.env.VITE_API_DELETE_HISTORY_ENDPOINT || '/history',
    deleteAllHistory: import.meta.env.VITE_API_DELETE_ALL_HISTORY_ENDPOINT || '/history'
  },
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000, // 30 seconds
  retries: 3,
  debug: import.meta.env.VITE_DEBUG_MODE === 'true'
}

// API Service Class
class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.baseURL
    this.endpoints = API_CONFIG.endpoints
    this.defaultHeaders = API_CONFIG.headers
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('auth_token')
  }

  // Get headers with authentication
  getAuthHeaders() {
    const token = this.getAuthToken()
    const headers = { ...this.defaultHeaders }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return headers
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers
      },
      ...options
    }

    // Add timeout handling
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout)
    config.signal = controller.signal

    try {
      if (API_CONFIG.debug) {
        console.log(`🚀 API Request: ${config.method || 'GET'} ${url}`, config)
      }
      
      const response = await fetch(url, config)
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`)
      }

      const data = await response.json()
      
      if (API_CONFIG.debug) {
        console.log('✅ API Response:', data)
      }
      
      return data
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please check your connection')
      }
      
      console.error('❌ API request failed:', error)
      throw new Error(error.message || 'Network request failed')
    }
  }

  // Workflow API methods
  async runWorkflow(workflowData) {
    if (API_CONFIG.debug) {
      console.log('🚀 Running workflow with data:', workflowData)
    }
    
    const result = await this.request(this.endpoints.workflow, {
      method: 'POST',
      body: JSON.stringify(workflowData)
    })
    
    if (API_CONFIG.debug) {
      console.log('✅ Workflow result received:', result)
    }
    
    return result
  }

  // History API methods
  async getHistory() {
    return await this.request(this.endpoints.history, {
      method: 'GET'
    })
  }

  // Delete single history item
  async deleteHistoryItem(id) {
    if (!id) {
      throw new Error('History ID is required for deletion')
    }
    
    return await this.request(`${this.endpoints.deleteHistory}/${id}`, {
      method: 'DELETE'
    })
  }

  // Delete all history items
  async deleteAllHistory() {
    return await this.request(this.endpoints.deleteAllHistory, {
      method: 'DELETE'
    })
  }

  // Utility method to check API health
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout for health check
      })
      return response.ok
    } catch (error) {
      if (API_CONFIG.debug) {
        console.warn('⚠️ Backend health check failed:', error)
      }
      return false
    }
  }

  // Get environment info
  getConfig() {
    return {
      baseURL: this.baseURL,
      endpoints: this.endpoints,
      environment: import.meta.env.NODE_ENV || 'development',
      debug: API_CONFIG.debug
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService()

export default apiService

// Export individual methods for convenience
export const { runWorkflow, getHistory, deleteHistoryItem, deleteAllHistory, healthCheck } = apiService