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
    const server = await Server.findById(req.params.serverId)
      .populate({
        path: 'categories', // Populate categories
        populate: {
          path: 'channels', // Nested population for TextChannel
          model: 'TextChannel', // Reference TextChannel model
          select: 'channelName allowedRoles messages', // Include only necessary fields
        },
      })
      .populate({
        path: 'members.userId', // Path within nested array
        model: 'User', // Model to populate from
        select: 'username email', // Select only necessary fields
      });

    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }

    res.json(server);
  } catch (error) {
    console.error('Error fetching server details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// Add user to server
const joinServer = async (req, res) => {
  try {
    const { serverId } = req.params;
    const { joinCode } = req.body;
    const userId = req.user.id; // Authenticated user ID

    // Find the server and validate the join code
    const server = await Server.findById(serverId);
    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }

    if (server.joinCode !== joinCode) {
      return res.status(403).json({ message: 'Invalid join code' });
    }

    // Check if the user is already a member
    const isAlreadyMember = server.members.some(member => member.userId.toString() === userId);
    if (isAlreadyMember) {
      return res.status(400).json({ message: 'You are already a member of this server' });
    }

    // Add the user as a student
    server.members.push({ userId, role: 'Student' });
    await server.save();

    res.status(200).json({ message: 'Successfully joined the server' });
  } catch (error) {
    console.error('Error joining server:', error);
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
    const userId = req.user.id;

    const servers = await Server.find().lean(); // Fetch all servers

    const serversWithMembership = servers.map(server => {
      const isMember = server.members.some(member => member.userId.toString() === userId);
      return {
        ...server,
        isMember,
      };
    });

    res.status(200).json(serversWithMembership);
  } catch (error) {
    console.error('Error fetching servers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const updateMemberRole = async (req, res) => {
  try {
    const { serverId, memberId } = req.params;
    const { role } = req.body;

    const server = await Server.findById(serverId);
    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }

    const member = server.members.find((m) => m.userId.toString() === memberId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found in this server' });
    }

    member.role = role;
    await server.save();

    res.status(200).json({ message: 'Member role updated successfully' });
  } catch (error) {
    console.error('Error updating member role:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// const getAllServers = async (req, res) => {
//   try {
//     console.log('getAllServers called'); // Log the function call
//     const servers = await Server.find(); // Adjust query as needed
//     console.log('Servers fetched successfully:', servers);
//     res.status(200).json(servers);
//   } catch (error) {
//     console.error('Error fetching servers:', error); // Log the error in detail
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

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
  updateMemberRole,
  createServer,
  getAllServers,
  getServerDetails,
  joinServer,
  updateServer,
  removeUserFromServer,
};
