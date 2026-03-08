'use client';

import { useTheme } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  const { theme, toggleTheme } = useTheme();
  const isForge = theme === 'forge';

  if (size === 'lg') {
    return (
      <button
        onClick={toggleTheme}
        className="theme-toggle-lg"
        aria-label={`Switch to ${isForge ? 'Scholar' : 'Forge'} theme`}
      >
        <div className="theme-toggle-track">
          <div className={`theme-toggle-thumb ${isForge ? 'translate-x-7' : 'translate-x-0.5'}`}>
            {isForge ? <Moon size={14} /> : <Sun size={14} />}
          </div>
          <span className="theme-toggle-label-left">{isForge ? '' : '☀'}</span>
          <span className="theme-toggle-label-right">{isForge ? '🌙' : ''}</span>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn"
      aria-label={`Switch to ${isForge ? 'Scholar' : 'Forge'} theme`}
    >
      <div className="theme-toggle-icon">
        {isForge ? <Sun size={18} /> : <Moon size={18} />}
      </div>
    </button>
  );
}
