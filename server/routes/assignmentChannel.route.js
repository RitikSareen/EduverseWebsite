const express = require('express');
const router = express.Router();
const {
  createAssignmentChannel,
  getAllAssignmentChannels,
  getAssignmentChannelDetails,
  updateAssignmentChannel,
  deleteAssignmentChannel,
  createAssignment,
  getAllAssignmentsInChannel,
  getAssignmentDetails,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
} = require('../services/assignmentChannel.service');

// Create a new assignment channel in a category
router.post('/servers/:serverId/categories/:categoryId/assignment-channels', createAssignmentChannel);

// Get all assignment channels in a category
router.get('/servers/:serverId/categories/:categoryId/assignment-channels', getAllAssignmentChannels);

// Get details of a specific assignment channel
router.get('/assignment-channels/:channelId', getAssignmentChannelDetails);

// Update an assignment channel
router.put('/assignment-channels/:channelId', updateAssignmentChannel);

// Delete an assignment channel
router.delete('/assignment-channels/:channelId', deleteAssignmentChannel);

// Create a new assignment in an assignment channel
router.post('/assignment-channels/:channelId/assignments', createAssignment);

// Get all assignments in an assignment channel
router.get('/assignment-channels/:channelId/assignments', getAllAssignmentsInChannel);

// Get details of a specific assignment
router.get('/assignments/:assignmentId', getAssignmentDetails);

// Update an assignment in an assignment channel
router.put('/assignments/:assignmentId', updateAssignment);

// Delete an assignment in an assignment channel
router.delete('/assignments/:assignmentId', deleteAssignment);

// Submit an assignment (student submission)
router.post('/assignments/:assignmentId/submit', submitAssignment);

module.exports = router;
