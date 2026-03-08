'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function LearnRedirect() {
  const params = useParams();
  const router = useRouter();
  const domainId = params?.domainId as string;

  useEffect(() => {
    // Redirect to the new domain page which has inline explainers/quizzes/coding challenges
    router.replace(`/domain/${domainId}`);
  }, [domainId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
      <p style={{ color: 'var(--text-secondary)' }}>Redirecting...</p>
    </div>
  );
}
