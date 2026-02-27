'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ClientLayout from '@/components/ClientLayout';
import { loadDomain, Domain } from '@/lib/domains';
import { loadProgress } from '@/lib/storage';
import { Trophy, Zap, Target, BookOpen, HelpCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DomainPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [domain, setDomain] = useState<Domain | null>(null);
  const [progress, setProgress] = useState(loadProgress());
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (id) loadDomain(id).then(setDomain).catch(() => {});
  }, [id]);

  if (!domain) {
    return <ClientLayout><div className="p-6 text-center text-white/60">Loading domain...</div></ClientLayout>;
  }

  const domainProgress = progress.domains[domain.id];
  const topics = domain.topics || [];
  
  // Support both old (levels) and new (topics) format
  const hasTopics = topics.length > 0;
  
  const filteredTopics = filter === 'all' 
    ? topics 
    : topics.filter((t: any) => t.difficulty === filter);

  const completedCount = domainProgress?.completedQuestions?.length || 0;
  const totalQuestions = topics.reduce((sum: number, t: any) => sum + (t.questions?.length || 0), 0);

  return (
    <ClientLayout>
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Back */}
        <button onClick={() => router.push('/domains')} className="flex items-center gap-2 text-white/60 hover:text-white">
          <ArrowLeft size={18} /> All Domains
        </button>

        {/* Header */}
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
              <BookOpen className="text-cyan-400" size={18} />
              <div>
                <div className="text-xs text-white/60">Topics</div>
                <div className="font-bold">{topics.length}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <HelpCircle className="text-purple-400" size={18} />
              <div>
                <div className="text-xs text-white/60">Questions</div>
                <div className="font-bold">{totalQuestions}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Target className="text-green-400" size={18} />
              <div>
                <div className="text-xs text-white/60">Completed</div>
                <div className="font-bold">{completedCount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        {hasTopics && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['all', 'beginner', 'intermediate', 'advanced'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  filter === f
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Topics list */}
        {hasTopics ? (
          <div className="space-y-3">
            {filteredTopics.map((topic: any, i: number) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/learn/${domain.id}/${topic.id}`}>
                  <div className="glass-card p-5 hover:bg-white/10 cursor-pointer group active:scale-[0.98] transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                        style={{ background: `${domain.color}20`, color: domain.color }}>
                        {topic.chapter || i + 1}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base truncate">{topic.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            topic.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                            topic.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {topic.difficulty}
                          </span>
                          <span className="text-xs text-white/40">
                            {topic.questions?.length || 0} questions
                          </span>
                          {topic.study?.readingTimeMin && (
                            <span className="text-xs text-white/40">
                              {topic.study.readingTimeMin} min
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <ChevronRight className="text-white/30 group-hover:text-white/60 transition-colors" size={20} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Fallback for old levels format */
          <div className="space-y-4">
            {domain.levels && Object.entries(domain.levels).map(([levelKey, levelData]: [string, any]) => (
              <div
                key={levelKey}
                onClick={() => router.push(`/quiz?domain=${domain.id}&level=${levelKey}`)}
                className="glass-card p-6 hover:bg-white/10 cursor-pointer"
              >
                <h3 className="font-bold text-lg capitalize">{levelData.name}</h3>
                <p className="text-sm text-white/60">{levelData.description}</p>
                <p className="text-xs text-white/40 mt-2">{levelData.questions?.length || 0} questions</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
