# Environment Configuration

This React frontend uses environment variables to configure API communication and application settings.

## Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the variables in `.env` according to your setup:
   ```bash
   # Backend API Configuration
   VITE_API_BASE_URL=http://localhost:4000
   
   # API Endpoints
   VITE_API_WORKFLOW_ENDPOINT=/run-workflow
   VITE_API_HISTORY_ENDPOINT=/history
   ```

## Available Environment Variables

### Required Variables
- `VITE_API_BASE_URL`: Base URL for the backend API (default: http://localhost:4000)
- `VITE_API_WORKFLOW_ENDPOINT`: Endpoint for workflow operations (default: /run-workflow)
- `VITE_API_HISTORY_ENDPOINT`: Endpoint for history operations (default: /history)
- `VITE_API_DELETE_HISTORY_ENDPOINT`: Endpoint for deleting individual history items (default: /history)
- `VITE_API_DELETE_ALL_HISTORY_ENDPOINT`: Endpoint for deleting all history (default: /history)

### Optional Variables
- `VITE_APP_TITLE`: Application title (default: Mini Workflow Automation)
- `VITE_APP_DESCRIPTION`: Application description
- `VITE_DEBUG_MODE`: Enable debug logging (default: false)
- `VITE_LOG_LEVEL`: Logging level (default: info)
- `VITE_ENABLE_HISTORY`: Enable history feature (default: true)
- `VITE_ENABLE_MODAL`: Enable modal feature (default: true)
- `VITE_ENABLE_ANIMATIONS`: Enable animations (default: true)

## API Service

The application uses a centralized API service (`src/services/api.js`) that:
- Handles all HTTP requests to the backend
- Provides error handling and timeout management
- Includes debug logging when `VITE_DEBUG_MODE=true`
- Performs backend health checks
- Supports request retries and timeouts

## Usage Example

```javascript
import apiService from './services/api'

// Run a workflow
const result = await apiService.runWorkflow({
  prompt: 'Get weather for Mumbai',
  action: 'weather',
  location: 'Mumbai'
})

// Get history
const history = await apiService.getHistory()

// Delete a specific history item
const deleted = await apiService.deleteHistoryItem(itemId)

// Delete all history
const result = await apiService.deleteAllHistory()

// Check backend health
const isHealthy = await apiService.healthCheck()
```

## Development vs Production

### Development
- Set `VITE_DEBUG_MODE=true` for detailed logging
- Backend typically runs on `http://localhost:4000`
- Hot reload enabled with Vite

### Production
- Set `VITE_DEBUG_MODE=false` to disable debug logs
- Update `VITE_API_BASE_URL` to production backend URL
- Build with `npm run build`

## Troubleshooting

1. **Connection Errors**: Check if backend is running and `VITE_API_BASE_URL` is correct
2. **CORS Issues**: Ensure backend has proper CORS configuration
3. **Timeout Issues**: Increase timeout in API service configuration
4. **Debug Mode**: Enable `VITE_DEBUG_MODE=true` to see detailed request/response logs