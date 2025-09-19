# Mini Workflow Automation with AI Agent & Authentication

A secure, full-stack application that allows users to authenticate via GitHub OAuth and run personalized 2-step workflows powered by an AI agent and third-party APIs. Each user has their own isolated workspace with private workflow history.

## 🚀 Features

### 🔐 **Authentication & Security**
- **GitHub OAuth Integration**: Secure sign-in/sign-up using GitHub accounts
- **JWT Token Authentication**: Stateless, secure authentication with 7-day token validity
- **Role-Based Access Control**: User and admin roles with appropriate permissions
- **Protected Routes**: All API endpoints require authentication
- **User Data Isolation**: Each user can only access their own workflows and history

### 🤖 **AI-Powered Workflows**
- **AI-Powered Responses**: Generate contextual content using Google's Gemini AI
- **Multiple API Integrations**: Weather, GitHub trending repos, and news headlines
- **Personal Workflow History**: Store and retrieve your private workflow runs
- **Beautiful Modal Views**: Detailed formatted display of workflow results

### 🎨 **Modern UI/UX**
- **Clean, Responsive Interface**: Built with React and Tailwind CSS
- **Two-Column Layout**: Workflow form on left, personal history on right
- **Real-time Feedback**: Auto-hide notifications and countdown timers
- **User Profile Display**: Shows GitHub avatar, username, and role
- **History Management**: Individual and bulk delete options for workflow history

## 📝 Prerequisites

- **Node.js** (v14 or higher)
- **GitHub Account** (for OAuth authentication)
- **Google Gemini API Key** ([Get one from Google AI Studio](https://makersuite.google.com/app/apikey))
- **GitHub OAuth App** (instructions below)

## ⚙️ **Setup Instructions**

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Automation
```

### 2. GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: `Mini Workflow Automation`
   - **Homepage URL**: `http://localhost:4000`
   - **Authorization callback URL**: `http://localhost:4000/auth/github/callback`
4. Click "Register application"
5. Copy the **Client ID** and **Client Secret** for the next step

### 3. Backend Setup

```bash
cd backend
npm install
```

### 4. Environment Configuration

1. Navigate to the `backend` directory
2. Open the `.env` file
3. Configure the following environment variables:

```env
# Server Configuration
PORT=4000
FRONTEND_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# GitHub OAuth (from step 2)
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
GITHUB_CALLBACK_URL=http://localhost:4000/auth/github/callback

# AI Configuration
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
MOCK_AI=false

# Third-party API Keys (optional but recommended)
OPENWEATHER_API_KEY=your_openweather_api_key
NEWSAPI_KEY=your_newsapi_key
GITHUB_TOKEN=your_github_personal_access_token
```

### 5. Frontend Setup

```bash
cd ../frontend-react
npm install
```

### 6. Frontend Environment Configuration

1. Navigate to the `frontend-react` directory
2. Create/update the `.env` file:

```env
VITE_API_BASE_URL=http://localhost:4000
VITE_DEBUG_MODE=true
```

### 7. Run the Application

#### Start the Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:4000`

#### Start the Frontend Development Server

```bash
cd frontend-react
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 8. Access the Application

1. Open your browser and navigate to `http://localhost:5173`
2. You'll see the login page with a "Continue with GitHub" button
3. Click the button to authenticate via GitHub OAuth
4. After successful authentication, you'll be redirected to your personal dashboard
5. Start creating workflows and view your private history!

## 🔐 **Authentication Flow**

1. **Unauthenticated Access**: Shows login page with GitHub OAuth
2. **GitHub OAuth**: Redirects to GitHub for authorization
3. **Token Generation**: Backend generates JWT token upon successful OAuth
4. **Secure Access**: All API calls include JWT token for authentication
5. **User Isolation**: Backend filters all data by authenticated user
6. **Session Duration**: Tokens valid for 7 days, then automatic re-login required
7. **Logout**: Clears tokens and returns to login page

## 📚 **API Endpoints**

### Authentication Endpoints

#### `GET /auth/github`
Initiate GitHub OAuth authentication flow.

#### `GET /auth/github/callback`
Handle GitHub OAuth callback and generate JWT token.

#### `GET /auth/me`
Get current authenticated user information.
**Headers:** `Authorization: Bearer <jwt_token>`

**Response:**
```json
{
  "id": 1,
  "username": "your_github_username",
  "email": "your@email.com",
  "avatar_url": "https://avatars.githubusercontent.com/u/...",
  "role": "user"
}
```

#### `POST /auth/logout`
Logout user (client-side token removal).

### Workflow Endpoints (Protected)

*All workflow endpoints require JWT authentication via `Authorization: Bearer <token>` header*

#### `POST /run-workflow`
Execute a workflow with AI agent and third-party API integration.

**Headers:** `Authorization: Bearer <jwt_token>`
**Request Body:**
```json
{
  "prompt": "Write a tweet about today's weather",
  "action": "weather",
  "location": "Delhi" // optional, only for weather
}
```

**Response:**
```json
{
  "ai_response": "Perfect day to chill outside!",
  "api_response": "Delhi, 32°C",
  "final_result": "Perfect day to chill outside! #weather",
  "action": "weather",
  "location": "Delhi",
  "user_id": 1
}
```

#### `GET /history`
Retrieve your personal workflow history (last 50 runs).

**Headers:** `Authorization: Bearer <jwt_token>`
**Response:**
```json
[
  {
    "id": 1,
    "title": "Delhi Weather",
    "prompt": "Write a tweet about today's weather",
    "action": "weather",
    "location": "Delhi",
    "ai_response": "Perfect day to chill outside!",
    "api_response": "Delhi, 32°C",
    "final_result": "Perfect day to chill outside! #weather",
    "user_id": 1,
    "created_at": "2025-09-19T12:26:30.000Z"
  }
]
```

#### `DELETE /history/:id`
Delete a specific workflow from your history.

**Headers:** `Authorization: Bearer <jwt_token>`
**Response:**
```json
{ "message": "Workflow deleted successfully" }
```

#### `DELETE /history`
Delete all workflows from your history.

**Headers:** `Authorization: Bearer <jwt_token>`
**Response:**
```json
{ "message": "All workflows deleted successfully" }
```

## 🔧 **Supported Actions**

- **weather**: Get current weather information for a specified location
- **github**: Fetch trending GitHub repositories from the last week  
- **news**: Get top headlines (US: NewsAPI, Other regions: Hacker News)

## 📱 **How to Use**

### 1. **Login**
- Navigate to `http://localhost:5173`
- Click "Continue with GitHub"
- Authorize the application on GitHub
- You'll be redirected to your personal dashboard

### 2. **Create Workflows**
- **Select Action**: Choose from Weather, GitHub, or News
- **Enter Location**: (For weather only) Specify city name
- **Write Prompt**: Describe what you want the AI to generate
- **Click "Run Workflow"**: Execute and see results

### 3. **View Results**
- Results appear in the left panel with beautiful formatting
- Weather: Temperature cards, humidity, wind speed, suggestions
- GitHub: Repository cards with stars, descriptions, links
- News: Headlines with links and previews

### 4. **Manage History**
- **View History**: Right panel shows your personal workflow history
- **Detailed View**: Click any history item to see formatted results in modal
- **Delete Items**: Use individual delete buttons or "Delete All"
- **Auto-hide**: Results auto-hide after 30 seconds, notifications after 5 seconds

### 5. **User Management**
- **Profile**: Top-right shows your GitHub avatar and username
- **Logout**: Click logout button to end session
- **Session**: Stays logged in for 7 days automatically

## 🎨 **UI Features**

- **Responsive Design**: Works on desktop and mobile
- **Real-time Feedback**: Loading states, countdown timers
- **Modal Popups**: Detailed workflow results with multiple close methods
- **Auto-hide**: Results and notifications auto-hide with timers
- **Beautiful Animations**: Smooth transitions and hover effects
- **Dark Theme**: Modern dark UI with gradient backgrounds

## 🚐 **Troubleshooting**

### Authentication Issues

**"OAuth callback error" or "Authentication failed"**
- Verify GitHub OAuth app configuration
- Ensure callback URL is exactly: `http://localhost:4000/auth/github/callback`
- Check `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in `.env`
- Ensure frontend is running on port 5173

**"Token expired" or automatic logout**
- JWT tokens expire after 7 days
- Simply login again with GitHub OAuth
- Check browser console for specific error messages

### Backend Connection Issues

**"Backend health check failed" or "Connection refused"**
- Ensure backend is running on port 4000
- Check that no other service is using port 4000
- Verify `.env` configuration is complete
- Check backend console for error messages

### Frontend Issues

**"Frontend won't start" or "Port conflicts"**
- Ensure frontend runs on port 5173 (required for OAuth)
- Stop other services using port 5173
- Restart frontend development server
- Clear browser cache and localStorage

### API Integration Issues

**"I do not have access to real-time information" Error**
- Verify Gemini API key in `.env` file
- Ensure the key has proper permissions
- Check internet connection
- Set `MOCK_AI=true` for testing without API

**Weather/News API errors**
- Weather works without API key (uses fallback service)
- News falls back to Hacker News if NewsAPI unavailable
- Check API key configuration if using premium features

### Database Issues

**SQLite errors or "Database connection failed"**
- Ensure backend has write permissions
- Check if `backend/database.sqlite` exists
- Backend will auto-create tables on first run
- Check backend console for specific database errors

### General Debugging

1. **Check Browser Console**: Look for JavaScript errors
2. **Check Backend Logs**: Monitor server console output
3. **Verify Environment**: Ensure all `.env` variables are set
4. **Test Authentication**: Try logging out and back in
5. **Clear Storage**: Clear browser localStorage if needed

## 💻 **Technologies Used**

### Backend
- **Node.js & Express.js**: Server framework
- **Passport.js**: Authentication middleware
  - `passport-github2`: GitHub OAuth strategy
  - `passport-jwt`: JWT authentication strategy
- **jsonwebtoken**: JWT token generation and verification
- **express-session**: Session management
- **SQLite**: Database (with auto-migration)
- **Google Gemini AI**: AI response generation
- **Third-party APIs**: Weather, GitHub, News

### Frontend
- **React 18**: Modern frontend framework
- **Vite**: Fast development build tool
- **React Router DOM**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations
- **Lucide React**: Beautiful icons
- **Context API**: Global authentication state management

### Authentication & Security
- **GitHub OAuth 2.0**: Secure social authentication
- **JWT (JSON Web Tokens)**: Stateless authentication
- **Role-based Access Control**: User permissions
- **CORS**: Cross-origin resource sharing
- **Environment Variables**: Secure configuration

### APIs & Integrations
- **Google Gemini AI**: `gemini-2.5-flash` model
- **Open-Meteo**: Weather data (free tier)
- **GitHub API**: Repository trending data
- **NewsAPI**: Headlines (with Hacker News fallback)
- **OpenWeatherMap**: Enhanced weather (optional)

## 📈 **Project Architecture**

```
Automation/
├── backend/                 # Node.js backend server
│   ├── src/
│   │   ├── config/           # Passport authentication config
│   │   ├── controllers/      # Route handlers
│   │   ├── db/               # Database models and functions
│   │   ├── middleware/       # JWT auth middleware
│   │   ├── routes/           # API routes (auth + workflow)
│   │   ├── services/         # AI and API integrations
│   │   └── app.js            # Express app configuration
│   ├── .env                  # Environment variables
│   ├── package.json          # Dependencies
│   └── server.js             # Server entry point
│
└── frontend-react/         # React frontend
    ├── src/
    │   ├── components/       # React components
    │   │   ├── AuthCallback.jsx  # OAuth callback handler
    │   │   ├── LoginPage.jsx     # GitHub OAuth login
    │   │   ├── MainApp.jsx       # Main authenticated app
    │   │   ├── Modal.jsx         # History detail modal
    │   │   ├── ResultDisplay.jsx # Formatted results
    │   │   └── ...              # Other components
    │   ├── contexts/         # React Context
    │   │   └── AuthContext.jsx   # Authentication state
    │   ├── services/         # API client
    │   │   └── api.js            # HTTP requests with JWT
    │   └── App.jsx           # Router and auth routing
    ├── .env                  # Frontend environment
    ├── package.json          # Dependencies
    └── vite.config.js        # Vite configuration
```

## 🔐 **Security Features**

- **OAuth 2.0**: Secure GitHub authentication
- **JWT Tokens**: Stateless authentication with expiration
- **User Isolation**: Database queries filtered by user_id
- **Protected Routes**: All API endpoints require authentication
- **CORS Configuration**: Restricted origins for security
- **Environment Variables**: Sensitive data in .env files
- **Session Security**: Secure cookie configuration
- **Role-based Access**: User and admin role separation

## 🚀 **Recent Enhancements**

### ✅ **Completed Features**
- [x] **GitHub OAuth Authentication** - Secure login/signup system
- [x] **JWT Token Management** - 7-day token validity with auto-expiration
- [x] **User Data Isolation** - Each user sees only their own workflows
- [x] **Protected API Routes** - All endpoints require authentication
- [x] **React Frontend Migration** - Modern React app with Tailwind CSS
- [x] **Beautiful Modal System** - Formatted workflow results display
- [x] **History Management** - Personal workflow history with delete options
- [x] **Role-based Access Control** - User and admin role support
- [x] **Auto-hide Functionality** - Smart result and notification timing
- [x] **Mobile-responsive Design** - Works on all devices

## 📅 **Future Enhancements**

- [ ] **Advanced Role Management** - More granular permissions
- [ ] **Workflow Templates** - Pre-built workflow templates
- [ ] **Workflow Sharing** - Share workflows between users
- [ ] **API Rate Limiting** - Enhanced security and performance
- [ ] **Email Notifications** - Workflow completion alerts
- [ ] **Workflow Scheduling** - Automated workflow execution
- [ ] **Analytics Dashboard** - Usage statistics and insights
- [ ] **Multi-language Support** - Internationalization
- [ ] **Cloud Deployment** - Production-ready deployment guides
- [ ] **Comprehensive Testing** - Unit and integration tests
- [ ] **Workflow Chaining** - Multi-step workflow automation
- [ ] **Third-party Integrations** - Slack, Discord, email services

## 📄 **Documentation**

- **Setup Guide**: Complete installation and configuration
- **API Reference**: Detailed endpoint documentation
- **Authentication Flow**: OAuth and JWT implementation
- **UI Components**: React component architecture
- **Database Schema**: User and workflow data structure
- **Security Model**: Authentication and authorization
- **Troubleshooting**: Common issues and solutions

## 🤝 **Contributing**

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 **License**

This project is licensed under the MIT License.

---

**Built with ❤️ by [Your Name]**  
*A modern, secure workflow automation platform with AI integration*

## 🚀 **Deployment Guide**

### 📋 **Pre-deployment Checklist**

- [ ] PostgreSQL database ready (local or hosted)
- [ ] GitHub OAuth app configured for production URLs
- [ ] All API keys obtained (Gemini, Weather, News)
- [ ] Environment variables documented
- [ ] Frontend build tested locally
- [ ] Backend tested with production database

### 🗄️ **PostgreSQL Database Setup**

#### Option 1: Hosted PostgreSQL (Recommended)

**Popular Providers:**
- [Railway](https://railway.app) - Easy PostgreSQL hosting
- [Supabase](https://supabase.com) - PostgreSQL with additional features
- [Render](https://render.com) - PostgreSQL databases
- [Heroku Postgres](https://www.heroku.com/postgres) - Reliable PostgreSQL
- [DigitalOcean](https://www.digitalocean.com/products/managed-databases) - Managed databases

**Setup Steps:**
1. Create account on chosen provider
2. Create new PostgreSQL database
3. Note connection details (host, port, database, username, password)
4. Update `DATABASE_URL` in environment variables

#### Option 2: Local PostgreSQL

**Install PostgreSQL:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql
brew services start postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

**Create Database:**
```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database and user
CREATE DATABASE workflow_automation;
CREATE USER workflow_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE workflow_automation TO workflow_user;

-- Exit
\\q
```

**Update Environment:**
```env
DATABASE_URL=postgresql://workflow_user:your_secure_password@localhost:5432/workflow_automation
```

### 🌐 **Backend Deployment**

#### Option 1: Railway (Recommended)

**Steps:**
1. Push code to GitHub repository
2. Go to [Railway](https://railway.app)
3. Create account and \"New Project\"
4. Select \"Deploy from GitHub repo\"
5. Choose your repository
6. Railway auto-detects Node.js
7. Add environment variables in Railway dashboard
8. Deploy automatically triggers

**Environment Variables in Railway:**
```env
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secure-jwt-secret-for-production
JWT_EXPIRES_IN=7d
SESSION_SECRET=your-super-secure-session-secret-for-production
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=https://your-backend-domain.com/auth/github/callback
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
OPENWEATHER_API_KEY=your_openweather_key
NEWSAPI_KEY=your_newsapi_key
GITHUB_TOKEN=your_github_token
```

#### Option 2: Render

**Steps:**
1. Go to [Render](https://render.com)
2. Create account and \"New Web Service\"
3. Connect GitHub repository
4. Configure:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Node
5. Add environment variables
6. Deploy

#### Option 3: Heroku

**Steps:**
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-app-name

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set GITHUB_CLIENT_ID=your_client_id
heroku config:set GITHUB_CLIENT_SECRET=your_client_secret
# ... add all other variables

# Deploy
git add .
git commit -m \"Deploy to Heroku\"
git push heroku main
```

### 🎨 **Frontend Deployment**

#### Option 1: Vercel (Recommended)

**Steps:**
1. Go to [Vercel](https://vercel.com)
2. Import GitHub repository
3. Select `frontend-react` as root directory
4. Vercel auto-detects Vite
5. Add environment variables:
   ```env
   VITE_API_BASE_URL=https://your-backend-domain.com
   ```
6. Deploy automatically

**Custom Domain Setup:**
1. Add custom domain in Vercel dashboard
2. Update DNS records as instructed
3. SSL automatically configured

#### Option 2: Netlify

**Steps:**
1. Build the project locally:
   ```bash
   cd frontend-react
   npm run build
   ```
2. Go to [Netlify](https://netlify.com)
3. Drag and drop `dist` folder
4. Or connect GitHub for automatic deploys
5. Add environment variables in site settings

### 🔧 **GitHub OAuth Configuration for Production**

**Update GitHub OAuth App:**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Edit your OAuth App
3. Update URLs:
   - **Homepage URL**: `https://your-frontend-domain.com`
   - **Authorization callback URL**: `https://your-backend-domain.com/auth/github/callback`
4. Save changes

### 🔍 **Production Environment Variables**

**Backend (.env.production):**
```env
# Server
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://your-frontend-domain.com

# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
JWT_EXPIRES_IN=7d
SESSION_SECRET=your-super-secure-session-secret-minimum-32-characters

# GitHub OAuth
GITHUB_CLIENT_ID=your_production_github_client_id
GITHUB_CLIENT_SECRET=your_production_github_client_secret
GITHUB_CALLBACK_URL=https://your-backend-domain.com/auth/github/callback

# AI
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
MOCK_AI=false

# Third-party APIs
OPENWEATHER_API_KEY=your_openweather_api_key
NEWSAPI_KEY=your_newsapi_key
GITHUB_TOKEN=your_github_personal_access_token
```

**Frontend (.env.production):**
```env
VITE_API_BASE_URL=https://your-backend-domain.com
VITE_DEBUG_MODE=false
```

### ✅ **Post-Deployment Checklist**

- [ ] Database connection working
- [ ] GitHub OAuth flow working
- [ ] All API integrations functional
- [ ] HTTPS enabled on both frontend and backend
- [ ] Environment variables secure
- [ ] Error monitoring setup (optional)
- [ ] Backup strategy for database
- [ ] Domain names configured
- [ ] Performance testing completed

### 🔧 **Database Migration for Production**

**Update backend/src/db/index.js for PostgreSQL:**
```javascript
// Add this for production PostgreSQL support
const isDevelopment = process.env.NODE_ENV !== 'production'
const dbPath = process.env.DATABASE_URL || 
  (isDevelopment ? './database.sqlite' : null)

if (process.env.DATABASE_URL) {
  // PostgreSQL configuration
  // Your existing PostgreSQL setup code
} else {
  // SQLite fallback for development
  // Your existing SQLite setup code
}

```


### 🚨 **Security Considerations**

- **Environment Variables**: Never commit production secrets
- **HTTPS**: Ensure SSL certificates on both frontend and backend
- **CORS**: Restrict to production domains only
- **JWT Secrets**: Use strong, unique secrets for production
- **Database**: Use connection pooling and SSL
- **Rate Limiting**: Implement API rate limiting
- **Monitoring**: Set up error tracking and monitoring

### 📊 **Monitoring & Analytics**

**Backend Monitoring:**
- [Sentry](https://sentry.io) - Error tracking
- [LogRocket](https://logrocket.com) - Session replay
- [New Relic](https://newrelic.com) - Performance monitoring

**Frontend Monitoring:**
- [Google Analytics](https://analytics.google.com) - Usage analytics
- [Hotjar](https://hotjar.com) - User behavior
- [Vercel Analytics](https://vercel.com/analytics) - Performance metrics
