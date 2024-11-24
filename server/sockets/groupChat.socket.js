const jwt = require('jsonwebtoken');
const User = require('../models/user');
const textChannelService = require('../services/textChannel.service'); // Import your service for message handling


const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new Error('Token is missing');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey');
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new Error('User not found');
    }

    // Attach userId to the socket for later use
    socket.userId = user._id.toString();
    next();
  } catch (error) {
    console.error('Socket authentication error:', error.message);
    next(new Error('Authentication error'));
  }
};


const setupGroupChatSocket = (io) => {
  io.use(authenticateSocket); // Apply authentication middleware

  io.on('connection', (socket) => {
    console.log(`User ${socket.userId} connected`);

    socket.on('join channel', (channelId) => {
      socket.join(channelId);
      console.log(`User ${socket.userId} joined channel: ${channelId}`);
    });

    socket.on('chat message', async (data) => {
      try {
        const { categoryId, textChannelId, content } = data;
    
        if (!categoryId || !textChannelId || !content) {
          throw new Error('Invalid message payload');
        }
    
        // Save the message to the database and get the complete message object
        const newMessage = await textChannelService.addMessageToTextChannel({
          params: { categoryId, textChannelId },
          body: { content },
          user: { id: socket.userId }, // Pass the userId from the socket
        });
    
        // Broadcast the message to the channel
        io.to(textChannelId).emit('chat message', newMessage);
        console.log(`Message sent to channel ${textChannelId}:`, newMessage);
      } catch (error) {
        console.error('Error handling chat message:', error.message);
      }
    });
    // socket.on('chat message', async (data) => {
    //   try {
    //     const { categoryId, textChannelId, content } = data;
    
    //     if (!categoryId || !textChannelId || !content) {
    //       throw new Error('Invalid message payload');
    //     }
    
    //     // Save the message to the database
    //     const newMessage = await textChannelService.addMessageToTextChannel({
    //       params: { categoryId, textChannelId },
    //       body: { content },
    //       user: { id: socket.userId }, // Pass the userId from the socket
    //     });
    
    //     // Fetch the sender's name
    //     const user = await User.findById(socket.userId);
    //     if (!user) {
    //       throw new Error('Sender not found');
    //     }
    
    //     const broadcastMessage = {
    //       ...newMessage.toObject(), // Include all message fields
    //       senderName: `${user.firstName} ${user.lastName}`, // Add sender's name
    //     };
    
    //     // Broadcast the message to the channel
    //     io.to(textChannelId).emit('chat message', broadcastMessage);
    //     console.log(`Message sent to channel ${textChannelId}:`, broadcastMessage);
    //   } catch (error) {
    //     console.error('Error handling chat message:', error.message);
    //   }
    // });
    // socket.on('chat message', async (data) => {
    //   try {
    //     const { categoryId, textChannelId, content } = data;

    //     if (!categoryId || !textChannelId || !content) {
    //       throw new Error('Invalid message payload');
    //     }

    //     // Save the message to the database
    //     const newMessage = await textChannelService.addMessageToTextChannel({
    //       params: { categoryId, textChannelId },
    //       body: { content },
    //       user: { id: socket.userId }, // Pass the userId from the socket
    //     });

    //     // Broadcast the message to the channel
    //     io.to(textChannelId).emit('chat message', newMessage);
    //     console.log(`Message sent to channel ${textChannelId}:`, newMessage);
    //   } catch (error) {
    //     console.error('Error handling chat message:', error.message);
    //   }
    // });

    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected`);
    });
  });
};

module.exports = setupGroupChatSocket;





