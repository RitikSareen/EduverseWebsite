const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  channels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TextChannel' }],
  allowedRoles: {
    role: { type: String, required: true }, // Custom roles like admin, teacher, student, etc.
    read: [{ type: Boolean, default: false }],    // Custom roles allowed to read the channel
    write: [{ type: Boolean, default: false }],   // Custom roles allowed to write in the channel
  },
});

module.exports = mongoose.model('Category', categorySchema);
