import { v4 as uuidV4 } from 'uuid';
import { IJoinRoomData, ILeaveRoomData, IUser } from '../types';

const rooms: Record<string, Record<string, IUser>> = {};

export const roomHandler = ({ socket }) => {
  const createRoom = () => {
    const roomId = uuidV4();
    rooms[roomId] = {};
    socket.emit('room-created', { roomId });
    console.log('user created the room');
  };

  const joinRoom = ({ roomId, peerId, userName }: IJoinRoomData) => {
    if (!rooms[roomId]) rooms[roomId] = {};
    console.log('user joined the room', roomId, peerId, userName);

    rooms[roomId][peerId] = { peerId, userName };

    socket.join(roomId);
    socket.to(roomId).emit('user-joined', { peerId, userName });
    socket.emit('get-users', { roomId, participants: rooms[roomId] });

    socket.on('disconnect', () => {
      console.log('user left the room', peerId);
      leaveRoom({ roomId, peerId });
    });
  };

  const leaveRoom = ({ peerId, roomId }: ILeaveRoomData) => {
    // rooms[roomId] = rooms[roomId]?.filter((id) => id !== peerId);
    socket.to(roomId).emit('user-disconnected', peerId);
  };

  const changeName = ({
    peerId,
    userName,
    roomId,
  }: {
    peerId: string;
    userName: string;
    roomId: string;
  }) => {
    if (rooms[roomId] && rooms[roomId][peerId]) {
      rooms[roomId][peerId].userName = userName;
      socket.to(roomId).emit('name-changed', { peerId, userName });
    }
  };

  socket.on('create-room', createRoom);
  socket.on('join-room', joinRoom);
  socket.on('change-name', changeName);
};
