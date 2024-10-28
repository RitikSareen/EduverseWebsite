// sockets/notification.socket.js
const Notification = require('../models/notification');

const setupNotificationSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected for notifications');

    socket.on('notify', async (data) => {
      const { userId, type, content } = data;

      // Save the notification to the database
      const notification = await Notification.create({ userId, type, content });

      // Emit the notification in real-time to the specific user
      io.to(userId).emit('notification', notification);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected from notifications');
    });
  });
};

module.exports = setupNotificationSocket;
