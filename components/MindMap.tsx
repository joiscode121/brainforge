'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MindMapProps {
  diagram: string;
  title: string;
}

export default function MindMap({ diagram, title }: MindMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            primaryColor: '#06b6d4',
            primaryTextColor: '#fff',
            primaryBorderColor: '#06b6d4',
            lineColor: '#a855f7',
            secondaryColor: '#3b82f6',
            tertiaryColor: '#1a0a2e',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px'
          },
          mindmap: {
            padding: 16,
            useMaxWidth: true,
          }
        });
        
        const id = `mermaid-${Math.random().toString(36).slice(2)}`;
        const { svg: renderedSvg } = await mermaid.render(id, diagram);
        setSvg(renderedSvg);
      } catch (e) {
        console.error('Mermaid render error:', e);
        setError(true);
      }
    };

    if (diagram) renderDiagram();
  }, [diagram]);

  if (error) {
    return (
      <div className="glass-card p-6 text-center text-white/40">
        <p>Mind map visualization unavailable</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-4 overflow-x-auto"
    >
      <div className="text-xs text-white/40 uppercase tracking-wider mb-3">{title} - Mind Map</div>
      <div
        ref={containerRef}
        className="min-h-[200px] flex items-center justify-center [&_svg]:max-w-full [&_svg]:h-auto [&_text]:fill-white"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </motion.div>
  );
}
