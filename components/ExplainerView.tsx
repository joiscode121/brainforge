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
        <div className="my-6 p-6 glass-card text-center">
          <div className="text-2xl md:text-3xl font-mono text-cyan-300 tracking-wide">
            {slide.visualData}
          </div>
        </div>
      );
    }
    
    if (slide.visual === 'code') {
      return (
        <pre className="my-6 p-4 glass-card overflow-x-auto">
          <code className="text-sm text-green-400 font-mono">{slide.visualData}</code>
        </pre>
      );
    }
    
    if (slide.visual === 'diagram') {
      return (
        <div className="my-6 p-4 glass-card text-center text-white/80 text-sm whitespace-pre-line">
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
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex-1">
          <div className="text-xs text-white/40 uppercase tracking-wider">Explainer</div>
          <div className="text-sm font-semibold truncate">{topicTitle}</div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl">
          <X size={20} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Slide content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto p-6 space-y-4"
          >
            <div className="text-xs text-white/40">
              {currentSlide + 1} / {slides.length}
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
              {slide?.title}
            </h2>
            
            <p className="text-white/80 text-lg leading-relaxed">
              {slide?.content}
            </p>
            
            {renderVisual()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-white/10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 hover:bg-white/10 rounded-xl text-white/60"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          
          <div className="flex items-center gap-4">
            <button
              onClick={goPrev}
              disabled={currentSlide === 0}
              className="p-3 hover:bg-white/10 rounded-xl disabled:opacity-30"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button
              onClick={togglePlay}
              className="p-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}
            </button>
            
            <button
              onClick={goNext}
              disabled={currentSlide === slides.length - 1}
              className="p-3 hover:bg-white/10 rounded-xl disabled:opacity-30"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          
          <div className="text-sm text-white/40 w-10 text-right">
            {currentSlide + 1}/{slides.length}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
