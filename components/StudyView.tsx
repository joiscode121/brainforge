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

  const renderContent = (text: string) => {
    return text.split('\n\n').map((paragraph, i) => {
      if (paragraph.startsWith('### ')) {
        return <h3 key={i} className="text-lg font-bold mt-6 mb-2" style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>{paragraph.slice(4)}</h3>;
      }
      if (paragraph.startsWith('## ')) {
        return <h2 key={i} className="text-xl font-bold mt-6 mb-3" style={{ fontFamily: 'var(--font-display)' }}>{paragraph.slice(3)}</h2>;
      }

      if (paragraph.startsWith('```')) {
        const lines = paragraph.split('\n');
        const code = lines.slice(1, -1).join('\n');
        return (
          <pre key={i} className="my-4 p-4 rounded-lg overflow-x-auto" style={{ background: 'var(--bg-sunken)', border: '1px solid var(--border-subtle)' }}>
            <code className="text-sm font-mono" style={{ color: 'var(--accent-dark)' }}>{code}</code>
          </pre>
        );
      }

      if (paragraph.startsWith('$$') && paragraph.endsWith('$$')) {
        const math = paragraph.slice(2, -2).trim();
        return (
          <div key={i} className="my-4 p-4 text-center surface-card">
            <span className="text-xl font-mono" style={{ color: 'var(--accent)' }}>{math}</span>
          </div>
        );
      }

      if (paragraph.includes('\n- ')) {
        const items = paragraph.split('\n').filter(l => l.startsWith('- '));
        return (
          <ul key={i} className="my-3 space-y-2">
            {items.map((item, j) => (
              <li key={j} className="flex gap-2">
                <span className="mt-0.5" style={{ color: 'var(--accent)' }}>•</span>
                <span style={{ color: 'var(--text-secondary)' }}>{renderInline(item.slice(2))}</span>
              </li>
            ))}
          </ul>
        );
      }

      return (
        <p key={i} className="leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
          {renderInline(paragraph)}
        </p>
      );
    });
  };

  const renderInline = (text: string) => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\$[^$]+\$)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="px-1.5 py-0.5 rounded text-sm font-mono" style={{ background: 'var(--bg-sunken)', color: 'var(--accent-dark)' }}>{part.slice(1, -1)}</code>;
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold" style={{ color: 'var(--text-primary)' }}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('$') && part.endsWith('$')) {
        return <span key={i} className="px-1 font-mono" style={{ color: 'var(--accent)' }}>{part.slice(1, -1)}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="surface-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen size={18} style={{ color: 'var(--accent)' }} />
          <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Study Material</span>
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          <Clock size={14} />
          <span>{readingTimeMin} min read</span>
        </div>
      </div>

      {/* Watch Explainer Button */}
      <button
        onClick={onStartExplainer}
        className="w-full surface-card-interactive p-4 flex items-center gap-4 group"
      >
        <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform"
             style={{ background: 'var(--accent)' }}>
          <Play size={22} fill="white" className="text-white" />
        </div>
        <div className="text-left">
          <div className="font-bold text-sm">Watch Explainer</div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Animated walkthrough with narration</div>
        </div>
      </button>

      {/* Content */}
      <div className="surface-card p-6">
        {renderContent(content)}
      </div>

      {/* Key Points */}
      <div className="surface-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={18} style={{ color: 'var(--warning)' }} />
          <h3 className="font-bold" style={{ fontFamily: 'var(--font-display)' }}>Key Takeaways</h3>
        </div>
        <div className="space-y-3">
          {keyPoints.map((point, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                   style={{ background: 'var(--accent-subtle)', border: '1px solid oklch(82% 0.06 35)' }}>
                <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>{i + 1}</span>
              </div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mark as Read */}
      <button
        onClick={() => { setHasRead(true); onComplete(); }}
        disabled={hasRead}
        className="w-full py-4 rounded-xl font-bold text-lg transition-all"
        style={hasRead
          ? { background: 'var(--success-light)', border: '1px solid var(--success)', color: 'var(--success)' }
          : { background: 'var(--accent)', color: 'white' }
        }
      >
        {hasRead ? (
          <span className="flex items-center justify-center gap-2">
            <CheckCircle size={20} /> Completed
          </span>
        ) : (
          "I've studied this — ready for quiz"
        )}
      </button>
    </motion.div>
  );
}
