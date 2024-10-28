const directMessageService = require('../services/directMessage.service');

const setupDirectMessageSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected for direct messaging');

    // Handle incoming direct messages
    socket.on('direct message', async (data) => {
      try {
        const { conversationId, content, recipientId } = data;

        // Create a simulated request and response to call the service method
        const req = {
          params: { conversationId },
          body: { content },
          user: { id: socket.userId }, // Assuming `userId` is associated with the socket connection after authentication
        };
        const res = {
          status: (code) => ({
            json: (response) => response,
          }),
        };

        // Add the message to the direct conversation
        const newMessage = await directMessageService.addMessageToConversation(req, res);

        // Emit the new message to the sender and recipient
        socket.emit('direct message', newMessage); // Emit back to the sender
        io.to(recipientId).emit('direct message', newMessage); // Emit to the recipient
      } catch (error) {
        console.error('Error processing direct message:', error);
        socket.emit('error', { error: 'Error processing direct message' });
      }
    });

    // Handle joining a direct conversation
    socket.on('join conversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`User joined conversation: ${conversationId}`);
    });

    // Handle leaving a direct conversation
    socket.on('leave conversation', (conversationId) => {
      socket.leave(conversationId);
      console.log(`User left conversation: ${conversationId}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected from direct messaging');
    });
  });
};

module.exports = setupDirectMessageSocket;
