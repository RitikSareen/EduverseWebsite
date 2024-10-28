const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth.guard');
const { getNotificationsByUser, markNotificationAsRead } = require('../services/notification.service');

// Get notifications for the logged-in user
router.get('/', verifyToken, getNotificationsByUser);

// Mark a notification as read
router.put('/:notificationId/read', verifyToken, markNotificationAsRead);

module.exports = router;
