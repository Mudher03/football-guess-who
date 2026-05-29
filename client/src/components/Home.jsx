import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';

export default function Home() {
  const navigate = useNavigate();
  const [joinCode, setJoinCode]     = useState('');
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

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
    <div className="home-page">
      {/* Background glow */}
      <div className="home-glow" />

      {/* Hero */}
      <header className="home-hero">
        <span className="home-ball">⚽</span>
        <h1 className="home-title">Football Guess Who</h1>
        <p className="home-sub">Real-time two-player guessing game · Challenge a friend!</p>
      </header>

      {/* Action card */}
      <div className="home-card">
        <div className="home-name-row">
          <input
            className="name-input"
            placeholder="Your name (optional)"
            value={playerName}
            maxLength={20}
            onChange={e => setPlayerName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
          />
        </div>

        <button
          className="btn btn-primary btn-lg home-cta"
          onClick={handleCreate}
          disabled={loading}
        >
          {loading ? 'Creating…' : '⚡ Create Game'}
        </button>

        <div className="divider">or join an existing game</div>

        <form onSubmit={handleJoin} className="join-form">
          <input
            type="text"
            placeholder="Room code (e.g. AB12CD)"
            value={joinCode}
            maxLength={6}
            onChange={e => setJoinCode(e.target.value.toUpperCase())}
            className="code-input"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="submit"
            className="btn btn-secondary"
            disabled={loading || !joinCode.trim()}
          >
            Join →
          </button>
        </form>

        {error && <p className="error-msg">{error}</p>}
      </div>

      {/* Features */}
      <div className="home-features">
        <div className="hf-item">
          <span className="hf-icon">🏟</span>
          <div>
            <div className="hf-title">155+ Footballers</div>
            <div className="hf-desc">PL, La Liga, Bundesliga, Serie A & Ligue 1</div>
          </div>
        </div>
        <div className="hf-item">
          <span className="hf-icon">⚡</span>
          <div>
            <div className="hf-title">Real-time Multiplayer</div>
            <div className="hf-desc">No account needed · Instant play</div>
          </div>
        </div>
        <div className="hf-item">
          <span className="hf-icon">⚙</span>
          <div>
            <div className="hf-title">Fully Configurable</div>
            <div className="hf-desc">Filter by nation, league &amp; win conditions</div>
          </div>
        </div>
      </div>
    </div>
  );
}
