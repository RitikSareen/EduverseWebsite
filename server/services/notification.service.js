const Notification = require('../models/notification');

// Get notifications for the logged-in user
const getNotificationsByUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const notifications = await Notification.find({ userId }).sort({ timestamp: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mark a notification as read
const markNotificationAsRead = async (req, res) => {
  const { notificationId } = req.params;
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
    res.status(200).json(updatedNotification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getNotificationsByUser,
  markNotificationAsRead,
};
