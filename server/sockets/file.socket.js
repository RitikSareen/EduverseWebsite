const setupFileSocket = (io) => {
    io.on('connection', (socket) => {
      console.log('A user connected for file handling');
  
      // Listen for file upload event and broadcast notification
      socket.on('file_uploaded', (data) => {
        // Emit to all clients about the file upload
        io.emit('file_uploaded_notification', {
          fileName: data.fileName,
          uploadedBy: data.uploadedBy,
          fileUrl: data.fileUrl,
        });
      });
  
      // Handle file deletion
      socket.on('file_deleted', (fileId) => {
        // Notify all clients that a file was deleted
        io.emit('file_deleted_notification', { fileId });
      });
  
      socket.on('disconnect', () => {
        console.log('A user disconnected from file handling');
      });
    });
  };
  
  module.exports = setupFileSocket;
  