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
    return <ClientLayout><div className="p-6 text-center text-white/60">Loading...</div></ClientLayout>;
  }

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'study', label: 'Study', icon: BookOpen },
    { id: 'mindmap', label: 'Mind Map', icon: Brain },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
  ];

  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Back + Title */}
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-xl">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="text-xs text-white/40">{domain.name}</div>
            <h1 className="text-xl font-bold">{topic.title}</h1>
          </div>
        </div>

        {/* Difficulty badge */}
        <div className="flex items-center gap-2">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            topic.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
            topic.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {topic.difficulty}
          </span>
          {topic.study?.readingTimeMin && (
            <span className="text-xs text-white/40">{topic.study.readingTimeMin} min read</span>
          )}
        </div>

        {/* Tabs */}
        <div className="glass-card p-1.5 flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white/80'
              }`}
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
              <div className="glass-card p-4 border border-yellow-500/30 bg-yellow-500/5">
                <p className="text-sm text-yellow-400">
                  Tip: Study the material first for better results!
                </p>
              </div>
            )}
            <button
              onClick={() => router.push(`/quiz?domain=${domainId}&topic=${topicId}`)}
              className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400"
            >
              Start Quiz ({topic.questions?.length || 0} questions)
            </button>
          </div>
        )}

        {/* Resources */}
        {topic.resources && topic.resources.length > 0 && (
          <div className="glass-card p-6">
            <h3 className="font-bold mb-3 text-sm text-white/60 uppercase tracking-wider">Resources</h3>
            <div className="space-y-2">
              {topic.resources.map((r: any, i: number) => (
                <a
                  key={i}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-cyan-400 hover:text-cyan-300 truncate"
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
