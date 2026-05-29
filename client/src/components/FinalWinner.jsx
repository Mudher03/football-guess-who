import React, { useEffect } from 'react';
import Confetti from './Confetti';
import { sounds } from '../sounds';

export default function FinalWinner({ result, myIndex, playerNames, onPlayAgain, onBackToLobby }) {
  const { winnerIndex, scores, roundHistory, isDraw, early } = result;

  const myName = playerNames[myIndex] || `Player ${myIndex + 1}`;
  const oppName = playerNames[1 - myIndex] || `Player ${2 - myIndex}`;

  const iWon = !isDraw && winnerIndex === myIndex;
  const oppWon = !isDraw && winnerIndex !== null && winnerIndex !== myIndex;

  useEffect(() => {
    if (iWon) sounds.win();
    else if (oppWon) sounds.lose();
  }, []);

  function winnerName() {
    if (isDraw) return null;
    return winnerIndex === myIndex ? myName : oppName;
  }

  return (
    <div className="page center">
      <Confetti active={iWon} />
      <div className="card final-card">
        <div className={`final-icon${iWon ? ' win' : isDraw ? ' draw' : ' lose'}`}>
          {iWon ? '🏆' : isDraw ? '🤝' : '😔'}
        </div>

        <h1 className="final-title">
          {iWon ? 'You Win!' : isDraw ? "It's a Draw!" : `${winnerName()} Wins!`}
        </h1>

        {early && <p className="final-sub muted">Game ended early</p>}

        {/* Score banner */}
        <div className="final-scores">
          <div className={`fs-col${myIndex === 0 ? (iWon || (!isDraw && winnerIndex === 0) ? ' winner' : '') : ''}`}>
            <div className="fs-name">{playerNames[0] || 'Player 1'}</div>
            <div className="fs-score">{scores[0]}</div>
          </div>
          <div className="fs-sep">vs</div>
          <div className={`fs-col${myIndex === 1 ? (iWon || (!isDraw && winnerIndex === 1) ? ' winner' : '') : ''}`}>
            <div className="fs-name">{playerNames[1] || 'Player 2'}</div>
            <div className="fs-score">{scores[1]}</div>
          </div>
        </div>

        {/* Round breakdown */}
        {roundHistory?.length > 0 && (
          <div className="round-history">
            <div className="rh-header">Round Breakdown</div>
            <div className="rh-list">
              {roundHistory.map((r, i) => {
                const roundWinnerName = r.winnerIndex === myIndex
                  ? myName
                  : (playerNames[1 - myIndex] || `Player ${2 - myIndex}`);
                return (
                  <div key={i} className={`rh-row${r.winnerIndex === myIndex ? ' rh-me' : ' rh-opp'}`}>
                    <span className="rh-round">Round {r.round}</span>
                    <span className="rh-winner">
                      {r.reason === 'forfeit' ? '🏳 Forfeit' : r.reason === 'correct-guess' ? '✓ Correct' : r.reason === 'guess-exhausted' ? '💀 No guesses left' : '✗ Wrong'}
                      {' '}{roundWinnerName}
                    </span>
                    <span className="rh-score">{r.scores[0]} – {r.scores[1]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="final-actions">
          <button className="btn btn-primary" onClick={onPlayAgain}>
            🔄 Play Again (same settings)
          </button>
          <button className="btn btn-secondary" onClick={onBackToLobby}>
            🏠 Back to Lobby
          </button>
        </div>
      </div>
    </div>
  );
}
