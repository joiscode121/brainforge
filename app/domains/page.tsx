'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ClientLayout from '@/components/ClientLayout';
import { loadAllDomains, Domain } from '@/lib/domains';
import { loadProgress } from '@/lib/storage';
import { ChevronRight, Newspaper, HelpCircle } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.25, 1, 0.5, 1] as const }
  })
};

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [v2Domains, setV2Domains] = useState<any[]>([]);
  const [progress, setProgress] = useState(loadProgress());

  useEffect(() => {
    loadAllDomains().then(setDomains);
    fetch('/api/v2/domains').then(r => r.json()).then(d => setV2Domains(d.domains || [])).catch(() => {});
  }, []);

  const localIds = new Set(domains.map(d => d.id));
  const v2OnlyDomains = v2Domains.filter(d => !localIds.has(d.slug) && (d.paper_count > 0 || d.question_count > 0));
  const getV2Stats = (id: string) => v2Domains.find(d => d.slug === id);

  return (
    <ClientLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-6">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp} className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>All Domains</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
            {domains.length + v2OnlyDomains.length} domains · {v2Domains.reduce((s, d) => s + d.paper_count, 0)} papers · {v2Domains.reduce((s, d) => s + d.question_count, 0)} questions
          </p>
        </motion.div>

        {/* Course Domains */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          {domains.map((domain, i) => {
            const domainProgress = progress.domains[domain.id];
            const level = domainProgress?.level || 1;
            const xp = domainProgress?.xp || 0;
            const v2 = getV2Stats(domain.id);
            const topicCount = domain.topics?.length || (domain.levels ? Object.keys(domain.levels).length : 0);
            const localQ = domain.topics
              ? domain.topics.reduce((s: number, t: any) => s + (t.questions?.length || 0), 0)
              : domain.levels
                ? Object.values(domain.levels).reduce((s: number, l: any) => s + (l.questions?.length || 0), 0)
                : 0;
            const totalQ = localQ + (v2?.question_count || 0);

            return (
              <Link key={domain.id} href={`/domain/${domain.id}`}>
                <motion.div
                  initial="hidden" animate="visible" custom={1 + i * 0.3} variants={fadeUp}
                  className="surface-card-interactive p-4 sm:p-5"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-2xl sm:text-3xl shrink-0"
                      style={{ background: `color-mix(in oklch, ${domain.color} 15%, var(--bg-surface))` }}
                    >
                      {domain.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base truncate" style={{ color: 'var(--text-primary)' }}>{domain.name}</h3>
                      <p className="text-xs line-clamp-1 mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{domain.description}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs flex-wrap" style={{ color: 'var(--text-muted)' }}>
                        <span>Lvl {level}</span>
                        <span style={{ color: 'var(--border)' }}>·</span>
                        <span>{xp} XP</span>
                        {topicCount > 0 && <><span style={{ color: 'var(--border)' }}>·</span><span>{topicCount} {domain.topics?.length ? 'topics' : 'levels'}</span></>}
                        {totalQ > 0 && <><span style={{ color: 'var(--border)' }}>·</span><span>{totalQ} questions</span></>}
                        {v2 && v2.paper_count > 0 && <><span style={{ color: 'var(--border)' }}>·</span><span>{v2.paper_count} papers</span></>}
                      </div>
                    </div>

                    <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} className="shrink-0" />
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* V2-only Research Domains */}
        {v2OnlyDomains.length > 0 && (
          <>
            <motion.div initial="hidden" animate="visible" custom={domains.length * 0.3 + 2} variants={fadeUp} className="mb-4">
              <h2 className="text-lg sm:text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Research Domains</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>AI-scraped papers with auto-generated quizzes</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {v2OnlyDomains.map((d: any, i: number) => (
                <Link key={d.slug} href={`/domain/${d.slug}`}>
                  <motion.div
                    initial="hidden" animate="visible" custom={domains.length * 0.3 + 3 + i * 0.3} variants={fadeUp}
                    className="surface-card-interactive p-4 sm:p-5"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-2xl sm:text-3xl shrink-0"
                        style={{ background: `color-mix(in oklch, ${d.color || '#6366f1'} 15%, var(--bg-surface))` }}
                      >
                        {d.icon || '📚'}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base truncate" style={{ color: 'var(--text-primary)' }}>{d.name}</h3>
                        <p className="text-xs line-clamp-1 mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{d.description}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs flex-wrap" style={{ color: 'var(--text-muted)' }}>
                          {d.paper_count > 0 && <span className="flex items-center gap-1"><Newspaper size={11} /> {d.paper_count} papers</span>}
                          {d.question_count > 0 && <><span style={{ color: 'var(--border)' }}>·</span><span className="flex items-center gap-1"><HelpCircle size={11} /> {d.question_count} questions</span></>}
                          {d.flashcard_count > 0 && <><span style={{ color: 'var(--border)' }}>·</span><span>{d.flashcard_count} flashcards</span></>}
                        </div>
                      </div>

                      <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} className="shrink-0" />
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </ClientLayout>
  );
}
