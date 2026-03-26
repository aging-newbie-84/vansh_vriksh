import React, { useState } from 'react';
import AudioCapture from '../components/AudioCapture';
import NudgePanel from '../components/NudgePanel';
import { parseFamily } from '../utils/apiClient';

const InputScreen = ({ onParseComplete, previousParse, transcript, setTranscript, sessionId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await parseFamily(transcript, previousParse ? [previousParse] : [], sessionId);
      onParseComplete(data);
    } catch (err) {
      setError('Failed to reach the storyteller. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addNudgeToTranscript = (text) => {
    setTranscript(prev => prev ? `${prev} ${text}` : text);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-8 max-w-4xl mx-auto min-h-screen">
      <header className="text-center space-y-2">
        <h1 className="text-5xl font-display text-[var(--color-primary)]">Vansh Vriksha</h1>
        <p className="text-lg font-body italic opacity-80">Map your family. Honour your roots.</p>
      </header>

      <main className="w-full space-y-6">
        <div className="flex flex-col items-center">
          <AudioCapture onTranscriptUpdate={setTranscript} />
        </div>

        <div className="relative">
          <textarea
            className="w-full h-48 p-4 bg-white border-2 border-[var(--color-accent)] rounded-lg shadow-inner focus:border-[var(--color-primary)] transition-colors text-lg"
            placeholder="Tell us about your family... who are your parents? Where are they from?"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
          {loading && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
            </div>
          )}
        </div>

        <NudgePanel onNudgeSelect={addNudgeToTranscript} />

        {error && <p className="text-red-600 text-center font-bold">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={!transcript.trim() || loading}
          className={`w-full py-4 text-xl font-display uppercase tracking-widest rounded-lg shadow-lg border-2 border-transparent transition-all ${
            !transcript.trim() || loading 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-accent)] hover:shadow-[var(--shadow-glow)]'
          }`}
        >
          {loading ? 'Consulting the Scribe...' : 'Build My Tree 🌳'}
        </button>
      </main>
    </div>
  );
};

export default InputScreen;
