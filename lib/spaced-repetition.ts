// SM-2 Algorithm for spaced repetition

import { ReviewCard } from './storage';

export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';

export function scheduleReview(
  card: ReviewCard | undefined,
  rating: ReviewRating,
  questionId: string,
  domainId: string,
  level: string
): ReviewCard {
  // New card defaults
  const currentCard = card || {
    questionId,
    domainId,
    level,
    interval: 0,
    repetitions: 0,
    easeFactor: 2.5,
    nextReview: new Date().toISOString()
  };

  let { interval, repetitions, easeFactor } = currentCard;

  // SM-2 algorithm
  const quality = ratingToQuality(rating);
  
  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    // Incorrect response
    repetitions = 0;
    interval = 1;
  }

  // Update ease factor
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  // Calculate next review date
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    questionId,
    domainId,
    level,
    interval,
    repetitions,
    easeFactor,
    nextReview: nextReview.toISOString()
  };
}

function ratingToQuality(rating: ReviewRating): number {
  switch (rating) {
    case 'again': return 0;
    case 'hard': return 3;
    case 'good': return 4;
    case 'easy': return 5;
  }
}

export function getDueReviews(reviewQueue: ReviewCard[]): ReviewCard[] {
  const now = new Date();
  return reviewQueue.filter(card => new Date(card.nextReview) <= now);
}

export function getReviewCount(reviewQueue: ReviewCard[]): number {
  return getDueReviews(reviewQueue).length;
}
