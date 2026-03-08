'use client';

import { motion } from 'framer-motion';
import ClientLayout from '@/components/ClientLayout';
import { Bell, Moon, Info } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 1, 0.5, 1] as const }
  })
};

export default function SettingsPage() {
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
            <h3 className="font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>Appearance</h3>
            <div className="flex items-center gap-3 mb-2">
              <Moon size={18} style={{ color: 'var(--info)' }} />
              <span className="text-sm">Light Mode</span>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Warm editorial theme for focused learning</p>
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
