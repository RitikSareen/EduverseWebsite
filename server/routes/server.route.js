// Server Routes
const express = require('express');
const router = express.Router();
const { createServer, getServerDetails, joinServer, updateServer, removeUserFromServer, getAllServers, updateMemberRole } = require('../services/server.service');

// Create a new server
router.post('/create', createServer);

router.get('/all', getAllServers);
// Get server details
router.get('/:serverId', getServerDetails);

// Add user to server
router.post('/:serverId/join', joinServer);

router.put('/:serverId/members/:memberId/role', updateMemberRole);

// Update server details
router.put('/:serverId', updateServer);

// Remove user from server
router.delete('/:serverId/remove-user/:userId', removeUserFromServer);

module.exports = router;
