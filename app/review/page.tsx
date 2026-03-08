'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ClientLayout from '@/components/ClientLayout';
import { loadProgress } from '@/lib/storage';
import { getDueReviews } from '@/lib/spaced-repetition';
import { RotateCcw, Calendar } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 1, 0.5, 1] as const }
  })
};

export default function ReviewPage() {
  const router = useRouter();
  const [progress] = useState(loadProgress());
  const dueReviews = getDueReviews(progress.reviewQueue);

  const startReview = () => {
    if (dueReviews.length > 0) {
      const first = dueReviews[0];
      router.push(`/quiz?domain=${first.domainId}&level=${first.level}&review=true`);
    }
  };

  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp} className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Review Queue</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Spaced repetition keeps knowledge fresh</p>
        </motion.div>

        {dueReviews.length > 0 ? (
          <div className="space-y-5">
            <motion.div initial="hidden" animate="visible" custom={1} variants={fadeUp}
              className="surface-card p-8 text-center">
              <div className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4"
                   style={{ background: 'var(--accent-subtle)' }}>
                <RotateCcw size={32} style={{ color: 'var(--accent)' }} />
              </div>
              <div className="text-5xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>{dueReviews.length}</div>
              <div className="mb-6" style={{ color: 'var(--text-tertiary)' }}>cards due for review</div>
              <button
                onClick={startReview}
                className="px-8 py-4 rounded-xl font-bold text-lg text-white transition-all hover:opacity-90"
                style={{ background: 'var(--accent)' }}
              >
                Start Review Session
              </button>
            </motion.div>

            <motion.div initial="hidden" animate="visible" custom={2} variants={fadeUp}
              className="surface-card p-5">
              <h3 className="font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Upcoming Reviews</h3>
              <div className="space-y-2">
                {progress.reviewQueue.slice(0, 5).map((card, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                    <div>
                      <div className="font-semibold text-sm">{card.domainId}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Interval: {card.interval} days</div>
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                      <Calendar size={14} />
                      {new Date(card.nextReview).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div initial="hidden" animate="visible" custom={1} variants={fadeUp}
            className="surface-card p-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4"
                 style={{ background: 'var(--bg-sunken)' }}>
              <RotateCcw size={32} style={{ color: 'var(--text-muted)' }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>All caught up!</h3>
            <p style={{ color: 'var(--text-tertiary)' }}>No reviews due today. Keep learning new material!</p>
          </motion.div>
        )}
      </div>
    </ClientLayout>
  );
}
