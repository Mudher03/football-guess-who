import React, { useState } from 'react';
import { setSoundEnabled } from '../sounds';

export default function SettingsPanel({
  settings, playerNames, isHost,
  cardSize, showClub, showNationality, soundOn, darkMode,
  onClose,
  onNamesChange,
  onRulesChange,
  onCardSize, onShowClub, onShowNationality, onSound, onDarkMode,
  onForfeit, onEndGame,
}) {
  const [names, setNames] = useState([playerNames[0] || 'Player 1', playerNames[1] || 'Player 2']);
  const [confirmForfeit, setConfirmForfeit] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);

  function saveNames() {
    onNamesChange(names);
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal settings-modal">
        <div className="modal-header">
          <h2>⚙ Settings</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="settings-modal-body">

          {/* Player names */}
          <div className="sp-section">
            <div className="sp-label">Player Names</div>
            <div className="names-row">
              {[0, 1].map(i => (
                <input key={i}
                  className="name-input"
                  value={names[i]}
                  maxLength={20}
                  placeholder={`Player ${i + 1}`}
                  onChange={e => {
                    const n = [...names];
                    n[i] = e.target.value;
                    setNames(n);
                  }}
                  onBlur={saveNames}
                  onKeyDown={e => { if (e.key === 'Enter') saveNames(); }}
                />
              ))}
            </div>
          </div>

          {/* Game rules — host only */}
          {isHost && (
            <>
              <div className="sp-section">
                <div className="sp-label">Points per correct guess</div>
                <div className="btn-group">
                  {[1, 2, 3].map(v => (
                    <button key={v}
                      className={`pill-btn${settings.pointsPerGuess === v ? ' active' : ''}`}
                      onClick={() => onRulesChange({ pointsPerGuess: v })}
                    >
                      {v} pt{v > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sp-section">
                <div className="sp-label">Win condition</div>
                <div className="radio-group">
                  <label className={`radio-opt${settings.winCondition === 'first-to' ? ' selected' : ''}`}>
                    <input type="radio" checked={settings.winCondition === 'first-to'}
                      onChange={() => onRulesChange({ winCondition: 'first-to' })}
                    />
                    First to&nbsp;
                    <select className="inline-select" value={settings.winTarget}
                      onChange={e => onRulesChange({ winTarget: Number(e.target.value) })}
                    >
                      {[3, 5, 7, 10].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                    &nbsp;wins
                  </label>
                  <label className={`radio-opt${settings.winCondition === 'play-rounds' ? ' selected' : ''}`}>
                    <input type="radio" checked={settings.winCondition === 'play-rounds'}
                      onChange={() => onRulesChange({ winCondition: 'play-rounds' })}
                    />
                    Play&nbsp;
                    <select className="inline-select" value={settings.winTarget}
                      onChange={e => onRulesChange({ winTarget: Number(e.target.value) })}
                    >
                      {[3, 5, 7, 10].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                    &nbsp;rounds
                  </label>
                </div>
              </div>

              <div className="sp-section">
                <div className="sp-label">Questions per turn</div>
                <div className="btn-group">
                  {[null, 3, 5, 7, 10].map(v => (
                    <button key={String(v)}
                      className={`pill-btn${settings.questionLimit === v ? ' active' : ''}`}
                      onClick={() => onRulesChange({ questionLimit: v })}
                    >
                      {v === null ? '∞' : v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sp-section">
                <label className="toggle-row">
                  <span>Wrong guess costs 1 pt</span>
                  <input type="checkbox"
                    checked={!!settings.wrongGuessPenalty}
                    onChange={e => onRulesChange({ wrongGuessPenalty: e.target.checked })}
                  />
                  <span className="toggle-track" />
                </label>
              </div>
            </>
          )}

          {/* Board settings */}
          <div className="sp-section">
            <div className="sp-label">Card Size</div>
            <div className="btn-group">
              {['small','medium','large'].map(s => (
                <button key={s}
                  className={`pill-btn${cardSize === s ? ' active' : ''}`}
                  onClick={() => onCardSize(s)}
                >
                  {s[0].toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="sp-section">
            <label className="toggle-row">
              <span>Show club on cards</span>
              <input type="checkbox" checked={showClub} onChange={e => onShowClub(e.target.checked)} />
              <span className="toggle-track" />
            </label>
            <label className="toggle-row">
              <span>Show nationality on cards</span>
              <input type="checkbox" checked={showNationality} onChange={e => onShowNationality(e.target.checked)} />
              <span className="toggle-track" />
            </label>
          </div>

          {/* UI prefs */}
          <div className="sp-section">
            <div className="sp-label">Preferences</div>
            <label className="toggle-row">
              <span>Sound effects</span>
              <input type="checkbox" checked={soundOn}
                onChange={e => { setSoundEnabled(e.target.checked); onSound(e.target.checked); }}
              />
              <span className="toggle-track" />
            </label>
            <label className="toggle-row">
              <span>Dark mode</span>
              <input type="checkbox" checked={darkMode} onChange={e => onDarkMode(e.target.checked)} />
              <span className="toggle-track" />
            </label>
          </div>

          {/* Danger zone */}
          <div className="sp-section danger-zone">
            <div className="sp-label">Actions</div>
            {confirmForfeit ? (
              <div className="confirm-row">
                <span className="confirm-text">Forfeit this round?</span>
                <button className="btn btn-danger btn-sm" onClick={() => { setConfirmForfeit(false); onForfeit(); onClose(); }}>Yes, forfeit</button>
                <button className="btn btn-secondary btn-sm" onClick={() => setConfirmForfeit(false)}>Cancel</button>
              </div>
            ) : (
              <button className="btn btn-warn btn-sm" onClick={() => setConfirmForfeit(true)}>
                🏳 Forfeit Current Round
              </button>
            )}
            {isHost && (
              confirmEnd ? (
                <div className="confirm-row">
                  <span className="confirm-text">End the game now?</span>
                  <button className="btn btn-danger btn-sm" onClick={() => { setConfirmEnd(false); onEndGame(); onClose(); }}>Yes, end game</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setConfirmEnd(false)}>Cancel</button>
                </div>
              ) : (
                <button className="btn btn-danger btn-sm" onClick={() => setConfirmEnd(true)}>
                  ✕ End Game Early
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
