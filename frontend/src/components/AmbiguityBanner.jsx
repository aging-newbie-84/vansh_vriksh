import React from 'react';
import { AlertCircle } from 'lucide-react';

const AmbiguityBanner = ({ ambiguities, onResolve }) => {
  return (
    <div className="mb-8 bg-amber-50 border border-[var(--color-amber)] rounded-xl p-4 flex gap-4 animate-pulse-subtle">
      <div className="bg-[var(--color-amber)] text-white w-12 h-12 rounded-full flex items-center justify-center shrink-0">
        <AlertCircle size={24} />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-[var(--color-amber)] mb-1">
          {ambiguities.length} {ambiguities.length === 1 ? 'thing needs' : 'things need'} your attention
        </h3>
        <div className="space-y-3">
          {ambiguities.map((amb, i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-2 border-t border-amber-200">
              <p className="text-sm text-amber-900">{amb.description}</p>
              <button 
                onClick={() => onResolve(amb)}
                className="shrink-0 px-4 py-1.5 bg-[var(--color-amber)] text-white text-xs font-bold rounded-lg shadow-sm active:scale-95 transition-all"
              >
                Resolve
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AmbiguityBanner;
