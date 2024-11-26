// User Service
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'mysecretkey';

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
    const { email, password } = req.body;

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

    // Return user details, including firstName and lastName
    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName || '', // Include firstName
        lastName: user.lastName || '',  // Include lastName
        email: user.email,
      },
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // Authenticated user ID
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};



// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const checkEmail = async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(200).json({ exists: true });
    }
    res.status(200).json({ exists: false });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user authentication provides user ID
    const { firstName, lastName, username, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        firstName, 
        lastName, 
        username, 
        email 
      },
      { 
        new: true, 
        runValidators: true 
      } // Return the updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllServers = async (req, res) => {
  try {
    const userId = req.user.id; // Get the authenticated user's ID
    const servers = await Server.find({
      'members.userId': userId, // Filter servers where the user is a member
    }).lean();

    res.status(200).json(servers); // Return the filtered list of servers
  } catch (error) {
    console.error('Error fetching user-specific servers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  checkEmail,
  updateUserProfile,
  changePassword,
  getAllServers
};

// // User Service
// const User = require('../models/user');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// const JWT_SECRET = 'mysecretkey';

// // Register a new user
// const registerUser = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       username,
//       email,
//       password: hashedPassword,
//     });

//     const savedUser = await newUser.save();
//     res.status(201).json(savedUser);
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// // User login
// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body
 
//     const user = await User.findOne({ email });
//     if (!user) {
//       throw new Error('Invalid email or password');
//     }
//      // Check if the password is correct
//     const isPasswordValid = await bcrypt.compare(password, user.password);
    
//     if (!isPasswordValid) {
//       throw new Error('Invalid email or password');
//     }
//      // Generate a JWT token
//     const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
     
//     res.status(201).json({
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email
//       },
//       token: token
//     });
//   } catch(error) {
//     res.status(500).json({error: error.message })
//   }   
// }

// // Get user profile
// const getUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// module.exports = {
//   registerUser,
//   loginUser,
//   getUserProfile,
// };
