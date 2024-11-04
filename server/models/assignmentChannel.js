// Assignment Schema
const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  dueDate: {
    type: Date,
  },
  allowedRoles: {
    role: { type: String, required: true }, // Custom roles like admin, teacher, student, etc.
    visible: [{ type: Boolean }], // Custom roles allowed to see the channel
    read: [{ type: Boolean }],    // Custom roles allowed to read the channel
    write: [{ type: Boolean }],   // Custom roles allowed to write in the channel
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
  submissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
    },
  ],
});

const Assignment = mongoose.model('AssignmentContent', assignmentSchema);

module.exports = Assignment;
