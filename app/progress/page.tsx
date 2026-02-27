'use client';

import { useState, useEffect } from 'react';
import ClientLayout from '@/components/ClientLayout';
import { loadProgress } from '@/lib/storage';
import { loadAllDomains, Domain } from '@/lib/domains';
import { TrendingUp, Award, Flame, Zap } from 'lucide-react';

export default function ProgressPage() {
  const [progress] = useState(loadProgress());
  const [domains, setDomains] = useState<Domain[]>([]);

  useEffect(() => {
    loadAllDomains().then(setDomains);
  }, []);

  return (
    <ClientLayout>
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
          <p className="text-white/60">Track your mastery journey</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Award className="text-yellow-500" size={24} />
              <span className="text-white/60">Level</span>
            </div>
            <div className="text-4xl font-bold">{progress.level}</div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="text-cyan-400" size={24} />
              <span className="text-white/60">Total XP</span>
            </div>
            <div className="text-4xl font-bold">{progress.xp}</div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Flame className="text-orange-500" size={24} />
              <span className="text-white/60">Streak</span>
            </div>
            <div className="text-4xl font-bold">{progress.streak}</div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-green-500" size={24} />
              <span className="text-white/60">Reviews</span>
            </div>
            <div className="text-4xl font-bold">{progress.reviewQueue.length}</div>
          </div>
        </div>

        {/* Domain Breakdown */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Domain Mastery</h2>
          {domains.map((domain) => {
            const domainProg = progress.domains[domain.id];
            const xp = domainProg?.xp || 0;
            const level = domainProg?.level || 1;
            const completed = domainProg?.completedQuestions.length || 0;

            return (
              <div key={domain.id} className="glass-card p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl">{domain.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold">{domain.name}</h3>
                    <div className="text-sm text-white/60">Level {level} · {xp} XP</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {Object.entries(domainProg?.levelProgress || {}).map(([lvl, count]) => (
                    <div key={lvl} className="flex items-center justify-between text-sm">
                      <span className="capitalize text-white/60">{lvl}</span>
                      <span className="font-semibold">{count} completed</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ClientLayout>
  );
}
