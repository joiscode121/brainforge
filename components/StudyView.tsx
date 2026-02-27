'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Clock, Lightbulb, Play } from 'lucide-react';

interface StudyViewProps {
  content: string;
  keyPoints: string[];
  readingTimeMin: number;
  onComplete: () => void;
  onStartExplainer: () => void;
}

export default function StudyView({ content, keyPoints, readingTimeMin, onComplete, onStartExplainer }: StudyViewProps) {
  const [hasRead, setHasRead] = useState(false);

  // Simple markdown rendering (bold, italic, code, headers, math placeholder)
  const renderContent = (text: string) => {
    return text.split('\n\n').map((paragraph, i) => {
      // Headers
      if (paragraph.startsWith('### ')) {
        return <h3 key={i} className="text-lg font-bold text-cyan-400 mt-6 mb-2">{paragraph.slice(4)}</h3>;
      }
      if (paragraph.startsWith('## ')) {
        return <h2 key={i} className="text-xl font-bold text-white mt-6 mb-3">{paragraph.slice(3)}</h2>;
      }
      
      // Code blocks
      if (paragraph.startsWith('```')) {
        const lines = paragraph.split('\n');
        const lang = lines[0].slice(3);
        const code = lines.slice(1, -1).join('\n');
        return (
          <pre key={i} className="my-4 p-4 bg-black/40 border border-white/10 rounded-xl overflow-x-auto">
            <code className="text-sm text-green-400 font-mono">{code}</code>
          </pre>
        );
      }
      
      // Display math ($$...$$)
      if (paragraph.startsWith('$$') && paragraph.endsWith('$$')) {
        const math = paragraph.slice(2, -2).trim();
        return (
          <div key={i} className="my-4 p-4 glass-card text-center">
            <span className="text-xl font-mono text-cyan-300">{math}</span>
          </div>
        );
      }
      
      // Bullet lists
      if (paragraph.includes('\n- ')) {
        const items = paragraph.split('\n').filter(l => l.startsWith('- '));
        return (
          <ul key={i} className="my-3 space-y-2">
            {items.map((item, j) => (
              <li key={j} className="flex gap-2 text-white/80">
                <span className="text-cyan-400 mt-1">&#x2022;</span>
                <span>{renderInline(item.slice(2))}</span>
              </li>
            ))}
          </ul>
        );
      }
      
      // Regular paragraph
      return (
        <p key={i} className="text-white/80 leading-relaxed mb-3">
          {renderInline(paragraph)}
        </p>
      );
    });
  };

  const renderInline = (text: string) => {
    // Handle inline code, bold, italic, inline math
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\$[^$]+\$)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="px-1.5 py-0.5 bg-white/10 rounded text-cyan-300 text-sm font-mono">{part.slice(1, -1)}</code>;
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('$') && part.endsWith('$')) {
        return <span key={i} className="px-1 font-mono text-cyan-300">{part.slice(1, -1)}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="glass-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen size={20} className="text-cyan-400" />
          <span className="text-sm text-white/60">Study Material</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/40">
          <Clock size={14} />
          <span>{readingTimeMin} min read</span>
        </div>
      </div>

      {/* Watch Explainer Button */}
      <button
        onClick={onStartExplainer}
        className="w-full glass-card p-4 flex items-center gap-4 hover:bg-white/10 transition-all group"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Play size={24} fill="white" />
        </div>
        <div className="text-left">
          <div className="font-bold">Watch Explainer</div>
          <div className="text-sm text-white/60">Animated walkthrough with narration</div>
        </div>
      </button>

      {/* Content */}
      <div className="glass-card p-6">
        {renderContent(content)}
      </div>

      {/* Key Points */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={18} className="text-yellow-400" />
          <h3 className="font-bold">Key Takeaways</h3>
        </div>
        <div className="space-y-3">
          {keyPoints.map((point, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-cyan-400">{i + 1}</span>
              </div>
              <span className="text-white/80 text-sm">{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mark as Read */}
      <button
        onClick={() => { setHasRead(true); onComplete(); }}
        disabled={hasRead}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
          hasRead
            ? 'bg-green-500/20 border border-green-500/40 text-green-400'
            : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400'
        }`}
      >
        {hasRead ? (
          <span className="flex items-center justify-center gap-2">
            <CheckCircle size={20} /> Completed
          </span>
        ) : (
          "I've studied this - ready for quiz"
        )}
      </button>
    </motion.div>
  );
}
