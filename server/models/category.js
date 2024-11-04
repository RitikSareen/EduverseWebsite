const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  server: { type: mongoose.Schema.Types.ObjectId, ref: 'Server', required: true },
  channels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }],
  allowedRoles: {
    role: { type: String, required: true }, // Custom roles like admin, teacher, student, etc.
    visible: [{ type: Boolean }], // Custom roles allowed to see the channel
    read: [{ type: Boolean }],    // Custom roles allowed to read the channel
    write: [{ type: Boolean }],   // Custom roles allowed to write in the channel
  },
});

module.exports = mongoose.model('Category', categorySchema);
