import React, { useEffect } from 'react';
import Confetti from './Confetti';
import { sounds } from '../sounds';

export default function RoundOver({ result, myIndex, playerNames, readyStatus, onNextRound }) {
  const { correct, guesserIndex, secretPlayers, scores, winnerIndex, round, reason, gameOver, qaLog } = result;

  const mySecret = secretPlayers[myIndex];
  const oppSecret = secretPlayers[1 - myIndex];
  const iWon = winnerIndex === myIndex;

  const myName = playerNames[myIndex] || `Player ${myIndex + 1}`;
  const oppName = playerNames[1 - myIndex] || `Player ${2 - myIndex}`;

  const myReady = readyStatus?.[myIndex] ?? false;
  const oppReady = readyStatus?.[1 - myIndex] ?? false;

  useEffect(() => {
    if (iWon) sounds.roundWin();
    else sounds.roundLose();
  }, []);

  function outcomeMsg() {
    if (reason === 'forfeit') {
      return guesserIndex === myIndex
        ? `You forfeited the round.`
        : `${oppName} forfeited the round.`;
    }
    if (reason === 'guess-exhausted') {
      return guesserIndex === myIndex
        ? `You used all your guesses! Their player was ${oppSecret.name}.`
        : `${oppName} used all their guesses — your player was ${mySecret.name}!`;
    }
    if (guesserIndex === myIndex) {
      return correct
        ? `You correctly guessed ${oppSecret.name}! 🎉`
        : `You guessed wrong — their player was ${oppSecret.name}.`;
    }
    return correct
      ? `${oppName} correctly guessed ${mySecret.name}!`
      : `${oppName} guessed wrong — your player was ${mySecret.name}.`;
  }

  return (
    <div className="page center">
      <Confetti active={iWon} />
      <div className="card round-over-card">
        <div className={`status-icon${iWon ? ' success' : ''}`}>
          {iWon ? '🏆' : '😔'}
        </div>
        <h2>{iWon ? 'You Won the Round!' : 'You Lost the Round'}</h2>
        <p className="muted">{outcomeMsg()}</p>

        {/* Reveal both secret players */}
        <div className="reveal-section">
          <div className="reveal-player">
            <img
              className="reveal-avatar"
              src={mySecret.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(mySecret.name)}&background=1e3554&color=7dd3fc&size=72&bold=true`}
              alt={mySecret.name}
            />
            <div className="reveal-label">Your Secret Player</div>
            <div className="reveal-name">{mySecret.name}</div>
            <div className="reveal-sub">{mySecret.club} · {mySecret.position}</div>
          </div>
          <div className="reveal-divider">vs</div>
          <div className="reveal-player">
            <img
              className="reveal-avatar"
              src={oppSecret.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(oppSecret.name)}&background=1e3554&color=7dd3fc&size=72&bold=true`}
              alt={oppSecret.name}
            />
            <div className="reveal-label">Opponent's Player</div>
            <div className="reveal-name">{oppSecret.name}</div>
            <div className="reveal-sub">{oppSecret.club} · {oppSecret.position}</div>
          </div>
        </div>

        {/* Score banner */}
        <div className="round-score-banner">
          <div className={`rsc-entry${winnerIndex === 0 ? ' rsc-winner' : ''}`}>
            <span className="rsc-name">{playerNames[0] || 'Player 1'}</span>
            <span className="rsc-score">{scores[0]}</span>
          </div>
          <div className="rsc-sep">–</div>
          <div className={`rsc-entry${winnerIndex === 1 ? ' rsc-winner' : ''}`}>
            <span className="rsc-name">{playerNames[1] || 'Player 2'}</span>
            <span className="rsc-score">{scores[1]}</span>
          </div>
        </div>

        <p className="muted" style={{ fontSize: 12, marginBottom: 8 }}>
          Round {round} complete
        </p>

        {/* Q&A log */}
        {qaLog && qaLog.length > 0 && (
          <div className="round-qa-log">
            <div className="rh-header">📜 Round Questions</div>
            <div className="qa-log" style={{ maxHeight: 160 }}>
              {qaLog.map((entry, i) => {
                const byMe = entry.askerIndex === myIndex;
                return (
                  <div key={i} className={`qa-entry${entry.answer ? ' qa-yes' : ' qa-no'}`}>
                    <div className="qa-who">{byMe ? 'You' : (playerNames[1 - myIndex] || 'Opp')}</div>
                    <div className="qa-q">{entry.question}</div>
                    <div className={`qa-ans${entry.answer ? ' ans-yes' : ' ans-no'}`}>
                      {entry.answer ? 'YES ✓' : 'NO ✗'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Ready status */}
        <div className="ready-status">
          <span className={`ready-dot${myReady ? ' ready' : ''}`} />
          <span>{myReady ? `${myName} is ready` : `${myName} — not ready`}</span>
          <span className={`ready-dot${oppReady ? ' ready' : ''}`} style={{ marginLeft: 12 }} />
          <span>{oppReady ? `${oppName} is ready` : `${oppName} — waiting`}</span>
        </div>

        <button
          className={`btn btn-primary${myReady ? ' btn-pulse' : ''}`}
          onClick={onNextRound}
          disabled={myReady}
        >
          {myReady
            ? '⏳ Waiting for opponent…'
            : gameOver
            ? '🏁 View Final Results →'
            : '▶ Start Next Round'}
        </button>
      </div>
    </div>
  );
}
