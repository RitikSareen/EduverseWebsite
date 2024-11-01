const express = require('express');
const router = express.Router();
// const upload = require('../middleware/upload');
const { uploadFile, getFile, deleteFile } = require('../services/file.service');
const { checkFileAccess, checkFileUploadAccess } = require('../middleware/permission_middleware');

// Upload a new file (requires permission to upload)
router.post('/upload', checkFileUploadAccess, upload.single('file'), uploadFile);

// Get file by ID (requires permission to view)
router.get('/:fileId', checkFileAccess, getFile);

// Delete a file by ID (requires permission to delete)
router.delete('/:fileId', checkFileUploadAccess, deleteFile);

module.exports = router;
