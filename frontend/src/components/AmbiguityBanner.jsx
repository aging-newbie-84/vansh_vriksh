import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

const AmbiguityBanner = ({ ambiguities, onResolve }) => {
  const [dismissed, setDismissed] = useState([]);

  const visible = ambiguities.filter((_, i) => !dismissed.includes(i));
  if (visible.length === 0) return null;

  return (
    <div className="mb-8 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-4 flex gap-4">
      <div className="bg-amber-500 text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
        <AlertCircle size={20} />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-amber-800 mb-2 text-sm uppercase tracking-wide">
          {visible.length} {visible.length === 1 ? 'item needs' : 'items need'} your attention
        </h3>
        <div className="space-y-2">
          {ambiguities.map((amb, i) => {
            if (dismissed.includes(i)) return null;
            return (
              <div key={i} className="flex items-center justify-between gap-3 py-2 border-t border-amber-200">
                <p className="text-sm text-amber-900 flex-1">{amb.description}</p>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => onResolve(amb)}
                    className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-lg shadow-sm active:scale-95 transition-all hover:bg-amber-600"
                  >
                    Resolve
                  </button>
                  <button
                    onClick={() => setDismissed(d => [...d, i])}
                    className="px-3 py-1 bg-white border border-amber-300 text-amber-700 text-xs font-bold rounded-lg shadow-sm active:scale-95 transition-all hover:bg-amber-100 flex items-center gap-1"
                    title="Dismiss this item"
                  >
                    <X size={11} /> Dismiss
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AmbiguityBanner;
