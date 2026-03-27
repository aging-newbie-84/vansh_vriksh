import React, { useState } from 'react';
import AudioCapture from '../components/AudioCapture';
import NudgePanel from '../components/NudgePanel';
import { parseFamily } from '../utils/apiClient';

// GPT-4o pricing (USD per 1K tokens) × USD/INR rate
const INR_PER_USD    = 83;
const INPUT_COST_PER_1K  = (2.50  / 1000) * INR_PER_USD;  // ₹0.2075 per 1K input tokens
const OUTPUT_COST_PER_1K = (10.00 / 1000) * INR_PER_USD;  // ₹0.83   per 1K output tokens

function calcCost(usage) {
  if (!usage || !usage.total_tokens) return null;
  const inputCost  = (usage.prompt_tokens     / 1000) * INPUT_COST_PER_1K;
  const outputCost = (usage.completion_tokens / 1000) * OUTPUT_COST_PER_1K;
  return {
    tokens: usage.total_tokens,
    inr:    (inputCost + outputCost).toFixed(2),
  };
}

const InputScreen = ({ onParseComplete, previousParse, transcript, setTranscript, sessionId }) => {
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);
  const [lastCost,  setLastCost]  = useState(null);   // { tokens, inr }
  const [totalInr,  setTotalInr]  = useState(0);      // running session total

  const handleSubmit = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await parseFamily(transcript, previousParse ? [previousParse] : [], sessionId);

      // Extract and display cost if available
      const cost = calcCost(data._usage);
      if (cost) {
        setLastCost(cost);
        setTotalInr(prev => +(prev + parseFloat(cost.inr)).toFixed(2));
      }

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

        {/* ── Token cost pill ── */}
        {lastCost && (
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
              style={{
                background: '#FDF0DC',
                border: '1px solid #C4622D44',
                fontFamily: "'Cormorant Garamond', serif",
                color: '#6B5A48',
              }}
            >
              <span style={{ color: '#C4622D' }}>✦</span>
              <span>Last parse: <strong>{lastCost.tokens.toLocaleString()} tokens</strong></span>
              <span style={{ color: '#C4622D' }}>·</span>
              <span>≈ <strong>₹{lastCost.inr}</strong></span>
            </div>

            {totalInr > 0 && (
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
                style={{
                  background: '#F5F0F8',
                  border: '1px solid #7B6E8A33',
                  fontFamily: "'Cormorant Garamond', serif",
                  color: '#7B6E8A',
                }}
              >
                Session total: ₹{totalInr}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default InputScreen;
