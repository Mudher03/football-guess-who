import React from 'react';

export default function Scoreboard({ scores, round, currentTurn, myIndex, playerNames, settings }) {
  const myName = playerNames?.[myIndex] || `P${myIndex + 1}`;
  const oppName = playerNames?.[1 - myIndex] || `P${2 - myIndex}`;
  const myScore = scores?.[myIndex] ?? 0;
  const oppScore = scores?.[1 - myIndex] ?? 0;
  const isMyTurn = currentTurn === myIndex;

  const winTarget = settings?.winTarget;
  const winCond = settings?.winCondition;

  return (
    <div className="scoreboard">
      <div className={`sb-player${isMyTurn ? ' sb-active' : ''}`}>
        {isMyTurn && <span className="sb-arrow">▶</span>}
        <span className="sb-name">{myName} <span className="sb-you">(you)</span></span>
        <span className="sb-score">{myScore}</span>
        {winCond === 'first-to' && winTarget && (
          <span className="sb-progress">{Array.from({ length: winTarget }, (_, i) => (
            <span key={i} className={`sb-dot${i < myScore ? ' sb-dot-filled' : ''}`} />
          ))}</span>
        )}
      </div>

      <div className="sb-center">
        <span className="sb-round">Round {round}</span>
        {winCond === 'first-to'
          ? <span className="sb-cond">First to {winTarget}</span>
          : <span className="sb-cond">{round}/{winTarget} rounds</span>
        }
      </div>

      <div className={`sb-player sb-player-right${!isMyTurn ? ' sb-active' : ''}`}>
        {!isMyTurn && <span className="sb-arrow">▶</span>}
        <span className="sb-name">{oppName}</span>
        <span className="sb-score">{oppScore}</span>
        {winCond === 'first-to' && winTarget && (
          <span className="sb-progress">{Array.from({ length: winTarget }, (_, i) => (
            <span key={i} className={`sb-dot${i < oppScore ? ' sb-dot-filled' : ''}`} />
          ))}</span>
        )}
      </div>
    </div>
  );
}
