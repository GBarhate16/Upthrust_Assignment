const { Router } = require('express');
const workflowRoutes = require('./workflow.routes');
const authRoutes = require('./auth.routes');

const router = Router();

// Authentication routes
router.use('/auth', authRoutes);

// Workflow routes (protected)
router.use('/', workflowRoutes);

module.exports = router;


