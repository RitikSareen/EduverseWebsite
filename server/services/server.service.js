// Server Service
const Server = require('../models/server');
const User = require('../models/user')

// Create a new server
const createServer = async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from `req.user`, set by `verifyToken`

    // Step 1: Create the server with the authenticated user as creator
    const newServer = new Server({
      name: req.body.name,
      description: req.body.description,
      createdBy: userId,
      members: [{ userId: userId, role: 'Admin' }] // Set creator as an Admin member
    });
    const savedServer = await newServer.save();

    // Step 2: Update the user's servers array to include the new server
    await User.findByIdAndUpdate(
      userId,
      { $push: { servers: savedServer._id } },
      { new: true }
    );

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

const getAllServers = async (req, res) => {
  try {
    console.log('getAllServers called'); // Log the function call
    const servers = await Server.find(); // Adjust query as needed
    console.log('Servers fetched successfully:', servers);
    res.status(200).json(servers);
  } catch (error) {
    console.error('Error fetching servers:', error); // Log the error in detail
    res.status(500).json({ error: 'Internal Server Error' });
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
  getAllServers,
  getServerDetails,
  addUserToServer,
  updateServer,
  removeUserFromServer,
};
