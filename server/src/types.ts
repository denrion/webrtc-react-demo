import { Socket } from 'socket.io';

interface ServerToClientEvents {
  'room-created': (data: RoomCreatedData) => void;
  'user-joined': (data: IUserJoinedData) => void;
  'get-users': (data: IGetUsersData) => void;
  'user-disconnected': (peerId: string) => void;
}

interface ClientToServerEvents {
  'create-room': () => void;
  'join-room': (data: IJoinRoomData) => void;
}

export type ServerSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

export interface RoomCreatedData {
  roomId: string;
}

export interface IUserJoinedData {
  peerId: string;
  userName: string;
}

export interface IJoinRoomData {
  roomId: string;
  peerId: string;
  userName: string;
}

export interface ILeaveRoomData {
  roomId: string;
  peerId: string;
}

export interface IUser {
  peerId: string;
  userName: string;
}

export interface IGetUsersData {
  roomId: string;
  participants: IUser[];
}
