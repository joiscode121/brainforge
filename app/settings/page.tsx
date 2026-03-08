'use client';

import { motion } from 'framer-motion';
import ClientLayout from '@/components/ClientLayout';
import { useTheme, ThemeMode } from '@/components/ThemeProvider';
import { Bell, Moon, Sun, Info, Check, Sparkles, BookOpen } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 1, 0.5, 1] as const }
  })
};

const themes: { id: ThemeMode; name: string; desc: string; icon: typeof Sun; preview: { bg: string; accent: string; text: string } }[] = [
  {
    id: 'scholar',
    name: 'Editorial Scholar',
    desc: 'Warm cream & terracotta — refined, magazine-inspired',
    icon: BookOpen,
    preview: { bg: '#f5f0e8', accent: '#b05a3a', text: '#3d3529' }
  },
  {
    id: 'forge',
    name: 'Dark Forge',
    desc: 'Glassmorphism with cyan & purple — immersive, futuristic',
    icon: Sparkles,
    preview: { bg: '#0a0a1a', accent: '#22d3ee', text: '#e2e8f0' }
  }
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp} className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Settings</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Customize your learning experience</p>
        </motion.div>

        <div className="space-y-4 max-w-xl">
          <motion.div initial="hidden" animate="visible" custom={1} variants={fadeUp} className="surface-card p-5">
            <h3 className="font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Notifications</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={18} style={{ color: 'var(--accent)' }} />
                <span className="text-sm">Daily Reminders</span>
              </div>
              <button className="w-11 h-6 rounded-full relative transition-colors" style={{ background: 'var(--bg-sunken)' }}>
                <div className="w-5 h-5 rounded-full absolute top-0.5 left-0.5 transition-transform"
                     style={{ background: 'var(--text-muted)' }} />
              </button>
            </div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" custom={2} variants={fadeUp} className="surface-card p-5">
            <h3 className="font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Appearance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {themes.map(t => {
                const isActive = theme === t.id;
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className="relative rounded-xl p-4 text-left transition-all border-2"
                    style={{
                      borderColor: isActive ? 'var(--accent)' : 'var(--border-subtle)',
                      boxShadow: isActive ? '0 0 0 3px var(--accent-subtle)' : 'none',
                    }}
                  >
                    {/* Theme preview strip */}
                    <div className="w-full h-16 rounded-lg mb-3 overflow-hidden relative"
                         style={{ background: t.preview.bg }}>
                      <div className="absolute inset-0 flex items-center justify-center gap-2">
                        <div className="w-8 h-2 rounded-full" style={{ background: t.preview.accent }} />
                        <div className="w-12 h-2 rounded-full" style={{ background: t.preview.text, opacity: 0.3 }} />
                        <div className="w-6 h-2 rounded-full" style={{ background: t.preview.accent, opacity: 0.5 }} />
                      </div>
                      {t.id === 'forge' && (
                        <div className="absolute top-2 left-2 w-6 h-6 rounded-full opacity-30"
                             style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon size={16} style={{ color: isActive ? 'var(--accent)' : 'var(--text-tertiary)' }} />
                      <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                        {t.name}
                      </span>
                      {isActive && (
                        <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center"
                             style={{ background: 'var(--accent)' }}>
                          <Check size={12} color="white" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.desc}</p>
                  </button>
                );
              })}
            </div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp} className="surface-card p-5">
            <h3 className="font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>About</h3>
            <div className="space-y-1.5 text-sm" style={{ color: 'var(--text-tertiary)' }}>
              <div className="flex items-center gap-2"><Info size={14} /> BrainForge v1.0.0</div>
              <div>Built with Next.js 14 + TypeScript</div>
              <div>Powered by spaced repetition (SM-2)</div>
            </div>
          </motion.div>
        </div>
      </div>
    </ClientLayout>
  );
}
