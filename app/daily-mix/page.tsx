'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ClientLayout from '@/components/ClientLayout';
import { loadAllDomains, Domain } from '@/lib/domains';
import { Play, Sparkles } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 1, 0.5, 1] as const }
  })
};

export default function DailyMixPage() {
  const router = useRouter();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAllDomains().then(setDomains);
  }, []);

  const startDailyMix = () => {
    setIsLoading(true);
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    if (randomDomain) {
      router.push(`/quiz?domain=${randomDomain.id}&level=beginner`);
    }
  };

  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp} className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Daily Mix</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>15–20 minutes of curated learning</p>
        </motion.div>

        <motion.div initial="hidden" animate="visible" custom={1} variants={fadeUp}
          className="surface-card p-8 text-center mb-5">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
               style={{ background: 'var(--accent-subtle)' }}>
            <Sparkles size={40} style={{ color: 'var(--accent)' }} />
          </div>

          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>Ready to learn?</h2>
          <p className="mb-8 max-w-md mx-auto" style={{ color: 'var(--text-tertiary)' }}>
            Your personalized daily mix pulls from your weakest areas across all domains
          </p>

          <button
            onClick={startDailyMix}
            disabled={isLoading || domains.length === 0}
            className="px-8 py-4 rounded-xl font-bold text-lg text-white disabled:opacity-50 flex items-center gap-3 mx-auto transition-all hover:opacity-90"
            style={{ background: 'var(--accent)' }}
          >
            <Play size={22} fill="white" />
            Start Daily Mix
          </button>
        </motion.div>

        <motion.div initial="hidden" animate="visible" custom={2} variants={fadeUp}
          className="surface-card p-5">
          <h3 className="font-bold mb-3 text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>What to expect</h3>
          <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <div className="flex items-start gap-2"><span style={{ color: 'var(--accent)' }}>•</span> Mixed difficulty from all domains</div>
            <div className="flex items-start gap-2"><span style={{ color: 'var(--accent)' }}>•</span> 10–15 questions</div>
            <div className="flex items-start gap-2"><span style={{ color: 'var(--accent)' }}>•</span> Adaptive difficulty based on your performance</div>
            <div className="flex items-start gap-2"><span style={{ color: 'var(--accent)' }}>•</span> Perfect for daily practice</div>
          </div>
        </motion.div>
      </div>
    </ClientLayout>
  );
}
