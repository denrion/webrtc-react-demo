import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { VideoPlayer } from '../components/VideoPlayer';
import { PeerState } from '../reducers/peerReducer';
import { RoomContext } from '../context/RoomContext';
import { NameInput } from '../components/common/Name';
import { ws } from '../ws';
import { UserContext } from '../context/UserContext';

export const Room = () => {
  const { id } = useParams();
  const { stream, peers, setRoomId } = useContext(RoomContext);
  const { userName, userId } = useContext(UserContext);

  useEffect(() => {
    if (stream) ws.emit('join-room', { roomId: id, peerId: userId, userName });
  }, [id, userId, stream, userName]);

  useEffect(() => {
    setRoomId(id || '');
  }, [id, setRoomId]);

  return (
    <div className='flex flex-col min-h-screen'>
      <div className='flex grow'>
        <div className={'grid gap-4 grid-cols-4'}>
          <div>
            <VideoPlayer stream={stream} />
            <NameInput />
          </div>

          {Object.values(peers as PeerState)
            .filter(peer => !!peer.stream)
            .map(peer => (
              <div key={peer.peerId}>
                <VideoPlayer stream={peer.stream} />
                <div>{peer.userName}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
