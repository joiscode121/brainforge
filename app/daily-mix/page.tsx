'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ClientLayout from '@/components/ClientLayout';
import { loadAllDomains, getRandomQuestions, Domain } from '@/lib/domains';
import { Play, Sparkles } from 'lucide-react';

export default function DailyMixPage() {
  const router = useRouter();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAllDomains().then(setDomains);
  }, []);

  const startDailyMix = () => {
    setIsLoading(true);
    // For simplicity, just redirect to a random domain quiz
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    if (randomDomain) {
      router.push(`/quiz?domain=${randomDomain.id}&level=beginner`);
    }
  };

  return (
    <ClientLayout>
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Daily Mix</h1>
          <p className="text-white/60">15-20 minutes of curated learning</p>
        </div>

        <div className="glass-card p-8 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
            <Sparkles className="text-white" size={48} />
          </div>

          <h2 className="text-2xl font-bold mb-3">Ready to learn?</h2>
          <p className="text-white/60 mb-8">
            Your personalized daily mix pulls from your weakest areas across all domains
          </p>

          <button
            onClick={startDailyMix}
            disabled={isLoading || domains.length === 0}
            className="px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 disabled:opacity-50 flex items-center gap-3 mx-auto"
          >
            <Play size={24} fill="white" />
            Start Daily Mix
          </button>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-bold mb-4">What to expect</h3>
          <div className="space-y-3 text-sm text-white/80">
            <div>• Mixed difficulty from all 7 domains</div>
            <div>• 10-15 questions</div>
            <div>• Adaptive difficulty based on your performance</div>
            <div>• Perfect for daily practice</div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
