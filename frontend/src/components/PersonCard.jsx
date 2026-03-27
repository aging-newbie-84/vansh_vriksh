import React, { useState } from 'react';

/**
 * Colour palette by gender × marital status
 *  Male           → terracotta  #C4622D
 *  Female married → rani rose   #B5456E
 *  Female single  → marigold    #B07C2A  (with ✦ motif)
 *  Deceased       → any of above at 55% opacity + sacred overlay
 */
const getAccent = (gender, isSingle) => {
  if (gender === 'female') return isSingle ? '#9B6B2A' : '#B5456E';
  return '#C4622D'; // male
};

const PersonCard = ({ person, onUpdate, onVerify, onRemove }) => {
  const isMale      = !person.gender || person.gender === 'male';
  const isVerified  = person.verified;
  const isDeceased  = person.is_deceased === true;
  // Only mark single if explicitly set — can't infer from missing marriages[] (spouses don't have it)
  const isSingle    = !isMale && person.is_single === true;

  const accent = getAccent(person.gender, isSingle);

  const [editingName, setEditingName] = useState(false);
  const [editingRole, setEditingRole] = useState(false);

  /* ── Deceased sacred background: aged parchment with faint lotus watermark ── */
  const deceasedStyle = isDeceased ? {
    background: 'linear-gradient(135deg, #F0E8DC 0%, #EAE0D0 100%)',
    backgroundImage: `
      linear-gradient(135deg, #F0E8DC 0%, #EAE0D0 100%),
      radial-gradient(ellipse at 90% 10%, rgba(180,140,80,0.08) 0%, transparent 60%)
    `,
  } : {};

  return (
    <div
      className={`relative rounded-xl transition-all duration-300 overflow-hidden ${
        isVerified
          ? 'bg-white border border-gray-100 shadow-sm'
          : 'border-2 border-amber-300 shadow-md shadow-amber-50'
      } ${isDeceased ? 'opacity-90' : ''}`}
      style={isDeceased ? deceasedStyle : { background: 'white' }}
    >
      {/* ── Sacred deceased watermark ─ large faint dagger behind content ── */}
      {isDeceased && (
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-end pr-2 pointer-events-none select-none"
          style={{ zIndex: 0 }}
        >
          <span style={{
            fontSize: '5rem',
            color: accent,
            opacity: 0.04,
            fontFamily: "'Cormorant Garamond', serif",
            lineHeight: 1,
          }}>†</span>
        </div>
      )}

      {/* ── Accent top bar ── */}
      <div style={{ height: 3, background: accent, opacity: isDeceased ? 0.5 : 1 }} />

      {/* ── Single female motif strip ── */}
      {isSingle && !isDeceased && (
        <div className="absolute top-0 right-0 w-5 h-full pointer-events-none" style={{ zIndex: 0 }}>
          <div style={{
            position: 'absolute', top: 8, right: 6,
            fontSize: '0.55rem', color: accent, opacity: 0.25, lineHeight: 1.8,
            writingMode: 'vertical-rl', letterSpacing: '0.2em',
          }}>✦✦✦</div>
        </div>
      )}

      <div className="relative p-3" style={{ zIndex: 1 }}>
        {/* ── Needs review badge ── */}
        {!isVerified && (
          <div className="flex items-center gap-1 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[9px] font-semibold text-amber-600 uppercase tracking-widest">Review</span>
          </div>
        )}

        {/* ── Name row ── */}
        <div className="flex items-start gap-1.5 mb-2.5">
          <div className="flex-1 min-w-0">
            {editingName ? (
              <input
                autoFocus
                className="w-full text-sm bg-transparent border-b outline-none pb-0.5"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: '#2A1F14', borderColor: accent }}
                value={person.name}
                onChange={e => onUpdate(person.id, 'name', e.target.value)}
                onBlur={() => setEditingName(false)}
                onKeyDown={e => e.key === 'Enter' && setEditingName(false)}
              />
            ) : (
              <button onClick={() => setEditingName(true)} className="text-left w-full group/n">
                <span
                  className="block leading-tight"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: isDeceased ? '#6B5A4A' : '#2A1F14',
                    textDecoration: isDeceased ? 'line-through' : 'none',
                    textDecorationColor: '#A09585',
                  }}
                >
                  {person.name || <span className="text-gray-300 italic text-xs">Unnamed</span>}
                </span>
              </button>
            )}
          </div>

          {/* Verify */}
          <button
            onClick={() => onVerify(person.id)}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all ${
              isVerified ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-white hover:bg-emerald-500'
            }`}
          >✓</button>

          {/* Remove */}
          <button
            onClick={() => onRemove(person.id)}
            className="w-6 h-6 rounded-full flex items-center justify-center text-gray-200 hover:text-red-400 hover:bg-red-50 transition-all text-base leading-none shrink-0"
          >×</button>
        </div>

        {/* ── Gender + Status pills (single row, compact) ── */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {/* Gender */}
          <div className="flex rounded-full overflow-hidden border text-[10px] font-semibold" style={{ borderColor: `${accent}40` }}>
            <button
              onClick={() => onUpdate(person.id, 'gender', 'male')}
              className="px-2 py-0.5 transition-all"
              style={isMale ? { background: '#C4622D', color: 'white' } : { color: '#aaa' }}
            >♂</button>
            <button
              onClick={() => onUpdate(person.id, 'gender', 'female')}
              className="px-2 py-0.5 transition-all"
              style={!isMale ? { background: isSingle ? '#9B6B2A' : '#B5456E', color: 'white' } : { color: '#aaa' }}
            >♀</button>
          </div>

          {/* Alive / Deceased */}
          <div className="flex rounded-full overflow-hidden border border-gray-100 text-[10px] font-semibold">
            <button
              onClick={() => onUpdate(person.id, 'is_deceased', false)}
              className="px-2 py-0.5 transition-all"
              style={!isDeceased ? { background: '#3D9B6A', color: 'white' } : { color: '#bbb' }}
            >Alive</button>
            <button
              onClick={() => onUpdate(person.id, 'is_deceased', true)}
              className="px-2 py-0.5 transition-all"
              style={isDeceased ? { background: '#8B7B6A', color: 'white' } : { color: '#bbb' }}
            >† Gone</button>
          </div>

          {/* Single toggle — only for females, user-controlled */}
          {!isMale && (
            <button
              onClick={() => onUpdate(person.id, 'is_single', !person.is_single)}
              className="px-2 py-0.5 rounded-full text-[9px] font-semibold transition-all"
              style={isSingle
                ? { background: `${accent}18`, color: accent, border: `1px solid ${accent}40` }
                : { background: 'transparent', color: '#ccc', border: '1px solid #eee' }}
            >
              {isSingle ? '✦ unmarried' : '✦ single?'}
            </button>
          )}
        </div>

        {/* ── Location ── */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-xs shrink-0" style={{ color: accent, opacity: 0.7 }}>📍</span>
          <input
            className="flex-1 text-xs bg-transparent border-b border-transparent focus:border-gray-200 outline-none transition-all"
            style={{ fontFamily: "'Lora', serif", color: isDeceased ? '#8B7B6A' : '#555' }}
            value={person.location || ''}
            onChange={e => onUpdate(person.id, 'location', e.target.value)}
            placeholder={isDeceased ? 'Their home…' : 'Town, state…'}
          />
        </div>

        {/* ── Role / memory ── */}
        <div
          className="rounded-lg px-2.5 py-2 cursor-text transition-colors mb-2.5"
          style={{ background: isDeceased ? 'rgba(180,150,110,0.08)' : '#F9F7F4', border: isDeceased ? '1px dashed rgba(180,140,80,0.2)' : '1px solid transparent' }}
          onClick={() => setEditingRole(true)}
        >
          {editingRole ? (
            <textarea
              autoFocus rows={2}
              className="w-full bg-transparent outline-none resize-none text-xs"
              style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', color: isDeceased ? '#7A6A58' : '#4A3F35' }}
              value={person.one_liner || ''}
              onChange={e => onUpdate(person.id, 'one_liner', e.target.value)}
              onBlur={() => setEditingRole(false)}
              placeholder="A memory, a role, a story…"
            />
          ) : (
            <p className="text-xs italic min-h-[1.2rem]"
              style={{ fontFamily: "'Lora', serif", color: person.one_liner ? (isDeceased ? '#7A6A58' : '#4A3F35') : '#C8BFB5' }}>
              {person.one_liner || (isDeceased ? 'In loving memory…' : 'Add a memory or role…')}
            </p>
          )}
        </div>

        {/* ── Confirm / confirmed ── */}
        {!isVerified ? (
          <button
            onClick={() => onVerify(person.id)}
            className="w-full py-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all"
            style={{ background: accent, color: '#FDF0DC' }}
          >
            ✓ Confirm
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-semibold px-2.5 py-0.5 rounded-full border"
              style={{ color: '#3D9B6A', background: '#F0FBF5', borderColor: '#B8E8CE' }}>
              ✓ Confirmed
            </span>
            <button onClick={() => onVerify(person.id)} className="text-[9px] text-gray-300 hover:text-gray-400 ml-auto transition-colors">
              undo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonCard;
