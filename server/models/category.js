const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  server: { type: mongoose.Schema.Types.ObjectId, ref: 'Server', required: true },
  channels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }],
  allowedRoles: {
    visible: [{ type: String }], // Custom roles allowed to see the category
    read: [{ type: String }],    // Custom roles allowed to read content within the category
    write: [{ type: String }],   // Custom roles allowed to write within the category
  },
});

module.exports = mongoose.model('Category', categorySchema);
