'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ClientLayout from '@/components/ClientLayout';
import StudyView from '@/components/StudyView';
import ExplainerView from '@/components/ExplainerView';
import MindMap from '@/components/MindMap';
import { loadDomain, Domain } from '@/lib/domains';
import { ArrowLeft, BookOpen, Brain, HelpCircle } from 'lucide-react';

type Tab = 'study' | 'mindmap' | 'quiz';

export default function LearnPage() {
  const params = useParams();
  const router = useRouter();
  const domainId = params?.domainId as string;
  const topicId = params?.topicId as string;

  const [domain, setDomain] = useState<Domain | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('study');
  const [showExplainer, setShowExplainer] = useState(false);
  const [studyComplete, setStudyComplete] = useState(false);

  useEffect(() => {
    if (domainId) loadDomain(domainId).then(setDomain).catch(() => {});
  }, [domainId]);

  const topic = domain?.topics?.find((t: any) => t.id === topicId);

  if (!domain || !topic) {
    return <ClientLayout><div className="p-6 text-center" style={{ color: 'var(--text-muted)' }}>Loading...</div></ClientLayout>;
  }

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'study', label: 'Study', icon: BookOpen },
    { id: 'mindmap', label: 'Mind Map', icon: Brain },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
  ];

  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-6 space-y-6">
        {/* Back + Title */}
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-[--bg-surface] transition-colors">
            <ArrowLeft size={20} style={{ color: 'var(--text-tertiary)' }} />
          </button>
          <div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{domain.name}</div>
            <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{topic.title}</h1>
          </div>
        </div>

        {/* Difficulty badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full font-medium"
            style={
              topic.difficulty === 'beginner' ? { background: 'var(--success-light)', color: 'var(--success)' } :
              topic.difficulty === 'intermediate' ? { background: 'var(--warning-light)', color: 'var(--warning)' } :
              { background: 'var(--error-light)', color: 'var(--error)' }
            }>
            {topic.difficulty}
          </span>
          {topic.study?.readingTimeMin && (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{topic.study.readingTimeMin} min read</span>
          )}
        </div>

        {/* Tabs */}
        <div className="surface-card p-1.5 flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all"
              style={{
                background: activeTab === tab.id ? 'var(--bg-surface)' : 'transparent',
                color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
                boxShadow: activeTab === tab.id ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'study' && topic.study && (
          <StudyView
            content={topic.study.content}
            keyPoints={topic.study.keyPoints || []}
            readingTimeMin={topic.study.readingTimeMin || 5}
            onComplete={() => setStudyComplete(true)}
            onStartExplainer={() => setShowExplainer(true)}
          />
        )}

        {activeTab === 'mindmap' && topic.mindmap && (
          <MindMap diagram={topic.mindmap} title={topic.title} />
        )}

        {activeTab === 'quiz' && (
          <div className="space-y-4">
            {!studyComplete && (
              <div className="p-4 rounded-xl" style={{ background: 'var(--warning-light)', border: '1px solid oklch(80% 0.06 80)' }}>
                <p className="text-sm" style={{ color: 'var(--warning)' }}>
                  Tip: Study the material first for better results!
                </p>
              </div>
            )}
            <button
              onClick={() => router.push(`/quiz?domain=${domainId}&topic=${topicId}`)}
              className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all hover:opacity-90"
              style={{ background: 'var(--accent)' }}
            >
              Start Quiz ({topic.questions?.length || 0} questions)
            </button>
          </div>
        )}

        {/* Resources */}
        {topic.resources && topic.resources.length > 0 && (
          <div className="surface-card p-6">
            <h3 className="font-semibold mb-3 text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Resources</h3>
            <div className="space-y-2">
              {topic.resources.map((r: any, i: number) => (
                <a
                  key={i}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm font-medium truncate transition-colors"
                  style={{ color: 'var(--accent)' }}
                >
                  {r.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Explainer overlay */}
      {showExplainer && topic.slides && (
        <ExplainerView
          slides={topic.slides}
          onClose={() => setShowExplainer(false)}
          topicTitle={topic.title}
        />
      )}
    </ClientLayout>
  );
}
