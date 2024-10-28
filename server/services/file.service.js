const mongoose = require('mongoose');
const { connection } = require('../app');
const { GridFSBucket } = require('mongodb');
const File = require('../models/file');

// Use the existing MongoDB connection
let gfs;
connection.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(connection.db, {
    bucketName: 'uploads',
  });
});

// Reference to Socket.io
let io;
const initializeSocket = (ioInstance) => {
  io = ioInstance;
};

// Upload a new file
const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { originalname, mimetype, id } = req.file;
  const uploadedBy = req.body.uploadedBy;

  try {
    const newFile = new File({
      fileName: originalname,
      fileType: mimetype,
      uploadedBy,
      fileUrl: `/files/${id}`, // This file URL will be used for retrieval
    });

    const savedFile = await newFile.save();

    // Emit a notification for the file upload
    io.emit('file_uploaded', {
      fileName: savedFile.fileName,
      uploadedBy: savedFile.uploadedBy,
      fileUrl: savedFile.fileUrl,
    });

    res.status(201).json(savedFile);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get file by ID
const getFile = async (req, res) => {
  const fileId = new mongoose.Types.ObjectId(req.params.fileId);
  try {
    gfs.find({ _id: fileId }).toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({ error: 'No file found' });
      }
      gfs.openDownloadStream(fileId).pipe(res);
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete file by ID
const deleteFile = async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);

    // Delete from GridFS
    await gfs.delete(fileId);

    // Delete metadata from File collection
    await File.findByIdAndDelete(fileId);

    // Emit a notification for the file deletion
    io.emit('file_deleted', fileId);

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  uploadFile,
  getFile,
  deleteFile,
  initializeSocket,
};
