import { roomHandler } from './room-handler';

import { ServerSocket } from '../types';

const socketIoHandler = (socket: ServerSocket) => {
  console.log('User connected');

  roomHandler({ socket });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
};

export { socketIoHandler };
