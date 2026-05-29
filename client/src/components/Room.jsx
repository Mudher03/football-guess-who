import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socket } from '../socket';
import GameBoard from './GameBoard';
import RoundOver from './RoundOver';
import FinalWinner from './FinalWinner';
import SettingsConfig from './SettingsConfig';

// Phases: connecting | waiting | settings | playing | round-over | ended | disconnected | error
export default function Room() {
  const { code } = useParams();
  const navigate = useNavigate();

  // ── Identity ──────────────────────────────────────────────────────────────
  const [phase, setPhase]           = useState('connecting');
  const [myIndex, setMyIndex]       = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers]       = useState(['Player 1', 'Player 2']);
  const [error, setError]           = useState('');
  const [settingsError, setSettingsError] = useState('');
  const [actionError, setActionError] = useState('');
  const [copied, setCopied]         = useState(false);

  // ── Game data ─────────────────────────────────────────────────────────────
  const [settings, setSettings]     = useState({
    selectedNations: [], selectedLeagues: [],
    pointsPerGuess: 1, winCondition: 'first-to', winTarget: 3,
    wrongGuessPenalty: false, questionLimit: null,
    guessAttempts: 3,
    playerNames: ['Player 1', 'Player 2'],
  });
  const [gameState, setGameState]   = useState(null);
  const [eliminated, setEliminated] = useState(new Set());
  const [roundResult, setRoundResult] = useState(null);
  const [gameResult, setGameResult]   = useState(null);
  const [readyStatus, setReadyStatus] = useState([false, false]);

  // ── UI preferences (local) ────────────────────────────────────────────────
  const [cardSize, setCardSize]             = useState(() => localStorage.getItem('cardSize') || 'medium');
  const [showClub, setShowClub]             = useState(() => localStorage.getItem('showClub') !== 'false');
  const [showNationality, setShowNationality] = useState(() => localStorage.getItem('showNationality') === 'true');
  const [soundOn, setSoundOn]               = useState(() => localStorage.getItem('soundOn') !== 'false');
  const [darkMode, setDarkMode]             = useState(() => localStorage.getItem('darkMode') !== 'false');

  const shareUrl = `${window.location.origin}/room/${code}`;
  const isHost = myIndex === 0;

  // Persist UI prefs
  useEffect(() => { localStorage.setItem('cardSize', cardSize); }, [cardSize]);
  useEffect(() => { localStorage.setItem('showClub', showClub); }, [showClub]);
  useEffect(() => { localStorage.setItem('showNationality', showNationality); }, [showNationality]);
  useEffect(() => { localStorage.setItem('soundOn', soundOn); }, [soundOn]);
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.documentElement.classList.toggle('light', !darkMode);
  }, [darkMode]);

  // ── Socket setup ──────────────────────────────────────────────────────────
  useEffect(() => {
    const storedName = sessionStorage.getItem('playerName') || '';
    const storedIndex = sessionStorage.getItem('myIndex');
    setPlayerName(storedName);
    if (storedIndex !== null) setMyIndex(Number(storedIndex));

    if (!socket.connected) socket.connect();

    // If we navigated here without going through Home (direct URL), try to join
    if (!storedName) {
      socket.emit('join-room', { code, playerName: 'Player 2' });
    } else if (storedName === 'Player 1') {
      setPhase('waiting');
    } else {
      setPhase('waiting');
    }

    // ── Lobby events ──────────────────────────────────────────────────────
    socket.on('room-joined', ({ code: c, playerName: pName, myIndex: idx }) => {
      const mi = idx ?? 1;
      sessionStorage.setItem('playerName', pName);
      sessionStorage.setItem('myIndex', mi);
      setPlayerName(pName);
      setMyIndex(mi);
      setPhase('waiting');
    });

    socket.on('player-connected', ({ players: pl, settings: s }) => {
      setPlayers(pl || ['Player 1', 'Player 2']);
      if (s) setSettings(s);
      setPhase('settings');
    });

    socket.on('settings-updated', ({ settings: s }) => {
      setSettings(s);
      setPlayers(s.playerNames || ['Player 1', 'Player 2']);
      setSettingsError('');
    });

    socket.on('rules-updated', ({ settings: s }) => setSettings(s));

    socket.on('names-updated', ({ playerNames: pn }) => {
      setPlayers(pn);
      setSettings(prev => ({ ...prev, playerNames: pn }));
    });

    socket.on('settings-error', ({ message }) => setSettingsError(message));

    socket.on('action-error', ({ message }) => {
      setActionError(message);
      setTimeout(() => setActionError(''), 3500);
    });

    socket.on('join-error', ({ message }) => {
      setError(message);
      setPhase('error');
    });

    socket.on('opponent-disconnected', () => setPhase('disconnected'));

    socket.on('returned-to-lobby', ({ settings: s }) => {
      setSettings(s);
      setGameState(null);
      setRoundResult(null);
      setGameResult(null);
      setPhase('settings');
    });

    // ── Game events ───────────────────────────────────────────────────────
    socket.on('game-started', (data) => {
      setMyIndex(data.myIndex);
      sessionStorage.setItem('myIndex', data.myIndex);

      setGameState({
        secretPlayer:       data.secretPlayer,
        pool:               data.pool,
        round:              data.round,
        scores:             data.scores,
        currentTurn:        data.currentTurn,
        qaLog:              [],
        pendingQuestion:    null,
        questionCounts:     [0, 0],
        questionLimit:      data.settings?.questionLimit ?? null,
        guessAttemptsLeft:  data.guessAttemptsLeft ?? [3, 3],
        settings:           data.settings,
      });
      setEliminated(new Set());
      setRoundResult(null);
      setReadyStatus([false, false]);
      setPhase('playing');
    });

    socket.on('question-asked', ({ question, askerIndex, questionCounts, questionLimit: ql }) => {
      setGameState(prev => prev ? {
        ...prev,
        pendingQuestion: { question, askerIndex },
        questionCounts: questionCounts || prev.questionCounts,
        questionLimit: ql !== undefined ? ql : prev.questionLimit,
      } : prev);
    });

    socket.on('question-answered', ({ question, answer, askerIndex, currentTurn, qaLog }) => {
      setGameState(prev => prev ? {
        ...prev,
        qaLog: qaLog || [...prev.qaLog, { question, answer, askerIndex }],
        pendingQuestion: null,
        currentTurn,
      } : prev);
    });

    socket.on('wrong-guess', ({ guesserIndex, guessedPlayerId, attemptsLeft, currentTurn }) => {
      setGameState(prev => {
        if (!prev) return prev;
        const newLeft = [...(prev.guessAttemptsLeft ?? [3, 3])];
        newLeft[guesserIndex] = attemptsLeft;
        return { ...prev, guessAttemptsLeft: newLeft, currentTurn };
      });
    });

    socket.on('guess-result', (result) => {
      setRoundResult(result);
      setReadyStatus([false, false]);
      setPhase('round-over');
    });

    socket.on('game-ended', (result) => {
      setGameResult(result);
      setPhase('ended');
    });

    socket.on('next-round-ready-status', ({ readyStatus: rs }) => {
      setReadyStatus(rs || [false, false]);
    });

    return () => {
      [
        'room-joined','player-connected','settings-updated','rules-updated',
        'names-updated','settings-error','action-error','join-error',
        'opponent-disconnected','returned-to-lobby','game-started',
        'question-asked','question-answered','wrong-guess','guess-result',
        'game-ended','next-round-ready-status',
      ].forEach(ev => socket.off(ev));
    };
  }, [code]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleUpdateSettings = useCallback((s) => {
    socket.emit('update-settings', { code, settings: s });
  }, [code]);

  const handleStartGame = useCallback(() => {
    setSettingsError('');
    socket.emit('start-game', { code });
  }, [code]);

  const handleAskQuestion = useCallback((q) => socket.emit('ask-question', { code, question: q }), [code]);
  const handleAnswerQuestion = useCallback((a) => socket.emit('answer-question', { code, answer: a }), [code]);
  const handleGuess = useCallback((id) => socket.emit('submit-guess', { code, playerId: id }), [code]);

  const handleNextRound = useCallback(() => {
    socket.emit('start-next-round', { code });
  }, [code]);

  const handlePlayAgain = useCallback(() => socket.emit('play-again', { code }), [code]);

  const handleBackToLobby = useCallback(() => {
    socket.emit('return-to-lobby', { code });
  }, [code]);

  const handleNamesChange = useCallback((names) => {
    socket.emit('update-names', { code, playerNames: names });
  }, [code]);

  const handleRulesChange = useCallback((rules) => {
    socket.emit('update-rules', { code, rules });
  }, [code]);

  const handleForfeit = useCallback(() => socket.emit('forfeit-round', { code }), [code]);
  const handleEndGame = useCallback(() => socket.emit('end-game-early', { code }), [code]);

  function toggleEliminated(id) {
    setEliminated(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function copyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // ── Render ────────────────────────────────────────────────────────────────
  if (phase === 'connecting') {
    return (
      <div className="page center">
        <div className="card"><Spinner /><p style={{ marginTop: 12 }}>Connecting…</p></div>
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="page center">
        <div className="card">
          <div className="status-icon">❌</div>
          <h2>Cannot Join Room</h2>
          <p className="error-msg">{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Return to Home</button>
        </div>
      </div>
    );
  }

  if (phase === 'disconnected') {
    return <DisconnectCountdown onExit={() => navigate('/')} />;
  }

  if (phase === 'ended' && gameResult) {
    return (
      <FinalWinner
        result={gameResult}
        myIndex={myIndex ?? 0}
        playerNames={players}
        onPlayAgain={handlePlayAgain}
        onBackToLobby={handleBackToLobby}
      />
    );
  }

  if (phase === 'round-over' && roundResult) {
    return (
      <RoundOver
        result={roundResult}
        myIndex={myIndex ?? 0}
        playerNames={players}
        readyStatus={readyStatus}
        onNextRound={handleNextRound}
      />
    );
  }

  if (phase === 'playing' && gameState) {
    return (
      <GameBoard
        key={`round-${gameState.round}`}
        gameState={gameState}
        myIndex={myIndex ?? 0}
        eliminated={eliminated}
        playerNames={players}
        isHost={isHost}
        cardSize={cardSize}
        showClub={showClub}
        showNationality={showNationality}
        soundOn={soundOn}
        darkMode={darkMode}
        actionError={actionError}
        onToggleEliminated={toggleEliminated}
        onAskQuestion={handleAskQuestion}
        onAnswerQuestion={handleAnswerQuestion}
        onGuess={handleGuess}
        onNamesChange={handleNamesChange}
        onRulesChange={handleRulesChange}
        onCardSize={setCardSize}
        onShowClub={setShowClub}
        onShowNationality={setShowNationality}
        onSound={setSoundOn}
        onDarkMode={setDarkMode}
        onForfeit={handleForfeit}
        onEndGame={handleEndGame}
      />
    );
  }

  if (phase === 'settings') {
    return (
      <div className="page center">
        <div className="card settings-card">
          <div className="room-header">
            <div className="room-code-box">
              <span className="room-code-label">Room</span>
              <span className="room-code">{code}</span>
            </div>
            <div className="player-pills">
              {players.map((p, i) => (
                <span key={i} className={`player-pill${i === myIndex ? ' me' : ''}`}>
                  {p}{i === myIndex ? ' (you)' : ''}
                </span>
              ))}
            </div>
          </div>

          <SettingsConfig
            settings={settings}
            onUpdate={handleUpdateSettings}
            onStart={handleStartGame}
            isHost={isHost}
            error={settingsError}
            playerNames={players}
          />
        </div>
      </div>
    );
  }

  // phase === 'waiting'
  return (
    <div className="page center">
      <div className="card">
        <div className="status-icon">⏳</div>
        <h2>Waiting for opponent…</h2>
        <div className="room-code-box">
          <span className="room-code-label">Room Code</span>
          <span className="room-code">{code}</span>
        </div>
        <p className="muted">Share this link:</p>
        <div className="share-row">
          <input className="share-input" readOnly value={shareUrl} onClick={e => e.target.select()} />
          <button className="btn btn-secondary" onClick={copyLink}>
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>
        <div className="tag-row">
          <span className="tag">You are: <strong>{playerName || '…'}</strong></span>
        </div>
        <Spinner />
      </div>
    </div>
  );
}

function Spinner() {
  return <div className="spinner" />;
}

function DisconnectCountdown({ onExit }) {
  const [secs, setSecs] = useState(60);
  useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);
  const pct = (secs / 60) * 100;
  return (
    <div className="page center">
      <div className="card" style={{ maxWidth: 400, textAlign: 'center' }}>
        <div className="status-icon">📡</div>
        <h2>Opponent Disconnected</h2>
        <p className="muted" style={{ marginBottom: 16 }}>
          Waiting for them to return… ({secs}s)
        </p>
        <div className="disconnect-bar-wrap">
          <div className="disconnect-bar" style={{ width: `${pct}%` }} />
        </div>
        {secs <= 0 && (
          <p className="muted" style={{ marginTop: 12 }}>They didn't return.</p>
        )}
        <button className="btn btn-secondary" style={{ marginTop: 20 }} onClick={onExit}>
          🚪 Exit to Home
        </button>
      </div>
    </div>
  );
}
