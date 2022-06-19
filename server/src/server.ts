import { createServer } from 'http';
import { Server } from 'socket.io';

import { app } from './app';
import { socketIoHandler } from './handlers/socket-io.handler';

const PORT = process.env.PORT ?? 8080;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});
io.on('connection', socketIoHandler);

httpServer.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
