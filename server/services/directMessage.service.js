const DirectConversation = require('../models/directConversation');

// Start a new direct conversation
const startDirectConversation = async (req, res) => {
  try {
    const { participantIds } = req.body;

    // Create a new conversation
    const conversation = new DirectConversation({ participants: participantIds });
    const savedConversation = await conversation.save();

    res.status(201).json(savedConversation);
  } catch (error) {
    console.error('Error starting a direct conversation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all direct conversations for a user
const getAllDirectConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all conversations where the user is a participant
    const conversations = await DirectConversation.find({ participants: userId });
    res.status(200).json(conversations);
  } catch (error) {
    console.error('Error getting direct conversations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a specific direct conversation by ID
const getDirectConversationDetails = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await DirectConversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error('Error getting direct conversation details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add a message to a direct conversation
const addMessageToConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content, files } = req.body;

    const conversation = await DirectConversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const newMessage = {
      sender_id: req.user.id,
      content,
      files: files || [], // Files metadata (like fileName, fileType, fileUrl) embedded in the message
    };

    conversation.messages.push(newMessage);
    await conversation.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error adding message to conversation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a message in a direct conversation
const updateMessageInConversation = async (req, res) => {
  try {
    const { conversationId, messageId } = req.params;
    const { content, files } = req.body;

    const conversation = await DirectConversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const message = conversation.messages.id(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Update message content and files
    message.content = content || message.content;
    message.files = files || message.files;

    await conversation.save();
    res.status(200).json(message);
  } catch (error) {
    console.error('Error updating message in conversation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a message from a direct conversation
const deleteMessageFromConversation = async (req, res) => {
  try {
    const { conversationId, messageId } = req.params;

    const conversation = await DirectConversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const message = conversation.messages.id(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.remove();
    await conversation.save();
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message from conversation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllMessagesInConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Find the conversation by ID
    const conversation = await DirectConversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.status(200).json(conversation.messages);
  } catch (error) {
    console.error('Error getting messages in conversation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  startDirectConversation,
  getAllDirectConversations,
  getDirectConversationDetails,
  addMessageToConversation,
  updateMessageInConversation,
  deleteMessageFromConversation,
  getAllMessagesInConversation,
};
