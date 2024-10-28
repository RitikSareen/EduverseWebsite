// Server Service
const Server = require('../models/server');

// Create a new server
const createServer = async (req, res) => {
  try {
    const newServer = new Server({
      serverName: req.body.serverName,
      roles: req.body.roles,
      members: [],
      categories: [],
    });
    const savedServer = await newServer.save();
    res.status(201).json(savedServer);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get server details
const getServerDetails = async (req, res) => {
  try {
    const server = await Server.findById(req.params.serverId).populate('categories');
    res.json(server);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add user to server
const addUserToServer = async (req, res) => {
  try {
    const { userId, roles } = req.body;
    const server = await Server.findById(req.params.serverId);
    server.members.push({ userId, roles });
    const updatedServer = await server.save();
    res.status(201).json(updatedServer);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update server details
const updateServer = async (req, res) => {
  try {
    const updatedServer = await Server.findByIdAndUpdate(req.params.serverId, req.body, { new: true });
    res.json(updatedServer);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Remove user from server
const removeUserFromServer = async (req, res) => {
  try {
    const server = await Server.findById(req.params.serverId);
    server.members = server.members.filter(member => member.userId.toString() !== req.params.userId);
    const updatedServer = await server.save();
    res.json(updatedServer);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createServer,
  getServerDetails,
  addUserToServer,
  updateServer,
  removeUserFromServer,
};
