const AssignmentChannel = require('../models/assignmentChannel');

// Create a new assignment in an assignment channel
const createAssignmentChannel = async (req, res) => {
  try {
    const { serverId, categoryId } = req.params;
    const { channelName, allowedRoles } = req.body;

    const newAssignmentChannel = new AssignmentChannel({
      channelName,
      category: categoryId,
      allowedRoles,
    });

    const savedChannel = await newAssignmentChannel.save();
    res.status(201).json(savedChannel);
  } catch (error) {
    console.error('Error creating assignment channel:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all assignment channels in a category
const getAllAssignmentChannels = async (req, res) => {
  try {
    const { serverId, categoryId } = req.params;

    const assignmentChannels = await AssignmentChannel.find({ category: categoryId });
    res.status(200).json(assignmentChannels);
  } catch (error) {
    console.error('Error getting assignment channels:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get details of a specific assignment channel
const getAssignmentChannelDetails = async (req, res) => {
  try {
    const { channelId } = req.params;

    const channel = await AssignmentChannel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Assignment channel not found' });
    }

    res.status(200).json(channel);
  } catch (error) {
    console.error('Error getting assignment channel details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update an assignment channel
const updateAssignmentChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { channelName, allowedRoles } = req.body;

    const updatedChannel = await AssignmentChannel.findByIdAndUpdate(
      channelId,
      { channelName, allowedRoles },
      { new: true }
    );

    if (!updatedChannel) {
      return res.status(404).json({ message: 'Assignment channel not found' });
    }

    res.status(200).json(updatedChannel);
  } catch (error) {
    console.error('Error updating assignment channel:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete an assignment channel
const deleteAssignmentChannel = async (req, res) => {
  try {
    const { channelId } = req.params;

    const deletedChannel = await AssignmentChannel.findByIdAndDelete(channelId);
    if (!deletedChannel) {
      return res.status(404).json({ message: 'Assignment channel not found' });
    }

    res.status(200).json({ message: 'Assignment channel deleted successfully' });
  } catch (error) {
    console.error('Error deleting assignment channel:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const createAssignment = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { title, description, dueDate, files } = req.body;

    const newAssignment = new AssignmentChannel({
      channel: channelId,
      teacher: req.user.id,
      title,
      description,
      dueDate,
      files: files || [],
    });

    const savedAssignment = await newAssignment.save();
    res.status(201).json(savedAssignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all assignments in an assignment channel
const getAllAssignmentsInChannel = async (req, res) => {
  try {
    const { channelId } = req.params;

    const assignments = await AssignmentChannel.find({ channel: channelId });
    res.status(200).json(assignments);
  } catch (error) {
    console.error('Error getting assignments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get assignment details
const getAssignmentDetails = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await AssignmentChannel.findById(assignmentId).populate('submissions');
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json(assignment);
  } catch (error) {
    console.error('Error getting assignment details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update an assignment in the assignment channel
const updateAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const updatedAssignment = await AssignmentChannel.findByIdAndUpdate(assignmentId, req.body, { new: true });
    if (!updatedAssignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json(updatedAssignment);
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete an assignment in an assignment channel
const deleteAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const deletedAssignment = await AssignmentChannel.findByIdAndDelete(assignmentId);
    if (!deletedAssignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Submit an assignment
const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { submission } = req.body;

    const assignment = await AssignmentChannel.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    assignment.submissions.push(submission);
    await assignment.save();

    res.status(201).json({ message: 'Submission added successfully' });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createAssignment,
  getAllAssignmentsInChannel,
  getAssignmentDetails,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  createAssignmentChannel,
  getAllAssignmentChannels,
  getAssignmentChannelDetails,
  updateAssignmentChannel,
  deleteAssignmentChannel,
};
