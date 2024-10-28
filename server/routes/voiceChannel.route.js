const express = require('express');
const router = express.Router();
const { createVoiceChannel, getVoiceChannelDetails, updateVoiceChannel, deleteVoiceChannel } = require('../services/voiceChannel.service');

router.post('/', createVoiceChannel);

// Get voice channel details
router.get('/:channelId', getVoiceChannelDetails);

// Update voice channel details
router.put('/:channelId', updateVoiceChannel);

// Delete a voice channel
router.delete('/:channelId', deleteVoiceChannel);

module.exports = router;