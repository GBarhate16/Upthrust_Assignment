const { Router } = require('express');
const { runWorkflow, getHistory, deleteHistory, deleteAllHistory } = require('../controllers/workflow.controller');
const { fetchWeather } = require('../services/integrations.service');
const { authenticateToken } = require('../middleware/auth');

const router = Router();

router.post('/run-workflow', authenticateToken, runWorkflow);
router.get('/history', authenticateToken, getHistory);
router.delete('/history/:id', authenticateToken, deleteHistory);
router.delete('/history', authenticateToken, deleteAllHistory);

// Test endpoint for weather debugging
router.get('/test-weather/:location', async (req, res) => {
	try {
		const location = req.params.location || 'Delhi';
		console.log('🧪 Testing weather API for:', location);
		const result = await fetchWeather(location);
		res.json({ 
			location,
			result,
			timestamp: new Date().toISOString()
		});
	} catch (error) {
		console.error('🧪 Weather test failed:', error);
		res.status(500).json({ 
			error: error.message,
			location: req.params.location || 'Delhi'
		});
	}
});

// Test endpoint for weather debugging with default location
router.get('/test-weather', async (req, res) => {
	try {
		const location = 'Delhi';
		console.log('🧪 Testing weather API for default location:', location);
		const result = await fetchWeather(location);
		res.json({ 
			location,
			result,
			timestamp: new Date().toISOString()
		});
	} catch (error) {
		console.error('🧪 Weather test failed:', error);
		res.status(500).json({ 
			error: error.message,
			location: 'Delhi'
		});
	}
});

module.exports = router;


