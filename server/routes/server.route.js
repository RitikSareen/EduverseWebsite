// Server Routes
const express = require('express');
const router = express.Router();
const { createServer, getServerDetails, addUserToServer, updateServer, removeUserFromServer } = require('../services/server.service');
const verifyToken = require('../middleware/auth.guard');

// Create a new server
router.post('/', createServer);

// Get server details
router.get('/:serverId', getServerDetails);

// Add user to server
router.post('/:serverId/add-user', addUserToServer);

// Update server details
router.put('/:serverId', updateServer);

// Remove user from server
router.delete('/:serverId/remove-user/:userId', removeUserFromServer);

module.exports = router;
