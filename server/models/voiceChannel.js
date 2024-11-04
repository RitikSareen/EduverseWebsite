const mongoose = require('mongoose');

const voiceChannelSchema = new mongoose.Schema({
  channelName: { type: String, required: true, trim: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  allowedRoles: {
    role: { type: String, required: true }, // Custom roles like admin, teacher, student, etc.
    visible: [{ type: Boolean }], // Custom roles allowed to see the channel
    connect: [{ type: Boolean }], // Custom roles allowed to connect to the voice channel
  },
});

module.exports = mongoose.model('VoiceChannel', voiceChannelSchema);
