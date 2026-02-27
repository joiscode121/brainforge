'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ClientLayout from '@/components/ClientLayout';
import { loadDomain, Domain, Question } from '@/lib/domains';
import { loadProgress, saveProgress, addXP, updateStreak } from '@/lib/storage';
import { scheduleReview, ReviewRating } from '@/lib/spaced-repetition';
import { Timer, CheckCircle, XCircle, Zap } from 'lucide-react';

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const domainId = searchParams?.get('domain') || '';
  const levelName = searchParams?.get('level') || 'beginner';

  const [domain, setDomain] = useState<Domain | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [earnedXP, setEarnedXP] = useState(0);
  const [totalXP, setTotalXP] = useState(0);

  useEffect(() => {
    if (!domainId) return;
    
    loadDomain(domainId).then((d) => {
      setDomain(d);
      const levelQuestions = d.levels[levelName as keyof typeof d.levels].questions;
      setQuestions(levelQuestions);
    });
  }, [domainId, levelName]);

  useEffect(() => {
    if (showFeedback || !questions[currentIndex]) return;

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
  }, [currentIndex, showFeedback, questions]);

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

    if (correct) {
      const xp = currentQuestion.xp;
      setEarnedXP(xp);
      setTotalXP(prev => prev + xp);
      
      let progress = loadProgress();
      progress = updateStreak(progress);
      progress = addXP(progress, xp, domainId);
      
      if (!progress.domains[domainId]?.completedQuestions.includes(currentQuestion.id)) {
        if (!progress.domains[domainId]) {
          progress.domains[domainId] = {
            xp: 0,
            level: 1,
            completedQuestions: [],
            levelProgress: { beginner: 0, intermediate: 0, advanced: 0 }
          };
        }
        progress.domains[domainId].completedQuestions.push(currentQuestion.id);
        progress.domains[domainId].levelProgress[levelName as 'beginner' | 'intermediate' | 'advanced']++;
      }
      
      const existingCard = progress.reviewQueue.find(c => c.questionId === currentQuestion.id);
      const rating: ReviewRating = timeLeft > 20 ? 'easy' : timeLeft > 10 ? 'good' : 'hard';
      const newCard = scheduleReview(existingCard, rating, currentQuestion.id, domainId, levelName);
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
      router.push(`/domain/${domainId}`);
    }
  };

  if (!domain || !currentQuestion) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-white/60">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <div className="flex items-center gap-1">
            <Zap size={16} className="text-yellow-500" />
            <span className="font-bold text-white">{totalXP} XP</span>
          </div>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="glass-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer size={20} className="text-cyan-400" />
            <span className="font-semibold">{timeLeft}s</span>
          </div>
          <div className="text-sm text-white/60">
            {domain.icon} {domain.name}
          </div>
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

      <div className="glass-card p-6 space-y-6">
        <h2 className="text-xl font-semibold leading-relaxed">{currentQuestion.question}</h2>

        {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const showResult = showFeedback && (isSelected || index === currentQuestion.correct);
              const isCorrectOption = index === currentQuestion.correct;
              
              return (
                <button
                  key={index}
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
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      showResult && isCorrectOption
                        ? 'border-green-500 bg-green-500'
                        : showResult && isSelected && !isCorrectOption
                        ? 'border-red-500 bg-red-500'
                        : isSelected
                        ? 'border-cyan-400 bg-cyan-400'
                        : 'border-white/40'
                    }`}>
                      {showResult && isCorrectOption && <CheckCircle size={16} className="text-white" />}
                      {showResult && isSelected && !isCorrectOption && <XCircle size={16} className="text-white" />}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
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
            />
            {showFeedback && (
              <div className="mt-2 text-sm text-white/60">
                Correct answer: <span className="font-bold text-white">{currentQuestion.answer}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {showFeedback && (
        <div className={`glass-card p-6 border-2 ${
          isCorrect ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            {isCorrect ? (
              <>
                <CheckCircle className="text-green-500" size={32} />
                <div>
                  <div className="font-bold text-lg">Correct!</div>
                  <div className="text-sm text-white/60">+{earnedXP} XP</div>
                </div>
              </>
            ) : (
              <>
                <XCircle className="text-red-500" size={32} />
                <div className="font-bold text-lg">Not quite</div>
              </>
            )}
          </div>
          <p className="text-white/80 leading-relaxed">{currentQuestion.explanation}</p>
        </div>
      )}

      <div className="flex gap-4">
        {!showFeedback ? (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null || selectedAnswer === ''}
            className="flex-1 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400"
          >
            {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <ClientLayout>
      <Suspense fallback={<div className="p-6 text-center">Loading quiz...</div>}>
        <QuizContent />
      </Suspense>
    </ClientLayout>
  );
}
