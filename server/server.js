const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const { ExpressPeerServer } = require('peer');
const socket = require('socket.io');
const app = express();

const server = http.createServer(app);
const PORT = process.env.PORT || 9000;
const io = socket(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const peerServer = ExpressPeerServer(server, {
  proxied: true,
  debug: true,
  path: '/server',
  ssl: {},
});

// Listen for incoming connections
io.on('connection', (socket) => {
  // Log when a user connects
  console.log('A user connected');

  // Listen for disconnection event
  socket.on('disconnect', () => {
    // Log when a user disconnects
    console.log('User disconnected');
  });

  // Listen for 'signal' event from a client
  socket.on('signal', (data) => {
    // Broadcast the 'signal' event and data to all connected clients except the sender
    socket.broadcast.emit('signal', data);
  });
});

app.use(cors());

app.use(peerServer);
app.get('/api/room', (req, res) => {
  res.send('rooom!');
});

server.listen(PORT, () => console.log(`Listening on: ${PORT}`));
