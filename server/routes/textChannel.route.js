const express = require('express');
const router = express.Router();
const {
  createTextChannel,
  getTextChannelDetails,
  getAllTextChannels,
  getAllMessagesInTextChannel,
  updateTextChannel,
  deleteTextChannel,
  addMessageToTextChannel,
  updateMessageInTextChannel,
  deleteMessageFromTextChannel
} = require('../services/textChannel.service');

// Create a new text channel under a category
router.post('/create/:categoryId', createTextChannel);

// Get details of a specific text channel
router.get('/servers/:serverId/categories/:categoryId/textChannels/:channelId', getTextChannelDetails);

// Get all text channels in a category
router.get('/servers/:serverId/categories/:categoryId/textChannels', getAllTextChannels);

// Get all messages in a specific text channel
router.get('/servers/:serverId/categories/:categoryId/textChannels/:channelId/messages', getAllMessagesInTextChannel);

// Update details of a specific text channel
router.put('/servers/:serverId/categories/:categoryId/textChannels/:channelId', updateTextChannel);

// Delete a specific text channel
router.delete('/servers/:serverId/categories/:categoryId/textChannels/:channelId', deleteTextChannel);

// Add a new message to a text channel
router.post('/servers/:serverId/categories/:categoryId/textChannels/:channelId/messages', addMessageToTextChannel);

// Update a specific message in a text channel
router.put('/servers/:serverId/categories/:categoryId/textChannels/:channelId/messages/:messageId', updateMessageInTextChannel);

// Delete a specific message from a text channel
router.delete('/servers/:serverId/categories/:categoryId/textChannels/:channelId/messages/:messageId', deleteMessageFromTextChannel);

module.exports = router;
