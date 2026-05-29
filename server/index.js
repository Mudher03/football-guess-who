const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const { customAlphabet } = require('nanoid');
const { ALL_PLAYERS, TOP_NATIONS, TOP_LEAGUES, buildPool, pickSecrets } = require('./players');

const generateCode = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);

// ── Default settings ────────────────────────────────────────────────────────
function defaultSettings() {
  return {
    selectedNations: [],
    selectedLeagues: [],
    pointsPerGuess: 1,
    winCondition: 'first-to',   // 'first-to' | 'play-rounds'
    winTarget: 3,
    wrongGuessPenalty: false,
    questionLimit: null,        // null = unlimited
    guessAttempts: 3,           // attempts per round (1 | 2 | 3)
    turnTimer: null,            // null | 30 | 60 | 90 (seconds)
    playerNames: ['Player 1', 'Player 2'],
  };
}

const rooms = new Map();

// ── Room factory ─────────────────────────────────────────────────────────────
function createRoom(hostSocketId) {
  let code;
  do { code = generateCode(); } while (rooms.has(code));
  const room = {
    code,
    players: [{ socketId: hostSocketId, playerName: 'Player 1' }],
    createdAt: Date.now(),
    phase: 'lobby',    // lobby | playing | round-over | ended
    round: 0,
    scores: [0, 0],
    roundHistory: [],
    secretPlayers: [null, null],
    currentTurn: 0,
    lastLoserIndex: null,
    qaLog: [],
    pendingQuestion: null,
    questionCounts: [0, 0],
    guessAttemptsLeft: [3, 3],
    nextRoundReady: [false, false],
    pendingGameEnd: null,
    settings: defaultSettings(),
  };
  rooms.set(code, room);
  return room;
}

function findRoomBySocket(socketId) {
  for (const r of rooms.values()) {
    if (r.players.some(p => p.socketId === socketId)) return r;
  }
  return null;
}

function checkWinCondition(room) {
  const { settings, scores, roundHistory } = room;
  if (settings.winCondition === 'first-to') {
    const w = scores.findIndex(s => s >= settings.winTarget);
    return w; // -1 if none
  }
  // play-rounds
  if (roundHistory.length >= settings.winTarget) {
    if (scores[0] > scores[1]) return 0;
    if (scores[1] > scores[0]) return 1;
    return -2; // draw
  }
  return -1;
}

function startRound(room, io) {
  const pool = buildPool(room.settings);
  const attempts = room.settings.guessAttempts ?? 3;
  room.phase = 'playing';
  room.qaLog = [];
  room.pendingQuestion = null;
  room.questionCounts = [0, 0];
  room.guessAttemptsLeft = [attempts, attempts];
  room.nextRoundReady = [false, false];
  room.secretPlayers = pickSecrets(pool);

  room.players.forEach((p, idx) => {
    io.to(p.socketId).emit('game-started', {
      secretPlayer: room.secretPlayers[idx],
      pool,
      round: room.round,
      scores: room.scores,
      currentTurn: room.currentTurn,
      myIndex: idx,
      settings: room.settings,
      guessAttemptsLeft: room.guessAttemptsLeft,
    });
  });
}

function endRound(room, io, winnerIdx, reason, guesserIdx, guessedPlayerId) {
  const pts = room.settings.pointsPerGuess || 1;
  room.scores[winnerIdx] += pts;
  room.lastLoserIndex = 1 - winnerIdx;
  room.roundHistory.push({ winnerIndex: winnerIdx, scores: [...room.scores], round: room.round, reason });

  const gameWinner = checkWinCondition(room);
  const gameOver = gameWinner !== -1;

  // Always transition to round-over so both players see the reveal screen.
  // If the game is over, stash the final result — it will be emitted once both
  // players (or just the host) click "Next Round" / "View Results".
  room.phase = 'round-over';
  if (gameOver) {
    room.pendingGameEnd = {
      winnerIndex: gameWinner === -2 ? null : gameWinner,
      scores: room.scores,
      roundHistory: room.roundHistory,
      settings: room.settings,
      isDraw: gameWinner === -2,
    };
  }

  io.to(room.code).emit('guess-result', {
    winnerIndex: winnerIdx,
    guesserIndex: guesserIdx,
    guessedPlayerId,
    secretPlayers: room.secretPlayers,
    scores: room.scores,
    round: room.round,
    correct: reason === 'correct-guess',
    reason,
    gameOver,
    qaLog: room.qaLog,
  });
}

// ── Express ──────────────────────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());

const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));
app.get('/api/meta', (_req, res) => res.json({ TOP_NATIONS, TOP_LEAGUES, playerCount: ALL_PLAYERS.length }));
app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });

// ── Socket events ─────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`[connect]    ${socket.id}`);

  socket.on('create-room', ({ playerName } = {}) => {
    const room = createRoom(socket.id);
    if (playerName) {
      room.players[0].playerName = playerName;
      room.settings.playerNames[0] = playerName;
    }
    socket.join(room.code);
    socket.emit('room-created', { code: room.code, playerName: room.players[0].playerName });
  });

  socket.on('join-room', ({ code, playerName } = {}) => {
    const norm = (code || '').trim().toUpperCase();
    const room = rooms.get(norm);
    if (!room) return socket.emit('join-error', { message: `Room "${norm}" not found.` });
    if (room.players.length >= 2) return socket.emit('join-error', { message: `Room "${norm}" is full.` });

    const pName = playerName || 'Player 2';
    room.players.push({ socketId: socket.id, playerName: pName });
    room.settings.playerNames[1] = pName;
    socket.join(room.code);

    socket.emit('room-joined', { code: room.code, playerName: pName, myIndex: 1 });
    io.to(room.code).emit('player-connected', {
      code: room.code,
      players: room.players.map(p => p.playerName),
      settings: room.settings,
    });
  });

  socket.on('update-settings', ({ code, settings }) => {
    const room = rooms.get(code);
    if (!room) return;
    if (room.players[0]?.socketId !== socket.id) return; // host only

    const pool = buildPool(settings);
    if (pool.length < 20) {
      return socket.emit('settings-error', {
        message: `Only ${pool.length} players match that filter. Need at least 20.`,
      });
    }
    room.settings = { ...room.settings, ...settings };
    room.players.forEach((p, i) => {
      if (settings.playerNames?.[i]) p.playerName = settings.playerNames[i];
    });
    io.to(room.code).emit('settings-updated', { settings: room.settings });
  });

  socket.on('update-names', ({ code, playerNames }) => {
    const room = rooms.get(code);
    if (!room || !Array.isArray(playerNames)) return;
    playerNames.forEach((n, i) => {
      if (n && room.players[i]) {
        room.players[i].playerName = n;
        room.settings.playerNames[i] = n;
      }
    });
    io.to(room.code).emit('names-updated', { playerNames: room.settings.playerNames });
  });

  socket.on('update-rules', ({ code, rules }) => {
    const room = rooms.get(code);
    if (!room) return;
    const allowed = ['pointsPerGuess', 'winCondition', 'winTarget', 'wrongGuessPenalty', 'questionLimit', 'guessAttempts', 'turnTimer'];
    for (const key of allowed) {
      if (rules[key] !== undefined) room.settings[key] = rules[key];
    }
    io.to(room.code).emit('rules-updated', { settings: room.settings });
  });

  socket.on('start-game', ({ code }) => {
    const room = rooms.get(code);
    if (!room || room.players.length < 2) return;
    if (room.phase !== 'lobby') return;
    if (room.players[0]?.socketId !== socket.id) return;

    const pool = buildPool(room.settings);
    if (pool.length < 20) {
      return socket.emit('settings-error', { message: `Pool too small (${pool.length}). Adjust filters.` });
    }
    room.round = 1;
    room.scores = [0, 0];
    room.roundHistory = [];
    room.currentTurn = 0;
    room.lastLoserIndex = null;
    console.log(`[start-game] ${code}  round=1`);
    startRound(room, io);
  });

  socket.on('ask-question', ({ code, question }) => {
    const room = rooms.get(code);
    if (!room || room.phase !== 'playing' || !question?.trim()) return;
    const idx = room.players.findIndex(p => p.socketId === socket.id);
    if (idx === -1 || idx !== room.currentTurn || room.pendingQuestion) return;

    const limit = room.settings.questionLimit;
    if (limit !== null && room.questionCounts[idx] >= limit) {
      return socket.emit('action-error', { message: `Question limit reached (${limit}). You must guess!` });
    }

    room.pendingQuestion = { question: question.trim(), askerIndex: idx };
    room.questionCounts[idx]++;
    io.to(room.code).emit('question-asked', {
      question: question.trim(),
      askerIndex: idx,
      questionCounts: room.questionCounts,
      questionLimit: room.settings.questionLimit,
    });
  });

  socket.on('answer-question', ({ code, answer }) => {
    const room = rooms.get(code);
    if (!room || room.phase !== 'playing' || !room.pendingQuestion) return;
    const idx = room.players.findIndex(p => p.socketId === socket.id);
    if (idx === -1 || room.pendingQuestion.askerIndex === idx) return;

    const { question, askerIndex } = room.pendingQuestion;
    room.qaLog.push({ question, answer: !!answer, askerIndex });
    room.pendingQuestion = null;
    room.currentTurn = idx;

    io.to(room.code).emit('question-answered', {
      question,
      answer: !!answer,
      askerIndex,
      currentTurn: room.currentTurn,
      qaLog: room.qaLog,
    });
  });

  socket.on('submit-guess', ({ code, playerId }) => {
    const room = rooms.get(code);
    if (!room || room.phase !== 'playing') return;
    const guesserIdx = room.players.findIndex(p => p.socketId === socket.id);
    if (guesserIdx === -1 || guesserIdx !== room.currentTurn) return;

    const opponentIdx = 1 - guesserIdx;
    const correct = room.secretPlayers[opponentIdx]?.id === playerId;

    if (correct) {
      endRound(room, io, guesserIdx, 'correct-guess', guesserIdx, playerId);
    } else {
      // Consume an attempt
      room.guessAttemptsLeft[guesserIdx] = Math.max(0, (room.guessAttemptsLeft[guesserIdx] ?? 1) - 1);
      const attemptsLeft = room.guessAttemptsLeft[guesserIdx];

      if (attemptsLeft <= 0) {
        // Out of attempts → opponent wins the round
        if (room.settings.wrongGuessPenalty) {
          room.scores[guesserIdx] = Math.max(0, room.scores[guesserIdx] - 1);
        }
        endRound(room, io, opponentIdx, 'guess-exhausted', guesserIdx, playerId);
      } else {
        // Still has attempts — broadcast wrong guess, turn stays with same player
        io.to(room.code).emit('wrong-guess', {
          guesserIndex: guesserIdx,
          guessedPlayerId: playerId,
          attemptsLeft,
          currentTurn: guesserIdx,
        });
      }
    }
    console.log(`[guess] ${code} P${guesserIdx + 1} ${correct ? 'correct' : 'wrong'} attempts=[${room.guessAttemptsLeft}]`);
  });

  socket.on('forfeit-round', ({ code }) => {
    const room = rooms.get(code);
    if (!room || room.phase !== 'playing') return;
    const idx = room.players.findIndex(p => p.socketId === socket.id);
    if (idx === -1) return;
    console.log(`[forfeit] ${code} P${idx + 1}`);
    endRound(room, io, 1 - idx, 'forfeit', idx, null);
  });

  socket.on('end-game-early', ({ code }) => {
    const room = rooms.get(code);
    if (!room || room.phase === 'lobby' || room.phase === 'ended') return;
    if (room.players[0]?.socketId !== socket.id) return;

    room.phase = 'ended';
    room.pendingGameEnd = null;
    const w = room.scores[0] > room.scores[1] ? 0 : room.scores[1] > room.scores[0] ? 1 : null;
    io.to(room.code).emit('game-ended', {
      winnerIndex: w,
      scores: room.scores,
      roundHistory: room.roundHistory,
      settings: room.settings,
      isDraw: w === null,
      early: true,
    });
    console.log(`[end-early] ${code}`);
  });

  socket.on('start-next-round', ({ code }) => {
    const room = rooms.get(code);
    if (!room || room.phase !== 'round-over' || room.players.length < 2) return;

    const idx = room.players.findIndex(p => p.socketId === socket.id);
    if (idx !== -1) room.nextRoundReady[idx] = true;

    io.to(room.code).emit('next-round-ready-status', { readyStatus: room.nextRoundReady });

    const isHost = idx === 0;
    const bothReady = room.nextRoundReady[0] && room.nextRoundReady[1];
    if (bothReady || isHost) {
      // If the game is already over, fire game-ended instead of starting a new round
      if (room.pendingGameEnd) {
        room.phase = 'ended';
        const payload = room.pendingGameEnd;
        room.pendingGameEnd = null;
        console.log(`[game-ended] ${code} winner=${payload.winnerIndex}`);
        io.to(room.code).emit('game-ended', payload);
        return;
      }
      room.round++;
      room.currentTurn = room.lastLoserIndex !== null ? room.lastLoserIndex : 0;
      console.log(`[next-round] ${code} round=${room.round}`);
      startRound(room, io);
    }
  });

  socket.on('play-again', ({ code }) => {
    const room = rooms.get(code);
    if (!room || room.phase !== 'ended') return;
    if (room.players[0]?.socketId !== socket.id) return;

    room.phase = 'lobby';
    room.round = 1;
    room.scores = [0, 0];
    room.roundHistory = [];
    room.currentTurn = 0;
    room.lastLoserIndex = null;
    room.pendingGameEnd = null;
    console.log(`[play-again] ${code}`);
    startRound(room, io);
  });

  socket.on('return-to-lobby', ({ code }) => {
    const room = rooms.get(code);
    if (!room) return;
    if (room.players[0]?.socketId !== socket.id) return;

    room.phase = 'lobby';
    room.round = 0;
    room.scores = [0, 0];
    room.roundHistory = [];
    room.pendingGameEnd = null;
    io.to(room.code).emit('returned-to-lobby', { settings: room.settings });
  });

  socket.on('disconnect', () => {
    console.log(`[disconnect] ${socket.id}`);
    const room = findRoomBySocket(socket.id);
    if (!room) return;
    room.players = room.players.filter(p => p.socketId !== socket.id);
    if (room.players.length === 0) rooms.delete(room.code);
    else io.to(room.code).emit('opponent-disconnected');
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`\n⚡  Server on http://localhost:${PORT}\n`));
