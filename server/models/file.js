const mongoose = require('mongoose');

// Define File Schema
const fileSchema = new mongoose.Schema({
  fileName: { type: String, trim: true, required: true },
  fileType: { type: String, trim: true, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl: { type: String, trim: true, required: true }, // This URL is used to access the file through the routes
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('File', fileSchema);
