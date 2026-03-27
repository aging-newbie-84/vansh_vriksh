import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import InputScreen from './screens/InputScreen';
import PreviewScreen from './screens/PreviewScreen';
import TreeScreen from './screens/TreeScreen';

function App() {
  const [screen, setScreen] = useState('input'); // 'input' | 'preview' | 'tree'
  const [transcript, setTranscript] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [confirmedData, setConfirmedData] = useState(null);
  const [sessionId] = useState(() => crypto.randomUUID());

  // Auto-save draft to localStorage
  useEffect(() => {
    const draft = localStorage.getItem('vv_draft');
    if (draft) {
      try {
        const { parsedData: savedParsed, confirmedData: savedConfirmed } = JSON.parse(draft);
        if (savedParsed) setParsedData(savedParsed);
        if (savedConfirmed) setConfirmedData(savedConfirmed);
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  }, []);

  // Save immediately on every change — not on a 30s interval
  useEffect(() => {
    if (parsedData || confirmedData) {
      localStorage.setItem('vv_draft', JSON.stringify({ parsedData, confirmedData }));
    }
  }, [parsedData, confirmedData]);

  const handleParseComplete = (data) => {
    setParsedData(data);
    setScreen('preview');
  };

  const handleConfirmTree = (data) => {
    setConfirmedData(data);
    setScreen('tree');
  };

  const handleBackToInput = () => {
    setScreen('input');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] font-[var(--font-body)] text-[var(--color-text)] overflow-x-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="min-h-screen"
        >
          {screen === 'input' && (
            <InputScreen 
              onParseComplete={handleParseComplete}
              transcript={transcript}
              setTranscript={setTranscript}
              previousParse={parsedData}
              sessionId={sessionId}
            />
          )}
          {screen === 'preview' && (
            <PreviewScreen
              data={parsedData}
              onConfirm={handleConfirmTree}
              onAddMore={handleBackToInput}
              onDataChange={setParsedData}
              sessionId={sessionId}
            />
          )}
          {screen === 'tree' && (
            <TreeScreen 
              data={confirmedData}
              onBack={() => setScreen('preview')}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
