'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ClientLayout from '@/components/ClientLayout';
import { loadProgress } from '@/lib/storage';
import { loadAllDomains, Domain } from '@/lib/domains';
import { TrendingUp, Award, Flame, Zap } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 1, 0.5, 1] as const }
  })
};

export default function ProgressPage() {
  const [progress] = useState(loadProgress());
  const [domains, setDomains] = useState<Domain[]>([]);

  useEffect(() => {
    loadAllDomains().then(setDomains);
  }, []);

  const stats = [
    { icon: Award, label: 'Level', value: progress.level, color: 'var(--warning)' },
    { icon: Zap, label: 'Total XP', value: progress.xp, color: 'var(--accent)' },
    { icon: Flame, label: 'Streak', value: progress.streak, color: 'oklch(60% 0.18 30)' },
    { icon: TrendingUp, label: 'Reviews', value: progress.reviewQueue.length, color: 'var(--success)' },
  ];

  return (
    <ClientLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp} className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Your Progress</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Track your mastery journey</p>
        </motion.div>

        {/* Overall Stats — asymmetric layout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial="hidden" animate="visible" custom={1 + i * 0.3} variants={fadeUp}
              className="surface-card p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <stat.icon size={20} style={{ color: stat.color }} />
                <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
              </div>
              <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Domain Breakdown */}
        <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp}>
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Domain Mastery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {domains.map((domain, i) => {
              const domainProg = progress.domains[domain.id];
              const xp = domainProg?.xp || 0;
              const level = domainProg?.level || 1;

              return (
                <motion.div key={domain.id} initial="hidden" animate="visible" custom={4 + i * 0.2} variants={fadeUp}
                  className="surface-card p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-2xl">{domain.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm">{domain.name}</h3>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Level {level} · {xp} XP</div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {Object.entries(domainProg?.levelProgress || {}).map(([lvl, count]) => (
                      <div key={lvl} className="flex items-center justify-between text-sm">
                        <span className="capitalize text-xs" style={{ color: 'var(--text-tertiary)' }}>{lvl}</span>
                        <span className="font-semibold text-xs">{count} completed</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </ClientLayout>
  );
}
