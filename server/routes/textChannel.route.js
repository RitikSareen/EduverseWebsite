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
  deleteMessageFromTextChannel,
} = require('../services/textChannel.service');

// Create a new text channel under a specific category
router.post('/create/:categoryId', createTextChannel);

// Get all text channels in a specific category
router.get('/:categoryId', getAllTextChannels);

// Get details of a specific text channel
router.get('/details/:textChannelId', getTextChannelDetails);

// Get all messages in a specific text channel
router.get('/:categoryId/:textChannelId/messages', getAllMessagesInTextChannel);

// Add a new message to a text channel
router.post('/:categoryId/:textChannelId/messages', addMessageToTextChannel);

// Update a specific message in a text channel
router.put('/:categoryId/:textChannelId/messages/:messagesId', updateMessageInTextChannel);

// Delete a specific message from a text channel
router.delete('/:textChannelId/messages/:messageId', deleteMessageFromTextChannel);

// Update details of a specific text channel
router.put('/:textChannelId', updateTextChannel);


// Delete a specific text channel
router.delete('/:categoryId/:textChannelId', deleteTextChannel);

module.exports = router;
