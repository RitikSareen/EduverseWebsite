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

// Create a new text channel in a category
router.post('/servers/:serverId/categories/:categoryId/text-channels', createTextChannel);

// Get details of a specific text channel
router.get('/servers/:serverId/categories/:categoryId/text-channels/:channelId', getTextChannelDetails);

// Get all text channels in a category
router.get('/servers/:serverId/categories/:categoryId/text-channels', getAllTextChannels);

// Get all messages in a text channel
router.get('/servers/:serverId/categories/:categoryId/text-channels/:channelId/messages', getAllMessagesInTextChannel);

// Update text channel details
router.put('/servers/:serverId/categories/:categoryId/text-channels/:channelId', updateTextChannel);

// Delete a text channel
router.delete('/servers/:serverId/categories/:categoryId/text-channels/:channelId', deleteTextChannel);

// Add a message to a text channel
router.post('/servers/:serverId/categories/:categoryId/text-channels/:channelId/messages', addMessageToTextChannel);

// Update a message in a text channel
router.put('/servers/:serverId/categories/:categoryId/text-channels/:channelId/messages/:messageId', updateMessageInTextChannel);

// Delete a message from a text channel
router.delete('/servers/:serverId/categories/:categoryId/text-channels/:channelId/messages/:messageId', deleteMessageFromTextChannel);

module.exports = router;
