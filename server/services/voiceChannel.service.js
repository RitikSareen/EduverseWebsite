const VoiceChannel = require('../models/voiceChannel');
const Category = require('../models/category');

const createVoiceChannel = async (req, res) => {
    try {
      const { serverId, categoryId } = req.params;
      const category = await Category.findById(categoryId);
      if (!category || category.server.toString() !== serverId) {
        return res.status(404).json({ message: 'Category not found or does not belong to the specified server' });
      }
  
      const voiceChannel = new VoiceChannel({ ...req.body, category: categoryId });
      const savedChannel = await voiceChannel.save();
      res.status(201).json(savedChannel);
    } catch (error) {
      console.error('Error creating voice channel:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Get text channel details
  const getVoiceChannelDetails = async (req, res) => {
    try {
      const { serverId, categoryId, channelId } = req.params;
      const channel = await VoiceChannel.findOne({ _id: channelId, category: categoryId });
      if (!channel) {
        return res.status(404).json({ message: 'Channel not found' });
      }
  
      const category = await Category.findById(categoryId);
      if (!category || category.server.toString() !== serverId) {
        return res.status(404).json({ message: 'Category not found or does not belong to the specified server' });
      }
  
      res.status(200).json(channel);
    } catch (error) {
      console.error('Error getting voice channel details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Update text channel details
  const updateVoiceChannel = async (req, res) => {
    try {
      const { serverId, categoryId, channelId } = req.params;
      const category = await Category.findById(categoryId);
      if (!category || category.server.toString() !== serverId) {
        return res.status(404).json({ message: 'Category not found or does not belong to the specified server' });
      }
  
      const updatedChannel = await VoiceChannel.findByIdAndUpdate(channelId, req.body, { new: true });
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
  const deleteVoiceChannel = async (req, res) => {
    try {
      const { serverId, categoryId, channelId } = req.params;
      const category = await Category.findById(categoryId);
      if (!category || category.server.toString() !== serverId) {
        return res.status(404).json({ message: 'Category not found or does not belong to the specified server' });
      }
  
      const deletedChannel = await VoiceChannel.findByIdAndDelete(channelId);
      if (!deletedChannel) {
        return res.status(404).json({ message: 'Channel not found' });
      }
  
      res.status(200).json({ message: 'Channel deleted successfully' });
    } catch (error) {
      console.error('Error deleting text channel:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  module.exports = {
    createVoiceChannel,
    getVoiceChannelDetails,
    updateVoiceChannel,
    deleteVoiceChannel,
  };
  