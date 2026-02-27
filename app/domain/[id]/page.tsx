'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ClientLayout from '@/components/ClientLayout';
import { loadDomain, Domain } from '@/lib/domains';
import { loadProgress } from '@/lib/storage';
import { Trophy, Target, Zap } from 'lucide-react';

const levelIcons = {
  beginner: '🌱',
  intermediate: '🔥',
  advanced: '⚡'
};

export default function DomainPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [domain, setDomain] = useState<Domain | null>(null);
  const [progress, setProgress] = useState(loadProgress());

  useEffect(() => {
    if (id) loadDomain(id).then(setDomain).catch(() => {});
  }, [id]);

  if (!domain) {
    return <ClientLayout><div className="p-6 text-center text-white/60">Loading domain...</div></ClientLayout>;
  }

  const domainProgress = progress.domains[domain.id];
  const level = domainProgress?.level || 1;

  const startQuiz = (levelName: string) => {
    router.push(`/quiz?domain=${domain.id}&level=${levelName}`);
  };

  return (
    <ClientLayout>
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
              style={{ background: `${domain.color}20`, border: `2px solid ${domain.color}` }}
            >
              {domain.icon}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{domain.name}</h1>
              <p className="text-white/60 text-sm">{domain.description}</p>
            </div>
          </div>

          <div className="flex gap-6 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <Trophy className="text-yellow-500" size={20} />
              <div>
                <div className="text-xs text-white/60">Level</div>
                <div className="font-bold">{level}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="text-cyan-400" size={20} />
              <div>
                <div className="text-xs text-white/60">XP</div>
                <div className="font-bold">{domainProgress?.xp || 0}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Target className="text-purple-400" size={20} />
              <div>
                <div className="text-xs text-white/60">Completed</div>
                <div className="font-bold">{domainProgress?.completedQuestions?.length || 0}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Choose Your Level</h2>

          {Object.entries(domain.levels).map(([levelKey, levelData]) => {
            const completed = domainProgress?.levelProgress?.[levelKey as keyof typeof domainProgress.levelProgress] || 0;
            const total = levelData.questions.length;
            const progressPercent = total > 0 ? (completed / total) * 100 : 0;

            return (
              <div
                key={levelKey}
                onClick={() => startQuiz(levelKey)}
                className="glass-card p-6 hover:bg-white/10 cursor-pointer group active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{levelIcons[levelKey as keyof typeof levelIcons]}</div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg capitalize">{levelData.name}</h3>
                      <span className="text-xs text-white/60 bg-white/10 px-2 py-0.5 rounded-full">
                        {completed}/{total}
                      </span>
                    </div>
                    <p className="text-sm text-white/60 mb-3">{levelData.description}</p>
                    
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${progressPercent}%`,
                          background: `linear-gradient(90deg, ${domain.color}, ${domain.color}CC)`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ClientLayout>
  );
}
