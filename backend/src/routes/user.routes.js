const express = require('express');
const router = express.Router();
const { getUserById, getAllUsers } = require('../controllers/user.controller');

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Public
 */
router.get('/', getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Public
 */
router.get('/:id', getUserById);

module.exports = router;
