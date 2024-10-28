const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  members: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      role: { type: String, required: true }, // Custom roles like admin, teacher, student, etc.
    }
  ],
  joinCode: { type: String, trim: true, default: this.name }
});

module.exports = mongoose.model('Server', serverSchema);
