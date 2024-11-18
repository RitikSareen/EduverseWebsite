const TextChannel = require('../models/textChannel');
const Category = require('../models/category');
const Server = require('../models/server');

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
    const { serverId, categoryId, channelId } = req.params;
    const channel = await TextChannel.findOne({ _id: channelId, category: categoryId });
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    const category = await Category.findById(categoryId);
    if (!category || category.server.toString() !== serverId) {
      return res.status(404).json({ message: 'Category not found or does not belong to the specified server' });
    }

    res.status(200).json(channel);
  } catch (error) {
    console.error('Error getting text channel details:', error);
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
    const { channelId } = req.params;

    const textChannel = await TextChannel.findById(channelId);
    if (!textChannel) {
      return res.status(404).json({ message: 'Text Channel not found' });
    }

    res.status(200).json(textChannel.messages);
  } catch (error) {
    console.error('Error getting messages in text channel:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update text channel details
const updateTextChannel = async (req, res) => {
  try {
    const { serverId, categoryId, channelId } = req.params;
    const category = await Category.findById(categoryId);
    if (!category || category.server.toString() !== serverId) {
      return res.status(404).json({ message: 'Category not found or does not belong to the specified server' });
    }

    const updatedChannel = await TextChannel.findByIdAndUpdate(channelId, req.body, { new: true });
    if (!updatedChannel) {
      return res.status(404).json({ message: 'Channel not found' });
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
    const { serverId, categoryId, channelId } = req.params;
    const category = await Category.findById(categoryId);
    if (!category || category.server.toString() !== serverId) {
      return res.status(404).json({ message: 'Category not found or does not belong to the specified server' });
    }

    const deletedChannel = await TextChannel.findByIdAndDelete(channelId);
    if (!deletedChannel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    res.status(200).json({ message: 'Channel deleted successfully' });
  } catch (error) {
    console.error('Error deleting text channel:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add a message to a text channel
const addMessageToTextChannel = async (req, res) => {
  try {
    const { serverId, categoryId, channelId } = req.params;
    const { content, files } = req.body;

    const textChannel = await TextChannel.findOne({ _id: channelId, category: categoryId });
    if (!textChannel) {
      return res.status(404).json({ message: 'Text Channel not found' });
    }

    const newMessage = {
      sender_id: req.user.id,
      content,
      files: files || [], // Files metadata (like fileName, fileType, fileUrl) embedded in the message
    };

    textChannel.messages.push(newMessage);
    await textChannel.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error adding message to text channel:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a message in a text channel
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
    const { channelId, messageId } = req.params;

    const textChannel = await TextChannel.findById(channelId);
    if (!textChannel) {
      return res.status(404).json({ message: 'Text Channel not found' });
    }

    const message = textChannel.messages.id(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.remove();
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
