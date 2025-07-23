const express = require('express');
const router = express.Router();
const { 
  getUserById, 
  getAllUsers, 
  createUser, 
  updateUser, 
  deleteUser, 
  searchUsers 
} = require('../controllers/user.controller');
const { update2FA } = require('../controllers/auth.controller'); // <-- Add this

/**
 * @route   GET /api/users/search
 * @desc    Search users by name or email
 * @access  Public
 */
router.get('/search', searchUsers);

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Public
 */
router.get('/', getAllUsers);

/**
 * @route   POST /api/users
 * @desc    Create new user
 * @access  Public
 */
router.post('/', createUser);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Public
 */
router.get('/:id', getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user by ID
 * @access  Public
 */
router.put('/:id', updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user by ID
 * @access  Public
 */
router.delete('/:id', deleteUser);

/**
 * @route   PUT /api/users/:id/2fa
 * @desc    Enable or disable 2FA for a user
 * @access  Authenticated (should restrict in middleware)
 */
router.put('/:id/2fa', update2FA);

module.exports = router;