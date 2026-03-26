import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

const nudges = [
  "Tell us about your grandparents",
  "Who are the eldest members you remember?",
  "Any family members in the army or government?",
  "Who moved cities for work or marriage?",
  "Did they have any children who passed away young?"
];

const NudgePanel = ({ onNudgeClick }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-full mb-8">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm mb-4 hover:text-[var(--color-primary)] transition-colors"
      >
        <Lightbulb size={16} className="text-[var(--color-accent)]" />
        <span>Not sure where to start? Try these...</span>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {isOpen && (
        <div className="flex flex-wrap gap-3 animate-fade-in">
          {nudges.map((nudge, i) => (
            <button
              key={i}
              onClick={() => onNudgeClick(nudge)}
              className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-accent-pale)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all active:scale-95"
            >
              {nudge}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NudgePanel;
