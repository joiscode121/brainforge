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
          theme: 'base',
          themeVariables: {
            primaryColor: '#c2785c',
            primaryTextColor: '#3a2e28',
            primaryBorderColor: '#c2785c',
            lineColor: '#8b7355',
            secondaryColor: '#e8dfd5',
            tertiaryColor: '#f5f0e8',
            fontFamily: 'DM Sans, system-ui, sans-serif',
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
      <div className="surface-card p-6 text-center" style={{ color: 'var(--text-muted)' }}>
        <p>Mind map visualization unavailable</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      className="surface-card p-4 overflow-x-auto"
    >
      <div className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>{title} — Mind Map</div>
      <div
        ref={containerRef}
        className="min-h-[200px] flex items-center justify-center [&_svg]:max-w-full [&_svg]:h-auto"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </motion.div>
  );
}
