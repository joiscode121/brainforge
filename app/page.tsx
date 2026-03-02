'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ClientLayout from '@/components/ClientLayout';
import { loadProgress, updateStreak, saveProgress } from '@/lib/storage';
import { loadAllDomains, Domain } from '@/lib/domains';
import { getReviewCount } from '@/lib/spaced-repetition';
import { Flame, Play, Target, BookOpen, Brain, RotateCcw } from 'lucide-react';

export default function Home() {
  const [progress, setProgress] = useState(loadProgress());
  const [domains, setDomains] = useState<Domain[]>([]);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    const updatedProgress = updateStreak(progress);
    if (updatedProgress.streak !== progress.streak) {
      setProgress(updatedProgress);
      saveProgress(updatedProgress);
    }

    loadAllDomains().then(setDomains);
    setReviewCount(getReviewCount(progress.reviewQueue));
  }, []);

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
      <div className="max-w-2xl mx-auto p-6 space-y-6">
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

        {/* Streak + XP Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flame className="text-orange-500" size={24} />
                <span className="text-3xl font-bold">{progress.streak}</span>
                <span className="text-white/60">day streak</span>
              </div>
              <div className="text-sm text-white/60">
                Level {progress.level} | {progress.xp} XP
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-cyan-400">
                {progress.xp % 100}
              </div>
              <div className="text-xs text-white/60">/ 100 to Level {progress.level + 1}</div>
            </div>
          </div>
          
          <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${(progress.xp % 100)}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Today's Lesson */}
        {todaysTopic && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href={`/learn/${todaysTopic.domain.id}/${todaysTopic.topic.id}`}>
              <div className="glass-card p-6 hover:bg-white/10 cursor-pointer group border border-cyan-500/20">
                <div className="text-xs text-cyan-400 uppercase tracking-wider mb-3 font-medium">
                  Today's Lesson
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="text-white" size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{todaysTopic.topic.title}</h3>
                    <p className="text-sm text-white/60">{todaysTopic.domain.name} | {todaysTopic.topic.difficulty}</p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-4"
        >
          <Link href="/domains">
            <div className="glass-card p-5 hover:bg-white/10 cursor-pointer text-center group">
              <Brain className="text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" size={28} />
              <div className="font-bold text-sm">Explore</div>
              <div className="text-xs text-white/40">{domains.length} domains</div>
            </div>
          </Link>
          
          <Link href="/review">
            <div className="glass-card p-5 hover:bg-white/10 cursor-pointer text-center group relative">
              <RotateCcw className="text-cyan-400 mx-auto mb-2 group-hover:scale-110 transition-transform" size={28} />
              <div className="font-bold text-sm">Review</div>
              <div className="text-xs text-white/40">{reviewCount} due</div>
              {reviewCount > 0 && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
                  {reviewCount}
                </div>
              )}
            </div>
          </Link>
        </motion.div>

        {/* Domain Progress */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg font-bold mb-3">Your Domains</h2>
          <div className="space-y-3">
            {domains.map((domain, i) => {
              const dp = progress.domains[domain.id];
              const totalQ = domain.topics 
                ? domain.topics.reduce((s, t) => s + (t.questions?.length || 0), 0)
                : domain.levels 
                  ? Object.values(domain.levels).reduce((s, l) => s + l.questions.length, 0)
                  : 0;
              const completed = dp?.completedQuestions?.length || 0;
              const pct = totalQ > 0 ? Math.round((completed / totalQ) * 100) : 0;

              return (
                <Link key={domain.id} href={`/domain/${domain.id}`}>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="glass-card p-4 hover:bg-white/10 cursor-pointer group flex items-center gap-4"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: `${domain.color}15`, border: `1.5px solid ${domain.color}30` }}
                    >
                      {domain.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{domain.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${pct}%`, background: domain.color }}
                          />
                        </div>
                        <span className="text-xs text-white/40 w-8 text-right">{pct}%</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </ClientLayout>
  );
}
