// LocalStorage utilities for BrainForge

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastStudyDate: string;
  domains: Record<string, DomainProgress>;
  reviewQueue: ReviewCard[];
}

export interface DomainProgress {
  xp: number;
  level: number;
  completedQuestions: string[];
  levelProgress: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
}

export interface ReviewCard {
  questionId: string;
  domainId: string;
  level: string;
  interval: number;
  repetitions: number;
  easeFactor: number;
  nextReview: string;
}

const STORAGE_KEY = 'brainforge_progress';

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') {
    return getDefaultProgress();
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return getDefaultProgress();
  }
  
  try {
    return JSON.parse(stored);
  } catch {
    return getDefaultProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function getDefaultProgress(): UserProgress {
  return {
    xp: 0,
    level: 1,
    streak: 0,
    lastStudyDate: '',
    domains: {},
    reviewQueue: []
  };
}

export function updateStreak(progress: UserProgress): UserProgress {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  if (progress.lastStudyDate === today) {
    return progress;
  }
  
  const newStreak = progress.lastStudyDate === yesterday 
    ? progress.streak + 1 
    : 1;
  
  return {
    ...progress,
    streak: newStreak,
    lastStudyDate: today
  };
}

export function addXP(progress: UserProgress, amount: number, domainId: string): UserProgress {
  const newProgress = { ...progress };
  newProgress.xp += amount;
  newProgress.level = Math.floor(newProgress.xp / 100) + 1;
  
  if (!newProgress.domains[domainId]) {
    newProgress.domains[domainId] = {
      xp: 0,
      level: 1,
      completedQuestions: [],
      levelProgress: { beginner: 0, intermediate: 0, advanced: 0 }
    };
  }
  
  newProgress.domains[domainId].xp += amount;
  newProgress.domains[domainId].level = Math.floor(newProgress.domains[domainId].xp / 50) + 1;
  
  return newProgress;
}
