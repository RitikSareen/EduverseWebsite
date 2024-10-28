// User Schema
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
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
});

const User = mongoose.model('User', userSchema);

module.exports = User;
