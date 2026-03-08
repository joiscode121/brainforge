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

export interface CodingChallenge {
  prompt: string;
  starter_code: string;
  solution: string;
  tests: string;
}

export interface CurriculumTopic {
  id: string;
  title: string;
  explainer: string;
  visual: string;
  questions: Question[];
  coding_challenge?: CodingChallenge;
  paper_ref?: string;
  source?: string;
}

export interface CurriculumLevel {
  name: string;
  description: string;
  order: number;
  topics: CurriculumTopic[];
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
  levels?: Record<string, Level | CurriculumLevel>;
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
    const questions: Question[] = [];
    for (const level of Object.values(domain.levels)) {
      if ('topics' in level && Array.isArray((level as CurriculumLevel).topics)) {
        // New curriculum format with topics inside levels
        for (const topic of (level as CurriculumLevel).topics) {
          questions.push(...(topic.questions || []));
        }
      } else if ('questions' in level) {
        questions.push(...(level as Level).questions);
      }
    }
    return questions;
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
