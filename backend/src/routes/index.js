const express = require('express');
const router = express.Router();

// Existing route imports...
const loginRoutes = require('./login.route');
const userRoutes = require('./user.routes');
const adminRoutes = require('./admin.route'); // Add route import for Admin Page

// Route usage
router.use('/api/login', loginRoutes);
router.use('/api/auth', loginRoutes); // Add auth route for /api/auth/login
router.use('/api/users', userRoutes);
router.use('/api/admin', adminRoutes); // Add route usage for Admin Page

module.exports = router;