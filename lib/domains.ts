// Domain data loader

export interface Question {
  id: string;
  type: 'multiple-choice' | 'text-input';
  question: string;
  options?: string[];
  correct?: number;
  answer?: string;
  explanation: string;
  xp: number;
  timeLimit?: number;
}

export interface Level {
  name: string;
  description: string;
  questions: Question[];
}

export interface Domain {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  levels: {
    beginner: Level;
    intermediate: Level;
    advanced: Level;
  };
}

const DOMAIN_IDS = [
  'ai-ml',
  'comp-math',
  'cs-fundamentals',
  'stem',
  'reading-english',
  'languages',
  'amc-math'
];

export async function loadDomain(domainId: string): Promise<Domain> {
  const response = await fetch(`/data/${domainId}.json`);
  return response.json();
}

export async function loadAllDomains(): Promise<Domain[]> {
  const domains = await Promise.all(
    DOMAIN_IDS.map(id => loadDomain(id))
  );
  return domains;
}

export function getRandomQuestions(domain: Domain, count: number): Question[] {
  const allQuestions: Question[] = [
    ...domain.levels.beginner.questions,
    ...domain.levels.intermediate.questions,
    ...domain.levels.advanced.questions
  ];
  
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
