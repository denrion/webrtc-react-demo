import socketIOClient from 'socket.io-client';

const WS = process.env.WS_SERVER_URL ?? 'http://localhost:8080';
export const ws = socketIOClient(WS);
