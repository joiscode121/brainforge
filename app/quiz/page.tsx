'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ClientLayout from '@/components/ClientLayout';
import { loadDomain, Domain, Question, getTopicQuestions, getAllQuestions } from '@/lib/domains';
import { loadProgress, saveProgress, addXP, updateStreak } from '@/lib/storage';
import { scheduleReview, ReviewRating } from '@/lib/spaced-repetition';
import { Timer, CheckCircle, XCircle, Zap, Trophy } from 'lucide-react';

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
        qs = d.levels[levelName as keyof typeof d.levels]?.questions || [];
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
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 text-center space-y-6"
          >
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
              <Trophy size={48} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold">Quiz Complete!</h2>
            <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              {percentage}%
            </div>
            <p className="text-white/60">
              {correctCount} of {questions.length} correct | +{totalXP} XP earned
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => router.back()}
                className="flex-1 py-3 rounded-xl font-bold glass-card hover:bg-white/10"
              >
                Back to Topic
              </button>
              <button
                onClick={() => { setQuizDone(false); setCurrentIndex(0); setSelectedAnswer(null); setShowFeedback(false); setTotalXP(0); setCorrectCount(0); setTimeLeft(30); }}
                className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500"
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
    return <ClientLayout><div className="p-6 text-center text-white/60">Loading quiz...</div></ClientLayout>;
  }

  const progressPct = ((currentIndex + 1) / questions.length) * 100;

  return (
    <ClientLayout>
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-white/60">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <div className="flex items-center gap-1">
              <Zap size={16} className="text-yellow-500" />
              <span className="font-bold text-white">{totalXP} XP</span>
            </div>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
              animate={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Timer */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer size={20} className="text-cyan-400" />
              <span className="font-semibold">{timeLeft}s</span>
            </div>
            <div className="text-sm text-white/60">{domain.icon} {domain.name}</div>
          </div>
          <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                timeLeft < 10 ? 'bg-red-500' : timeLeft < 20 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${(timeLeft / (currentQuestion.timeLimit || 30)) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="glass-card p-6 space-y-6"
          >
            <h2 className="text-xl font-semibold leading-relaxed">{currentQuestion.question}</h2>

            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const showResult = showFeedback && (isSelected || index === currentQuestion.correct);
                  const isCorrectOption = index === currentQuestion.correct;
                  
                  return (
                    <motion.button
                      key={index}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => !showFeedback && setSelectedAnswer(index)}
                      disabled={showFeedback}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        showResult
                          ? isCorrectOption
                            ? 'border-green-500 bg-green-500/20'
                            : 'border-red-500 bg-red-500/20'
                          : isSelected
                          ? 'border-cyan-400 bg-cyan-400/10'
                          : 'border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                          showResult && isCorrectOption ? 'border-green-500 bg-green-500 text-white' :
                          showResult && isSelected && !isCorrectOption ? 'border-red-500 bg-red-500 text-white' :
                          isSelected ? 'border-cyan-400 bg-cyan-400 text-white' :
                          'border-white/40 text-white/40'
                        }`}>
                          {showResult && isCorrectOption ? <CheckCircle size={16} /> :
                           showResult && isSelected ? <XCircle size={16} /> :
                           String.fromCharCode(65 + index)}
                        </div>
                        <span>{option}</span>
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
                  className="w-full p-4 rounded-xl border-2 border-white/20 bg-white/5 focus:border-cyan-400 focus:bg-white/10 outline-none text-lg"
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-card p-6 border-2 ${
                isCorrect ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                {isCorrect ? (
                  <>
                    <CheckCircle className="text-green-500" size={28} />
                    <div>
                      <div className="font-bold text-lg">Correct!</div>
                      <div className="text-sm text-green-400">+{earnedXP} XP</div>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="text-red-500" size={28} />
                    <div className="font-bold text-lg">Not quite</div>
                  </>
                )}
              </div>
              <p className="text-white/80 leading-relaxed text-sm">{currentQuestion.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action button */}
        {!showFeedback ? (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null || selectedAnswer === ''}
            className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400"
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
    <Suspense fallback={<ClientLayout><div className="p-6 text-center text-white/60">Loading...</div></ClientLayout>}>
      <QuizContent />
    </Suspense>
  );
}
