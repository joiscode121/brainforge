'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronLeft, ChevronRight, X, Volume2, VolumeX } from 'lucide-react';

interface Slide {
  title: string;
  content: string;
  visual?: string;
  visualData?: string;
  narration?: string;
}

interface ExplainerViewProps {
  slides: Slide[];
  onClose: () => void;
  topicTitle: string;
}

export default function ExplainerView({ slides, onClose, topicTitle }: ExplainerViewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const slide = slides[currentSlide];
  const progress = ((currentSlide + 1) / slides.length) * 100;

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => {
    if (isPlaying && slide?.narration && !isMuted) {
      window.speechSynthesis?.cancel();
      const utterance = new SpeechSynthesisUtterance(slide.narration);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onend = () => {
        if (currentSlide < slides.length - 1) {
          setTimeout(() => setCurrentSlide(prev => prev + 1), 500);
        } else {
          setIsPlaying(false);
        }
      };
      synthRef.current = utterance;
      window.speechSynthesis?.speak(utterance);
    }
  }, [currentSlide, isPlaying, isMuted]);

  const togglePlay = () => {
    if (isPlaying) {
      window.speechSynthesis?.cancel();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const goNext = () => {
    window.speechSynthesis?.cancel();
    if (currentSlide < slides.length - 1) setCurrentSlide(prev => prev + 1);
  };

  const goPrev = () => {
    window.speechSynthesis?.cancel();
    if (currentSlide > 0) setCurrentSlide(prev => prev - 1);
  };

  const renderVisual = () => {
    if (!slide?.visual || !slide?.visualData) return null;

    if (slide.visual === 'equation') {
      return (
        <div className="my-6 p-6 surface-card text-center">
          <div className="text-2xl md:text-3xl font-mono tracking-wide" style={{ color: 'var(--accent)' }}>
            {slide.visualData}
          </div>
        </div>
      );
    }

    if (slide.visual === 'code') {
      return (
        <pre className="my-6 p-4 rounded-lg overflow-x-auto" style={{ background: 'var(--bg-sunken)', border: '1px solid var(--border-subtle)' }}>
          <code className="text-sm font-mono" style={{ color: 'var(--accent-dark)' }}>{slide.visualData}</code>
        </pre>
      );
    }

    if (slide.visual === 'diagram') {
      return (
        <div className="my-6 p-4 surface-card text-center text-sm whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
          {slide.visualData}
        </div>
      );
    }

    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex flex-col"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Explainer</div>
          <div className="text-sm font-semibold truncate">{topicTitle}</div>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-[--bg-surface] transition-colors">
          <X size={20} style={{ color: 'var(--text-tertiary)' }} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="progress-track h-1">
        <motion.div
          className="progress-fill h-full"
          style={{ background: 'var(--accent)' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Slide content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="max-w-2xl mx-auto p-6 space-y-4"
          >
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {currentSlide + 1} / {slides.length}
            </div>

            <h2 className="text-2xl md:text-3xl font-bold leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              {slide?.title}
            </h2>

            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {slide?.content}
            </p>

            {renderVisual()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="p-4 pb-safe" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 rounded-lg hover:bg-[--bg-surface] transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={goPrev}
              disabled={currentSlide === 0}
              className="p-3 rounded-lg hover:bg-[--bg-surface] disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={togglePlay}
              className="p-4 rounded-full hover:opacity-90 transition-all text-white"
              style={{ background: 'var(--accent)' }}
            >
              {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}
            </button>

            <button
              onClick={goNext}
              disabled={currentSlide === slides.length - 1}
              className="p-3 rounded-lg hover:bg-[--bg-surface] disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="text-sm w-10 text-right" style={{ color: 'var(--text-muted)' }}>
            {currentSlide + 1}/{slides.length}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
