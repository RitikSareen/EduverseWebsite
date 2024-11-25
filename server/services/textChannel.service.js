const TextChannel = require('../models/textChannel');
const Category = require('../models/category');
const Server = require('../models/server');
const User = require('../models/user');

// Create a new text channel
const createTextChannel = async (req, res) => {
  try {
    const { serverId, categoryId } = req.params;
    const { name, allowedRoles } = req.body;

    // Step 1: Create the text channel
    const newTextChannel = new TextChannel({
      channelName: name,
      allowedRoles,
    });

    const savedTextChannel = await newTextChannel.save();

    // Step 2: Add the text channel to the category
    await Category.findByIdAndUpdate(
      categoryId,
      { $push: { channels: savedTextChannel._id } },
      { new: true }
    );

    res.status(201).json(savedTextChannel);
  } catch (error) {
    console.error('Error creating text channel:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get details of a specific text channel
const getTextChannelDetails = async (req, res) => {
  try {
    const { textChannelId } = req.params;
    const textChannel = await TextChannel.findById(textChannelId);

    if (!textChannel) {
      return res.status(404).json({ message: 'Text Channel not found' });
    }

    res.status(200).json(textChannel);
  } catch (error) {
    console.error('Error fetching text channel details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Get all text channels within a category
const getAllTextChannels = async (req, res) => {
  try {
    const { serverId, categoryId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category || category.server.toString() !== serverId) {
      return res.status(404).json({ message: 'Category not found or does not belong to the specified server' });
    }

    const textChannels = await TextChannel.find({ category: categoryId });
    res.status(200).json(textChannels);
  } catch (error) {
    console.error('Error getting text channels:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all messages in a text channel

const getAllMessagesInTextChannel = async (req, res) => {
  try {
    const { textChannelId } = req.params;

    // Find the text channel and populate messages with sender details
    const textChannel = await TextChannel.findById(textChannelId).populate('messages.sender_id', 'username');
    if (!textChannel) {
      return res.status(404).json({ message: 'Text Channel not found' });
    }

    // Transform the messages to include sender name and timestamp
    const messagesWithDetails = textChannel.messages.map((message) => ({
      _id: message._id,
      content: message.content,
      senderName: message.sender_id.username || 'Unknown', // Get username
      createdAt: message.createdAt, // Include timestamp
    }));

    res.json(messagesWithDetails);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateTextChannel = async (req, res) => {
  try {
    const { textChannelId } = req.params;
    const updatedChannel = await TextChannel.findByIdAndUpdate(
      textChannelId,
      req.body,
      { new: true }
    );

    if (!updatedChannel) {
      return res.status(404).json({ message: 'Text Channel not found' });
    }

    res.status(200).json(updatedChannel);
  } catch (error) {
    console.error('Error updating text channel:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Delete a text channel
const deleteTextChannel = async (req, res) => {
  try {
    const { textChannelId } = req.params;

    const textChannel = await TextChannel.findByIdAndDelete(textChannelId);
    if (!textChannel) {
      return res.status(404).json({ message: 'Text Channel not found' });
    }

    res.status(200).json({ message: 'Text Channel deleted successfully' });
  } catch (error) {
    console.error('Error deleting text channel:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const addMessageToTextChannel = async ({ params, body, user }) => {
  try {
    const { categoryId, textChannelId } = params;
    const { content } = body;

    if (!categoryId || !textChannelId || !content) {
      throw new Error('Missing required fields');
    }

    // Find the text channel
    const textChannel = await TextChannel.findById(textChannelId);
    if (!textChannel) {
      throw new Error('Text Channel not found');
    }

    // Create the new message object
    const newMessage = {
      sender_id: user.id, // Ensure sender_id is properly set
      content,
      createdAt: new Date(), // Add timestamp
    };

    // Save the message to the text channel
    textChannel.messages.push(newMessage);
    await textChannel.save();

    // Return the saved message (plain object with relevant fields)
    return {
      _id: textChannel.messages[textChannel.messages.length - 1]._id, // Get last inserted message ID
      content: newMessage.content,
      sender_id: newMessage.sender_id,
      createdAt: newMessage.createdAt,
    };
  } catch (error) {
    console.error('Error adding message to text channel:', error);
    throw error;
  }
};


const updateMessageInTextChannel = async (req, res) => {
  try {
    const { channelId, messageId } = req.params;
    const { content, files } = req.body;

    const textChannel = await TextChannel.findById(channelId);
    if (!textChannel) {
      return res.status(404).json({ message: 'Text Channel not found' });
    }

    const message = textChannel.messages.id(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Update message content and files
    message.content = content || message.content;
    message.files = files || message.files;

    await textChannel.save();
    res.status(200).json(message);
  } catch (error) {
    console.error('Error updating message in text channel:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a message from a text channel
const deleteMessageFromTextChannel = async (req, res) => {
  try {
    const { textChannelId, messageId } = req.params;

    // Find the text channel
    const textChannel = await TextChannel.findById(textChannelId);
    if (!textChannel) {
      return res.status(404).json({ message: 'Text Channel not found' });
    }

    // Find the index of the message in the messages array
    const messageIndex = textChannel.messages.findIndex(
      (message) => message._id.toString() === messageId
    );

    if (messageIndex === -1) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Remove the message from the array
    textChannel.messages.splice(messageIndex, 1);

    // Save the updated text channel
    await textChannel.save();

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message from text channel:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



module.exports = {
  createTextChannel,
  getTextChannelDetails,
  getAllTextChannels,
  getAllMessagesInTextChannel,
  updateTextChannel,
  deleteTextChannel,
  addMessageToTextChannel,
  updateMessageInTextChannel,
  deleteMessageFromTextChannel,
};
