import React, { useState, useEffect, useRef, useCallback } from 'react';
import PlayerCard from './PlayerCard';
import Scoreboard from './Scoreboard';
import GuessModal from './GuessModal';
import SettingsPanel from './SettingsPanel';
import { sounds } from '../sounds';

const QUICK_QUESTIONS = [
  'Is your player a Forward?',
  'Is your player a Midfielder?',
  'Is your player a Defender?',
  'Is your player a Goalkeeper?',
  'Does your player play in the Premier League?',
  'Does your player play in La Liga?',
  'Does your player play in the Bundesliga?',
  'Does your player play in Serie A?',
  'Does your player play in Ligue 1?',
  'Is your player from South America?',
  'Is your player from England?',
  'Is your player from France?',
  'Is your player from Spain?',
  'Is your player from Germany?',
  'Is your player left-footed?',
  'Is your player over 30?',
  'Is your player under 25?',
  'Has your player won the UCL?',
  'Has your player won the World Cup?',
  'Is your player a national team captain?',
];

const POS_COLORS = {
  Forward: '#16a34a', Midfielder: '#2563eb', Defender: '#7c3aed', Goalkeeper: '#b45309',
};

// Maps quick question text → a function that tests a player
const Q_MATCHERS = [
  { q: 'Is your player a Forward?',      test: p => p.position === 'Forward' },
  { q: 'Is your player a Midfielder?',   test: p => p.position === 'Midfielder' },
  { q: 'Is your player a Defender?',     test: p => p.position === 'Defender' },
  { q: 'Is your player a Goalkeeper?',   test: p => p.position === 'Goalkeeper' },
  { q: 'Does your player play in the Premier League?', test: p => p.league === 'Premier League' },
  { q: 'Does your player play in La Liga?',            test: p => p.league === 'La Liga' },
  { q: 'Does your player play in the Bundesliga?',     test: p => p.league === 'Bundesliga' },
  { q: 'Does your player play in Serie A?',            test: p => p.league === 'Serie A' },
  { q: 'Does your player play in Ligue 1?',            test: p => p.league === 'Ligue 1' },
  { q: 'Is your player from South America?', test: p => ['Brazil','Argentina','Uruguay','Colombia','Chile'].includes(p.nationality) },
  { q: 'Is your player from England?',   test: p => p.nationality === 'England' },
  { q: 'Is your player from France?',    test: p => p.nationality === 'France' },
  { q: 'Is your player from Spain?',     test: p => p.nationality === 'Spain' },
  { q: 'Is your player from Germany?',   test: p => p.nationality === 'Germany' },
  { q: 'Is your player left-footed?',    test: p => p.foot === 'left' },
  { q: 'Is your player over 30?',        test: p => p.ageRange === 'over30' },
  { q: 'Is your player under 25?',       test: p => p.ageRange === 'under25' },
  { q: 'Has your player won the UCL?',   test: p => p.hasTrophies?.ucl },
  { q: 'Has your player won the World Cup?', test: p => p.hasTrophies?.worldCup },
  { q: 'Is your player a national team captain?', test: p => p.isCaptain },
];

export default function GameBoard({
  gameState, myIndex, eliminated, playerNames,
  cardSize, showClub, showNationality, soundOn, darkMode,
  isHost, actionError,
  onToggleEliminated, onAskQuestion, onAnswerQuestion, onGuess,
  onNamesChange, onRulesChange, onCardSize, onShowClub, onShowNationality, onSound, onDarkMode,
  onForfeit, onEndGame,
}) {
  const { secretPlayer, pool, round, scores, currentTurn, qaLog, pendingQuestion, questionCounts, questionLimit, guessAttemptsLeft, settings } = gameState;
  const myAttempts  = guessAttemptsLeft?.[myIndex] ?? settings?.guessAttempts ?? 3;
  const maxAttempts = settings?.guessAttempts ?? 3;

  const [question, setQuestion]         = useState('');
  const [showGuessModal, setShowGuessModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [posFilter, setPosFilter]       = useState('ALL');   // board filter
  const [autoElim, setAutoElim]         = useState(null);   // { question, answer, matcher } for auto-eliminate suggestion
  const qaEndRef = useRef(null);

  const isMyTurn    = currentTurn === myIndex;
  const needToAnswer = pendingQuestion && pendingQuestion.askerIndex !== myIndex;
  const myQCount    = questionCounts?.[myIndex] ?? 0;
  const questionsLeft = questionLimit !== null ? Math.max(0, questionLimit - myQCount) : null;
  const mustGuess   = questionsLeft !== null && questionsLeft === 0;

  // Scroll Q&A to bottom
  useEffect(() => {
    qaEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [qaLog]);

  // Keyboard shortcuts: Y = YES, N = NO when answering
  useEffect(() => {
    if (!needToAnswer) return;
    function handler(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'y' || e.key === 'Y') answerYes();
      if (e.key === 'n' || e.key === 'N') answerNo();
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [needToAnswer]); // eslint-disable-line

  // Detect auto-eliminate opportunity after an answer comes in
  useEffect(() => {
    if (!qaLog.length) return;
    const last = qaLog[qaLog.length - 1];
    if (last.askerIndex !== myIndex) return; // only when WE asked
    const matcher = Q_MATCHERS.find(m => m.q === last.question);
    if (!matcher) return;
    // Count how many active cards would be eliminated
    const activeIds = new Set(pool.filter(p => !eliminated.has(p.id)).map(p => p.id));
    const wouldElim = pool.filter(p => activeIds.has(p.id) && (last.answer ? !matcher.test(p) : matcher.test(p)));
    if (wouldElim.length > 0) {
      setAutoElim({ question: last.question, answer: last.answer, ids: wouldElim.map(p => p.id), count: wouldElim.length });
    }
  }, [qaLog]); // eslint-disable-line

  function applyAutoElim() {
    if (!autoElim) return;
    autoElim.ids.forEach(id => {
      if (!eliminated.has(id)) { sounds.eliminate(); onToggleEliminated(id); }
    });
    setAutoElim(null);
  }

  function submitQuestion() {
    const q = question.trim();
    if (!q) return;
    sounds.question();
    onAskQuestion(q);
    setQuestion('');
    setAutoElim(null);
  }

  function answerYes() { sounds.answer(); onAnswerQuestion(true); }
  function answerNo()  { sounds.answer(); onAnswerQuestion(false); }

  function handleGuessConfirm(id) {
    sounds.guess();
    onGuess(id);
    setShowGuessModal(false);
  }

  function handleEliminate(id) {
    sounds.eliminate();
    onToggleEliminated(id);
  }

  const secretAvatarUrl = secretPlayer.photo
    || `https://ui-avatars.com/api/?name=${encodeURIComponent(secretPlayer.name)}&background=0d4f1e&color=39ff14&size=64&bold=true`;

  // Board grid filter
  const POS_FILTERS = ['ALL', 'GK', 'DEF', 'MID', 'FWD'];
  const POS_MAP = { GK: 'Goalkeeper', DEF: 'Defender', MID: 'Midfielder', FWD: 'Forward' };
  const filteredPool = posFilter === 'ALL'
    ? pool
    : pool.filter(p => p.position === POS_MAP[posFilter]);

  return (
    <div className="game-page">
      {showGuessModal && (
        <GuessModal
          pool={pool}
          eliminated={eliminated}
          attemptsLeft={myAttempts}
          maxAttempts={maxAttempts}
          onConfirm={handleGuessConfirm}
          onCancel={() => setShowGuessModal(false)}
        />
      )}

      {actionError && (
        <div className="action-toast">{actionError}</div>
      )}

      {showSettings && (
        <SettingsPanel
          settings={settings || {}}
          playerNames={playerNames}
          isHost={isHost}
          cardSize={cardSize}
          showClub={showClub}
          showNationality={showNationality}
          soundOn={soundOn}
          darkMode={darkMode}
          onClose={() => setShowSettings(false)}
          onNamesChange={onNamesChange}
          onRulesChange={onRulesChange}
          onCardSize={onCardSize}
          onShowClub={onShowClub}
          onShowNationality={onShowNationality}
          onSound={onSound}
          onDarkMode={onDarkMode}
          onForfeit={onForfeit}
          onEndGame={onEndGame}
        />
      )}

      <Scoreboard
        scores={scores}
        round={round}
        currentTurn={currentTurn}
        myIndex={myIndex}
        playerNames={playerNames}
        settings={settings}
      />

      <div className="game-body">
        {/* ── Board ── */}
        <div className="board-area">
          {/* Position filter bar */}
          <div className="board-filter-bar">
            {POS_FILTERS.map(f => (
              <button
                key={f}
                className={`board-filter-btn${posFilter === f ? ' active' : ''}`}
                onClick={() => setPosFilter(f)}
              >
                {f === 'ALL' ? `All (${pool.length})` : `${f} (${pool.filter(p => p.position === POS_MAP[f]).length})`}
              </button>
            ))}
          </div>

          <div className={`player-grid player-grid-${cardSize}`}>
            {filteredPool.map(p => (
              <PlayerCard
                key={p.id}
                player={p}
                eliminated={eliminated.has(p.id)}
                onClick={() => handleEliminate(p.id)}
                size={cardSize}
                showClub={showClub}
                showNationality={showNationality}
              />
            ))}
          </div>
        </div>

        {/* ── Side panel ── */}
        <div className="side-panel">
          <button className="gear-btn" onClick={() => setShowSettings(true)} title="Settings">⚙</button>

          {/* Secret player */}
          <div className="secret-box">
            <div className="secret-label">Your Secret Player</div>
            <img
              className="secret-avatar"
              src={secretAvatarUrl}
              alt={secretPlayer.name}
              onError={e => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(secretPlayer.name)}&background=0d4f1e&color=39ff14&size=64&bold=true`; }}
            />
            <div className="secret-name">{secretPlayer.name}</div>
            <div className="secret-meta">
              {secretPlayer.club}
              <span className="pos-badge" style={{ background: POS_COLORS[secretPlayer.position] || '#475569' }}>
                {secretPlayer.position?.slice(0,3).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Guess attempts */}
          <div className="attempts-row">
            <span className="attempts-label">Guesses:</span>
            {Array.from({ length: maxAttempts }, (_, i) => (
              <span key={i} className={`attempt-ball${i < myAttempts ? '' : ' attempt-used'}`}>⚽</span>
            ))}
          </div>

          {/* Turn status */}
          <div className={`turn-status${isMyTurn ? ' my-turn' : ' opp-turn'}`}>
            {needToAnswer
              ? '📣 Answer the question!'
              : isMyTurn
              ? mustGuess ? '⚡ Question limit — GUESS NOW!' : '🟢 Your turn'
              : '⏳ Opponent is thinking…'}
          </div>

          {/* Question limit badge */}
          {isMyTurn && !needToAnswer && questionsLeft !== null && (
            <div className={`q-limit-badge${mustGuess ? ' must-guess' : ''}`}>
              {mustGuess ? '0 questions left — must guess!' : `${questionsLeft} question${questionsLeft !== 1 ? 's' : ''} left`}
            </div>
          )}

          {/* Q&A log */}
          <div className="qa-log">
            {qaLog.length === 0 && <p className="qa-empty">No questions yet.</p>}
            {qaLog.map((entry, i) => {
              const byMe = entry.askerIndex === myIndex;
              return (
                <div key={i} className={`qa-entry${entry.answer ? ' qa-yes' : ' qa-no'}`}>
                  <div className="qa-who">{byMe ? 'You' : 'Opp'}</div>
                  <div className="qa-q">{entry.question}</div>
                  <div className={`qa-ans${entry.answer ? ' ans-yes' : ' ans-no'}`}>
                    {entry.answer ? 'YES ✓' : 'NO ✗'}
                  </div>
                </div>
              );
            })}
            <div ref={qaEndRef} />
          </div>

          {/* Auto-eliminate suggestion */}
          {autoElim && (
            <div className="auto-elim-banner">
              <span className="auto-elim-text">
                Eliminate {autoElim.count} player{autoElim.count !== 1 ? 's' : ''}?
                <span className="auto-elim-hint">
                  ({autoElim.answer ? 'not matching' : 'matching'} your question)
                </span>
              </span>
              <div className="auto-elim-btns">
                <button className="btn btn-sm auto-elim-yes" onClick={applyAutoElim}>✓ Yes</button>
                <button className="btn btn-sm btn-secondary" onClick={() => setAutoElim(null)}>Skip</button>
              </div>
            </div>
          )}

          {/* Action area */}
          {needToAnswer ? (
            <div className="answer-area">
              <div className="pending-q">"{pendingQuestion.question}"</div>
              <div className="answer-btns">
                <button className="btn btn-yes" onClick={answerYes}>✓ YES <kbd>Y</kbd></button>
                <button className="btn btn-no"  onClick={answerNo}>✗ NO <kbd>N</kbd></button>
              </div>
            </div>
          ) : isMyTurn ? (
            <div className="ask-area">
              {!mustGuess && (
                <>
                  <div className="quick-questions">
                    {QUICK_QUESTIONS.map(q => (
                      <button key={q} className="quick-q-chip" onClick={() => setQuestion(q)}>
                        {q}
                      </button>
                    ))}
                  </div>
                  <div className="ask-row">
                    <input
                      className="question-input"
                      placeholder="Ask a yes/no question…"
                      value={question}
                      onChange={e => setQuestion(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') submitQuestion(); }}
                    />
                    <button
                      className="btn btn-secondary ask-btn"
                      disabled={!question.trim()}
                      onClick={submitQuestion}
                    >
                      Ask
                    </button>
                  </div>
                </>
              )}
              <button
                className="btn btn-guess"
                onClick={() => { sounds.click(); setShowGuessModal(true); }}
              >
                🎯 Guess Their Player!
              </button>
            </div>
          ) : (
            <div className="waiting-area">
              <div className="spinner" />
              <p className="muted">Waiting for opponent…</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
