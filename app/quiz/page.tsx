'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ClientLayout from '@/components/ClientLayout';
import { loadDomain, Domain, Question, getTopicQuestions, getAllQuestions } from '@/lib/domains';
import { loadProgress, saveProgress, addXP, updateStreak } from '@/lib/storage';
import { scheduleReview, ReviewRating } from '@/lib/spaced-repetition';
import { Timer, CheckCircle, XCircle, Zap, Trophy } from 'lucide-react';
import AudioMode from '@/components/AudioMode';

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const domainId = searchParams?.get('domain') || '';
  const topicId = searchParams?.get('topic') || '';
  const levelName = searchParams?.get('level') || '';

  const [domain, setDomain] = useState<Domain | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [earnedXP, setEarnedXP] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  useEffect(() => {
    if (!domainId) return;

    loadDomain(domainId).then((d) => {
      setDomain(d);
      let qs: Question[] = [];

      if (topicId) {
        qs = getTopicQuestions(d, topicId);
      } else if (levelName && d.levels) {
        const level = d.levels[levelName as keyof typeof d.levels] as any;
        if (level?.topics && Array.isArray(level.topics)) {
          qs = level.topics.flatMap((t: any) => t.questions || []);
        } else {
          qs = level?.questions || [];
        }
      } else {
        qs = getAllQuestions(d).sort(() => Math.random() - 0.5).slice(0, 10);
      }

      setQuestions(qs);
      if (qs[0]?.timeLimit) setTimeLeft(qs[0].timeLimit);
    });
  }, [domainId, topicId, levelName]);

  useEffect(() => {
    if (showFeedback || !questions[currentIndex] || quizDone) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, showFeedback, questions, quizDone]);

  const currentQuestion = questions[currentIndex];

  const handleSubmit = () => {
    if (!currentQuestion) return;
    if (selectedAnswer === null && !showFeedback) return;

    let correct = false;

    if (currentQuestion.type === 'multiple-choice') {
      correct = selectedAnswer === currentQuestion.correct;
    } else {
      const userAnswer = String(selectedAnswer).trim().toLowerCase();
      const correctAnswer = currentQuestion.answer?.trim().toLowerCase() || '';
      correct = userAnswer === correctAnswer;
    }

    setIsCorrect(correct);
    setShowFeedback(true);
    if (correct) setCorrectCount(prev => prev + 1);

    if (correct) {
      const xp = currentQuestion.xp;
      setEarnedXP(xp);
      setTotalXP(prev => prev + xp);

      let progress = loadProgress();
      progress = updateStreak(progress);
      progress = addXP(progress, xp, domainId);

      if (!progress.domains[domainId]) {
        progress.domains[domainId] = { xp: 0, level: 1, completedQuestions: [], levelProgress: { beginner: 0, intermediate: 0, advanced: 0 } };
      }
      if (!progress.domains[domainId].completedQuestions.includes(currentQuestion.id)) {
        progress.domains[domainId].completedQuestions.push(currentQuestion.id);
      }

      const rating: ReviewRating = timeLeft > 20 ? 'easy' : timeLeft > 10 ? 'good' : 'hard';
      const existingCard = progress.reviewQueue.find(c => c.questionId === currentQuestion.id);
      const newCard = scheduleReview(existingCard, rating, currentQuestion.id, domainId, levelName || 'mixed');
      progress.reviewQueue = progress.reviewQueue.filter(c => c.questionId !== currentQuestion.id);
      progress.reviewQueue.push(newCard);

      saveProgress(progress);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setTimeLeft(questions[currentIndex + 1]?.timeLimit || 30);
      setEarnedXP(0);
    } else {
      setQuizDone(true);
    }
  };

  if (quizDone) {
    const percentage = Math.round((correctCount / questions.length) * 100);
    return (
      <ClientLayout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="surface-card p-8 text-center space-y-6"
          >
            <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center"
                 style={{ background: 'var(--accent-subtle)' }}>
              <Trophy size={40} style={{ color: 'var(--accent)' }} />
            </div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Quiz Complete!</h2>
            <div className="text-5xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>
              {percentage}%
            </div>
            <p style={{ color: 'var(--text-tertiary)' }}>
              {correctCount} of {questions.length} correct · +{totalXP} XP earned
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => router.back()}
                className="flex-1 py-3 rounded-xl font-semibold surface-card-interactive"
                style={{ color: 'var(--text-secondary)' }}
              >
                Back to Topic
              </button>
              <button
                onClick={() => { setQuizDone(false); setCurrentIndex(0); setSelectedAnswer(null); setShowFeedback(false); setTotalXP(0); setCorrectCount(0); setTimeLeft(30); }}
                className="flex-1 py-3 rounded-xl font-semibold text-white"
                style={{ background: 'var(--accent)' }}
              >
                Try Again
              </button>
            </div>
          </motion.div>
        </div>
      </ClientLayout>
    );
  }

  if (!domain || !currentQuestion) {
    return <ClientLayout><div className="p-6 text-center" style={{ color: 'var(--text-muted)' }}>Loading quiz...</div></ClientLayout>;
  }

  const progressPct = ((currentIndex + 1) / questions.length) * 100;

  return (
    <ClientLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-6 space-y-5">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: 'var(--text-tertiary)' }}>Question {currentIndex + 1} of {questions.length}</span>
            <div className="flex items-center gap-1">
              <Zap size={16} style={{ color: 'var(--warning)' }} />
              <span className="font-bold">{totalXP} XP</span>
            </div>
          </div>
          <div className="progress-track h-2">
            <motion.div
              className="progress-fill h-full"
              style={{ background: 'var(--accent)' }}
              animate={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Timer */}
        <div className="surface-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer size={18} style={{ color: 'var(--accent)' }} />
              <span className="font-semibold">{timeLeft}s</span>
            </div>
            <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{domain.icon} {domain.name}</div>
          </div>
          <div className="progress-track mt-2 h-1">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${(timeLeft / (currentQuestion.timeLimit || 30)) * 100}%`,
                background: timeLeft < 10 ? 'var(--error)' : timeLeft < 20 ? 'var(--warning)' : 'var(--success)'
              }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="surface-card p-6 space-y-5"
          >
            <div className="flex items-start justify-between gap-3 mb-1">
              <h2 className="text-lg sm:text-xl font-semibold leading-relaxed flex-1" style={{ fontFamily: 'var(--font-display)' }}>
                {currentQuestion.question}
              </h2>
              <AudioMode
                content=""
                question={currentQuestion.question}
                options={currentQuestion.options?.map((o: any) => typeof o === 'string' ? o : o.text || '')}
                explanation={currentQuestion.explanation}
                showExplanation={showFeedback}
              />
            </div>

            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const showResult = showFeedback && (isSelected || index === currentQuestion.correct);
                  const isCorrectOption = index === currentQuestion.correct;

                  let cardStyle: any = {
                    background: isSelected ? 'var(--accent-subtle)' : 'var(--bg-surface)',
                    border: isSelected ? '2px solid var(--accent)' : '2px solid var(--border-subtle)',
                  };
                  if (showResult) {
                    if (isCorrectOption) cardStyle = { background: 'var(--success-light)', border: '2px solid var(--success)' };
                    else if (isSelected) cardStyle = { background: 'var(--error-light)', border: '2px solid var(--error)' };
                    else cardStyle = { background: 'var(--bg-sunken)', border: '2px solid var(--border-subtle)', opacity: 0.5 };
                  }

                  return (
                    <motion.button
                      key={index}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => !showFeedback && setSelectedAnswer(index)}
                      disabled={showFeedback}
                      className="w-full p-4 rounded-xl text-left transition-all"
                      style={cardStyle}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0"
                          style={
                            showResult && isCorrectOption ? { borderColor: 'var(--success)', background: 'var(--success)', color: 'white' } :
                            showResult && isSelected && !isCorrectOption ? { borderColor: 'var(--error)', background: 'var(--error)', color: 'white' } :
                            isSelected ? { borderColor: 'var(--accent)', background: 'var(--accent)', color: 'white' } :
                            { borderColor: 'var(--border)', color: 'var(--text-muted)' }
                          }>
                          {showResult && isCorrectOption ? <CheckCircle size={16} /> :
                           showResult && isSelected ? <XCircle size={16} /> :
                           String.fromCharCode(65 + index)}
                        </div>
                        <span style={{ color: 'var(--text-primary)' }}>{option}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === 'text-input' && (
              <div>
                <input
                  type="text"
                  value={selectedAnswer as string || ''}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  disabled={showFeedback}
                  placeholder="Type your answer..."
                  className="w-full p-4 rounded-xl text-lg outline-none transition-all"
                  style={{
                    background: 'var(--bg-surface)',
                    border: '2px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                  onKeyDown={(e) => e.key === 'Enter' && !showFeedback && handleSubmit()}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Feedback */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-xl"
              style={{
                background: isCorrect ? 'var(--success-light)' : 'var(--error-light)',
                border: `1px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}`,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                {isCorrect ? (
                  <>
                    <CheckCircle size={24} style={{ color: 'var(--success)' }} />
                    <div>
                      <div className="font-bold text-lg" style={{ color: 'var(--success)' }}>Correct!</div>
                      <div className="text-sm" style={{ color: 'var(--success)' }}>+{earnedXP} XP</div>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle size={24} style={{ color: 'var(--error)' }} />
                    <div className="font-bold text-lg" style={{ color: 'var(--error)' }}>Not quite</div>
                  </>
                )}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{currentQuestion.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action button */}
        {!showFeedback ? (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null || selectedAnswer === ''}
            className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: 'var(--accent)' }}
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all hover:opacity-90"
            style={{ background: 'var(--accent)' }}
          >
            {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
          </button>
        )}
      </div>
    </ClientLayout>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<ClientLayout><div className="p-6 text-center" style={{ color: 'var(--text-muted)' }}>Loading...</div></ClientLayout>}>
      <QuizContent />
    </Suspense>
  );
}
