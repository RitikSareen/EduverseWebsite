const textChannelService = require('../services/textChannel.service');

const setupGroupChatSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected for messaging');

    // Handle incoming chat messages
    socket.on('chat message', async (data) => {
      try {
        const { channelId, content } = data;

        // Add the message to the text channel
        const req = {
          params: { channelId },
          body: { content },
          user: { id: socket.userId }, // Assuming `userId` is associated with the socket connection (e.g., after authentication)
        };
        const res = {
          status: (code) => ({
            json: (response) => response,
          }),
        };

        // Call the service method to add a message
        const newMessage = await textChannelService.addMessageToTextChannel(req, res);

        // Broadcast the new message to all clients in the room for the channel
        io.to(channelId).emit('chat message', newMessage);
      } catch (error) {
        console.error('Error processing message:', error);
        socket.emit('error', { error: 'Error processing message' });
      }
    });

    // Join channel
    socket.on('join channel', (channelId) => {
      socket.join(channelId);
      console.log(`User joined channel: ${channelId}`);
    });

    // Leave channel
    socket.on('leave channel', (channelId) => {
      socket.leave(channelId);
      console.log(`User left channel: ${channelId}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected from messaging');
    });
  });
};

module.exports = setupGroupChatSocket;
