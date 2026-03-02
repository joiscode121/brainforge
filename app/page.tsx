'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ClientLayout from '@/components/ClientLayout';
import { loadProgress, updateStreak, saveProgress } from '@/lib/storage';
import { loadAllDomains, Domain } from '@/lib/domains';
import { getReviewCount } from '@/lib/spaced-repetition';
import { Flame, Play, Target, BookOpen, Brain, RotateCcw, Newspaper } from 'lucide-react';

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

  // V2-only domains (not in local JSON)
  const localIds = new Set(domains.map(d => d.id));
  const v2OnlyDomains = v2Domains.filter(d => !localIds.has(d.slug) && (d.paper_count > 0 || d.question_count > 0));
  const totalDomainCount = domains.length + v2OnlyDomains.length;
  const totalPapers = v2Domains.reduce((s, d) => s + d.paper_count, 0);
  const totalQuestions = v2Domains.reduce((s, d) => s + d.question_count, 0);

  const getV2Stats = (id: string) => v2Domains.find(d => d.slug === id);

  // Pick a random topic for "Today's Lesson"
  const todaysTopic = domains.length > 0 ? (() => {
    const withTopics = domains.filter(d => d.topics && d.topics.length > 0);
    if (withTopics.length === 0) return null;
    const domain = withTopics[Math.floor(Math.random() * withTopics.length)];
    const topic = domain.topics![Math.floor(Math.random() * domain.topics!.length)];
    return { domain, topic };
  })() : null;

  return (
    <ClientLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            BrainForge
          </h1>
          <p className="text-white/60 text-sm">Master everything, one topic at a time</p>
        </motion.div>

        {/* Dashboard Row: Streak | Today's Lesson | Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {/* Streak */}
          <div className="glass-card p-4 col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="text-orange-500" size={20} />
                <span className="text-2xl font-bold">{progress.streak}</span>
                <span className="text-white/60 text-sm">day streak</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/60">Lvl {progress.level} · {progress.xp} XP</div>
              </div>
            </div>
            <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${(progress.xp % 100)}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>
          </div>

          {/* Today's Lesson */}
          {todaysTopic ? (
            <Link href={`/learn/${todaysTopic.domain.id}/${todaysTopic.topic.id}`} className="col-span-2 lg:col-span-1">
              <div className="glass-card p-4 hover:bg-white/10 cursor-pointer group border border-cyan-500/20 h-full">
                <div className="text-[10px] text-cyan-400 uppercase tracking-wider mb-2 font-medium">Today's Lesson</div>
                <div className="font-bold text-sm truncate">{todaysTopic.topic.title}</div>
                <div className="text-xs text-white/40 truncate">{todaysTopic.domain.name} · {todaysTopic.topic.difficulty}</div>
              </div>
            </Link>
          ) : (
            <div className="glass-card p-4 col-span-2 lg:col-span-1 flex items-center justify-center text-white/20 text-sm">No lesson today</div>
          )}

          {/* Quick Actions */}
          <div className="col-span-2 lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-3">
            <Link href="/domains">
              <div className="glass-card p-3 hover:bg-white/10 cursor-pointer group flex items-center gap-3 h-full">
                <Brain className="text-purple-400 shrink-0" size={20} />
                <div>
                  <div className="font-bold text-sm">Explore</div>
                  <div className="text-[10px] text-white/40">{totalDomainCount} domains</div>
                </div>
              </div>
            </Link>
            <Link href="/review">
              <div className="glass-card p-3 hover:bg-white/10 cursor-pointer group flex items-center gap-3 relative h-full">
                <RotateCcw className="text-cyan-400 shrink-0" size={20} />
                <div>
                  <div className="font-bold text-sm">Review</div>
                  <div className="text-[10px] text-white/40">{reviewCount} due</div>
                </div>
                {reviewCount > 0 && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full text-[9px] flex items-center justify-center font-bold">{reviewCount}</div>
                )}
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Domain Progress */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg font-bold mb-1">Your Domains</h2>
          {totalPapers > 0 && (
            <p className="text-xs text-white/40 mb-3">{totalPapers} papers · {totalQuestions} AI questions across all domains</p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {/* Merge all domains into one unified list */}
            {[
              ...domains.map(d => ({
                id: d.id, name: d.name, icon: d.icon, color: d.color,
                papers: getV2Stats(d.id)?.paper_count || 0,
                questions: (d.topics ? d.topics.reduce((s: number, t: any) => s + (t.questions?.length || 0), 0) : d.levels ? Object.values(d.levels).reduce((s: number, l: any) => s + (l as any).questions.length, 0) : 0) + (getV2Stats(d.id)?.question_count || 0),
                pct: (() => { const dp = progress.domains[d.id]; const localQ = d.topics ? d.topics.reduce((s: number, t: any) => s + (t.questions?.length || 0), 0) : d.levels ? Object.values(d.levels).reduce((s: number, l: any) => s + (l as any).questions.length, 0) : 0; const totalQ = localQ + (getV2Stats(d.id)?.question_count || 0); const completed = dp?.completedQuestions?.length || 0; return totalQ > 0 ? Math.round((completed / totalQ) * 100) : 0; })()
              })),
              ...v2OnlyDomains.map((d: any) => ({
                id: d.slug, name: d.name, icon: d.icon || '📚', color: d.color || '#6366f1',
                papers: d.paper_count, questions: d.question_count, pct: 0
              }))
            ].map((d, i) => (
              <Link key={d.id} href={`/domain/${d.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.03 }}
                  className="glass-card p-3 hover:bg-white/10 cursor-pointer group active:scale-[0.98] h-full"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-lg shrink-0"
                      style={{ background: `${d.color}15` }}
                    >
                      {d.icon}
                    </div>
                    <div className="font-semibold text-xs truncate flex-1">{d.name}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${d.pct}%`, background: d.color }} />
                    </div>
                    <span className="text-[10px] text-white/40 w-6 text-right">{d.pct}%</span>
                  </div>
                  <div className="text-[10px] text-white/25 mt-1 truncate">
                    {d.papers > 0 && `${d.papers} papers`}{d.papers > 0 && d.questions > 0 && ' · '}{d.questions > 0 && `${d.questions} Qs`}
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </ClientLayout>
  );
}
