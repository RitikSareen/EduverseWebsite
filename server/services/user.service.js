// User Service
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// User login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
 
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }
     // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
     // Generate a JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
     
    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      token: token
    });
  } catch(error) {
    res.status(500).json({error: error.message })
  }   
}

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
