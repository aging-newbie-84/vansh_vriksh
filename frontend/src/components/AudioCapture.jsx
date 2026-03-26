import React, { useState, useEffect, useRef } from 'react';

const AudioCapture = ({ onTranscriptUpdate }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        if (event.results[event.results.length - 1].isFinal) {
          onTranscriptUpdate(prev => prev ? `${prev} ${transcript}` : transcript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
    } else {
      console.warn('Speech recognition not supported in this browser.');
    }
  }, [onTranscriptUpdate]);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      setDuration(0);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const formatDuration = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4 py-8">
      <button
        onClick={toggleRecording}
        className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 relative group overflow-hidden ${
          isRecording ? 'bg-red-600 scale-110' : 'bg-[var(--color-primary)] hover:scale-105'
        }`}
      >
        <div className={`absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
        <span className="text-5xl">{isRecording ? '⏹' : '🎙️'}</span>
        {isRecording && (
          <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        )}
      </button>

      {isRecording && (
        <div className="text-xl font-bold font-mono text-red-600 flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
          <span>{formatDuration(duration)}</span>
        </div>
      )}

      <p className="font-display uppercase tracking-widest text-[var(--color-text-muted)] text-sm">
        {isRecording ? "Listening to your story..." : "Click to narrate family memories"}
      </p>
    </div>
  );
};

export default AudioCapture;
