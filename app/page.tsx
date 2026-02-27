'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ClientLayout from '@/components/ClientLayout';
import { loadProgress, updateStreak, saveProgress } from '@/lib/storage';
import { loadAllDomains, Domain } from '@/lib/domains';
import { getReviewCount } from '@/lib/spaced-repetition';
import { Flame, Play, Target } from 'lucide-react';

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

  return (
    <ClientLayout>
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            BrainForge
          </h1>
          <p className="text-white/60 text-sm">Master everything, one question at a time</p>
        </div>

        {/* Streak & XP Card */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flame className="text-orange-500" size={24} />
                <span className="text-3xl font-bold">{progress.streak}</span>
                <span className="text-white/60">day streak</span>
              </div>
              <div className="text-sm text-white/60">
                Level {progress.level} · {progress.xp} XP
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-cyan-400">
                {progress.xp % 100}
              </div>
              <div className="text-xs text-white/60">/ 100 to Level {progress.level + 1}</div>
            </div>
          </div>
          
          {/* XP Progress bar */}
          <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-500"
              style={{ width: `${(progress.xp % 100)}%` }}
            />
          </div>
        </div>

        {/* Daily Mix */}
        <Link href="/daily-mix" className="block">
          <div className="glass-card p-6 hover:bg-white/10 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="text-white" size={24} fill="white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Daily Mix</h3>
                  <p className="text-sm text-white/60">15-20 min curated session</p>
                </div>
              </div>
              <Target className="text-cyan-400" size={32} />
            </div>
          </div>
        </Link>

        {/* Review Queue */}
        {reviewCount > 0 && (
          <Link href="/review" className="block">
            <div className="glass-card p-6 border-2 border-orange-500/50 hover:bg-orange-500/10 cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">Review Queue</h3>
                  <p className="text-sm text-white/60">{reviewCount} cards due today</p>
                </div>
                <div className="text-3xl font-bold text-orange-500">{reviewCount}</div>
              </div>
            </div>
          </Link>
        )}

        {/* Domain Progress Rings */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Your Domains</h2>
          <div className="grid grid-cols-2 gap-4">
            {domains.map((domain) => {
              const domainProgress = progress.domains[domain.id];
              const xp = domainProgress?.xp || 0;
              const level = domainProgress?.level || 1;
              const progressPercent = (xp % 50) * 2; // 0-100%

              return (
                <Link key={domain.id} href={`/domain/${domain.id}`}>
                  <div className="glass-card p-4 hover:bg-white/10 cursor-pointer group">
                    <div className="flex flex-col items-center gap-3">
                      {/* Progress Ring */}
                      <div className="relative w-20 h-20">
                        <svg className="transform -rotate-90" width="80" height="80">
                          {/* Background circle */}
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="6"
                            fill="none"
                          />
                          {/* Progress circle */}
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke={domain.color}
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray={`${progressPercent * 2.26} 226`}
                            strokeLinecap="round"
                            className="transition-all duration-500"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-2xl">
                          {domain.icon}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="font-semibold text-sm">{domain.name}</div>
                        <div className="text-xs text-white/60">Level {level}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="glass-card p-6">
          <h3 className="font-bold mb-4">Today's Goal</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/60">Complete 10 questions</span>
              <span className="text-cyan-400 font-semibold">0/10</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400 w-0" />
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
