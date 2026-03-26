import React from 'react';

const PersonCard = ({ person, onUpdate, onVerify, onRemove }) => {
  const isMale = !person.gender || person.gender === 'male';
  
  return (
    <div className={`relative p-6 bg-white border-2 rounded-2xl shadow-sm hover:shadow-xl transition-all ${
      person.verified ? 'border-[var(--color-success)] bg-green-50/10' : 'border-amber-300'
    } group`}>
      {/* Verify Badge */}
      <button
        onClick={() => onVerify(person.id)}
        className={`absolute top-4 right-12 w-8 h-8 rounded-full flex items-center justify-center transition-all font-bold text-sm ${
          person.verified
            ? 'bg-[var(--color-success)] text-white shadow-sm'
            : 'bg-amber-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg'
        }`}
        title={person.verified ? "Verified ✓" : "Click to confirm this person"}
      >
        ✓
      </button>

      {/* Remove Button */}
      <button 
        onClick={() => onRemove(person.id)}
        className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
        title="Remove this person"
      >
        ×
      </button>

      <div className="flex flex-col space-y-4">
        {/* Name Input */}
        <input 
          className="text-2xl font-display text-[var(--color-primary)] bg-transparent border-b border-transparent focus:border-[var(--color-accent)] w-full focus:bg-white p-1 rounded-t-lg transition-all"
          value={person.name}
          onChange={(e) => onUpdate(person.id, 'name', e.target.value)}
          placeholder="Person's Name"
        />

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] p-1">Gender</label>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button 
                onClick={() => onUpdate(person.id, 'gender', 'male')}
                className={`flex-1 py-1 rounded-md text-xs font-bold transition-all ${isMale ? 'bg-white shadow-sm font-black' : 'text-gray-400'}`}
              >
                MALE 🏹
              </button>
              <button 
                onClick={() => onUpdate(person.id, 'gender', 'female')}
                className={`flex-1 py-1 rounded-md text-xs font-bold transition-all ${!isMale ? 'bg-white shadow-sm font-black text-red-600' : 'text-gray-400'}`}
              >
                FEMALE 🌸
              </button>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] p-1">Location</label>
            <input 
              className="px-3 py-2 bg-gray-50 border-transparent border-2 focus:border-[var(--color-accent)] focus:bg-white rounded-lg text-sm transition-all"
              value={person.location || ''}
              onChange={(e) => onUpdate(person.id, 'location', e.target.value)}
              placeholder="Odisha, Bangalore..."
            />
          </div>
        </div>

        {/* Bio Input */}
        <div className="flex flex-col">
          <label className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] p-1">Role / Life Story</label>
          <input 
            className="px-3 py-2 bg-gray-50 border-transparent border-2 focus:border-[var(--color-accent)] focus:bg-white rounded-lg text-sm transition-all italic"
            value={person.one_liner || ''}
            onChange={(e) => onUpdate(person.id, 'one_liner', e.target.value)}
            placeholder="What was their role? Any memory?"
          />
        </div>

        {/* Status indicator + confirm CTA */}
        <div className="flex flex-col gap-2 pt-2">
          {!person.verified && (
            <button
              onClick={() => onVerify(person.id)}
              className="w-full py-2 text-xs font-bold rounded-lg bg-amber-50 border-2 border-amber-400 text-amber-800 hover:bg-green-50 hover:border-green-500 hover:text-green-800 transition-all tracking-wide"
            >
              ✓ Confirm this person
            </button>
          )}
          {person.verified && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-300">✓ Confirmed Ancestor</span>
              <button onClick={() => onVerify(person.id)} className="text-[10px] text-gray-400 hover:text-gray-600 ml-auto">undo</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonCard;
