'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function DomainPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [domain, setDomain] = useState<any>(null);
  const [tab, setTab] = useState<'feed' | 'quiz' | 'flashcards' | 'generate'>('feed');
  const [feed, setFeed] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [currentFC, setCurrentFC] = useState(0);

  // Generate state
  const [genCount, setGenCount] = useState(10);
  const [genDifficulty, setGenDifficulty] = useState('intermediate');
  const [genTopic, setGenTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [genResult, setGenResult] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/v2/domains`).then(r => r.json()).then(d => {
      const dom = (d.domains || []).find((x: any) => x.slug === slug);
      if (dom) setDomain(dom);
    });
  }, [slug]);

  useEffect(() => {
    if (tab === 'feed') fetch(`/api/v2/feed?domain=${slug}&limit=20`).then(r => r.json()).then(d => setFeed(d.digests || []));
    if (tab === 'quiz') {
      fetch(`/api/v2/quiz?domain=${slug}&limit=15`).then(r => r.json()).then(d => { setQuestions(d.questions || []); setCurrentQ(0); setSelected(null); setScore(0); });
    }
    if (tab === 'flashcards') {
      fetch(`/api/v2/flashcards?domain=${slug}&limit=20`).then(r => r.json()).then(d => { setFlashcards(d.flashcards || []); setCurrentFC(0); setFlipped(false); });
    }
  }, [tab, slug]);

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === questions[currentQ]?.correct_answer) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    setSelected(null);
    setCurrentQ(c => c + 1);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGenResult(null);
    try {
      const res = await fetch(`/api/v2/generate?domain=${slug}&count=${genCount}&difficulty=${genDifficulty}&topic=${encodeURIComponent(genTopic)}`);
      const data = await res.json();
      setGenResult(data);
    } catch (e) {
      setGenResult({ error: 'Generation failed' });
    }
    setGenerating(false);
  };

  const startGenQuiz = () => {
    if (genResult?.questions) {
      setQuestions(genResult.questions.map((q: any, i: number) => ({
        ...q, id: `gen-${i}`, domain_slug: slug, correct_answer: q.correct,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
      })));
      setCurrentQ(0); setSelected(null); setScore(0);
      setTab('quiz');
    }
  };

  if (!domain) return <div style={{ background: '#0a0908', minHeight: '100vh', color: 'white', padding: 20 }}>Loading...</div>;

  return (
    <div className="min-h-screen pb-24" style={{ background: '#0a0908' }}>
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <Link href="/" className="text-white/40 text-sm mb-3 inline-block">Back</Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${domain.color}20` }}>
            <div className="w-4 h-4 rounded-full" style={{ background: domain.color }}></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{domain.name}</h1>
            <p className="text-white/40 text-xs">{domain.paper_count} papers / {domain.question_count} questions / {domain.flashcard_count} flashcards</p>
          </div>
        </div>
        <p className="text-white/50 text-sm">{domain.description}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-5 mb-4">
        {(['feed', 'quiz', 'flashcards', 'generate'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-[12px] font-medium transition-colors ${
              tab === t ? 'bg-amber-500/20 text-amber-400' : 'bg-white/[0.04] text-white/50'
            }`}>{t === 'generate' ? 'Generate' : t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>

      {/* Feed */}
      {tab === 'feed' && (
        <div className="px-5 space-y-3">
          {feed.length === 0 && <div className="text-white/30 text-center py-10 text-sm">No digests yet</div>}
          {feed.map((d, i) => (
            <div key={i} className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/50">{d.source}</span>
                <span className="text-[10px] text-white/30">{d.published_date}</span>
              </div>
              <h3 className="text-[14px] font-medium text-white/90 mb-2">{d.title}</h3>
              <p className="text-[12px] text-white/50 mb-2">{d.summary}</p>
              {d.why_it_matters && <p className="text-[11px] text-amber-400/70 italic">{d.why_it_matters}</p>}
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-[10px] px-2 py-0.5 rounded ${
                  d.difficulty === 'expert' ? 'bg-red-500/20 text-red-400' :
                  d.difficulty === 'advanced' ? 'bg-purple-500/20 text-purple-400' :
                  d.difficulty === 'intermediate' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-emerald-500/20 text-emerald-400'
                }`}>{d.difficulty}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quiz */}
      {tab === 'quiz' && questions.length > 0 && currentQ < questions.length && (
        <div className="px-5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/40 text-sm">{currentQ + 1} / {questions.length}</span>
            <span className="text-amber-400 text-sm font-medium">Score: {score}</span>
          </div>
          <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/[0.06]">
            <p className="text-white/90 text-[15px] mb-5 leading-relaxed">{questions[currentQ].question}</p>
            <div className="space-y-2">
              {(questions[currentQ].options || []).map((opt: string, idx: number) => {
                const isCorrect = idx === questions[currentQ].correct_answer;
                const isSelected = idx === selected;
                let bg = 'bg-white/[0.04] border-white/[0.06]';
                if (selected !== null) {
                  if (isCorrect) bg = 'bg-emerald-500/20 border-emerald-400/30';
                  else if (isSelected && !isCorrect) bg = 'bg-red-500/20 border-red-400/30';
                }
                return (
                  <button key={idx} onClick={() => handleAnswer(idx)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${bg} ${selected === null ? 'hover:bg-white/[0.06]' : ''}`}>
                    <span className="text-[13px] text-white/80">{opt}</span>
                  </button>
                );
              })}
            </div>
            {selected !== null && (
              <div className="mt-4">
                <p className="text-[12px] text-white/50 mb-3">{questions[currentQ].explanation}</p>
                <button onClick={nextQuestion}
                  className="w-full py-3 rounded-xl bg-amber-500/20 text-amber-400 font-medium text-sm">
                  {currentQ + 1 < questions.length ? 'Next Question' : 'Done'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'quiz' && currentQ >= questions.length && questions.length > 0 && (
        <div className="px-5 text-center py-10">
          <div className="text-4xl font-bold text-amber-400 mb-2">{score}/{questions.length}</div>
          <div className="text-white/50 text-sm mb-4">{Math.round(score/questions.length*100)}% correct</div>
          <button onClick={() => { setCurrentQ(0); setSelected(null); setScore(0); setTab('quiz'); }}
            className="px-6 py-3 rounded-xl bg-amber-500/20 text-amber-400 font-medium text-sm">Try Again</button>
        </div>
      )}

      {/* Flashcards */}
      {tab === 'flashcards' && flashcards.length > 0 && (
        <div className="px-5">
          <div className="text-white/40 text-sm text-center mb-4">{currentFC + 1} / {flashcards.length}</div>
          <button onClick={() => setFlipped(!flipped)}
            className="w-full bg-white/[0.03] rounded-2xl p-8 border border-white/[0.06] min-h-[200px] flex items-center justify-center text-center transition-all hover:bg-white/[0.05]">
            <div>
              <div className="text-[10px] text-white/30 mb-3">{flipped ? 'Answer' : 'Question'}</div>
              <p className="text-white/90 text-[16px] leading-relaxed">
                {flipped ? flashcards[currentFC].back : flashcards[currentFC].front}
              </p>
            </div>
          </button>
          <div className="flex gap-3 mt-4">
            <button onClick={() => { setCurrentFC(c => Math.max(0, c - 1)); setFlipped(false); }}
              className="flex-1 py-3 rounded-xl bg-white/[0.04] text-white/50 text-sm">Previous</button>
            <button onClick={() => { setCurrentFC(c => Math.min(flashcards.length - 1, c + 1)); setFlipped(false); }}
              className="flex-1 py-3 rounded-xl bg-amber-500/20 text-amber-400 text-sm font-medium">Next</button>
          </div>
        </div>
      )}

      {/* Generate */}
      {tab === 'generate' && (
        <div className="px-5">
          <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/[0.06]">
            <h3 className="text-white/90 text-[15px] font-medium mb-4">Generate Custom Questions</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-white/40 text-[11px] block mb-1">Number of questions</label>
                <div className="flex gap-2">
                  {[5, 10, 20, 30].map(n => (
                    <button key={n} onClick={() => setGenCount(n)}
                      className={`px-4 py-2 rounded-lg text-[12px] ${genCount === n ? 'bg-amber-500/20 text-amber-400' : 'bg-white/[0.04] text-white/50'}`}>{n}</button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-white/40 text-[11px] block mb-1">Difficulty</label>
                <div className="flex gap-2 flex-wrap">
                  {['beginner', 'intermediate', 'advanced', 'expert'].map(d => (
                    <button key={d} onClick={() => setGenDifficulty(d)}
                      className={`px-4 py-2 rounded-lg text-[12px] capitalize ${genDifficulty === d ? 'bg-amber-500/20 text-amber-400' : 'bg-white/[0.04] text-white/50'}`}>{d}</button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-white/40 text-[11px] block mb-1">Custom topic (optional)</label>
                <input type="text" value={genTopic} onChange={e => setGenTopic(e.target.value)}
                  placeholder="e.g. transformers, CRISPR, orbital mechanics..."
                  className="w-full bg-white/[0.04] rounded-lg px-4 py-2.5 text-[13px] text-white/80 outline-none border border-white/[0.06] placeholder:text-white/20" />
              </div>
              
              <button onClick={handleGenerate} disabled={generating}
                className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${generating ? 'bg-white/10 text-white/30' : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'}`}>
                {generating ? 'Generating...' : `Generate ${genCount} Questions`}
              </button>
            </div>
          </div>
          
          {genResult && !genResult.error && (
            <div className="mt-4 bg-white/[0.03] rounded-2xl p-5 border border-white/[0.06]">
              <div className="flex justify-between items-center mb-3">
                <span className="text-white/90 text-[14px] font-medium">{genResult.generated} questions generated</span>
                <span className="text-white/40 text-[11px]">{genResult.totalInDomain} total in domain</span>
              </div>
              <button onClick={startGenQuiz}
                className="w-full py-3 rounded-xl bg-emerald-500/20 text-emerald-400 font-medium text-sm">
                Start Quiz with Generated Questions
              </button>
              <div className="mt-3 space-y-2 max-h-[300px] overflow-y-auto">
                {genResult.questions.map((q: any, i: number) => (
                  <div key={i} className="bg-white/[0.02] rounded-lg p-3 border border-white/[0.03]">
                    <p className="text-[12px] text-white/70">{q.question}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {genResult?.error && (
            <div className="mt-4 bg-red-500/10 rounded-xl p-4 border border-red-500/20">
              <p className="text-red-400 text-sm">{genResult.error}</p>
            </div>
          )}
        </div>
      )}

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/[0.06] px-6 py-3 flex justify-around z-50">
        <Link href="/" className="text-[11px] text-white/40">Home</Link>
        <Link href="/domains" className="text-[11px] text-white/40">Domains</Link>
        <Link href="/review" className="text-[11px] text-white/40">Review</Link>
        <Link href="/progress" className="text-[11px] text-white/40">Progress</Link>
      </nav>
    </div>
  );
}
