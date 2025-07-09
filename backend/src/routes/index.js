const express = require('express');
const router = express.Router();

// Existing route imports...
const loginRoutes = require('./login.route');
const userRoutes = require('./user.routes');
const adminRoutes = require('./admin.route');

// === Google OAuth Route Import ===
const googleAuthRoutes = require('./google-auth.route'); // <-- ADD THIS LINE

// Route usage
router.use('/api/login', loginRoutes);
router.use('/api/auth', loginRoutes); // For /api/auth/login (manual login)
router.use('/api/auth', googleAuthRoutes); // <-- ADD THIS LINE for Google OAuth

router.use('/api/users', userRoutes);
router.use('/api/admin', adminRoutes);

module.exports = router;