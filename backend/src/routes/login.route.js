const express = require('express');
const router = express.Router();
const { login, verify2FA } = require('../controllers/auth.controller');

/**
 * @route   POST /api/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/', login);
router.post('/verify-2fa', verify2FA);

module.exports = router;