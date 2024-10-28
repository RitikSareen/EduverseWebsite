const mongoose = require('mongoose');

const voiceChannelSchema = new mongoose.Schema({
  channelName: { type: String, required: true, trim: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  allowedRoles: {
    visible: [{ type: String }], // Custom roles allowed to see the channel
    connect: [{ type: String }], // Custom roles allowed to connect to the voice channel
  },
});

module.exports = mongoose.model('VoiceChannel', voiceChannelSchema);
