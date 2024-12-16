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
    if (rooms[roomId]) {
      console.log('New user joined the room', roomId, 'peer', peerId);
      rooms[roomId].push(peerId);
      socket.join(roomId);
    }
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
    socket.leave(roomId);
    io.in(roomId).emit('user-left-room', { peerId });
    io.in(roomId).emit('get-users', { roomId, users: rooms[roomId] });
  };
  socket.on('create-room', createRoom);
  socket.on('join-room', joinRoom);
  socket.on('leave-room', leaveRoom);
};

export default roomHandler;
