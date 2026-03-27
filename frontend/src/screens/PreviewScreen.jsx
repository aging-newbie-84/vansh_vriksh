import React, { useState } from 'react';
import PersonCard from '../components/PersonCard';
import AmbiguityBanner from '../components/AmbiguityBanner';

const PreviewScreen = ({ data, onConfirm, onAddMore, onDataChange, sessionId }) => {
  const [localData, setLocalData] = useState(data);

  if (!localData) return null;

  // Sync every edit back to App.jsx so returning from tree screen preserves changes
  const update = (next) => {
    setLocalData(next);
    onDataChange?.(next);
  };

  const handleUpdatePerson = (id, field, value) => {
    const updated = localData.persons.map(p => p.id === id ? { ...p, [field]: value } : p);
    update({ ...localData, persons: updated });
  };

  const handleVerifyPerson = (id) => {
    const updated = localData.persons.map(p => p.id === id ? { ...p, verified: !p.verified } : p);
    update({ ...localData, persons: updated });
  };

  const handleRemovePerson = (id) => {
    const updated = localData.persons.filter(p => p.id !== id);
    update({ ...localData, persons: updated });
  };

  const handleConfirm = () => {
    onConfirm(localData);
  };

  const allVerified = localData.persons.every(p => p.verified);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg)]">
      <header className="sticky top-0 z-10 w-full bg-white border-b border-[var(--color-accent)] shadow-sm px-6 py-4 flex justify-between items-center backdrop-blur-md bg-white/70">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onAddMore}
            className="text-[var(--color-primary)] hover:text-red-900 font-bold transition-colors"
          >
            ← Add More
          </button>
          <h1 className="text-2xl font-display text-[var(--color-primary)] tracking-wide hidden sm:block" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 600 }}>Review Your Family Map</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <p className="text-sm font-body italic opacity-70 hidden md:block">
            {allVerified ? 'Verified. Ready to build.' : 'Verify individuals to continue.'}
          </p>
          <button 
            onClick={handleConfirm}
            disabled={!allVerified && localData.persons.length > 0}
            className={`px-6 py-2 rounded-full font-display uppercase tracking-widest transition-all ${
              !allVerified && localData.persons.length > 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-accent)] shadow-lg hover:shadow-[var(--shadow-glow)]'
            }`}
          >
            Build My Tree ✨
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto w-full p-6 space-y-8">
        {localData.ambiguities?.length > 0 && (
          <AmbiguityBanner ambiguities={localData.ambiguities} onResolve={() => {}} />
        )}

        <div className="bg-white/50 p-6 border-l-4 border-[var(--color-primary)] text-lg italic shadow-sm rounded-r-lg">
          "{localData.summary}"
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {localData.persons.map(person => (
              <PersonCard 
                key={person.id}
                person={person}
                onUpdate={handleUpdatePerson}
                onVerify={handleVerifyPerson}
                onRemove={handleRemovePerson}
              />
            ))}
          </div>
        </div>

        {localData.nudges?.length > 0 && (
          <div className="mt-12 text-center p-8 border-2 border-dashed border-[var(--color-accent)] rounded-2xl bg-white/30 space-y-4">
            <h3 className="font-display text-[var(--color-primary)] uppercase tracking-widest">A Quick Thought</h3>
            {localData.nudges.map((nudge, i) => (
              <p key={i} className="text-xl font-body italic text-[var(--color-text)]">"{nudge}"</p>
            ))}
            <button 
              onClick={onAddMore}
              className="text-[var(--color-primary)] font-bold border-b-2 border-transparent hover:border-[var(--color-primary)] transition-all"
            >
              ANSWER THIS →
            </button>
          </div>
        )}
      </main>

      {/* Sticky floating Build button — always reachable on scroll */}
      {allVerified && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={handleConfirm}
            className="px-8 py-3 rounded-full font-display uppercase tracking-widest bg-[var(--color-primary)] text-white shadow-2xl hover:bg-[var(--color-accent)] hover:shadow-[var(--shadow-glow)] transition-all text-sm"
          >
            Build My Tree ✨
          </button>
        </div>
      )}
      {!allVerified && localData.persons.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="px-5 py-2.5 rounded-full bg-white border-2 border-amber-300 text-amber-700 text-xs font-bold shadow-lg">
            {localData.persons.filter(p => !p.verified).length} remaining to confirm
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewScreen;
