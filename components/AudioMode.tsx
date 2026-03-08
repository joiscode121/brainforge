'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface AudioModeProps {
  content: string;
  question?: string;
  options?: string[];
  explanation?: string;
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

  useEffect(() => {
    if (enabled && question) {
      const text = options
        ? `${question}. Options: ${options.map((o, i) => o.replace(/^[A-D]\)\s*/, `${['A', 'B', 'C', 'D'][i]}. `)).join('. ')}`
        : question;
      speak(text);
    }
    return () => { window.speechSynthesis?.cancel(); };
  }, [question, enabled, speak]);

  useEffect(() => {
    if (enabled && showExplanation && explanation) {
      setTimeout(() => speak(explanation), 500);
    }
  }, [showExplanation, explanation, enabled, speak]);

  useEffect(() => {
    if (enabled && autoPlay && content && !question) {
      speak(content);
    }
  }, [content, enabled, autoPlay, speak, question]);

  useEffect(() => () => { window.speechSynthesis?.cancel(); }, []);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => { setEnabled(!enabled); if (enabled) stop(); }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
        style={{
          background: enabled ? 'var(--accent-subtle)' : 'var(--bg-surface)',
          color: enabled ? 'var(--accent)' : 'var(--text-muted)',
          border: `1px solid ${enabled ? 'oklch(82% 0.06 35)' : 'var(--border-subtle)'}`,
        }}
      >
        {enabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
        {enabled ? 'Audio On' : 'Audio'}
      </button>

      {enabled && (
        <>
          {speaking ? (
            <button onClick={stop} className="p-1.5 rounded-lg" style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
              <Pause size={14} />
            </button>
          ) : (
            <button onClick={() => {
              const text = question
                ? (options ? `${question}. ${options.join('. ')}` : question)
                : content;
              speak(text);
            }} className="p-1.5 rounded-lg" style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
              <Play size={14} />
            </button>
          )}

          <div className="flex items-center gap-1">
            {[0.75, 1.0, 1.25, 1.5].map(r => (
              <button key={r} onClick={() => setRate(r)}
                className="px-1.5 py-0.5 rounded text-[10px] transition-colors"
                style={{
                  background: rate === r ? 'var(--bg-surface)' : 'transparent',
                  color: rate === r ? 'var(--text-primary)' : 'var(--text-muted)',
                }}>{r}x</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
