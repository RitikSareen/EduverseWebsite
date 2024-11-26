// User Routes
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, checkEmail, updateUserProfile, changePassword } = require('../services/user.service');
const verifyToken = require('../middleware/auth.guard');

// Register a new user
router.post('/register', registerUser);

// User login
router.post('/login', loginUser);

// Get user profile
router.get('/profile', getUserProfile);

//for checking email
router.get('/check-email',checkEmail)

//for updating the profile
router.put('/profile', verifyToken, updateUserProfile);

//for password update
router.put('/change-password', verifyToken, changePassword);


module.exports = router;
