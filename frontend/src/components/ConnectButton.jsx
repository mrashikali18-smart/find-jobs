import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { UserPlus, Clock, UserCheck, UserMinus } from 'lucide-react';
import { connectionApi } from '../api/services';

export default function ConnectButton({ userId }) {
  const [status, setStatus] = useState('loading');
  const [connectionId, setConnectionId] = useState(null);
  const [isRequester, setIsRequester] = useState(false);

  const load = () => {
    connectionApi
      .status(userId)
      .then(({ data }) => {
        setStatus(data.status);
        setConnectionId(data.connectionId);
        setIsRequester(data.isRequester);
      })
      .catch(() => setStatus('none'));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleConnect = async () => {
    try {
      await connectionApi.send(userId);
      toast.success('Connection request sent');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send request');
    }
  };

  const handleAccept = async () => {
    try {
      await connectionApi.respond(connectionId, { status: 'accepted' });
      toast.success('Connection accepted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not accept request');
    }
  };

  const handleRemove = async () => {
    if (!window.confirm('Remove this connection?')) return;
    try {
      await connectionApi.remove(userId);
      toast.success('Connection removed');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not remove connection');
    }
  };

  if (status === 'loading') return null;

  if (status === 'none') {
    return (
      <button onClick={handleConnect} className="btn-accent">
        <UserPlus size={16} /> Connect
      </button>
    );
  }

  if (status === 'pending') {
    return isRequester ? (
      <button disabled className="btn-outline">
        <Clock size={16} /> Request sent
      </button>
    ) : (
      <button onClick={handleAccept} className="btn-accent">
        <UserCheck size={16} /> Accept request
      </button>
    );
  }

  if (status === 'accepted') {
    return (
      <button onClick={handleRemove} className="btn-outline">
        <UserMinus size={16} /> Connected
      </button>
    );
  }

  // rejected — allow sending a new request
  return (
    <button onClick={handleConnect} className="btn-accent">
      <UserPlus size={16} /> Connect
    </button>
  );
}
