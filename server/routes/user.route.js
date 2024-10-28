// User Routes
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../services/user.service');

// Register a new user
router.post('/register', registerUser);

// User login
router.post('/login', loginUser);

// Get user profile
router.get('/profile', getUserProfile);

module.exports = router;
