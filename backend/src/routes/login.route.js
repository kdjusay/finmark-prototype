const express = require('express');
const router = express.Router();
const { login } = require('../controllers/auth.controller');

/**
 * @route   POST /api/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/', login);

module.exports = router;
