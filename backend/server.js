require('./src/config/env');

const app = require('./src/app');
const db = require('./src/db');

const PORT = process.env.PORT || 4000;

async function start() {
	try {
		await db.connect();
		app.listen(PORT, () => {
			console.log(`Backend server running on http://localhost:${PORT}`);
		});
	} catch (e) {
		console.error('Failed to start server due to DB error:', e.message);
		process.exit(1);
	}
}

start();
