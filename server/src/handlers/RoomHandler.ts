import { Server, Socket } from 'socket.io';
import { v4 as UUIDv4 } from 'uuid';
import type IRoomParams from '../interfaces/IRoomParams';

const rooms: Record<string, string[]> = {};

const roomHandler = (socket: Socket, io: Server) => {
  const createRoom = () => {
    const roomId = UUIDv4();
    socket.join(roomId);

    rooms[roomId] = [];

    socket.emit('room-created', { roomId });
  };
  const joinRoom = ({ roomId, peerId }: IRoomParams) => {
    if (!rooms[roomId]) {
      console.log('Room deas not exist');
      return;
    }
    console.log(rooms[roomId], 'rum');
    if (rooms[roomId].length >= 2) {
      console.log('User is on call');
      return;
    }
    console.log('New user joined the room', roomId, 'peer', peerId);
    rooms[roomId].push(peerId);
    socket.join(roomId);
    socket.on('ready', () => {
      socket.to(roomId).emit('user-joined-room', { peerId });
    });
    socket.on('disconnect', () => leaveRoom({ roomId, peerId }));
    io.in(roomId).emit('get-users', { roomId, users: rooms[roomId] });

    socket.on(
      'mute',
      ({ type, value }: { type: 'audio' | 'video'; value: boolean }) =>
        socket.to(roomId).emit('user-muted', { peerId, type, value })
    );
  };
  const leaveRoom = ({ roomId, peerId }: IRoomParams) => {
    if (rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter((peer) => peer !== peerId);
    }
    if (rooms[roomId]?.length === 0) {
      //set call as ended in db
      delete rooms[roomId];
    }
    socket.to(roomId).emit('user-left-room', { peerId });
    socket.to(roomId).emit('get-users', { roomId, users: rooms[roomId] });
    socket.leave(roomId);
  };
  const closeRoom = ({ roomId, peerId }: IRoomParams) => {
    if (rooms[roomId]) {
      //set call as ended in db and remove room
      console.log(peerId, 'call terminated');
      delete rooms[roomId];
    }
    socket.leave(roomId);
  };
  socket.on('create-room', createRoom);
  socket.on('join-room', joinRoom);
  socket.on('leave-room', leaveRoom);
  socket.on('close-room', closeRoom);
};

export default roomHandler;
