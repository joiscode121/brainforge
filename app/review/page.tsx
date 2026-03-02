'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ClientLayout from '@/components/ClientLayout';
import { loadProgress } from '@/lib/storage';
import { getDueReviews } from '@/lib/spaced-repetition';
import { RotateCcw, Calendar } from 'lucide-react';

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Review Queue</h1>
          <p className="text-white/60">Spaced repetition keeps knowledge fresh</p>
        </div>

        {dueReviews.length > 0 ? (
          <>
            <div className="glass-card p-8 text-center">
              <RotateCcw className="mx-auto text-cyan-400 mb-4" size={48} />
              <div className="text-5xl font-bold mb-2">{dueReviews.length}</div>
              <div className="text-white/60 mb-6">cards due for review</div>
              <button
                onClick={startReview}
                className="px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400"
              >
                Start Review Session
              </button>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-bold mb-4">Upcoming Reviews</h3>
              <div className="space-y-3">
                {progress.reviewQueue.slice(0, 5).map((card, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div>
                      <div className="font-semibold">{card.domainId}</div>
                      <div className="text-xs text-white/60">Interval: {card.interval} days</div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <Calendar size={16} />
                      {new Date(card.nextReview).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="glass-card p-12 text-center">
            <RotateCcw className="mx-auto text-white/40 mb-4" size={64} />
            <h3 className="text-xl font-bold mb-2">All caught up!</h3>
            <p className="text-white/60">No reviews due today. Keep learning new material!</p>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
