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
    <div className="progress-track h-2">
      <div className="progress-fill h-full" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function ExplainerCard({ content }: { content: string }) {
  const [open, setOpen] = useState(false);
  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('### ')) return <h3 key={i} className="text-base font-bold mt-4 mb-1" style={{ color: 'var(--accent)' }}>{line.slice(4)}</h3>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold mt-4 mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{line.slice(3)}</h2>;
      if (line.startsWith('- **')) {
        const match = line.match(/^- \*\*(.+?)\*\*:?\s*(.*)/);
        if (match) return <div key={i} className="flex gap-2 ml-2 mb-1"><span style={{ color: 'var(--accent)' }}>•</span><span><strong style={{ color: 'var(--text-primary)' }}>{match[1]}</strong>{match[2] ? `: ${match[2]}` : ''}</span></div>;
      }
      if (line.startsWith('- ')) return <div key={i} className="flex gap-2 ml-2 mb-1"><span style={{ color: 'var(--accent)' }}>•</span><span style={{ color: 'var(--text-secondary)' }}>{line.slice(2)}</span></div>;
      if (line.match(/^\d+\. /)) {
        const num = line.match(/^(\d+)\. /);
        return <div key={i} className="flex gap-2 ml-2 mb-1"><span className="font-bold" style={{ color: 'var(--accent)' }}>{num?.[1]}.</span><span style={{ color: 'var(--text-secondary)' }}>{line.slice(line.indexOf(' ') + 1)}</span></div>;
      }
      if (line.trim() === '') return <div key={i} className="h-2" />;
      const formatted = line.replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--text-primary)">$1</strong>')
                            .replace(/`(.+?)`/g, '<code style="padding:2px 6px;background:var(--bg-sunken);border-radius:4px;font-size:0.8em;font-family:monospace;color:var(--accent-dark)">$1</code>');
      return <p key={i} className="text-sm mb-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }} dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  };

  return (
    <div className="surface-card overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full p-4 flex items-center justify-between transition-colors hover:bg-[--bg-surface]">
        <div className="flex items-center gap-2">
          <BookOpen size={16} style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Explainer</span>
        </div>
        <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }} />
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
    <div className="surface-card overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full p-4 flex items-center justify-between transition-colors hover:bg-[--bg-surface]">
        <div className="flex items-center gap-2">
          <Eye size={16} style={{ color: 'var(--info)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Visual Diagram</span>
        </div>
        <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4">
              <pre className="text-xs sm:text-sm font-mono p-4 overflow-x-auto whitespace-pre leading-relaxed rounded-lg"
                   style={{ background: 'var(--bg-sunken)', color: 'var(--accent-dark)', border: '1px solid var(--border-subtle)' }}>
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
    <div className="surface-card overflow-hidden">
      <div className="p-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-2 mb-2">
          <Code size={16} style={{ color: 'var(--warning)' }} />
          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Coding Challenge</span>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{challenge.prompt}</p>
      </div>
      <div className="p-4">
        <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Starter Code:</div>
        <pre className="text-xs font-mono rounded-lg p-3 overflow-x-auto mb-3 whitespace-pre-wrap"
             style={{ background: 'var(--bg-sunken)', color: 'var(--accent-dark)', border: '1px solid var(--border-subtle)' }}>
          {challenge.starter_code}
        </pre>
        <button
          onClick={() => setShowSolution(!showSolution)}
          className="flex items-center gap-2 text-sm transition-colors font-medium"
          style={{ color: 'var(--warning)' }}
        >
          {showSolution ? <EyeOff size={14} /> : <Eye size={14} />}
          {showSolution ? 'Hide Solution' : 'Show Solution'}
        </button>
        <AnimatePresence>
          {showSolution && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="mt-3">
                <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Solution:</div>
                <pre className="text-xs font-mono rounded-lg p-3 overflow-x-auto whitespace-pre-wrap"
                     style={{ background: 'var(--success-light)', color: 'var(--success)', border: '1px solid var(--success)' }}>
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
    <div className="surface-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 sm:p-5 flex items-center gap-4 hover:bg-[--bg-surface] transition-colors text-left"
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
          style={isCompleted
            ? { background: 'var(--success-light)', color: 'var(--success)' }
            : { background: `color-mix(in oklch, ${domainColor} 15%, var(--bg-base))`, color: domainColor }
          }>
          {isCompleted ? <CheckCircle size={16} /> : <BookOpen size={14} />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm sm:text-base truncate" style={{ color: 'var(--text-primary)' }}>{topic.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{topic.questions?.length || 0} questions</span>
            {topic.coding_challenge && <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>code</span>}
            {topic.paper_ref && <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: 'var(--info-light)', color: 'var(--info)' }}>paper</span>}
          </div>
        </div>
        <ChevronDown size={18} className={`transition-transform shrink-0 ${expanded ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }} />
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
              {topic.explainer && <ExplainerCard content={topic.explainer} />}
              {topic.visual && <AsciiVisual content={topic.visual} />}
              {topic.coding_challenge && <CodingChallengeCard challenge={topic.coding_challenge} />}

              {topic.paper_ref && (
                <a href={topic.paper_ref} target="_blank" rel="noopener noreferrer"
                  className="surface-card p-3 flex items-center gap-2 hover:bg-[--bg-surface] transition-colors block">
                  <FileText size={14} style={{ color: 'var(--info)' }} />
                  <span className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>{topic.paper_ref}</span>
                  <ChevronRight size={12} style={{ color: 'var(--text-muted)' }} className="ml-auto shrink-0" />
                </a>
              )}

              {topic.questions && topic.questions.length > 0 && !quizMode && (
                <button onClick={() => { setQuizMode(true); resetQuiz(); setQuizMode(true); }}
                  className="w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                  style={{ color: domainColor, border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                  <HelpCircle size={16} /> Start Quiz ({topic.questions.length} questions)
                </button>
              )}

              {quizMode && !quizDone && topic.questions[currentQ] && (
                <div className="surface-card p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{currentQ + 1}/{topic.questions.length}</span>
                    <span className="text-xs font-bold" style={{ color: domainColor }}>Score: {score}</span>
                  </div>
                  <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-primary)' }}>{topic.questions[currentQ].question}</p>
                  <div className="space-y-2">
                    {topic.questions[currentQ].options?.map((opt, idx) => {
                      const isCorrect = idx === topic.questions[currentQ].correct;
                      const isSelected = idx === selected;
                      let style: any = { background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' };
                      if (selected !== null) {
                        if (isCorrect) style = { background: 'var(--success-light)', border: '1px solid var(--success)' };
                        else if (isSelected) style = { background: 'var(--error-light)', border: '1px solid var(--error)' };
                        else style = { background: 'var(--bg-sunken)', border: '1px solid var(--border-subtle)', opacity: 0.6 };
                      }
                      return (
                        <button key={idx} onClick={() => handleAnswer(idx)}
                          className="w-full text-left p-3 rounded-xl transition-all text-sm"
                          style={style}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {selected !== null && (
                    <div className="mt-3">
                      <p className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>{topic.questions[currentQ].explanation}</p>
                      <button onClick={nextQuestion}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
                        style={{ color: domainColor, border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                        {currentQ + 1 < topic.questions.length ? 'Next Question' : 'See Results'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {quizMode && quizDone && (
                <div className="surface-card p-4 text-center">
                  <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: domainColor }}>{score}/{topic.questions.length}</div>
                  <div className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>{Math.round(score / topic.questions.length * 100)}% correct</div>
                  <div className="flex gap-2">
                    <button onClick={() => { resetQuiz(); setQuizMode(true); }}
                      className="flex-1 py-2 rounded-xl text-xs font-medium" style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>Retry</button>
                    <button onClick={resetQuiz}
                      className="flex-1 py-2 rounded-xl text-xs font-medium" style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>Close</button>
                  </div>
                </div>
              )}

              <button onClick={onToggleComplete}
                className="w-full py-2.5 rounded-xl text-sm font-medium transition-all"
                style={isCompleted
                  ? { background: 'var(--success-light)', border: '1px solid var(--success)', color: 'var(--success)' }
                  : { border: '1px solid var(--border)', color: 'var(--text-tertiary)' }
                }>
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
      if (d.levels) {
        const sorted = Object.entries(d.levels).sort((a, b) => {
          const orderA = (a[1] as any).order || 0;
          const orderB = (b[1] as any).order || 0;
          return orderA - orderB;
        });
        if (sorted.length > 0) setActiveLevel(sorted[0][0]);
      }
    }).catch(() => {});

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
    return <ClientLayout><div className="p-6 text-center" style={{ color: 'var(--text-muted)' }}>Loading domain...</div></ClientLayout>;
  }

  const hasCurriculumLevels = domain.levels && Object.values(domain.levels).some(l => isCurriculumLevel(l));
  const sortedLevels = domain.levels
    ? Object.entries(domain.levels).sort((a, b) => ((a[1] as any).order || 0) - ((b[1] as any).order || 0))
    : [];
  const currentLevel = activeLevel && domain.levels ? domain.levels[activeLevel] : null;
  const currentTopics = currentLevel && isCurriculumLevel(currentLevel) ? currentLevel.topics : [];

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-6 space-y-5">
        {/* Back */}
        <button onClick={() => router.push('/domains')} className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
          <ArrowLeft size={16} /> All Domains
        </button>

        {/* Header */}
        <div className="surface-card p-5 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4 mb-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-2xl sm:text-3xl shrink-0"
              style={{ background: `color-mix(in oklch, ${domain.color} 18%, var(--bg-surface))` }}>
              {domain.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold truncate" style={{ fontFamily: 'var(--font-display)' }}>{domain.name}</h1>
              <p className="text-xs sm:text-sm line-clamp-2" style={{ color: 'var(--text-tertiary)' }}>{domain.description}</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            {[
              { icon: BookOpen, label: 'Levels', value: sortedLevels.length, color: 'var(--accent)' },
              { icon: Target, label: 'Topics', value: totalTopics, color: 'var(--success)' },
              { icon: HelpCircle, label: 'Questions', value: totalQuestions, color: 'var(--info)' },
              { icon: Code, label: 'Challenges', value: totalChallenges, color: 'var(--warning)' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon size={16} style={{ color }} />
                <div>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{label}</div>
                  <div className="font-bold text-sm">{value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Overall Progress */}
          {totalTopics > 0 && (
            <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Progress</span>
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{completedTopics.size}/{totalTopics} topics</span>
              </div>
              <ProgressBar completed={completedTopics.size} total={totalTopics} color={domain.color} />
            </div>
          )}
        </div>

        {/* Level Navigation */}
        {hasCurriculumLevels && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {sortedLevels.map(([key, level], i) => {
              const cl = level as CurriculumLevel;
              const levelCompleted = cl.topics?.filter(t => completedTopics.has(t.id)).length || 0;
              const levelTotal = cl.topics?.length || 0;
              const isActive = activeLevel === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveLevel(key)}
                  className="px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0"
                  style={{
                    background: isActive ? 'var(--bg-elevated)' : 'transparent',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                    border: isActive ? '1px solid var(--border)' : '1px solid transparent',
                    boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold"
                      style={{ background: `color-mix(in oklch, ${domain.color} 15%, var(--bg-base))`, color: domain.color }}>
                      {i + 1}
                    </span>
                    <span>{cl.name || key}</span>
                    {levelTotal > 0 && (
                      <span className="text-[10px]" style={{ color: levelCompleted === levelTotal && levelTotal > 0 ? 'var(--success)' : 'var(--text-muted)' }}>
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
          <div className="accent-surface p-4">
            <h2 className="font-bold text-base mb-1" style={{ color: domain.color, fontFamily: 'var(--font-display)' }}>
              Level {(currentLevel as CurriculumLevel).order}: {(currentLevel as CurriculumLevel).name}
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{(currentLevel as CurriculumLevel).description}</p>
            <div className="mt-3">
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
              <motion.div key={topic.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, ease: [0.25, 1, 0.5, 1] }}>
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

        {/* Fallback: Old levels format */}
        {!hasCurriculumLevels && domain.levels && (
          <div className="space-y-3">
            {Object.entries(domain.levels).map(([levelKey, levelData]: [string, any]) => (
              <div
                key={levelKey}
                onClick={() => router.push(`/quiz?domain=${domain.id}&level=${levelKey}`)}
                className="surface-card-interactive p-4 sm:p-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base capitalize">{levelData.name}</h3>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>{levelData.description}</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <div className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: domain.color }}>{levelData.questions?.length || 0}</div>
                    <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>questions</div>
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
              <motion.div key={topic.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, ease: [0.25, 1, 0.5, 1] }}>
                <Link href={`/learn/${domain.id}/${topic.id}`}>
                  <div className="surface-card-interactive p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                        style={{ background: `color-mix(in oklch, ${domain.color} 15%, var(--bg-base))`, color: domain.color }}>
                        {topic.chapter || i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base truncate">{topic.title}</h3>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{topic.questions?.length || 0} questions</span>
                      </div>
                      <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
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
