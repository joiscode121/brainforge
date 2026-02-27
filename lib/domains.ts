// Domain data loader - supports both old (levels) and new (topics) format

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

export interface Slide {
  title: string;
  content: string;
  visual?: string;
  visualData?: string;
  narration?: string;
}

export interface StudyMaterial {
  content: string;
  keyPoints: string[];
  readingTimeMin: number;
}

export interface Topic {
  id: string;
  title: string;
  chapter: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  study: StudyMaterial;
  mindmap: string;
  slides: Slide[];
  questions: Question[];
  resources: { title: string; url: string }[];
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
  topics?: Topic[];
  levels?: {
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
  if (!response.ok) throw new Error(`Failed to load domain ${domainId}`);
  return response.json();
}

export async function loadAllDomains(): Promise<Domain[]> {
  const results = await Promise.allSettled(
    DOMAIN_IDS.map(id => loadDomain(id))
  );
  return results
    .filter((r): r is PromiseFulfilledResult<Domain> => r.status === 'fulfilled')
    .map(r => r.value);
}

export function getAllQuestions(domain: Domain): Question[] {
  if (domain.topics) {
    return domain.topics.flatMap(t => t.questions || []);
  }
  if (domain.levels) {
    return [
      ...domain.levels.beginner.questions,
      ...domain.levels.intermediate.questions,
      ...domain.levels.advanced.questions
    ];
  }
  return [];
}

export function getTopicQuestions(domain: Domain, topicId: string): Question[] {
  const topic = domain.topics?.find(t => t.id === topicId);
  return topic?.questions || [];
}

export function getRandomQuestions(domain: Domain, count: number): Question[] {
  const all = getAllQuestions(domain);
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
