'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ClientLayout from '@/components/ClientLayout';
import { loadAllDomains, Domain } from '@/lib/domains';
import { loadProgress } from '@/lib/storage';
import { ChevronRight, Newspaper, HelpCircle } from 'lucide-react';

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [v2Domains, setV2Domains] = useState<any[]>([]);
  const [progress, setProgress] = useState(loadProgress());

  useEffect(() => {
    loadAllDomains().then(setDomains);
    fetch('/api/v2/domains').then(r => r.json()).then(d => setV2Domains(d.domains || [])).catch(() => {});
  }, []);

  // Merge: local domains get V2 stats enrichment, V2-only domains get added
  const localIds = new Set(domains.map(d => d.id));
  const v2OnlyDomains = v2Domains.filter(d => !localIds.has(d.slug) && (d.paper_count > 0 || d.question_count > 0));

  const getV2Stats = (id: string) => v2Domains.find(d => d.slug === id);

  return (
    <ClientLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">All Domains</h1>
          <p className="text-white/60 text-sm sm:text-base">
            {domains.length + v2OnlyDomains.length} domains · {v2Domains.reduce((s, d) => s + d.paper_count, 0)} papers · {v2Domains.reduce((s, d) => s + d.question_count, 0)} questions
          </p>
        </div>

        {/* Course Domains (with structured topics/levels) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {domains.map((domain) => {
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
                <div className="glass-card p-4 sm:p-6 hover:bg-white/10 cursor-pointer group active:scale-[0.98] transition-all">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shrink-0"
                      style={{ background: `${domain.color}20`, border: `2px solid ${domain.color}40` }}
                    >
                      {domain.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base sm:text-lg truncate">{domain.name}</h3>
                      <p className="text-xs sm:text-sm text-white/60 mb-2 line-clamp-1">{domain.description}</p>
                      <div className="flex items-center gap-2 sm:gap-3 text-xs text-white/60 flex-wrap">
                        <span>Lvl {level}</span>
                        <span className="text-white/20">·</span>
                        <span>{xp} XP</span>
                        {topicCount > 0 && <><span className="text-white/20">·</span><span>{topicCount} {domain.topics?.length ? 'topics' : 'levels'}</span></>}
                        {totalQ > 0 && <><span className="text-white/20">·</span><span>{totalQ} questions</span></>}
                        {v2 && v2.paper_count > 0 && <><span className="text-white/20">·</span><span>{v2.paper_count} papers</span></>}
                      </div>
                    </div>
                    
                    <ChevronRight className="text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all shrink-0" size={20} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* V2-only Research Domains */}
        {v2OnlyDomains.length > 0 && (
          <>
            <div className="pt-2">
              <h2 className="text-lg sm:text-xl font-bold mb-1">Research Domains</h2>
              <p className="text-white/40 text-xs sm:text-sm">AI-scraped papers with auto-generated quizzes</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {v2OnlyDomains.map((d: any) => (
                <Link key={d.slug} href={`/domain/${d.slug}`}>
                  <div className="glass-card p-4 sm:p-6 hover:bg-white/10 cursor-pointer group active:scale-[0.98] transition-all">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shrink-0"
                        style={{ background: `${d.color || '#6366f1'}20`, border: `2px solid ${d.color || '#6366f1'}40` }}
                      >
                        {d.icon || '📚'}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg truncate">{d.name}</h3>
                        <p className="text-xs sm:text-sm text-white/60 mb-2 line-clamp-1">{d.description}</p>
                        <div className="flex items-center gap-2 sm:gap-3 text-xs text-white/60 flex-wrap">
                          {d.paper_count > 0 && <span className="flex items-center gap-1"><Newspaper size={12} /> {d.paper_count} papers</span>}
                          {d.question_count > 0 && <><span className="text-white/20">·</span><span className="flex items-center gap-1"><HelpCircle size={12} /> {d.question_count} questions</span></>}
                          {d.flashcard_count > 0 && <><span className="text-white/20">·</span><span>{d.flashcard_count} flashcards</span></>}
                        </div>
                      </div>
                      
                      <ChevronRight className="text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all shrink-0" size={20} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </ClientLayout>
  );
}
