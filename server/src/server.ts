import express, { Request, Response } from 'express';
import serverConfig from './config/serverConfig.js';
import http from 'http';
import https from 'https';
import path from 'path';
import cors from 'cors';
import history from 'connect-history-api-fallback';
import { ExpressPeerServer, PeerServer } from 'peer';
import { Server, Socket } from 'socket.io';
import roomHandler from './handlers/RoomHandler.js';
const app = express();

const __dirname = path.resolve('../platform/dist');

// peer server old and working

const peerPort = serverConfig.PEER_PORT as number;
const peerServer = PeerServer({
  port: peerPort,
  path: '/peer',
  // ssl: {},
});

// const expressPeerServer = ExpressPeerServer(peerServer);
// app.use(expressPeerServer);
//

//peer server

// const peerServer = http.createServer(app).listen(9000);
// const expressPeerServer = ExpressPeerServer(peerServer, {
//   //@ts-expect-error
//   debug: true,
//   port: 9000,
//   path: '/peer',
// });
// expressPeerServer.on('connection', function (client) {
//   console.log(client.getId() + ' peer connected');
// });
// expressPeerServer.on('disconnect', function (client) {
//   console.log(client.getId() + ' peer disconnected');
// });
// app.use(expressPeerServer);

//prevent vue routs from being resolved in express
app.use(
  history({
    rewrites: [
      {
        from: /^\/api\/.*$/,
        to: function (context) {
          return context.parsedUrl.path as string;
        },
      },
    ],
  })
);

// server for backend and socket
const port = serverConfig.PORT as number;
const server = http.createServer(app);

const io = new Server(server, {
  path: '/socket.io/',
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
});
app.use(cors());
app.use(express.static(__dirname));

app.get('/api/*', (req: Request, res: Response) => {
  res.send('API connected');
});

server.listen(port, () => console.log(`Listening on: ${port}`));
// peerServer.listen(peerPort, () => console.log(`Listening on: ${peerPort}`));
