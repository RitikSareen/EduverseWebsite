// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

// Import route files
const userRoutes = require('./routes/user.route');
const serverRoutes = require('./routes/server.route');
const categoryRoutes = require('./routes/category.route');
const textChannelRoutes = require('./routes/textChannel.route');
const directMessagesRoutes = require('./routes/directMessage.route');
// const fileRoutes = require('./routes/file.route');
const verifyToken = require('./middleware/auth.guard');

// Import socket setup functions

const setupGroupChatSocket = require('./sockets/groupChat.socket');
const setupDirectMessageSocket = require('./sockets/directChat.socket');
const setupFileSocket = require('./sockets/file.socket');

// Initialize app
const app = express();
const port = 3500;

// MongoDB connection string
// const mongoURI = 'mongodb://localhost:4800/eduverse-db';
const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB
// mongoose.connect(mongoURI);
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Middleware to parse JSON
app.use(express.json());
app.use(cors({
  origin: 'http://192.41.170.157:4200',
  // origin: 'http://localhost:4200',
}));

// Define Routes
app.use('/user', userRoutes);
app.use('/servers', verifyToken, serverRoutes);
app.use('/categories', verifyToken, categoryRoutes);
app.use('/textChannels', verifyToken, textChannelRoutes);
app.use('/directMessages', verifyToken, directMessagesRoutes);
// app.use('/files', verifyToken, fileRoutes);

// Create HTTP server and set up Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://192.41.170.157:4200',
    // origin: 'http://localhost:4200', // Adjust to your client origin
    methods: ['GET', 'POST'],
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Set up WebSocket functionality
setupGroupChatSocket(io);
// Set up socket handlers
setupDirectMessageSocket(io);
setupFileSocket(io);



// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello, Express with MongoDB!');
});

// Start the server
server.listen(port, () => {
  console.log(`Express app listening at http://192.41.170.157:${port}`);
});

module.exports = { app, io };
