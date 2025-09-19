const { generateAiResponse } = require('../services/ai.service');
const { fetchWeather, fetchTrendingRepos, fetchTopHeadlines, hashtagForAction } = require('../services/integrations.service');
const db = require('../db');

async function runWorkflow(req, res) {
	try {
		const { prompt, action, location } = req.body || {};
		const user_id = req.user?.id; // Get user ID from authenticated user
		
		console.log('Received request:', { prompt, action, location, user_id }); // Debug log
		
		if (!prompt || !action) {
			return res.status(400).json({ error: 'prompt and action are required' });
		}
		
		if (!user_id) {
			return res.status(401).json({ error: 'Authentication required' });
		}

		// First get the API response
		let apiResponse = '';
		switch (String(action)) {
			case 'weather':
				apiResponse = await fetchWeather(location);
				break;
			case 'github':
				apiResponse = await fetchTrendingRepos();
				break;
			case 'news':
				apiResponse = await fetchTopHeadlines();
				break;
			default:
				return res.status(400).json({ error: 'Unsupported action. Use weather | github | news' });
		}

		// Now generate AI response with context
		const aiResponse = await generateAiResponse(String(prompt), String(action), apiResponse);

		// Create a better final result that doesn't duplicate information
		let finalResult;
		if (action === 'weather') {
			finalResult = `${aiResponse} ${hashtagForAction(action)}`.trim();
		} else {
			finalResult = `${aiResponse} ${apiResponse} ${hashtagForAction(action)}`.trim();
		}

		await db.saveRun({ prompt, action, ai_response: aiResponse, api_response: apiResponse, final_result: finalResult, user_id });

		// Return both individual responses and formatted final result for frontend processing
		res.json({ 
			ai_response: aiResponse, 
			api_response: apiResponse, 
			final_result: finalResult 
		});
	} catch (_e) {
		res.status(500).json({ error: 'Internal server error' });
	}
}

async function getHistory(req, res) {
	try {
		const user_id = req.user?.id; // Get user ID from authenticated user
		
		if (!user_id) {
			return res.status(401).json({ error: 'Authentication required' });
		}
		
		const rows = await db.getLastRuns(10, user_id); // Get only user's own data
		res.json(rows);
	} catch (_e) {
		res.status(500).json({ error: 'DB error' });
	}
}

async function deleteHistory(req, res) {
	try {
		const { id } = req.params;
		const user_id = req.user?.id; // Get user ID from authenticated user
		
		if (!id) {
			return res.status(400).json({ error: 'History ID is required' });
		}
		
		if (!user_id) {
			return res.status(401).json({ error: 'Authentication required' });
		}

		const deleted = await db.deleteRun(parseInt(id), user_id); // Delete only user's own data
		if (!deleted) {
			return res.status(404).json({ error: 'History item not found or access denied' });
		}

		res.json({ message: 'History item deleted successfully', id: parseInt(id) });
	} catch (error) {
		console.error('Delete history error:', error);
		res.status(500).json({ error: 'Failed to delete history item' });
	}
}

async function deleteAllHistory(req, res) {
	try {
		const user_id = req.user?.id; // Get user ID from authenticated user
		
		if (!user_id) {
			return res.status(401).json({ error: 'Authentication required' });
		}
		
		const deletedCount = await db.deleteAllRuns(user_id); // Delete only user's own data
		res.json({ 
			message: `All history deleted successfully`, 
			deletedCount 
		});
	} catch (error) {
		console.error('Delete all history error:', error);
		res.status(500).json({ error: 'Failed to delete all history' });
	}
}

module.exports = { runWorkflow, getHistory, deleteHistory, deleteAllHistory };


