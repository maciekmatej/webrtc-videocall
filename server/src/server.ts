import express, { Request, Response } from 'express';
import serverConfig from './config/serverConfig.js';
import http from 'http';
import path from 'path';
import cors from 'cors';
import { PeerServer, ExpressPeerServer } from 'peer';
import { Server, Socket } from 'socket.io';
import roomHandler from './handlers/RoomHandler.js';
const app = express();

const server = http.createServer(app);

//peer server
const peerPort = serverConfig.PEER_PORT as number;
const peerServer = PeerServer({
  port: peerPort,
  proxied: true,
  path: '/',
  // ssl: {},
});
// nie mam pojecia dlaczego tak ale dziala ...
//@ts-expect-error
const expressPeerServer = ExpressPeerServer(peerServer);
app.use(expressPeerServer);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Listen for incoming connections
io.on('connection', (socket: Socket) => {
  // Log when a user connects
  console.log('A user connected', socket.id);
  roomHandler(socket, io); //pass socket for room creation

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

app.get('/api/room', (req: Request, res: Response) => {
  res.send('rooom!');
});

server.listen(serverConfig.PORT, () =>
  console.log(`Listening on: ${serverConfig.PORT}`)
);
