const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const healthRoutes = require('./health.routes');

// API routes
router.use('/api/auth', authRoutes);
router.use('/api/health', healthRoutes);

module.exports = router;
