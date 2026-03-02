'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const categoryLabels: Record<string, string> = {
  science: 'Science & Biology',
  tech: 'Technology',
  math: 'Mathematics',
  language: 'Language & Reading',
};

const categoryOrder = ['science', 'tech', 'math', 'language'];

export default function Home() {
  const [domains, setDomains] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/v2/domains').then(r => r.json()).then(d => setDomains(d.domains || []));
    fetch('/api/v2/stats').then(r => r.json()).then(setStats);
  }, []);

  const grouped = categoryOrder.map(cat => ({
    category: cat,
    label: categoryLabels[cat],
    domains: domains.filter(d => d.category === cat),
  })).filter(g => g.domains.length > 0);

  return (
    <div className="min-h-screen pb-24" style={{ background: '#0a0908' }}>
      {/* Header */}
      <div className="px-5 pt-8 pb-6">
        <h1 className="text-3xl font-bold text-white">BrainForge</h1>
        <p className="text-white/40 text-sm mt-1">Universal Mastery Engine</p>
      </div>

      {/* Stats bar */}
      {stats && (
        <div className="px-5 mb-6">
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Papers', value: stats.papers },
              { label: 'Questions', value: stats.questions },
              { label: 'Flashcards', value: stats.flashcards },
              { label: 'Domains', value: stats.domains },
            ].map((s, i) => (
              <div key={i} className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.06] text-center">
                <div className="text-lg font-bold text-white">{s.value}</div>
                <div className="text-[10px] text-white/40">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Mix CTA */}
      <div className="px-5 mb-8">
        <Link href="/quiz?mode=daily" className="block bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl p-5 border border-amber-400/20">
          <div className="text-lg font-bold text-amber-400">Daily Mix</div>
          <div className="text-sm text-white/50 mt-1">15 questions from across all domains</div>
        </Link>
      </div>

      {/* Domain grid by category */}
      {grouped.map(group => (
        <div key={group.category} className="mb-8">
          <div className="px-5 mb-3">
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">{group.label}</h2>
          </div>
          <div className="px-5 grid grid-cols-2 gap-3">
            {group.domains.map(d => (
              <Link key={d.slug} href={`/domain/${d.slug}`}
                className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05] hover:border-white/[0.12] transition-all active:scale-[0.98]">
                <div className="w-8 h-8 rounded-lg mb-3 flex items-center justify-center text-lg"
                  style={{ background: `${d.color}20` }}>
                  <div className="w-3 h-3 rounded-full" style={{ background: d.color }}></div>
                </div>
                <div className="text-[13px] font-medium text-white/90 mb-1">{d.name}</div>
                <div className="text-[11px] text-white/30 mb-2 line-clamp-2">{d.description}</div>
                <div className="flex gap-3 text-[10px]">
                  <span className="text-white/40">{d.paper_count} papers</span>
                  <span style={{ color: d.color }}>{d.question_count} questions</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/[0.06] px-6 py-3 flex justify-around z-50">
        {[
          { label: 'Home', href: '/', active: true },
          { label: 'Domains', href: '/domains' },
          { label: 'Review', href: '/review' },
          { label: 'Progress', href: '/progress' },
        ].map(n => (
          <Link key={n.href} href={n.href} className={`text-[11px] ${n.active ? 'text-amber-400' : 'text-white/40'}`}>
            {n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
