const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');

const routes = require('./routes');
const db = require('./db');

const app = express();

// CORS configuration
app.use(cors({
	origin: process.env.FRONTEND_URL || 'http://localhost:5173',
	credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
	secret: process.env.SESSION_SECRET || 'your-session-secret',
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: process.env.NODE_ENV === 'production',
		maxAge: 24 * 60 * 60 * 1000 // 24 hours
	}
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Health check
app.get('/health', (_req, res) => {
	res.json({ status: 'ok', db: db?.isConnected ? 'connected' : 'disconnected' });
});

// API routes
app.use('/', routes);

module.exports = app;


