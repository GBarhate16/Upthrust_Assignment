const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

function loadEnv() {
	// In production, environment variables are set by the platform
	if (process.env.NODE_ENV === 'production') {
		console.log('[ENV] Running in production mode - using platform environment variables');
		return;
	}
	
	// For development, load from .env files
	const root = path.resolve(__dirname, '..', '..');
	const candidates = [
		path.join(root, '.env'),
		path.join(root, 'env'),
	];

	for (const file of candidates) {
		if (fs.existsSync(file)) {
			console.log('[ENV] Loading environment from:', file);
			dotenv.config({ path: file, override: true });
			break;
		}
	}
}

loadEnv();

module.exports = {
	loadEnv,
};


