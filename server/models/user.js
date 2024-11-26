
// User Schema
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: false, // Not mandatory initially
    trim: true,
  },
  lastName: {
    type: String,
    required: false, // Not mandatory initially
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  servers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Server',
    },
  ],
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;