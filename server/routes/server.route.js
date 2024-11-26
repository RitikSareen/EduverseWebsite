// Server Routes
const express = require('express');
const router = express.Router();
const { createServer, getServerDetails, joinServer, updateServer, removeUserFromServer, getAllServers, deleteServer, updateMemberRole,leaveServer } = require('../services/server.service');

// Create a new server
router.post('/create', createServer);

router.get('/all', getAllServers);
// Get server details
router.get('/:serverId', getServerDetails);

router.delete('/servers/:serverId', deleteServer);


// Add user to server
router.post('/:serverId/join', joinServer);

router.put('/:serverId/members/:memberId/role', updateMemberRole);

// Update server details
router.put('/:serverId', updateServer);

router.delete('/servers/:serverId/leave', leaveServer);

// Remove user from server
router.delete('/:serverId/remove-user/:userId', removeUserFromServer);

module.exports = router;
