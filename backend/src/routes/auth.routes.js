const { Router } = require('express');
const passport = require('../config/passport');
const { generateToken } = require('../middleware/auth');

const router = Router();

// GitHub OAuth login
router.get('/github',
	passport.authenticate('github', { scope: ['user:email'] })
);

// GitHub OAuth callback
router.get('/github/callback',
	passport.authenticate('github', { session: false }),
	(req, res) => {
		try {
			// Generate JWT token
			const token = generateToken(req.user.id);
			
			// Redirect to frontend with token
			const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
			res.redirect(`${frontendURL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
				id: req.user.id,
				username: req.user.username,
				email: req.user.email,
				avatar_url: req.user.avatar_url,
				role: req.user.role
			}))}`);
		} catch (error) {
			console.error('❌ Auth callback error:', error);
			const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
			res.redirect(`${frontendURL}/auth/error?message=Authentication failed`);
		}
	}
);

// Get current user
router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
	res.json({
		id: req.user.id,
		username: req.user.username,
		email: req.user.email,
		avatar_url: req.user.avatar_url,
		role: req.user.role
	});
});

// Logout (client-side will remove token)
router.post('/logout', (req, res) => {
	res.json({ message: 'Logout successful' });
});

module.exports = router;