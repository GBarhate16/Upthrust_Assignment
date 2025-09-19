const { Client } = require('pg');

let client = null;
let isConnected = false;
let connectPromise = null;

function connect() {
	if (connectPromise) return connectPromise;
	const url = process.env.DATABASE_URL;
	if (!url) {
		const err = new Error('DATABASE_URL is not set');
		connectPromise = Promise.reject(err);
		return connectPromise;
	}
	client = new Client({
		connectionString: url,
		ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
	});
	connectPromise = client.connect()
		.then(async () => {
			// Create users table
			await client.query(`CREATE TABLE IF NOT EXISTS users (
				id SERIAL PRIMARY KEY,
				github_id VARCHAR(255) UNIQUE NOT NULL,
				username VARCHAR(255) NOT NULL,
				email VARCHAR(255),
				avatar_url TEXT,
				role VARCHAR(50) DEFAULT 'user',
				created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
				updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
			)`);
			
			// Check if user_id column exists in workflow_runs, if not add it
			try {
				await client.query(`ALTER TABLE workflow_runs ADD COLUMN user_id INTEGER REFERENCES users(id)`);
				console.log('[DB] Added user_id column to workflow_runs');
			} catch (e) {
				// Column probably already exists
				if (!e.message.includes('already exists')) {
					console.log('[DB] user_id column already exists or other error:', e.message);
				}
			}
			
			// Create workflow_runs table (in case it doesn't exist)
			await client.query(`CREATE TABLE IF NOT EXISTS workflow_runs (
				id SERIAL PRIMARY KEY,
				user_id INTEGER REFERENCES users(id),
				prompt TEXT NOT NULL,
				action TEXT NOT NULL,
				ai_response TEXT NOT NULL,
				api_response TEXT NOT NULL,
				final_result TEXT NOT NULL,
				created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
			)`);
			
			isConnected = true;
			console.log('[DB] Connected and ensured tables: users, workflow_runs');
			return client;
		})
		.catch((e) => {
			console.error('[DB] Connection failed:', e.message);
			throw e;
		});
	return connectPromise;
}

async function saveRun({ prompt, action, ai_response, api_response, final_result, user_id }) {
	if (!client) throw new Error('DB client not initialized');
	if (!user_id) throw new Error('user_id is required');
	await client.query(
		'INSERT INTO workflow_runs (user_id, prompt, action, ai_response, api_response, final_result) VALUES ($1,$2,$3,$4,$5,$6)',
		[user_id, prompt, action, ai_response, api_response, final_result]
	);
}

async function getLastRuns(limit = 10, user_id = null) {
	if (!client) throw new Error('DB client not initialized');
	let query, params;
	if (user_id) {
		query = 'SELECT id, prompt, action, ai_response, api_response, final_result, created_at FROM workflow_runs WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2';
		params = [user_id, limit];
	} else {
		// For backwards compatibility - return all if no user_id specified
		query = 'SELECT id, prompt, action, ai_response, api_response, final_result, created_at FROM workflow_runs ORDER BY created_at DESC LIMIT $1';
		params = [limit];
	}
	const r = await client.query(query, params);
	return r.rows || [];
}

async function deleteRun(id, user_id = null) {
	if (!client) throw new Error('DB client not initialized');
	let query, params;
	if (user_id) {
		query = 'DELETE FROM workflow_runs WHERE id = $1 AND user_id = $2 RETURNING id';
		params = [id, user_id];
	} else {
		query = 'DELETE FROM workflow_runs WHERE id = $1 RETURNING id';
		params = [id];
	}
	const result = await client.query(query, params);
	return result.rowCount > 0;
}

async function deleteAllRuns(user_id = null) {
	if (!client) throw new Error('DB client not initialized');
	let query, params;
	if (user_id) {
		query = 'DELETE FROM workflow_runs WHERE user_id = $1';
		params = [user_id];
	} else {
		query = 'DELETE FROM workflow_runs';
		params = [];
	}
	const result = await client.query(query, params);
	return result.rowCount;
}

// User management functions
async function createUser({ github_id, username, email, avatar_url }) {
	if (!client) throw new Error('DB client not initialized');
	const result = await client.query(
		'INSERT INTO users (github_id, username, email, avatar_url) VALUES ($1, $2, $3, $4) RETURNING *',
		[github_id, username, email, avatar_url]
	);
	return result.rows[0];
}

async function findUserByGithubId(github_id) {
	if (!client) throw new Error('DB client not initialized');
	const result = await client.query(
		'SELECT * FROM users WHERE github_id = $1',
		[github_id]
	);
	return result.rows[0] || null;
}

async function findUserById(id) {
	if (!client) throw new Error('DB client not initialized');
	const result = await client.query(
		'SELECT * FROM users WHERE id = $1',
		[id]
	);
	return result.rows[0] || null;
}

async function updateUser(id, updates) {
	if (!client) throw new Error('DB client not initialized');
	const { username, email, avatar_url } = updates;
	const result = await client.query(
		'UPDATE users SET username = COALESCE($2, username), email = COALESCE($3, email), avatar_url = COALESCE($4, avatar_url), updated_at = now() WHERE id = $1 RETURNING *',
		[id, username, email, avatar_url]
	);
	return result.rows[0];
}

module.exports = { 
	client, 
	connect, 
	connectPromise, 
	isConnected, 
	saveRun, 
	getLastRuns, 
	deleteRun, 
	deleteAllRuns,
	// User functions
	createUser,
	findUserByGithubId,
	findUserById,
	updateUser
};


