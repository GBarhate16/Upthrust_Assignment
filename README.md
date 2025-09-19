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

## 📝 Quick Start Guide

### 1. **Prerequisites**
- Node.js (v14+), GitHub account
- [Google Gemini API Key](https://makersuite.google.com/app/apikey)
- GitHub OAuth App ([setup instructions](#github-oauth-setup))

### 2. **Installation**
```bash
git clone <your-repo-url>
cd Automation

# Backend setup
cd backend && npm install

# Frontend setup
cd ../frontend-react && npm install
```

### 3. **Configuration**
Update `.env` files in both `backend/` and `frontend-react/` directories with your API keys and OAuth credentials.

### 4. **Run Application**
```bash
# Terminal 1: Backend (port 4000)
cd backend && npm run dev

# Terminal 2: Frontend (port 5173)
cd frontend-react && npm run dev
```

### 5. **Access**
Open `http://localhost:5173` and login with GitHub OAuth!

## 🔐 **GitHub OAuth Setup**

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App" and configure:
   - **Application name**: `Mini Workflow Automation`
   - **Homepage URL**: `http://localhost:4000`
   - **Authorization callback URL**: `http://localhost:4000/auth/github/callback`
3. Save and copy the **Client ID** and **Client Secret**

## ⚙️ **Environment Configuration**

### Backend `.env` (in `backend/` directory):
```env
# Server
PORT=4000
FRONTEND_URL=http://localhost:5173

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
GITHUB_CALLBACK_URL=http://localhost:4000/auth/github/callback

# AI & APIs
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
MOCK_AI=false
OPENWEATHER_API_KEY=your_openweather_api_key
NEWSAPI_KEY=your_newsapi_key
GITHUB_TOKEN=your_github_personal_access_token
```

### Frontend `.env` (in `frontend-react/` directory):
```env
VITE_API_BASE_URL=http://localhost:4000
VITE_DEBUG_MODE=true
```

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

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **OAuth callback error** | Verify GitHub OAuth app callback URL: `http://localhost:4000/auth/github/callback` |
| **Token expired** | JWT tokens expire after 7 days - login again with GitHub |
| **Backend connection failed** | Ensure backend runs on port 4000, check `.env` configuration |
| **Frontend port conflicts** | Frontend must run on port 5173 for OAuth to work |
| **Gemini AI errors** | Verify `GEMINI_API_KEY` in `.env` or set `MOCK_AI=true` |
| **Database errors** | Check backend console, ensure write permissions for SQLite |

### Debugging Steps
1. Check browser console for JavaScript errors
2. Monitor backend logs for server errors
3. Verify all environment variables are set
4. Test authentication flow (logout/login)
5. Clear browser localStorage if needed

## 💻 **Technology Stack**

### Backend Technologies
- **Node.js & Express.js**: Server framework
- **Passport.js**: Authentication middleware (`passport-github2`, `passport-jwt`)
- **JWT**: Token-based authentication with 7-day expiration
- **SQLite/PostgreSQL**: Database with auto-migration support
- **Google Gemini AI**: AI response generation (`gemini-2.5-flash`)

### Frontend Technologies
- **React 18 + Vite**: Modern frontend with fast development
- **React Router DOM**: Client-side routing with protected routes
- **Tailwind CSS**: Utility-first styling with responsive design
- **Context API**: Global authentication state management

### Security & Integrations
- **GitHub OAuth 2.0**: Secure social authentication
- **Role-based Access Control**: User data isolation
- **Third-party APIs**: Weather (Open-Meteo), GitHub, News (NewsAPI/Hacker News)

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

**Built with ❤️ - A modern, secure workflow automation platform with AI integration**

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
