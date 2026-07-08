import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_AI_API_URL || 'http://localhost:8000';

const FALLBACK_QUESTIONS = [
  {
    id: 'fb-1',
    text: 'Which data structure is best suited for implementing undo/redo functionality?',
    subject: 'Data Structures',
    topic: 'Stacks',
    subtopic: 'LIFO',
    difficulty: 'EASY',
    bloom_level: 'Understanding',
    marks: '2',
    time_limit: '45',
    tags: 'Stacks,History,Undo',
  },
  {
    id: 'fb-2',
    text: 'What is the time complexity of binary search on a sorted array?',
    subject: 'Algorithms',
    topic: 'Searching',
    subtopic: 'Binary Search',
    difficulty: 'MEDIUM',
    bloom_level: 'Application',
    marks: '3',
    time_limit: '60',
    tags: 'Search,Complexity,Logarithmic',
  },
  {
    id: 'fb-3',
    text: 'Which SQL clause is used to filter rows after grouping?',
    subject: 'Databases',
    topic: 'SQL',
    subtopic: 'GROUP BY',
    difficulty: 'MEDIUM',
    bloom_level: 'Understanding',
    marks: '3',
    time_limit: '50',
    tags: 'SQL,Aggregation,Filtering',
  },
  {
    id: 'fb-4',
    text: 'Why is the AVL tree preferred over a regular binary search tree in some applications?',
    subject: 'Data Structures',
    topic: 'Trees',
    subtopic: 'AVL Trees',
    difficulty: 'HARD',
    bloom_level: 'Analysis',
    marks: '4',
    time_limit: '90',
    tags: 'Balanced Trees,Performance',
  },
  {
    id: 'fb-5',
    text: 'What is the main purpose of process scheduling in an operating system?',
    subject: 'Operating Systems',
    topic: 'Scheduling',
    subtopic: 'CPU Scheduling',
    difficulty: 'MEDIUM',
    bloom_level: 'Understanding',
    marks: '3',
    time_limit: '60',
    tags: 'OS,Processes,CPU',
  },
  {
    id: 'fb-6',
    text: 'In a REST API, which HTTP method is typically used to create a new resource?',
    subject: 'Web Development',
    topic: 'HTTP',
    subtopic: 'REST',
    difficulty: 'EASY',
    bloom_level: 'Remembering',
    marks: '2',
    time_limit: '40',
    tags: 'HTTP,REST,API',
  },
  {
    id: 'fb-7',
    text: 'What is the difference between TCP and UDP in terms of reliability?',
    subject: 'Networks',
    topic: 'Transport Layer',
    subtopic: 'TCP vs UDP',
    difficulty: 'MEDIUM',
    bloom_level: 'Analysis',
    marks: '3',
    time_limit: '70',
    tags: 'Networking,Transport,Protocols',
  },
  {
    id: 'fb-8',
    text: 'Which metric is commonly used to evaluate a classification model?',
    subject: 'Machine Learning',
    topic: 'Evaluation',
    subtopic: 'Accuracy',
    difficulty: 'MEDIUM',
    bloom_level: 'Application',
    marks: '3',
    time_limit: '60',
    tags: 'ML,Metrics,Classification',
  },
];

export const aiApi = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export interface StudentProfile {
  student_id: string;
  weak_topics: string[];
  strong_topics: string[];
  preferred_difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  n_results: number;
}

export interface RecommendedQuestion {
  id: string;
  text: string;
  subject: string;
  topic: string;
  subtopic: string;
  difficulty: string;
  bloom_level: string;
  marks: string;
  time_limit: string;
  tags: string;
  similarity: string;
}

export interface RecommendationResponse {
  status: string;
  student_id: string;
  query: string;
  difficulty_filter: string;
  total_recommended: number;
  recommended_questions: RecommendedQuestion[];
  source?: 'backend' | 'fallback';
}

export interface PredictionInput {
  study_hours: number;
  previous_score: number;
  attendance_rate: number;
  weak_topics_count: number;
  time_per_question_sec: number;
}

export interface PredictionResponse {
  status: string;
  prediction: string;
  pass_probability: string;
  fail_probability: string;
}

const buildFallbackRecommendations = (profile: StudentProfile): RecommendationResponse => {
  const weakTopics = profile.weak_topics.map(topic => topic.toLowerCase());
  const strongTopics = profile.strong_topics.map(topic => topic.toLowerCase());
  const preferredDifficulty = profile.preferred_difficulty.toUpperCase();
  const difficultyRank = { EASY: 0, MEDIUM: 1, HARD: 2 } as const;

  const scoredQuestions = FALLBACK_QUESTIONS.map(question => {
    const text = `${question.subject} ${question.topic} ${question.subtopic}`.toLowerCase();
    let score = 0.4;

    if (weakTopics.some(topic => text.includes(topic))) score += 0.45;
    if (strongTopics.some(topic => text.includes(topic))) score -= 0.2;

    const questionDifficulty = question.difficulty.toUpperCase();
    const diffDelta = Math.abs(difficultyRank[questionDifficulty as keyof typeof difficultyRank] - difficultyRank[preferredDifficulty as keyof typeof difficultyRank]);
    score += diffDelta === 0 ? 0.25 : diffDelta === 1 ? 0.08 : -0.05;

    score += question.marks === '4' ? 0.05 : 0.02;

    return {
      ...question,
      similarity: `${Math.max(0.75, Math.min(0.99, score)).toFixed(2)}`,
    } as RecommendedQuestion;
  })
    .sort((a, b) => Number(b.similarity) - Number(a.similarity))
    .slice(0, profile.n_results);

  const query = weakTopics.length
    ? `Adaptive review for ${weakTopics.join(', ')} with ${preferredDifficulty.toLowerCase()} focus`
    : `Balanced review with ${preferredDifficulty.toLowerCase()} focus`;

  return {
    status: 'success',
    student_id: profile.student_id,
    query,
    difficulty_filter: preferredDifficulty,
    total_recommended: scoredQuestions.length,
    recommended_questions: scoredQuestions,
    source: 'fallback',
  };
};

export const getRecommendations = async (profile: StudentProfile): Promise<RecommendationResponse> => {
  try {
    const res = await aiApi.post<RecommendationResponse>('/api/ai/recommend', profile);
    return {
      ...res.data,
      source: 'backend',
    };
  } catch {
    return buildFallbackRecommendations(profile);
  }
};

export const predictPerformance = (data: PredictionInput) =>
  aiApi.post<PredictionResponse>('/api/ai/predict', data);
