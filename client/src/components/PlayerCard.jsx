import React from 'react';

const POS_COLORS = {
  Forward: '#16a34a', Midfielder: '#2563eb', Defender: '#7c3aed', Goalkeeper: '#b45309',
};
const POS_SHORT = { Forward: 'FWD', Midfielder: 'MID', Defender: 'DEF', Goalkeeper: 'GK' };

const NAT_FLAGS = {
  'Brazil':'🇧🇷','France':'🇫🇷','England':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','Spain':'🇪🇸','Germany':'🇩🇪',
  'Argentina':'🇦🇷','Portugal':'🇵🇹','Italy':'🇮🇹','Netherlands':'🇳🇱','Belgium':'🇧🇪',
  'Morocco':'🇲🇦','Senegal':'🇸🇳','Nigeria':'🇳🇬','Ghana':'🇬🇭','Ivory Coast':'🇨🇮',
  'Cameroon':'🇨🇲','Egypt':'🇪🇬','Algeria':'🇩🇿','Gabon':'🇬🇦','Tunisia':'🇹🇳',
  'Croatia':'🇭🇷','Serbia':'🇷🇸','Poland':'🇵🇱','Norway':'🇳🇴','Sweden':'🇸🇪',
  'Denmark':'🇩🇰','Switzerland':'🇨🇭','Austria':'🇦🇹','Russia':'🇷🇺','Slovakia':'🇸🇰',
  'Slovenia':'🇸🇮','Hungary':'🇭🇺','Turkey':'🇹🇷','Ukraine':'🇺🇦','Georgia':'🇬🇪',
  'Colombia':'🇨🇴','Uruguay':'🇺🇾','Chile':'🇨🇱','Mexico':'🇲🇽','United States':'🇺🇸',
  'Canada':'🇨🇦','Jamaica':'🇯🇲',
  'South Korea':'🇰🇷','Japan':'🇯🇵','Australia':'🇦🇺','Iran':'🇮🇷',
};

const FALLBACK_URL = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1e3554&color=7dd3fc&size=80&bold=true`;

export default function PlayerCard({ player, eliminated, onClick, size = 'medium', showClub = true, showNationality = false }) {
  const avatarUrl = player.photo || FALLBACK_URL(player.name);
  const flag = NAT_FLAGS[player.nationality] || '';

  return (
    <div
      className={`player-card player-card-${size}${eliminated ? ' eliminated' : ''}`}
      onClick={onClick}
      title={`${player.name}${eliminated ? ' — click to restore' : ' — click to eliminate'}`}
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
          {showNationality
            ? <div className="player-card-nat">{flag} {player.nationality}</div>
            : flag && size !== 'small' && <div className="player-card-flag">{flag}</div>
          }
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
