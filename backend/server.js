// Load environment variables
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const app = require('./src/app');
const db = require('./src/db');

const PORT = process.env.PORT || 4000;

async function start() {
	try {
		console.log('[SERVER] Starting server...');
		console.log('[SERVER] NODE_ENV:', process.env.NODE_ENV);
		console.log('[SERVER] PORT:', PORT);
		console.log('[SERVER] DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
		
		await db.connect();
		app.listen(PORT, '0.0.0.0', () => {
			console.log(`[SERVER] Backend server running on port ${PORT}`);
		});
	} catch (e) {
		console.error('[SERVER] Failed to start server due to DB error:', e.message);
		console.error('[SERVER] Full error:', e);
		process.exit(1);
	}
}

start();
