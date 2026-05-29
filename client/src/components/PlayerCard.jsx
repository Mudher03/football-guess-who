import React from 'react';

const POS_COLORS = {
  Forward: '#16a34a', Midfielder: '#2563eb', Defender: '#7c3aed', Goalkeeper: '#b45309',
};
const POS_SHORT = { Forward: 'FWD', Midfielder: 'MID', Defender: 'DEF', Goalkeeper: 'GK' };

const FALLBACK_URL = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1e3554&color=7dd3fc&size=80&bold=true`;

export default function PlayerCard({ player, eliminated, onClick, size = 'medium', showClub = true, showNationality = false }) {
  const avatarUrl = player.photo || FALLBACK_URL(player.name);

  return (
    <div
      className={`player-card player-card-${size}${eliminated ? ' eliminated' : ''}`}
      onClick={onClick}
      title={eliminated ? 'Click to restore' : 'Click to eliminate'}
    >
      <div className="card-inner">
        <div className="card-front">
          <div className="card-avatar-wrap">
            <img
              className="player-avatar"
              src={avatarUrl}
              alt={player.name}
              loading="lazy"
              onError={e => { e.currentTarget.src = FALLBACK_URL(player.name); }}
            />
          </div>
          <div className="player-card-name">{player.name}</div>
          {showClub && <div className="player-card-club">{player.club}</div>}
          {showNationality && <div className="player-card-nat">{player.nationality}</div>}
          <div className="player-card-footer">
            <span
              className="pos-badge"
              style={{ background: POS_COLORS[player.position] || '#475569' }}
            >
              {POS_SHORT[player.position] || player.position}
            </span>
          </div>
        </div>
        <div className="card-back">
          <span className="card-back-x">✕</span>
        </div>
      </div>
    </div>
  );
}
