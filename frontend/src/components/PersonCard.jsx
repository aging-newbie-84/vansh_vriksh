import React from 'react';

const PersonCard = ({ person, onUpdate, onVerify, onRemove }) => {
  const isMale = !person.gender || person.gender === 'male';
  const isVerified = person.verified;

  return (
    <div className={`relative rounded-2xl shadow-sm transition-all group ${
      isVerified
        ? 'bg-white border-2 border-green-300'
        : 'bg-amber-50/60 border-2 border-amber-400 shadow-amber-100 shadow-md ring-1 ring-amber-300/50'
    }`}>
      {/* Needs Review stripe */}
      {!isVerified && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 rounded-l-2xl" />
      )}

      <div className="p-5 pl-6">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 pr-2">
            {!isVerified && (
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full mb-1">
                ● Needs Review
              </span>
            )}
            <input
              className="text-xl font-display text-[var(--color-primary)] bg-transparent border-b border-transparent focus:border-[var(--color-accent)] w-full focus:bg-white px-1 py-0.5 rounded-t transition-all"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
              value={person.name}
              onChange={(e) => onUpdate(person.id, 'name', e.target.value)}
              placeholder="Person's Name"
            />
          </div>

          {/* Verify + Remove buttons */}
          <div className="flex gap-1 shrink-0">
            <button
              onClick={() => onVerify(person.id)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all font-bold text-sm shadow ${
                isVerified
                  ? 'bg-green-500 text-white'
                  : 'bg-amber-500 text-white hover:bg-green-500 animate-pulse'
              }`}
              title={isVerified ? "Verified ✓" : "Confirm this person"}
            >
              ✓
            </button>
            <button
              onClick={() => onRemove(person.id)}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors text-lg leading-none"
              title="Remove this person"
            >
              ×
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col">
            <label className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] mb-1">Gender</label>
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => onUpdate(person.id, 'gender', 'male')}
                className={`flex-1 py-1 rounded-md text-xs font-bold transition-all ${isMale ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400'}`}
              >
                MALE 🏹
              </button>
              <button
                onClick={() => onUpdate(person.id, 'gender', 'female')}
                className={`flex-1 py-1 rounded-md text-xs font-bold transition-all ${!isMale ? 'bg-white shadow-sm text-red-600' : 'text-gray-400'}`}
              >
                FEMALE 🌸
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] mb-1">Location</label>
            <input
              className="px-3 py-1.5 bg-white border border-gray-200 focus:border-[var(--color-accent)] rounded-lg text-sm transition-all"
              value={person.location || ''}
              onChange={(e) => onUpdate(person.id, 'location', e.target.value)}
              placeholder="Town, State..."
            />
          </div>

          <div className="flex flex-col col-span-2">
            <label className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] mb-1">Status</label>
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => onUpdate(person.id, 'is_deceased', false)}
                className={`flex-1 py-1 rounded-md text-xs font-bold transition-all ${!person.is_deceased ? 'bg-white shadow-sm text-green-700' : 'text-gray-400'}`}
              >
                ALIVE
              </button>
              <button
                onClick={() => onUpdate(person.id, 'is_deceased', true)}
                className={`flex-1 py-1 rounded-md text-xs font-bold transition-all ${person.is_deceased ? 'bg-white shadow-sm text-gray-600' : 'text-gray-400'}`}
              >
                DECEASED †
              </button>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-3">
          <label className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] mb-1 block">Role / Life Story</label>
          <input
            className="w-full px-3 py-1.5 bg-white border border-gray-200 focus:border-[var(--color-accent)] rounded-lg text-sm transition-all italic"
            value={person.one_liner || ''}
            onChange={(e) => onUpdate(person.id, 'one_liner', e.target.value)}
            placeholder="What was their role? Any memory?"
          />
        </div>

        {/* Confirm / Confirmed */}
        <div className="mt-3">
          {!isVerified ? (
            <button
              onClick={() => onVerify(person.id)}
              className="w-full py-2 text-xs font-bold rounded-xl bg-amber-500 text-white hover:bg-green-600 transition-all tracking-wide shadow-sm"
            >
              ✓ Confirm this person
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-300">
                ✓ Confirmed Ancestor
              </span>
              <button onClick={() => onVerify(person.id)} className="text-[10px] text-gray-400 hover:text-gray-600 ml-auto">
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
