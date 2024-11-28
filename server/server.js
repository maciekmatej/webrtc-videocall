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
app.use(cors());

app.use(peerServer);
app.get('/', (req, res) => {
  res.send('server running!');
});

server.listen(PORT, () => console.log(`Listening on: ${PORT}`));
