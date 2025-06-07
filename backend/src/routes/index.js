const express = require('express');
const router = express.Router();
const loginRoute = require('./login.route');
const userRoutes = require('./user.routes');

// API routes
router.use('/api/login', loginRoute);
router.use('/api/users', userRoutes);

module.exports = router;
