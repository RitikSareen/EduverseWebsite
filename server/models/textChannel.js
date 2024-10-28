const mongoose = require('mongoose');

// Define Message Schema
const messageSchema = new mongoose.Schema({
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  files: [
    {
      fileName: {
        type: String,
        trim: true,
      },
      fileType: {
        type: String,
        trim: true,
      },
      fileUrl: {
        type: String,
        trim: true,
      },
    },
  ],
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Define Text Channel Schema
const textChannelSchema = new mongoose.Schema({
  channelName: { type: String, required: true, trim: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  allowedRoles: {
    visible: [{ type: String }], // Custom roles allowed to see the channel
    read: [{ type: String }],    // Custom roles allowed to read the channel
    write: [{ type: String }],   // Custom roles allowed to write in the channel
  },
  messages: [messageSchema], // Array of embedded messages
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('TextChannel', textChannelSchema);
