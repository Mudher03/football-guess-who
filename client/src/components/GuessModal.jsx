import React, { useState, useMemo } from 'react';

const POS_COLORS = {
  Forward: '#16a34a', Midfielder: '#2563eb', Defender: '#7c3aed', Goalkeeper: '#b45309',
};

export default function GuessModal({ pool, eliminated, attemptsLeft = 3, maxAttempts = 3, onConfirm, onCancel }) {
  const [selected, setSelected]   = useState(null);
  const [filter, setFilter]       = useState('active'); // 'active' | 'all'
  const [search, setSearch]       = useState('');

  const base = filter === 'active' ? pool.filter(p => !eliminated.has(p.id)) : pool;

  const displayed = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return base;
    return base.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.club.toLowerCase().includes(q) ||
      p.nationality?.toLowerCase().includes(q)
    );
  }, [base, search]);

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="modal guess-modal">
        <div className="modal-header">
          <button className="close-btn" style={{ float: 'none', marginLeft: 'auto', display: 'block' }} onClick={onCancel}>✕</button>
          <h2>🎯 Guess Their Player!</h2>
          <div className="guess-attempts">
            {Array.from({ length: maxAttempts }, (_, i) => (
              <span key={i} className={`attempt-ball${i < attemptsLeft ? '' : ' attempt-used'}`}>⚽</span>
            ))}
            <span className="guess-attempts-text">{attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} left</span>
          </div>

          {/* Filters row */}
          <div className="guess-filter">
            <button className={`pill-btn${filter === 'active' ? ' active' : ''}`} onClick={() => setFilter('active')}>
              Active ({pool.filter(p => !eliminated.has(p.id)).length})
            </button>
            <button className={`pill-btn${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>
              All ({pool.length})
            </button>
          </div>

          {/* Search input */}
          <input
            className="guess-search"
            type="text"
            placeholder="Search by name, club or nationality…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        <div className="guess-grid">
          {displayed.map(p => {
            const isElim = eliminated.has(p.id);
            const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=1e3a5f&color=7dd3fc&size=48&bold=true`;
            return (
              <div
                key={p.id}
                className={`guess-card${selected?.id === p.id ? ' selected' : ''}${isElim ? ' guess-elim' : ''}`}
                onClick={() => setSelected(p)}
              >
                <img
                  className="guess-avatar"
                  src={p.photo || fallback}
                  alt={p.name}
                  loading="lazy"
                  onError={e => { e.currentTarget.src = fallback; }}
                />
                <div className="guess-card-name">{p.name}</div>
                <div className="guess-card-meta">{p.club}</div>
                <span className="guess-card-pos" style={{ background: POS_COLORS[p.position] || '#475569' }}>
                  {p.position?.slice(0, 3).toUpperCase()}
                </span>
              </div>
            );
          })}
          {displayed.length === 0 && (
            <p className="muted" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem' }}>
              {search ? `No players match "${search}"` : 'All players eliminated! Switch to "All" to see everyone.'}
            </p>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button
            className="btn btn-guess"
            disabled={!selected}
            onClick={() => selected && onConfirm(selected.id)}
          >
            {selected ? `Confirm: ${selected.name}` : 'Select a player first'}
          </button>
        </div>
      </div>
    </div>
  );
}
