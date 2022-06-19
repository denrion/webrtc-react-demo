import {
  createContext,
  useEffect,
  useState,
  useReducer,
  useContext,
} from 'react';
import { useNavigate } from 'react-router-dom';
import Peer from 'peerjs';
import { ws } from '../ws';
import { peersReducer, PeerState } from '../reducers/peerReducer';
import {
  addPeerStreamAction,
  addPeerNameAction,
  removePeerStreamAction,
  addAllPeersAction,
} from '../reducers/peerActions';

import { UserContext } from './UserContext';
import { IPeer } from '../types/peer';

interface RoomValue {
  stream?: MediaStream;
  peers: PeerState;
  roomId: string;
  setRoomId: (id: string) => void;
}

export const RoomContext = createContext<RoomValue>({
  peers: {},
  setRoomId: id => {},
  roomId: '',
});

export const RoomProvider: React.FunctionComponent = ({ children }) => {
  const navigate = useNavigate();
  const { userName, userId } = useContext(UserContext);
  const [me, setMe] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();
  const [peers, dispatch] = useReducer(peersReducer, {});
  const [screenSharingId, setScreenSharingId] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');

  const enterRoom = ({ roomId }: { roomId: 'string' }) => {
    navigate(`/room/${roomId}`);
  };
  const getUsers = ({
    participants,
  }: {
    participants: Record<string, IPeer>;
  }) => {
    dispatch(addAllPeersAction(participants));
  };

  const removePeer = (peerId: string) => {
    dispatch(removePeerStreamAction(peerId));
  };

  const nameChangedHandler = ({
    peerId,
    userName,
  }: {
    peerId: string;
    userName: string;
  }) => {
    dispatch(addPeerNameAction(peerId, userName));
  };

  useEffect(() => {
    ws.emit('change-name', { peerId: userId, userName, roomId });
  }, [userName, userId, roomId]);

  useEffect(() => {
    const peer = new Peer(userId, {
      host: 'http://ec2-18-193-123-110.eu-central-1.compute.amazonaws.com',
      port: 9000,
      path: '/myapp',
    });
    setMe(peer);

    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(stream => {
          setStream(stream);
        });
    } catch (error) {
      console.error(error);
    }

    ws.on('room-created', enterRoom);
    ws.on('get-users', getUsers);
    ws.on('user-disconnected', removePeer);
    ws.on('user-started-sharing', peerId => setScreenSharingId(peerId));
    ws.on('user-stopped-sharing', () => setScreenSharingId(''));
    ws.on('name-changed', nameChangedHandler);

    return () => {
      ws.off('room-created');
      ws.off('get-users');
      ws.off('user-disconnected');
      ws.off('user-started-sharing');
      ws.off('user-stopped-sharing');
      ws.off('user-joined');
      ws.off('name-changed');
      me?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (screenSharingId) {
      ws.emit('start-sharing', { peerId: screenSharingId, roomId });
    } else {
      ws.emit('stop-sharing');
    }
  }, [screenSharingId, roomId]);

  useEffect(() => {
    if (!me) return;
    if (!stream) return;
    ws.on('user-joined', ({ peerId, userName: name }) => {
      const call = me.call(peerId, stream, {
        metadata: {
          userName,
        },
      });
      call.on('stream', peerStream => {
        dispatch(addPeerStreamAction(peerId, peerStream));
      });
      dispatch(addPeerNameAction(peerId, name));
    });

    me.on('call', call => {
      const { userName } = call.metadata;
      dispatch(addPeerNameAction(call.peer, userName));
      call.answer(stream);
      call.on('stream', peerStream => {
        dispatch(addPeerStreamAction(call.peer, peerStream));
      });
    });

    return () => {
      ws.off('user-joined');
    };
  }, [me, stream, userName]);

  return (
    <RoomContext.Provider
      value={{
        stream,
        peers,
        roomId,
        setRoomId,
      }}>
      {children}
    </RoomContext.Provider>
  );
};
