'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ClientLayout from '@/components/ClientLayout';
import { loadAllDomains, Domain } from '@/lib/domains';
import { loadProgress } from '@/lib/storage';
import { ChevronRight } from 'lucide-react';

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [progress, setProgress] = useState(loadProgress());

  useEffect(() => {
    loadAllDomains().then(setDomains);
  }, []);

  return (
    <ClientLayout>
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">All Domains</h1>
          <p className="text-white/60">Choose your path to mastery</p>
        </div>

        <div className="space-y-4">
          {domains.map((domain) => {
            const domainProgress = progress.domains[domain.id];
            const level = domainProgress?.level || 1;
            const xp = domainProgress?.xp || 0;

            return (
              <Link key={domain.id} href={`/domain/${domain.id}`}>
                <div className="glass-card p-6 hover:bg-white/10 cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                      style={{ background: `${domain.color}20`, border: `2px solid ${domain.color}40` }}
                    >
                      {domain.icon}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{domain.name}</h3>
                      <p className="text-sm text-white/60 mb-2">{domain.description}</p>
                      <div className="flex items-center gap-3 text-xs text-white/60">
                        <span>Level {level}</span>
                        <span>·</span>
                        <span>{xp} XP</span>
                      </div>
                    </div>
                    
                    <ChevronRight className="text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </ClientLayout>
  );
}
