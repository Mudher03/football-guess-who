import React, { useState, useEffect, useRef } from 'react';
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

export default function GameBoard({
  gameState, myIndex, eliminated, playerNames,
  cardSize, showClub, showNationality, soundOn, darkMode,
  isHost, actionError,
  onToggleEliminated, onAskQuestion, onAnswerQuestion, onGuess,
  onNamesChange, onRulesChange, onCardSize, onShowClub, onShowNationality, onSound, onDarkMode,
  onForfeit, onEndGame,
}) {
  const { secretPlayer, pool, round, scores, currentTurn, qaLog, pendingQuestion, questionCounts, questionLimit, guessAttemptsLeft, settings } = gameState;
  const myAttempts = guessAttemptsLeft?.[myIndex] ?? settings?.guessAttempts ?? 3;
  const maxAttempts = settings?.guessAttempts ?? 3;

  const [question, setQuestion] = useState('');
  const [showGuessModal, setShowGuessModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const qaEndRef = useRef(null);

  const isMyTurn = currentTurn === myIndex;
  const needToAnswer = pendingQuestion && pendingQuestion.askerIndex !== myIndex;
  const myQCount = questionCounts?.[myIndex] ?? 0;
  const questionsLeft = questionLimit !== null ? Math.max(0, questionLimit - myQCount) : null;
  const mustGuess = questionsLeft !== null && questionsLeft === 0;

  useEffect(() => {
    qaEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [qaLog]);

  function submitQuestion() {
    const q = question.trim();
    if (!q) return;
    sounds.question();
    onAskQuestion(q);
    setQuestion('');
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

  const secretAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(secretPlayer.name)}&background=0d4f1e&color=39ff14&size=64&bold=true`;

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
        {/* ── Board grid ── */}
        <div className="board-area">
          <div className={`player-grid player-grid-${cardSize}`}>
            {pool.map(p => (
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
          {/* Gear icon */}
          <button className="gear-btn" onClick={() => setShowSettings(true)} title="Settings">⚙</button>

          {/* Secret player */}
          <div className="secret-box">
            <div className="secret-label">Your Secret Player</div>
            <img className="secret-avatar" src={secretAvatarUrl} alt={secretPlayer.name} />
            <div className="secret-name">{secretPlayer.name}</div>
            <div className="secret-meta">
              {secretPlayer.club}
              <span className="pos-badge" style={{ background: POS_COLORS[secretPlayer.position] || '#475569' }}>
                {secretPlayer.position?.slice(0,3).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Guess attempts ⚽⚽⚽ */}
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
              ? mustGuess ? '⚡ Question limit reached — GUESS NOW!' : '🟢 Your turn'
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

          {/* Action area */}
          {needToAnswer ? (
            <div className="answer-area">
              <div className="pending-q">"{pendingQuestion.question}"</div>
              <div className="answer-btns">
                <button className="btn btn-yes" onClick={answerYes}>✓ YES</button>
                <button className="btn btn-no"  onClick={answerNo}>✗ NO</button>
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
                      autoFocus
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
