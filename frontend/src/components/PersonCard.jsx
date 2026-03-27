import React, { useState } from 'react';

const PersonCard = ({ person, onUpdate, onVerify, onRemove }) => {
  const isMale     = !person.gender || person.gender === 'male';
  const isVerified = person.verified;
  const [editingName, setEditingName] = useState(false);
  const [editingRole, setEditingRole] = useState(false);

  const accent = isMale ? '#C4622D' : '#7B6E8A';

  return (
    <div className={`relative rounded-2xl transition-all duration-300 ${
      isVerified
        ? 'bg-white border border-green-200 shadow-sm'
        : 'bg-white border-2 border-amber-400 shadow-lg shadow-amber-100/60'
    }`}>
      {/* Unverified left stripe */}
      {!isVerified && (
        <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-amber-400" />
      )}

      <div className="p-5">
        {/* ── Top row: name + actions ── */}
        <div className="flex items-start gap-2 mb-4">
          <div className="flex-1 min-w-0">
            {!isVerified && (
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-widest">
                  Needs review
                </span>
              </div>
            )}
            {/* Inline name edit — click name text to edit */}
            {editingName ? (
              <input
                autoFocus
                className="w-full text-xl bg-transparent border-b-2 border-[#C4622D] outline-none pb-0.5"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: '#2A1F14' }}
                value={person.name}
                onChange={e => onUpdate(person.id, 'name', e.target.value)}
                onBlur={() => setEditingName(false)}
                onKeyDown={e => e.key === 'Enter' && setEditingName(false)}
              />
            ) : (
              <button
                onClick={() => setEditingName(true)}
                className="text-left w-full group/name"
                title="Click to edit name"
              >
                <span
                  className="text-xl block group-hover/name:opacity-70 transition-opacity"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: '#2A1F14', lineHeight: 1.3 }}
                >
                  {person.name || <span className="text-gray-300 italic">Unnamed</span>}
                </span>
                <span className="text-[9px] text-gray-300 opacity-0 group-hover/name:opacity-100 transition-opacity">
                  click to edit
                </span>
              </button>
            )}
          </div>

          {/* Verify ✓ */}
          <button
            onClick={() => onVerify(person.id)}
            title={isVerified ? 'Verified' : 'Confirm this person'}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all shrink-0 ${
              isVerified ? 'bg-green-500 text-white shadow-sm' : 'bg-amber-400 text-white hover:bg-green-500 shadow-md'
            }`}
          >✓</button>

          {/* Remove × */}
          <button
            onClick={() => onRemove(person.id)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all shrink-0 text-lg leading-none"
            title="Remove"
          >×</button>
        </div>

        {/* ── Gender pill ── */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex bg-gray-50 rounded-full p-0.5 border border-gray-100">
            <button
              onClick={() => onUpdate(person.id, 'gender', 'male')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                isMale ? 'bg-[#C4622D] text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              ♂ Male
            </button>
            <button
              onClick={() => onUpdate(person.id, 'gender', 'female')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                !isMale ? 'bg-[#7B6E8A] text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              ♀ Female
            </button>
          </div>

          {/* Alive / Deceased */}
          <div className="flex bg-gray-50 rounded-full p-0.5 border border-gray-100">
            <button
              onClick={() => onUpdate(person.id, 'is_deceased', false)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                !person.is_deceased ? 'bg-emerald-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Alive
            </button>
            <button
              onClick={() => onUpdate(person.id, 'is_deceased', true)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                person.is_deceased ? 'bg-gray-400 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              † Deceased
            </button>
          </div>
        </div>

        {/* ── Location — tap to edit ── */}
        <div className="flex items-center gap-2 mb-3 group/loc">
          <span className="text-sm">📍</span>
          <input
            className="flex-1 text-sm bg-transparent border-b border-transparent focus:border-gray-300 outline-none text-gray-600 placeholder-gray-200 transition-all"
            style={{ fontFamily: "'Lora', serif" }}
            value={person.location || ''}
            onChange={e => onUpdate(person.id, 'location', e.target.value)}
            placeholder="Town, state — where did they live?"
          />
        </div>

        {/* ── Role / memory — tap to edit ── */}
        <div
          className="rounded-xl px-3 py-2.5 cursor-text transition-colors"
          style={{ background: isVerified ? '#F8F6F3' : '#FFFBF4' }}
          onClick={() => setEditingRole(true)}
        >
          {editingRole ? (
            <textarea
              autoFocus
              rows={2}
              className="w-full bg-transparent outline-none resize-none text-sm"
              style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', color: '#4A3F35' }}
              value={person.one_liner || ''}
              onChange={e => onUpdate(person.id, 'one_liner', e.target.value)}
              onBlur={() => setEditingRole(false)}
              placeholder="What was their role? Any memory worth keeping?"
            />
          ) : (
            <p
              className="text-sm italic text-gray-400 min-h-[1.5rem]"
              style={{ fontFamily: "'Lora', serif", color: person.one_liner ? '#4A3F35' : undefined }}
            >
              {person.one_liner || 'Add a memory or role…'}
            </p>
          )}
        </div>

        {/* ── Confirm / confirmed ── */}
        <div className="mt-3">
          {!isVerified ? (
            <button
              onClick={() => onVerify(person.id)}
              className="w-full py-2 rounded-xl text-xs font-bold tracking-wide transition-all"
              style={{ background: '#C4622D', color: '#FDF0DC' }}
            >
              ✓ Confirm this person
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ✓ Confirmed
              </span>
              <button onClick={() => onVerify(person.id)} className="text-[10px] text-gray-300 hover:text-gray-500 ml-auto transition-colors">
                undo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonCard;
