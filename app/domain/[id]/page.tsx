'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ClientLayout from '@/components/ClientLayout';
import { loadDomain, Domain } from '@/lib/domains';
import { loadProgress } from '@/lib/storage';
import { Trophy, Zap, Target, BookOpen, HelpCircle, ChevronRight, ArrowLeft, Newspaper, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import AudioMode from '@/components/AudioMode';

export default function DomainPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [domain, setDomain] = useState<Domain | null>(null);
  const [progress, setProgress] = useState(loadProgress());
  const [filter, setFilter] = useState<string>('all');

  // V2: Paper feed, generation, domain-specific stats
  const [v2Feed, setV2Feed] = useState<any[]>([]);
  const [v2Stats, setV2Stats] = useState<any>(null);
  const [v2Domain, setV2Domain] = useState<any>(null);
  const [showFeed, setShowFeed] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [autoShown, setAutoShown] = useState(false);
  const [genCount, setGenCount] = useState(10);
  const [genDifficulty, setGenDifficulty] = useState('intermediate');
  const [genTopic, setGenTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [genResult, setGenResult] = useState<any>(null);
  const [genQuizMode, setGenQuizMode] = useState(false);
  const [genCurrentQ, setGenCurrentQ] = useState(0);
  const [genSelected, setGenSelected] = useState<number | null>(null);
  const [genScore, setGenScore] = useState(0);

  useEffect(() => {
    if (!id) return;
    
    // Load everything in parallel
    const loadAll = async () => {
      // Always fetch V2 data
      const [v2DomainsRes, feedRes, statsRes] = await Promise.all([
        fetch(`/api/v2/domains`).then(r => r.json()).catch(() => ({ domains: [] })),
        fetch(`/api/v2/feed?domain=${id}&limit=10`).then(r => r.json()).catch(() => ({ digests: [] })),
        fetch(`/api/v2/stats`).then(r => r.json()).catch(() => null),
      ]);

      const v2Match = (v2DomainsRes.domains || []).find((x: any) => x.slug === id);
      if (v2Match) setV2Domain(v2Match);
      setV2Feed(feedRes.digests || []);
      if (statsRes) setV2Stats(statsRes);

      // Try local JSON
      try {
        const localDomain = await loadDomain(id);
        setDomain(localDomain);
      } catch {
        // No local JSON - use V2 API data
        if (v2Match) {
          setDomain({
            id: v2Match.slug,
            name: v2Match.name,
            icon: v2Match.icon || '📚',
            color: v2Match.color || '#6366f1',
            description: v2Match.description || '',
          } as Domain);
        }
      }
    };

    loadAll();
  }, [id]);

  // Auto-show feed for V2-only domains (no local content)
  useEffect(() => {
    if (domain && !autoShown && !domain.topics?.length && !domain.levels && v2Feed.length > 0) {
      setShowFeed(true);
      setAutoShown(true);
    }
  }, [domain, v2Feed, autoShown]);

  const handleGenerate = async () => {
    setGenerating(true); setGenResult(null);
    try {
      const res = await fetch(`/api/v2/generate?domain=${id}&count=${genCount}&difficulty=${genDifficulty}&topic=${encodeURIComponent(genTopic)}`);
      setGenResult(await res.json());
    } catch { setGenResult({ error: 'Generation failed' }); }
    setGenerating(false);
  };

  const startGenQuiz = () => {
    if (genResult?.questions) {
      setGenQuizMode(true); setGenCurrentQ(0); setGenSelected(null); setGenScore(0);
    }
  };

  const handleGenAnswer = (idx: number) => {
    if (genSelected !== null) return;
    setGenSelected(idx);
    if (idx === genResult.questions[genCurrentQ]?.correct) setGenScore(s => s + 1);
  };

  if (!domain) {
    return <ClientLayout><div className="p-6 text-center text-white/60">Loading domain...</div></ClientLayout>;
  }

  const domainProgress = progress.domains[domain.id];
  const topics = domain.topics || [];
  
  // Support both old (levels) and new (topics) format
  const hasTopics = topics.length > 0;
  
  const filteredTopics = filter === 'all' 
    ? topics 
    : topics.filter((t: any) => t.difficulty === filter);

  const completedCount = domainProgress?.completedQuestions?.length || 0;
  
  // Count questions from both topics AND levels format
  const topicQuestions = topics.reduce((sum: number, t: any) => sum + (t.questions?.length || 0), 0);
  const levelQuestions = domain.levels 
    ? Object.values(domain.levels).reduce((sum: number, l: any) => sum + (l.questions?.length || 0), 0) 
    : 0;
  const localQuestions = topicQuestions + levelQuestions;
  
  // Merge with V2 API data for real counts
  const v2Papers = v2Domain?.paper_count || 0;
  const v2Questions = v2Domain?.question_count || 0;
  const v2Flashcards = v2Domain?.flashcard_count || 0;
  const totalQuestions = localQuestions + v2Questions;
  const totalTopics = hasTopics ? topics.length : (domain.levels ? Object.keys(domain.levels).length : 0);

  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-4 sm:space-y-6">
        {/* Back */}
        <button onClick={() => router.push('/domains')} className="flex items-center gap-2 text-white/60 hover:text-white">
          <ArrowLeft size={18} /> All Domains
        </button>

        {/* Header */}
        <div className="glass-card p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div
              className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-4xl shrink-0"
              style={{ background: `${domain.color}20`, border: `2px solid ${domain.color}` }}
            >
              {domain.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold truncate">{domain.name}</h1>
              <p className="text-white/60 text-xs sm:text-sm line-clamp-2">{domain.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:gap-6 gap-3 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <BookOpen className="text-cyan-400" size={18} />
              <div>
                <div className="text-xs text-white/60">{hasTopics ? 'Topics' : 'Levels'}</div>
                <div className="font-bold">{totalTopics}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <HelpCircle className="text-purple-400" size={18} />
              <div>
                <div className="text-xs text-white/60">Questions</div>
                <div className="font-bold">{totalQuestions}</div>
              </div>
            </div>
            {v2Papers > 0 && (
              <div className="flex items-center gap-2">
                <Newspaper className="text-amber-400" size={18} />
                <div>
                  <div className="text-xs text-white/60">Papers</div>
                  <div className="font-bold">{v2Papers}</div>
                </div>
              </div>
            )}
            {v2Flashcards > 0 && (
              <div className="flex items-center gap-2">
                <Zap className="text-yellow-400" size={18} />
                <div>
                  <div className="text-xs text-white/60">Flashcards</div>
                  <div className="font-bold">{v2Flashcards}</div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Target className="text-green-400" size={18} />
              <div>
                <div className="text-xs text-white/60">Completed</div>
                <div className="font-bold">{completedCount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        {hasTopics && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['all', 'beginner', 'intermediate', 'advanced'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  filter === f
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Topics list */}
        {hasTopics ? (
          <div className="space-y-3">
            {filteredTopics.map((topic: any, i: number) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/learn/${domain.id}/${topic.id}`}>
                  <div className="glass-card p-5 hover:bg-white/10 cursor-pointer group active:scale-[0.98] transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                        style={{ background: `${domain.color}20`, color: domain.color }}>
                        {topic.chapter || i + 1}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base truncate">{topic.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            topic.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                            topic.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {topic.difficulty}
                          </span>
                          <span className="text-xs text-white/40">
                            {topic.questions?.length || 0} questions
                          </span>
                          {topic.study?.readingTimeMin && (
                            <span className="text-xs text-white/40">
                              {topic.study.readingTimeMin} min
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <ChevronRight className="text-white/30 group-hover:text-white/60 transition-colors" size={20} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : domain.levels ? (
          /* Levels format (beginner/intermediate/advanced) */
          <div className="space-y-3">
            {Object.entries(domain.levels).map(([levelKey, levelData]: [string, any]) => (
              <div
                key={levelKey}
                onClick={() => router.push(`/quiz?domain=${domain.id}&level=${levelKey}`)}
                className="glass-card p-4 sm:p-5 hover:bg-white/10 cursor-pointer active:scale-[0.98] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base capitalize">{levelData.name}</h3>
                    <p className="text-xs text-white/50 mt-1">{levelData.description}</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <div className="text-lg font-bold" style={{ color: domain.color }}>{levelData.questions?.length || 0}</div>
                    <div className="text-[10px] text-white/40">questions</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* V2-only domain - no local topics or levels, show quick actions */
          <div className="space-y-3">
            {v2Questions > 0 && (
              <div className="glass-card p-4 sm:p-5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base">Quick Quiz</h3>
                    <p className="text-xs text-white/50 mt-1">Test yourself on AI-generated questions from scraped papers</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <div className="text-lg font-bold" style={{ color: domain.color }}>{v2Questions}</div>
                    <div className="text-[10px] text-white/40">questions</div>
                  </div>
                </div>
              </div>
            )}
            {v2Flashcards > 0 && (
              <div className="glass-card p-4 sm:p-5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base">Flashcards</h3>
                    <p className="text-xs text-white/50 mt-1">Review key concepts from latest research</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <div className="text-lg font-bold" style={{ color: domain.color }}>{v2Flashcards}</div>
                    <div className="text-[10px] text-white/40">cards</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {/* ═══ V2: Research Feed & AI Question Generator ═══ */}
        
        {/* V2 Action Buttons */}
        <div className="flex gap-2 sm:gap-3 pt-4 border-t border-white/10 flex-wrap">
          {v2Feed.length > 0 && (
            <button onClick={() => { setShowFeed(!showFeed); setShowGenerate(false); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                showFeed ? 'bg-white/10 text-white border border-white/20' : 'glass-card text-white/60 hover:text-white'
              }`}>
              <Newspaper size={16} /> Research Feed ({v2Feed.length})
            </button>
          )}
          <button onClick={() => { setShowGenerate(!showGenerate); setShowFeed(false); setGenQuizMode(false); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              showGenerate ? 'bg-white/10 text-white border border-white/20' : 'glass-card text-white/60 hover:text-white'
            }`}>
            <Sparkles size={16} /> Generate Questions
          </button>
        </div>

        {/* Research Feed */}
        {showFeed && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <h3 className="text-white/80 font-bold text-lg">Latest Research</h3>
            {v2Feed.map((d: any, i: number) => (
              <div key={i} className="glass-card p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/50">{d.source}</span>
                  <span className="text-xs text-white/30">{d.published_date}</span>
                  {d.difficulty && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      d.difficulty === 'expert' ? 'bg-red-500/20 text-red-400' :
                      d.difficulty === 'advanced' ? 'bg-purple-500/20 text-purple-400' :
                      d.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>{d.difficulty}</span>
                  )}
                </div>
                <h4 className="font-bold text-sm text-white/90 mb-1">{d.title}</h4>
                {d.summary && <p className="text-xs text-white/50 mb-2">{d.summary}</p>}
                {d.why_it_matters && <p className="text-xs italic" style={{ color: domain?.color || '#C4843B' }}>{d.why_it_matters}</p>}
                <div className="flex items-center justify-between mt-2">
                  {d.url && <a href={d.url} target="_blank" rel="noopener" className="text-xs text-white/30 hover:text-white/60">View paper →</a>}
                  <AudioMode content={`${d.title}. ${d.summary || ''}. ${d.why_it_matters || ''}`} autoPlay={false} />
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Generate Questions */}
        {showGenerate && !genQuizMode && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="glass-card p-4 sm:p-6 space-y-4 sm:space-y-5">
              <h3 className="text-white/90 font-bold text-base sm:text-lg flex items-center gap-2">
                <Sparkles size={20} style={{ color: domain?.color }} /> Generate Custom Questions
              </h3>
              
              <div>
                <label className="text-white/40 text-xs block mb-2">Number of questions</label>
                <div className="flex gap-2">
                  {[5, 10, 20, 30].map(n => (
                    <button key={n} onClick={() => setGenCount(n)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        genCount === n ? 'bg-white/10 text-white border border-white/20' : 'text-white/50 hover:text-white/80'
                      }`}>{n}</button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-white/40 text-xs block mb-2">Difficulty</label>
                <div className="flex gap-2 flex-wrap">
                  {['beginner', 'intermediate', 'advanced', 'expert'].map(d => (
                    <button key={d} onClick={() => setGenDifficulty(d)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                        genDifficulty === d ? 'bg-white/10 text-white border border-white/20' : 'text-white/50 hover:text-white/80'
                      }`}>{d}</button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-white/40 text-xs block mb-2">Custom topic (optional)</label>
                <input type="text" value={genTopic} onChange={e => setGenTopic(e.target.value)}
                  placeholder="e.g. transformers, CRISPR, orbital mechanics..."
                  className="w-full bg-white/5 rounded-xl px-4 py-3 text-sm text-white/80 outline-none border border-white/10 placeholder:text-white/20 focus:border-white/30 transition-colors" />
              </div>
              
              <button onClick={handleGenerate} disabled={generating}
                className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${
                  generating ? 'bg-white/5 text-white/30' : 'bg-white/10 text-white hover:bg-white/15 border border-white/10'
                }`}>
                {generating ? (
                  <span className="flex items-center justify-center gap-2"><Loader2 size={16} className="animate-spin" /> Generating...</span>
                ) : `Generate ${genCount} Questions`}
              </button>
            </div>
            
            {genResult && !genResult.error && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mt-3">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white/90 font-bold">{genResult.generated} questions generated</span>
                  <span className="text-white/40 text-xs">{genResult.totalInDomain} total in domain</span>
                </div>
                <button onClick={startGenQuiz}
                  className="w-full py-3 rounded-xl font-medium text-sm transition-all border border-white/10 hover:bg-white/10"
                  style={{ color: domain?.color }}>
                  Start Quiz with Generated Questions
                </button>
                <div className="mt-4 space-y-2 max-h-[240px] overflow-y-auto">
                  {genResult.questions.map((q: any, i: number) => (
                    <div key={i} className="bg-white/[0.03] rounded-lg p-3 border border-white/[0.05]">
                      <p className="text-xs text-white/60">{q.question}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {genResult?.error && (
              <div className="glass-card p-4 mt-3 border border-red-500/20">
                <p className="text-red-400 text-sm">{genResult.error}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Generated Quiz Mode */}
        {showGenerate && genQuizMode && genResult?.questions && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {genCurrentQ < genResult.questions.length ? (
              <div className="glass-card p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
                    <span className="text-white/40 text-sm">{genCurrentQ + 1} / {genResult.questions.length}</span>
                    <span className="font-bold text-sm" style={{ color: domain?.color }}>Score: {genScore}</span>
                  </div>
                  <AudioMode 
                    content="" 
                    question={genResult.questions[genCurrentQ].question}
                    options={genResult.questions[genCurrentQ].options}
                    explanation={genResult.questions[genCurrentQ].explanation}
                    showExplanation={genSelected !== null}
                  />
                </div>
                <p className="text-white/90 text-base mb-5 leading-relaxed">{genResult.questions[genCurrentQ].question}</p>
                <div className="space-y-2">
                  {genResult.questions[genCurrentQ].options.map((opt: string, idx: number) => {
                    const isCorrect = idx === genResult.questions[genCurrentQ].correct;
                    const isSelected = idx === genSelected;
                    let cls = 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08]';
                    if (genSelected !== null) {
                      if (isCorrect) cls = 'bg-green-500/20 border-green-400/30';
                      else if (isSelected) cls = 'bg-red-500/20 border-red-400/30';
                      else cls = 'bg-white/[0.02] border-white/[0.04]';
                    }
                    return (
                      <button key={idx} onClick={() => handleGenAnswer(idx)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all ${cls}`}>
                        <span className="text-sm text-white/80">{opt}</span>
                      </button>
                    );
                  })}
                </div>
                {genSelected !== null && (
                  <div className="mt-4">
                    <p className="text-xs text-white/50 mb-3">{genResult.questions[genCurrentQ].explanation}</p>
                    <button onClick={() => { setGenSelected(null); setGenCurrentQ(c => c + 1); }}
                      className="w-full py-3 rounded-xl font-medium text-sm border border-white/10 hover:bg-white/10 transition-all"
                      style={{ color: domain?.color }}>
                      {genCurrentQ + 1 < genResult.questions.length ? 'Next Question' : 'See Results'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-card p-6 text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: domain?.color }}>{genScore}/{genResult.questions.length}</div>
                <div className="text-white/50 text-sm mb-4">{Math.round(genScore/genResult.questions.length*100)}% correct</div>
                <div className="flex gap-3">
                  <button onClick={() => { setGenCurrentQ(0); setGenSelected(null); setGenScore(0); }}
                    className="flex-1 py-3 rounded-xl font-medium text-sm border border-white/10 hover:bg-white/10 text-white/70">Retry</button>
                  <button onClick={() => { setGenQuizMode(false); setGenResult(null); }}
                    className="flex-1 py-3 rounded-xl font-medium text-sm border border-white/10 hover:bg-white/10"
                    style={{ color: domain?.color }}>Generate More</button>
                </div>
              </div>
            )}
          </motion.div>
        )}

      </div>
    </ClientLayout>
  );
}
