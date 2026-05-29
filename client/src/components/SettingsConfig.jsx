import React, { useState, useEffect, useMemo } from 'react';
import { ALL_PLAYERS_META } from '../playersData';

const TOP_NATIONS = ['Brazil','France','England','Spain','Germany','Argentina','Portugal','Italy','Netherlands','Belgium'];
const TOP_LEAGUES = ['Premier League','La Liga','Bundesliga','Serie A','Ligue 1'];
const NATION_FLAGS = {
  Brazil:'🇧🇷', France:'🇫🇷', England:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', Spain:'🇪🇸', Germany:'🇩🇪',
  Argentina:'🇦🇷', Portugal:'🇵🇹', Italy:'🇮🇹', Netherlands:'🇳🇱', Belgium:'🇧🇪',
};
const LEAGUE_FLAGS = {
  'Premier League':'🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'La Liga':'🇪🇸', 'Bundesliga':'🇩🇪', 'Serie A':'🇮🇹', 'Ligue 1':'🇫🇷',
};

function calcPoolSize(selectedNations, selectedLeagues) {
  if (!selectedNations.length && !selectedLeagues.length) return ALL_PLAYERS_META.length;
  return ALL_PLAYERS_META.filter(p => {
    const nationOk = selectedNations.length ? selectedNations.includes(p.nationality) : false;
    const leagueOk = selectedLeagues.length ? selectedLeagues.includes(p.league) : false;
    return nationOk || leagueOk;
  }).length;
}

export default function SettingsConfig({ settings, onUpdate, onStart, isHost, error, playerNames }) {
  const [local, setLocal] = useState(() => ({
    selectedNations: settings.selectedNations || [],
    selectedLeagues: settings.selectedLeagues || [],
    pointsPerGuess: settings.pointsPerGuess || 1,
    winCondition: settings.winCondition || 'first-to',
    winTarget: settings.winTarget || 3,
    wrongGuessPenalty: settings.wrongGuessPenalty || false,
    questionLimit: settings.questionLimit ?? null,
    guessAttempts: settings.guessAttempts ?? 3,
    playerNames: settings.playerNames || ['Player 1', 'Player 2'],
  }));

  const poolSize = useMemo(
    () => calcPoolSize(local.selectedNations, local.selectedLeagues),
    [local.selectedNations, local.selectedLeagues]
  );
  const poolTooSmall = poolSize < 20;

  useEffect(() => {
    setLocal(s => ({
      ...s,
      ...settings,
      guessAttempts: settings.guessAttempts ?? s.guessAttempts ?? 3,
    }));
  }, [settings]);

  function toggleNation(n) {
    const next = local.selectedNations.includes(n)
      ? local.selectedNations.filter(x => x !== n)
      : [...local.selectedNations, n];
    apply({ selectedNations: next });
  }

  function toggleLeague(l) {
    const next = local.selectedLeagues.includes(l)
      ? local.selectedLeagues.filter(x => x !== l)
      : [...local.selectedLeagues, l];
    apply({ selectedLeagues: next });
  }

  function apply(patch) {
    const next = { ...local, ...patch };
    setLocal(next);
    if (isHost) onUpdate(next);
  }

  const qlOptions = [null, 3, 5, 7, 10];

  return (
    <div className="settings-config">
      <h2 className="settings-title">⚙ Game Settings</h2>
      <p className="settings-sub">{isHost ? 'Configure then start the game.' : 'Waiting for host to configure…'}</p>

      {/* Player names */}
      <div className="settings-section">
        <div className="section-label">Player Names</div>
        <div className="names-row">
          {[0, 1].map(i => (
            <input
              key={i}
              className="name-input"
              value={local.playerNames?.[i] || `Player ${i + 1}`}
              maxLength={20}
              placeholder={`Player ${i + 1}`}
              disabled={!isHost}
              onChange={e => {
                const names = [...(local.playerNames || ['Player 1', 'Player 2'])];
                names[i] = e.target.value;
                apply({ playerNames: names });
              }}
            />
          ))}
        </div>
      </div>

      {/* Nation filter */}
      <div className="settings-section">
        <div className="section-label">Nations <span className="section-hint">(leave blank = all)</span></div>
        <div className="chip-grid">
          {TOP_NATIONS.map(n => (
            <button
              key={n}
              className={`chip${local.selectedNations.includes(n) ? ' chip-on' : ''}`}
              onClick={() => isHost && toggleNation(n)}
              disabled={!isHost}
            >
              {NATION_FLAGS[n]} {n}
            </button>
          ))}
        </div>
      </div>

      {/* League filter */}
      <div className="settings-section">
        <div className="section-label">Leagues <span className="section-hint">(leave blank = all)</span></div>
        <div className="chip-grid">
          {TOP_LEAGUES.map(l => (
            <button
              key={l}
              className={`chip${local.selectedLeagues.includes(l) ? ' chip-on' : ''}`}
              onClick={() => isHost && toggleLeague(l)}
              disabled={!isHost}
            >
              {LEAGUE_FLAGS[l]} {l}
            </button>
          ))}
        </div>
      </div>

      {/* Pool size */}
      <div className="settings-section">
        <div className={`pool-size-display${poolTooSmall ? ' pool-warn' : ''}`}>
          <span className="pool-count">{poolSize}</span>
          <span className="pool-label">players in pool</span>
          {poolTooSmall && <span className="pool-warning">⚠ Need at least 20</span>}
        </div>
      </div>

      {/* Win condition */}
      <div className="settings-section">
        <div className="section-label">Win Condition</div>
        <div className="radio-group">
          <label className={`radio-opt${local.winCondition === 'first-to' ? ' selected' : ''}`}>
            <input type="radio" name="winCond" value="first-to"
              checked={local.winCondition === 'first-to'}
              onChange={() => isHost && apply({ winCondition: 'first-to' })}
              disabled={!isHost}
            />
            First to&nbsp;
            <select
              value={local.winTarget}
              disabled={!isHost}
              onChange={e => apply({ winTarget: Number(e.target.value) })}
              className="inline-select"
            >
              {[3, 5, 7, 10].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            &nbsp;wins
          </label>
          <label className={`radio-opt${local.winCondition === 'play-rounds' ? ' selected' : ''}`}>
            <input type="radio" name="winCond" value="play-rounds"
              checked={local.winCondition === 'play-rounds'}
              onChange={() => isHost && apply({ winCondition: 'play-rounds' })}
              disabled={!isHost}
            />
            Play&nbsp;
            <select
              value={local.winTarget}
              disabled={!isHost}
              onChange={e => apply({ winTarget: Number(e.target.value) })}
              className="inline-select"
            >
              {[3, 5, 7, 10].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            &nbsp;rounds
          </label>
        </div>
      </div>

      {/* Points per guess */}
      <div className="settings-section">
        <div className="section-label">Points per correct guess</div>
        <div className="btn-group">
          {[1, 2, 3].map(v => (
            <button key={v}
              className={`pill-btn${local.pointsPerGuess === v ? ' active' : ''}`}
              onClick={() => isHost && apply({ pointsPerGuess: v })}
              disabled={!isHost}
            >
              {v} pt{v > 1 ? 's' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Question limit */}
      <div className="settings-section">
        <div className="section-label">Questions per turn</div>
        <div className="btn-group">
          {qlOptions.map(v => (
            <button key={String(v)}
              className={`pill-btn${local.questionLimit === v ? ' active' : ''}`}
              onClick={() => isHost && apply({ questionLimit: v })}
              disabled={!isHost}
            >
              {v === null ? 'Unlimited' : v}
            </button>
          ))}
        </div>
      </div>

      {/* Guess attempts */}
      <div className="settings-section">
        <div className="section-label">Guess attempts per round</div>
        <div className="btn-group">
          {[1, 2, 3].map(v => (
            <button key={v}
              className={`pill-btn${local.guessAttempts === v ? ' active' : ''}`}
              onClick={() => isHost && apply({ guessAttempts: v })}
              disabled={!isHost}
            >
              {'⚽'.repeat(v)} {v}
            </button>
          ))}
        </div>
      </div>

      {/* Penalty */}
      <div className="settings-section">
        <label className={`toggle-row${!isHost ? ' disabled' : ''}`}>
          <span>Wrong guess costs 1 point</span>
          <input type="checkbox"
            checked={!!local.wrongGuessPenalty}
            disabled={!isHost}
            onChange={e => apply({ wrongGuessPenalty: e.target.checked })}
          />
          <span className="toggle-track" />
        </label>
      </div>

      {error && <p className="error-msg">{error}</p>}

      {isHost ? (
        <button className="btn btn-primary btn-lg" disabled={poolTooSmall} onClick={onStart}
          title={poolTooSmall ? 'Pool too small — add more filters' : ''}>
          ⚽ Start Game
        </button>
      ) : (
        <div className="waiting-host">
          <div className="spinner" />
          <p className="muted">Waiting for host to start…</p>
        </div>
      )}
    </div>
  );
}
