'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ClientLayout from '@/components/ClientLayout';
import { loadProgress, updateStreak, saveProgress } from '@/lib/storage';
import { loadAllDomains, Domain } from '@/lib/domains';
import { getReviewCount } from '@/lib/spaced-repetition';
import { Flame, Play, Target, BookOpen, Brain, RotateCcw, ArrowRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.25, 1, 0.5, 1] as const }
  })
};

export default function Home() {
  const [progress, setProgress] = useState(loadProgress());
  const [domains, setDomains] = useState<Domain[]>([]);
  const [v2Domains, setV2Domains] = useState<any[]>([]);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    const updatedProgress = updateStreak(progress);
    if (updatedProgress.streak !== progress.streak) {
      setProgress(updatedProgress);
      saveProgress(updatedProgress);
    }

    loadAllDomains().then(setDomains);
    setReviewCount(getReviewCount(progress.reviewQueue));
    fetch('/api/v2/domains').then(r => r.json()).then(d => setV2Domains(d.domains || [])).catch(() => {});
  }, []);

  const localIds = new Set(domains.map(d => d.id));
  const v2OnlyDomains = v2Domains.filter(d => !localIds.has(d.slug) && (d.paper_count > 0 || d.question_count > 0));
  const totalDomainCount = domains.length + v2OnlyDomains.length;
  const totalPapers = v2Domains.reduce((s, d) => s + d.paper_count, 0);
  const totalQuestions = v2Domains.reduce((s, d) => s + d.question_count, 0);
  const getV2Stats = (id: string) => v2Domains.find(d => d.slug === id);

  const todaysTopic = domains.length > 0 ? (() => {
    const withTopics = domains.filter(d => d.topics && d.topics.length > 0);
    if (withTopics.length === 0) return null;
    const domain = withTopics[Math.floor(Math.random() * withTopics.length)];
    const topic = domain.topics![Math.floor(Math.random() * domain.topics!.length)];
    return { domain, topic };
  })() : null;

  return (
    <ClientLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        {/* Header — editorial, left-aligned */}
        <motion.header
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fadeUp}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            BrainForge
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Master everything, one topic at a time
          </p>
        </motion.header>

        {/* Dashboard — asymmetric grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
          {/* Streak + XP — full width on mobile, 2-col on desktop */}
          <motion.div
            initial="hidden" animate="visible" custom={1} variants={fadeUp}
            className="lg:col-span-2 surface-card p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--warning-light, oklch(92% 0.05 80))' }}>
                  <Flame size={20} style={{ color: 'var(--warning, oklch(65% 0.16 80))' }} />
                </div>
                <div>
                  <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{progress.streak}</div>
                  <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>day streak</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Level {progress.level}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{progress.xp} XP</div>
              </div>
            </div>
            <div className="progress-track h-2">
              <motion.div
                className="progress-fill h-full"
                style={{ background: 'var(--accent)' }}
                initial={{ width: 0 }}
                animate={{ width: `${(progress.xp % 100)}%` }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 1, 0.5, 1] as const }}
              />
            </div>
          </motion.div>

          {/* Quick actions — stacked */}
          <motion.div
            initial="hidden" animate="visible" custom={2} variants={fadeUp}
            className="flex flex-row lg:flex-col gap-3"
          >
            {todaysTopic && (
              <Link href={`/learn/${todaysTopic.domain.id}/${todaysTopic.topic.id}`} className="flex-1">
                <div className="accent-surface p-4 h-full transition-all hover:shadow-md">
                  <div className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--accent)' }}>
                    Today's Lesson
                  </div>
                  <div className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{todaysTopic.topic.title}</div>
                  <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-tertiary)' }}>
                    {todaysTopic.domain.name}
                  </div>
                </div>
              </Link>
            )}
            <Link href="/review" className="flex-1">
              <div className="surface-card-interactive p-4 h-full relative">
                <div className="flex items-center gap-2.5">
                  <RotateCcw size={18} style={{ color: 'var(--accent)' }} />
                  <div>
                    <div className="font-semibold text-sm">Review</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{reviewCount} due</div>
                  </div>
                </div>
                {reviewCount > 0 && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold text-white"
                       style={{ background: 'var(--error)' }}>
                    {reviewCount}
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Domain Progress — editorial section */}
        <motion.section
          initial="hidden" animate="visible" custom={3} variants={fadeUp}
        >
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Your Domains</h2>
              {totalPapers > 0 && (
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {totalPapers} papers · {totalQuestions} questions across {totalDomainCount} domains
                </p>
              )}
            </div>
            <Link href="/domains" className="text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all" style={{ color: 'var(--accent)' }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              ...domains.map(d => ({
                id: d.id, name: d.name, icon: d.icon, color: d.color,
                papers: getV2Stats(d.id)?.paper_count || 0,
                questions: (d.topics ? d.topics.reduce((s: number, t: any) => s + (t.questions?.length || 0), 0) : d.levels ? Object.values(d.levels).reduce((s: number, l: any) => { if (l.topics) return s + l.topics.reduce((ts: number, t: any) => ts + (t.questions?.length || 0), 0); return s + (l.questions?.length || 0); }, 0) : 0) + (getV2Stats(d.id)?.question_count || 0),
                pct: (() => { const dp = progress.domains[d.id]; const localQ = d.topics ? d.topics.reduce((s: number, t: any) => s + (t.questions?.length || 0), 0) : d.levels ? Object.values(d.levels).reduce((s: number, l: any) => { if (l.topics) return s + l.topics.reduce((ts: number, t: any) => ts + (t.questions?.length || 0), 0); return s + (l.questions?.length || 0); }, 0) : 0; const totalQ = localQ + (getV2Stats(d.id)?.question_count || 0); const completed = dp?.completedQuestions?.length || 0; return totalQ > 0 ? Math.round((completed / totalQ) * 100) : 0; })()
              })),
              ...v2OnlyDomains.map((d: any) => ({
                id: d.slug, name: d.name, icon: d.icon || '📚', color: d.color || '#6366f1',
                papers: d.paper_count, questions: d.question_count, pct: 0
              }))
            ].map((d, i) => (
              <Link key={d.id} href={`/domain/${d.id}`}>
                <motion.div
                  initial="hidden" animate="visible" custom={4 + i * 0.5} variants={fadeUp}
                  className="surface-card-interactive p-4 h-full"
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                         style={{ background: `color-mix(in oklch, ${d.color} 12%, var(--bg-base))` }}>
                      {d.icon}
                    </div>
                    <div className="font-semibold text-sm leading-tight flex-1" style={{ color: 'var(--text-primary)' }}>
                      {d.name}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="progress-track flex-1 h-1.5">
                      <div className="progress-fill h-full" style={{ width: `${d.pct}%`, background: d.color }} />
                    </div>
                    <span className="text-[11px] font-medium w-7 text-right" style={{ color: 'var(--text-muted)' }}>{d.pct}%</span>
                  </div>
                  {(d.papers > 0 || d.questions > 0) && (
                    <div className="text-[10px] mt-2" style={{ color: 'var(--text-muted)' }}>
                      {d.papers > 0 && `${d.papers} papers`}{d.papers > 0 && d.questions > 0 && ' · '}{d.questions > 0 && `${d.questions} Qs`}
                    </div>
                  )}
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.section>
      </div>
    </ClientLayout>
  );
}
