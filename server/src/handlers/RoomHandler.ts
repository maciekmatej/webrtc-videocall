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
    io.in(roomId).emit('joined-room', { peerId });
    io.in(roomId).emit('get-users', { roomId, users: rooms[roomId] });
  };
  socket.on('create-room', createRoom);
  socket.on('join-room', joinRoom);
};

export default roomHandler;
