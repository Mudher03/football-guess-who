import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';

export default function Home() {
  const navigate = useNavigate();
  const [joinCode, setJoinCode]   = useState('');
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on('room-created', ({ code, playerName: pName }) => {
      sessionStorage.setItem('playerName', pName || 'Player 1');
      sessionStorage.setItem('myIndex', '0');
      navigate(`/room/${code}`);
    });

    socket.on('room-joined', ({ code, playerName: pName, myIndex }) => {
      sessionStorage.setItem('playerName', pName || 'Player 2');
      sessionStorage.setItem('myIndex', String(myIndex ?? 1));
      navigate(`/room/${code}`);
    });

    socket.on('join-error', ({ message }) => {
      setError(message);
      setLoading(false);
    });

    return () => {
      socket.off('room-created');
      socket.off('room-joined');
      socket.off('join-error');
    };
  }, [navigate]);

  function handleCreate() {
    setError('');
    setLoading(true);
    socket.emit('create-room', { playerName: playerName.trim() || 'Player 1' });
  }

  function handleJoin(e) {
    e.preventDefault();
    const c = joinCode.trim().toUpperCase();
    if (!c) { setError('Please enter a room code.'); return; }
    setError('');
    setLoading(true);
    socket.emit('join-room', { code: c, playerName: playerName.trim() || 'Player 2' });
  }

  return (
    <div className="page center">
      <div className="card home-card">
        <div className="logo-area">
          <div className="logo">⚽</div>
          <h1>Football Guess Who</h1>
          <p className="subtitle">Real-time two-player guessing game. Challenge a friend!</p>
        </div>

        <div className="home-name-row">
          <input
            className="name-input"
            placeholder="Your name (optional)"
            value={playerName}
            maxLength={20}
            onChange={e => setPlayerName(e.target.value)}
          />
        </div>

        <button className="btn btn-primary btn-lg" onClick={handleCreate} disabled={loading}>
          {loading ? 'Creating…' : '⚡ Create Game'}
        </button>

        <div className="divider">or join an existing game</div>

        <form onSubmit={handleJoin} className="join-form">
          <input
            type="text"
            placeholder="Enter room code (e.g. AB12CD)"
            value={joinCode}
            maxLength={6}
            onChange={e => setJoinCode(e.target.value.toUpperCase())}
            className="code-input"
            autoComplete="off"
            spellCheck={false}
          />
          <button type="submit" className="btn btn-secondary" disabled={loading || !joinCode.trim()}>
            Join →
          </button>
        </form>

        {error && <p className="error-msg">{error}</p>}

        <div className="home-features">
          <div className="feature-item">🏟 150+ real footballers</div>
          <div className="feature-item">⚡ Real-time multiplayer</div>
          <div className="feature-item">⚙ Fully configurable</div>
        </div>
      </div>
    </div>
  );
}
