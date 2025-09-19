const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

function loadEnv() {
	const root = path.resolve(__dirname, '..', '..');
	const candidates = [
		path.join(root, '.env'),
		path.join(root, 'env'),
	];

	for (const file of candidates) {
		if (fs.existsSync(file)) {
			dotenv.config({ path: file, override: true });
		}
	}
}

loadEnv();

module.exports = {
	loadEnv,
};


