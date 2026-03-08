'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ClientLayout from '@/components/ClientLayout';
import { loadDomain, Domain, CurriculumLevel, CurriculumTopic } from '@/lib/domains';
import { loadProgress, saveProgress } from '@/lib/storage';
import { Trophy, Zap, Target, BookOpen, HelpCircle, ChevronRight, ChevronDown, ArrowLeft, Code, Eye, EyeOff, CheckCircle, Play, FileText, Newspaper, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function isCurriculumLevel(level: any): level is CurriculumLevel {
  return level && 'topics' in level && Array.isArray(level.topics) && level.topics.length > 0 && 'explainer' in level.topics[0];
}

function ProgressBar({ completed, total, color }: { completed: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="w-full bg-white/5 rounded-full h-2">
      <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function ExplainerCard({ content }: { content: string }) {
  const [open, setOpen] = useState(false);
  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('### ')) return <h3 key={i} className="text-base font-bold text-cyan-400 mt-4 mb-1">{line.slice(4)}</h3>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold text-white mt-4 mb-2">{line.slice(3)}</h2>;
      if (line.startsWith('- **')) {
        const match = line.match(/^- \*\*(.+?)\*\*:?\s*(.*)/);
        if (match) return <div key={i} className="flex gap-2 ml-2 mb-1"><span className="text-cyan-400">•</span><span><strong className="text-white">{match[1]}</strong>{match[2] ? `: ${match[2]}` : ''}</span></div>;
      }
      if (line.startsWith('- ')) return <div key={i} className="flex gap-2 ml-2 mb-1"><span className="text-cyan-400">•</span><span className="text-white/70">{line.slice(2)}</span></div>;
      if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ') || line.startsWith('5. ')) {
        return <div key={i} className="flex gap-2 ml-2 mb-1"><span className="text-cyan-400 font-bold">{line.charAt(0)}.</span><span className="text-white/70">{line.slice(3)}</span></div>;
      }
      if (line.trim() === '') return <div key={i} className="h-2" />;
      // Inline formatting
      const formatted = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
                            .replace(/`(.+?)`/g, '<code class="px-1 py-0.5 bg-white/10 rounded text-cyan-300 text-xs font-mono">$1</code>');
      return <p key={i} className="text-white/70 text-sm mb-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  };

  return (
    <div className="glass-card overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-cyan-400" />
          <span className="text-sm font-medium text-white/80">Explainer</span>
        </div>
        <ChevronDown size={16} className={`text-white/40 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4 text-sm">
              {renderMarkdown(content)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AsciiVisual({ content }: { content: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-card overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-2">
          <Eye size={16} className="text-purple-400" />
          <span className="text-sm font-medium text-white/80">Visual Diagram</span>
        </div>
        <ChevronDown size={16} className={`text-white/40 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4">
              <pre className="text-xs sm:text-sm font-mono text-green-400/90 bg-black/40 rounded-xl p-4 overflow-x-auto whitespace-pre leading-relaxed border border-white/5">
                {content}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CodingChallengeCard({ challenge }: { challenge: CurriculumTopic['coding_challenge'] }) {
  const [showSolution, setShowSolution] = useState(false);
  if (!challenge) return null;
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-2 mb-2">
          <Code size={16} className="text-amber-400" />
          <span className="text-sm font-bold text-white/90">Coding Challenge</span>
        </div>
        <p className="text-sm text-white/70">{challenge.prompt}</p>
      </div>
      <div className="p-4">
        <div className="text-xs text-white/40 mb-1">Starter Code:</div>
        <pre className="text-xs font-mono text-cyan-300 bg-black/40 rounded-lg p-3 overflow-x-auto border border-white/5 mb-3 whitespace-pre-wrap">
          {challenge.starter_code}
        </pre>
        <button
          onClick={() => setShowSolution(!showSolution)}
          className="flex items-center gap-2 text-sm text-amber-400/80 hover:text-amber-400 transition-colors"
        >
          {showSolution ? <EyeOff size={14} /> : <Eye size={14} />}
          {showSolution ? 'Hide Solution' : 'Show Solution'}
        </button>
        <AnimatePresence>
          {showSolution && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="mt-3">
                <div className="text-xs text-white/40 mb-1">Solution:</div>
                <pre className="text-xs font-mono text-green-400 bg-black/40 rounded-lg p-3 overflow-x-auto border border-green-500/20 whitespace-pre-wrap">
                  {challenge.solution}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TopicCard({ topic, domainColor, isCompleted, onToggleComplete }: {
  topic: CurriculumTopic;
  domainColor: string;
  isCompleted: boolean;
  onToggleComplete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === topic.questions[currentQ]?.correct) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= topic.questions.length) {
      setQuizDone(true);
    } else {
      setCurrentQ(c => c + 1);
      setSelected(null);
    }
  };

  const resetQuiz = () => {
    setCurrentQ(0); setSelected(null); setScore(0); setQuizDone(false); setQuizMode(false);
  };

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 sm:p-5 flex items-center gap-4 hover:bg-white/5 transition-colors text-left"
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${isCompleted ? 'bg-green-500/20' : ''}`}
          style={!isCompleted ? { background: `${domainColor}20`, color: domainColor } : {}}>
          {isCompleted ? <CheckCircle size={16} className="text-green-400" /> : <BookOpen size={14} />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm sm:text-base truncate">{topic.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-white/40">{topic.questions?.length || 0} questions</span>
            {topic.coding_challenge && <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">code</span>}
            {topic.paper_ref && <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">paper</span>}
          </div>
        </div>
        <ChevronDown size={18} className={`text-white/30 transition-transform shrink-0 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3">
              {/* Explainer */}
              {topic.explainer && <ExplainerCard content={topic.explainer} />}
              
              {/* Visual */}
              {topic.visual && <AsciiVisual content={topic.visual} />}
              
              {/* Coding Challenge */}
              {topic.coding_challenge && <CodingChallengeCard challenge={topic.coding_challenge} />}
              
              {/* Paper Reference */}
              {topic.paper_ref && (
                <a href={topic.paper_ref} target="_blank" rel="noopener noreferrer"
                  className="glass-card p-3 flex items-center gap-2 hover:bg-white/5 transition-colors block">
                  <FileText size={14} className="text-purple-400" />
                  <span className="text-xs text-white/60 truncate">{topic.paper_ref}</span>
                  <ChevronRight size={12} className="text-white/30 ml-auto shrink-0" />
                </a>
              )}

              {/* Quiz Section */}
              {topic.questions && topic.questions.length > 0 && !quizMode && (
                <button onClick={() => { setQuizMode(true); resetQuiz(); setQuizMode(true); }}
                  className="w-full py-3 rounded-xl text-sm font-medium border border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                  style={{ color: domainColor }}>
                  <HelpCircle size={16} /> Start Quiz ({topic.questions.length} questions)
                </button>
              )}

              {/* Quiz Mode */}
              {quizMode && !quizDone && topic.questions[currentQ] && (
                <div className="glass-card p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-white/40">{currentQ + 1}/{topic.questions.length}</span>
                    <span className="text-xs font-bold" style={{ color: domainColor }}>Score: {score}</span>
                  </div>
                  <p className="text-sm text-white/90 mb-4 leading-relaxed">{topic.questions[currentQ].question}</p>
                  <div className="space-y-2">
                    {topic.questions[currentQ].options?.map((opt, idx) => {
                      const isCorrect = idx === topic.questions[currentQ].correct;
                      const isSelected = idx === selected;
                      let cls = 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08]';
                      if (selected !== null) {
                        if (isCorrect) cls = 'bg-green-500/20 border-green-400/30';
                        else if (isSelected) cls = 'bg-red-500/20 border-red-400/30';
                        else cls = 'bg-white/[0.02] border-white/[0.04]';
                      }
                      return (
                        <button key={idx} onClick={() => handleAnswer(idx)}
                          className={`w-full text-left p-3 rounded-xl border transition-all text-sm ${cls}`}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {selected !== null && (
                    <div className="mt-3">
                      <p className="text-xs text-white/50 mb-2">{topic.questions[currentQ].explanation}</p>
                      <button onClick={nextQuestion}
                        className="w-full py-2.5 rounded-xl text-sm font-medium border border-white/10 hover:bg-white/5"
                        style={{ color: domainColor }}>
                        {currentQ + 1 < topic.questions.length ? 'Next Question' : 'See Results'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Quiz Results */}
              {quizMode && quizDone && (
                <div className="glass-card p-4 text-center">
                  <div className="text-2xl font-bold mb-1" style={{ color: domainColor }}>{score}/{topic.questions.length}</div>
                  <div className="text-xs text-white/50 mb-3">{Math.round(score / topic.questions.length * 100)}% correct</div>
                  <div className="flex gap-2">
                    <button onClick={() => { resetQuiz(); setQuizMode(true); }}
                      className="flex-1 py-2 rounded-xl text-xs border border-white/10 hover:bg-white/5 text-white/70">Retry</button>
                    <button onClick={resetQuiz}
                      className="flex-1 py-2 rounded-xl text-xs border border-white/10 hover:bg-white/5 text-white/70">Close</button>
                  </div>
                </div>
              )}

              {/* Mark Complete */}
              <button onClick={onToggleComplete}
                className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isCompleted ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'border border-white/10 hover:bg-white/5 text-white/60'
                }`}>
                {isCompleted ? '✓ Completed' : 'Mark as Complete'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DomainPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [domain, setDomain] = useState<Domain | null>(null);
  const [progress, setProgress] = useState(loadProgress());
  const [activeLevel, setActiveLevel] = useState<string | null>(null);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!id) return;
    loadDomain(id).then(d => {
      setDomain(d);
      // Set first level as active
      if (d.levels) {
        const sorted = Object.entries(d.levels).sort((a, b) => {
          const orderA = (a[1] as any).order || 0;
          const orderB = (b[1] as any).order || 0;
          return orderA - orderB;
        });
        if (sorted.length > 0) setActiveLevel(sorted[0][0]);
      }
    }).catch(() => {});

    // Load completed topics from localStorage
    try {
      const saved = localStorage.getItem(`brainforge-completed-${id}`);
      if (saved) setCompletedTopics(new Set(JSON.parse(saved)));
    } catch {}
  }, [id]);

  const toggleComplete = (topicId: string) => {
    setCompletedTopics(prev => {
      const next = new Set(prev);
      if (next.has(topicId)) next.delete(topicId);
      else next.add(topicId);
      localStorage.setItem(`brainforge-completed-${id}`, JSON.stringify(Array.from(next)));
      return next;
    });
  };

  if (!domain) {
    return <ClientLayout><div className="p-6 text-center text-white/60">Loading domain...</div></ClientLayout>;
  }

  // Check if this is the new curriculum format
  const hasCurriculumLevels = domain.levels && Object.values(domain.levels).some(l => isCurriculumLevel(l));

  const sortedLevels = domain.levels
    ? Object.entries(domain.levels).sort((a, b) => ((a[1] as any).order || 0) - ((b[1] as any).order || 0))
    : [];

  const currentLevel = activeLevel && domain.levels ? domain.levels[activeLevel] : null;
  const currentTopics = currentLevel && isCurriculumLevel(currentLevel) ? currentLevel.topics : [];

  // Stats
  const totalTopics = sortedLevels.reduce((sum, [, l]) => sum + (isCurriculumLevel(l) ? l.topics.length : 0), 0);
  const totalQuestions = sortedLevels.reduce((sum, [, l]) => {
    if (isCurriculumLevel(l)) return sum + l.topics.reduce((s, t) => s + (t.questions?.length || 0), 0);
    if ('questions' in l) return sum + ((l as any).questions?.length || 0);
    return sum;
  }, 0);
  const totalChallenges = sortedLevels.reduce((sum, [, l]) => {
    if (isCurriculumLevel(l)) return sum + l.topics.filter(t => t.coding_challenge).length;
    return sum;
  }, 0);

  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-4 sm:space-y-6">
        {/* Back */}
        <button onClick={() => router.push('/domains')} className="flex items-center gap-2 text-white/60 hover:text-white text-sm">
          <ArrowLeft size={16} /> All Domains
        </button>

        {/* Header */}
        <div className="glass-card p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shrink-0"
              style={{ background: `${domain.color}20`, border: `2px solid ${domain.color}` }}>
              {domain.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold truncate">{domain.name}</h1>
              <p className="text-white/60 text-xs sm:text-sm line-clamp-2">{domain.description}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <BookOpen className="text-cyan-400" size={16} />
              <div>
                <div className="text-[10px] text-white/40">Levels</div>
                <div className="font-bold text-sm">{sortedLevels.length}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Target className="text-green-400" size={16} />
              <div>
                <div className="text-[10px] text-white/40">Topics</div>
                <div className="font-bold text-sm">{totalTopics}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <HelpCircle className="text-purple-400" size={16} />
              <div>
                <div className="text-[10px] text-white/40">Questions</div>
                <div className="font-bold text-sm">{totalQuestions}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Code className="text-amber-400" size={16} />
              <div>
                <div className="text-[10px] text-white/40">Challenges</div>
                <div className="font-bold text-sm">{totalChallenges}</div>
              </div>
            </div>
          </div>

          {/* Overall Progress */}
          {totalTopics > 0 && (
            <div className="mt-4 pt-3 border-t border-white/5">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-white/40">Progress</span>
                <span className="text-xs text-white/60">{completedTopics.size}/{totalTopics} topics</span>
              </div>
              <ProgressBar completed={completedTopics.size} total={totalTopics} color={domain.color} />
            </div>
          )}
        </div>

        {/* Level Navigation */}
        {hasCurriculumLevels && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {sortedLevels.map(([key, level], i) => {
              const cl = level as CurriculumLevel;
              const levelCompleted = cl.topics?.filter(t => completedTopics.has(t.id)).length || 0;
              const levelTotal = cl.topics?.length || 0;
              const isActive = activeLevel === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveLevel(key)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                    isActive
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold"
                      style={{ background: `${domain.color}20`, color: domain.color }}>
                      {i + 1}
                    </span>
                    <span>{cl.name || key}</span>
                    {levelTotal > 0 && (
                      <span className={`text-[10px] ${levelCompleted === levelTotal && levelTotal > 0 ? 'text-green-400' : 'text-white/30'}`}>
                        {levelCompleted}/{levelTotal}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Current Level Description */}
        {activeLevel && currentLevel && isCurriculumLevel(currentLevel) && (
          <div className="glass-card p-4">
            <h2 className="font-bold text-base mb-1" style={{ color: domain.color }}>
              Level {(currentLevel as CurriculumLevel).order}: {(currentLevel as CurriculumLevel).name}
            </h2>
            <p className="text-xs text-white/50">{(currentLevel as CurriculumLevel).description}</p>
            <div className="mt-2">
              <ProgressBar
                completed={currentTopics.filter(t => completedTopics.has(t.id)).length}
                total={currentTopics.length}
                color={domain.color}
              />
            </div>
          </div>
        )}

        {/* Topics for Current Level */}
        {hasCurriculumLevels && currentTopics.length > 0 && (
          <div className="space-y-3">
            {currentTopics.map((topic, i) => (
              <motion.div key={topic.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <TopicCard
                  topic={topic}
                  domainColor={domain.color}
                  isCompleted={completedTopics.has(topic.id)}
                  onToggleComplete={() => toggleComplete(topic.id)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Fallback: Old levels format (beginner/intermediate/advanced) */}
        {!hasCurriculumLevels && domain.levels && (
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
        )}

        {/* Fallback: Topics format */}
        {domain.topics && domain.topics.length > 0 && (
          <div className="space-y-3">
            {domain.topics.map((topic: any, i: number) => (
              <motion.div key={topic.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={`/learn/${domain.id}/${topic.id}`}>
                  <div className="glass-card p-5 hover:bg-white/10 cursor-pointer group active:scale-[0.98] transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                        style={{ background: `${domain.color}20`, color: domain.color }}>
                        {topic.chapter || i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base truncate">{topic.title}</h3>
                        <span className="text-xs text-white/40">{topic.questions?.length || 0} questions</span>
                      </div>
                      <ChevronRight className="text-white/30 group-hover:text-white/60" size={20} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
