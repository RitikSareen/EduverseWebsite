const express = require('express');
const router = express.Router();
const {
  startDirectConversation,
  getAllDirectConversations,
  getDirectConversationDetails,
  addMessageToConversation,
  updateMessageInConversation,
  deleteMessageFromConversation,
  getAllMessagesInConversation,
} = require('../services/directMessage.service');

// Start a new conversation
router.post('/', startDirectConversation);

// Get all conversations for a user
router.get('/', getAllDirectConversations);

// Get details of a specific conversation
router.get('/:conversationId', getDirectConversationDetails);

// Add a message to a conversation
router.post('/:conversationId/messages', addMessageToConversation);

// Update a message in a conversation
router.put('/:conversationId/messages/:messageId', updateMessageInConversation);

// Delete a message from a conversation
router.delete('/:conversationId/messages/:messageId', deleteMessageFromConversation);

router.get('/:conversationId/messages', getAllMessagesInConversation);

module.exports = router;
