const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const db = require('../db');

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
	clientID: process.env.GITHUB_CLIENT_ID,
	clientSecret: process.env.GITHUB_CLIENT_SECRET,
	callbackURL: process.env.GITHUB_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
	try {
		console.log('🔐 GitHub OAuth callback for user:', profile.username);
		
		// Check if user already exists
		let user = await db.findUserByGithubId(profile.id);
		
		if (user) {
			// Update existing user with latest info
			user = await db.updateUser(user.id, {
				username: profile.username,
				email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
				avatar_url: profile.photos && profile.photos[0] ? profile.photos[0].value : null
			});
			console.log('✅ Updated existing user:', user.username);
		} else {
			// Create new user
			user = await db.createUser({
				github_id: profile.id,
				username: profile.username,
				email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
				avatar_url: profile.photos && profile.photos[0] ? profile.photos[0].value : null
			});
			console.log('✅ Created new user:', user.username);
		}
		
		return done(null, user);
	} catch (error) {
		console.error('❌ GitHub OAuth error:', error);
		return done(error, null);
	}
}));

// JWT Strategy
passport.use(new JwtStrategy({
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET
}, async (jwtPayload, done) => {
	try {
		const user = await db.findUserById(jwtPayload.userId);
		if (user) {
			return done(null, user);
		} else {
			return done(null, false);
		}
	} catch (error) {
		return done(error, false);
	}
}));

// Serialize user for session
passport.serializeUser((user, done) => {
	done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
	try {
		const user = await db.findUserById(id);
		done(null, user);
	} catch (error) {
		done(error, null);
	}
});

module.exports = passport;