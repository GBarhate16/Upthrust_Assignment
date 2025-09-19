const jwt = require('jsonwebtoken');
const db = require('../db');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
	try {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

		if (!token) {
			return res.status(401).json({ error: 'Access token required' });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await db.findUserById(decoded.userId);
		
		if (!user) {
			return res.status(401).json({ error: 'Invalid token' });
		}

		req.user = user;
		next();
	} catch (error) {
		console.error('Auth middleware error:', error);
		return res.status(403).json({ error: 'Invalid or expired token' });
	}
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
	if (!req.user) {
		return res.status(401).json({ error: 'Authentication required' });
	}
	
	if (req.user.role !== 'admin') {
		return res.status(403).json({ error: 'Admin access required' });
	}
	
	next();
};

// Generate JWT token
const generateToken = (userId) => {
	return jwt.sign(
		{ userId },
		process.env.JWT_SECRET,
		{ expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
	);
};

module.exports = {
	authenticateToken,
	requireAdmin,
	generateToken
};