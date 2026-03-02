'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Play, Pause, SkipForward, RotateCcw } from 'lucide-react';

interface AudioModeProps {
  content: string;        // Text to read aloud
  question?: string;      // Current question text
  options?: string[];     // Answer options
  explanation?: string;   // Explanation after answering
  showExplanation?: boolean;
  autoPlay?: boolean;
  onComplete?: () => void;
}

export default function AudioMode({ content, question, options, explanation, showExplanation, autoPlay = false, onComplete }: AudioModeProps) {
  const [speaking, setSpeaking] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [rate, setRate] = useState(1.0);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1.0;
    
    // Try to get a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('English'));
    if (preferred) utterance.voice = preferred;
    
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => { setSpeaking(false); onComplete?.(); };
    utterance.onerror = () => setSpeaking(false);
    
    utterRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [rate, onComplete]);

  const stop = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  };

  // Auto-read question when it changes
  useEffect(() => {
    if (enabled && question) {
      const text = options
        ? `${question}. Options: ${options.map((o, i) => o.replace(/^[A-D]\)\s*/, `${['A', 'B', 'C', 'D'][i]}. `)).join('. ')}`
        : question;
      speak(text);
    }
    return () => { window.speechSynthesis?.cancel(); };
  }, [question, enabled, speak]);

  // Read explanation when shown
  useEffect(() => {
    if (enabled && showExplanation && explanation) {
      setTimeout(() => speak(explanation), 500);
    }
  }, [showExplanation, explanation, enabled, speak]);

  // Read general content
  useEffect(() => {
    if (enabled && autoPlay && content && !question) {
      speak(content);
    }
  }, [content, enabled, autoPlay, speak, question]);

  // Cleanup on unmount
  useEffect(() => () => { window.speechSynthesis?.cancel(); }, []);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => { setEnabled(!enabled); if (enabled) stop(); }}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
          enabled ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-white/5 text-white/40 border border-white/10 hover:text-white/70'
        }`}
      >
        {enabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
        {enabled ? 'Audio On' : 'Audio'}
      </button>
      
      {enabled && (
        <>
          {speaking ? (
            <button onClick={stop} className="p-1.5 rounded-lg bg-white/5 text-white/50 hover:text-white">
              <Pause size={14} />
            </button>
          ) : (
            <button onClick={() => {
              const text = question 
                ? (options ? `${question}. ${options.join('. ')}` : question)
                : content;
              speak(text);
            }} className="p-1.5 rounded-lg bg-white/5 text-white/50 hover:text-white">
              <Play size={14} />
            </button>
          )}
          
          <div className="flex items-center gap-1">
            {[0.75, 1.0, 1.25, 1.5].map(r => (
              <button key={r} onClick={() => setRate(r)}
                className={`px-1.5 py-0.5 rounded text-[10px] ${
                  rate === r ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'
                }`}>{r}x</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
