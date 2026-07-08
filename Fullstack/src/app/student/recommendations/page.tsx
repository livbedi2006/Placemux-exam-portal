'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Brain, Target, Sparkles, BookOpen,
  Clock, Award, Tag, TrendingUp,
  ChevronRight, Loader2, AlertCircle, Star
} from 'lucide-react';
import { getRecommendations, type RecommendedQuestion, type StudentProfile } from '@/lib/ai-api';

const TOPICS = [
  'Data Structures', 'Algorithms', 'Databases', 'Machine Learning',
  'Operating Systems', 'Web Development', 'Networks', 'Calculus',
  'Linear Algebra', 'Statistics',
];

const DIFFICULTY_COLORS: Record<string, string> = {
  EASY:   'badge-green',
  MEDIUM: 'badge-amber',
  HARD:   'badge-red',
};

const BLOOM_COLORS: Record<string, string> = {
  Knowledge:    'badge-blue',
  Understanding:'badge-blue',
  Application:  'badge-purple',
  Analysis:     'badge-purple',
  Synthesis:    'badge-red',
  Evaluation:   'badge-red',
};

export default function AIRecommendationsPage() {
  const router = useRouter();
  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const [strongTopics, setStrongTopics] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [nResults, setNResults] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    query: string;
    total: number;
    questions: RecommendedQuestion[];
  } | null>(null);
  const [recommendationMode, setRecommendationMode] = useState<'backend' | 'fallback' | null>(null);

  const toggleTopic = (topic: string, type: 'weak' | 'strong') => {
    if (type === 'weak') {
      setWeakTopics(prev =>
        prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
      );
    } else {
      setStrongTopics(prev =>
        prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
      );
    }
  };

  const handleGetRecommendations = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const profile: StudentProfile = {
      student_id: 'student_demo',
      weak_topics: weakTopics,
      strong_topics: strongTopics,
      preferred_difficulty: difficulty,
      n_results: nResults,
    };

    try {
      const res = await getRecommendations(profile);
      if (res.status === 'success') {
        setResult({
          query: res.query,
          total: res.total_recommended,
          questions: res.recommended_questions,
        });
        setRecommendationMode(res.source === 'fallback' ? 'fallback' : 'backend');
      } else {
        setError((res as any).message || 'Unknown error from AI service.');
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
        'Could not connect to the AI Recommendation API. Make sure the backend is running on port 8000.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getReasonForQuestion = (question: RecommendedQuestion) => {
    const topicText = `${question.subject} ${question.topic} ${question.subtopic}`.toLowerCase();

    if (weakTopics.some(topic => topicText.includes(topic.toLowerCase()))) {
      return `Strong match for your weak area in ${question.topic}.`;
    }

    if (strongTopics.some(topic => topicText.includes(topic.toLowerCase()))) {
      return `A lighter review item that helps reinforce ${question.topic}.`;
    }

    return `Balanced practice suggestion for ${difficulty.toLowerCase()} level review.`;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Brain className="text-purple-500" size={28} />
            AI Question Recommendations
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            Powered by Sentence Transformers & ChromaDB — trained on Kaggle question bank data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="pulse-dot"></span>
          <span className="text-xs text-[var(--text-tertiary)] font-medium">AI Engine Active</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Config Panel */}
        <div className="col-span-4">
          <div className="card p-5 flex flex-col gap-5">
            <h2 className="font-bold text-base flex items-center gap-2">
              <Target size={16} className="text-[var(--brand-500)]" /> Personalization Settings
            </h2>

            {/* Weak Topics */}
            <div>
              <label className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-2 block">
                My Weak Topics
              </label>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map(topic => (
                  <button
                    key={topic}
                    onClick={() => toggleTopic(topic, 'weak')}
                    className={`badge cursor-pointer transition-all ${
                      weakTopics.includes(topic)
                        ? 'badge-red ring-2 ring-red-500/30'
                        : 'badge-gray'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Strong Topics */}
            <div>
              <label className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-2 block">
                My Strong Topics
              </label>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map(topic => (
                  <button
                    key={topic}
                    onClick={() => toggleTopic(topic, 'strong')}
                    className={`badge cursor-pointer transition-all ${
                      strongTopics.includes(topic)
                        ? 'badge-green ring-2 ring-green-500/30'
                        : 'badge-gray'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-2 block">
                Preferred Difficulty
              </label>
              <div className="flex gap-2">
                {(['EASY', 'MEDIUM', 'HARD'] as const).map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                      difficulty === d
                        ? d === 'EASY' ? 'bg-emerald-500 text-white border-emerald-500'
                          : d === 'MEDIUM' ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-red-500 text-white border-red-500'
                        : 'border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Count */}
            <div>
              <label className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-2 block">
                Number of Recommendations: <span className="text-[var(--brand-500)]">{nResults}</span>
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={nResults}
                onChange={e => setNResults(Number(e.target.value))}
                className="w-full accent-[var(--brand-500)]"
              />
            </div>

            <button
              onClick={handleGetRecommendations}
              disabled={loading}
              className="btn btn-gradient w-full"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Generating AI Recommendations...</>
              ) : (
                <><Sparkles size={16} /> Get AI Recommendations</>
              )}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="col-span-8">
          {error && (
            <div className="card p-5 border-red-500/30 bg-red-500/5 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-bold text-red-500">Connection Error</div>
                <div className="text-sm text-[var(--text-secondary)] mt-1">{error}</div>
                <div className="text-xs text-[var(--text-tertiary)] mt-2">
                  Start the backend: <code className="bg-[var(--bg-subtle)] px-1 rounded">cd backend &amp;&amp; python -m uvicorn main:app --reload</code>
                </div>
              </div>
            </div>
          )}

          {!result && !loading && !error && (
            <div className="card p-10 flex flex-col items-center justify-center gap-4 text-center min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white animate-float">
                <Brain size={32} />
              </div>
              <h3 className="font-bold text-lg">Ready for AI-Powered Recommendations</h3>
              <p className="text-[var(--text-secondary)] text-sm max-w-sm">
                Select your weak topics and difficulty, then click the button to get personalized
                questions powered by semantic search on Kaggle data.
              </p>
            </div>
          )}

          {loading && (
            <div className="card p-10 flex flex-col items-center justify-center gap-4 min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                <Loader2 size={32} className="text-purple-500 animate-spin" />
              </div>
              <p className="font-bold">Querying vector database...</p>
              <p className="text-sm text-[var(--text-secondary)]">
                Semantic search across {25} Kaggle questions using all-MiniLM-L6-v2
              </p>
            </div>
          )}

          {result && (
            <div className="flex flex-col gap-4">
              {/* Summary */}
              <div className="card p-4 flex flex-col gap-3 bg-gradient-to-r from-purple-500/5 to-blue-500/5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-[var(--text-primary)]">
                      {result.total} Questions Found
                    </div>
                    <div className="text-xs text-[var(--text-tertiary)] mt-0.5">
                      Query: &ldquo;{result.query}&rdquo;
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-purple-500" />
                    <span className="text-sm font-medium text-purple-500">Adaptive AI Match</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {weakTopics.length > 0 ? weakTopics.map(topic => (
                    <span key={topic} className="badge badge-red">Focus: {topic}</span>
                  )) : <span className="badge badge-gray">Balanced review mode</span>}
                  {strongTopics.length > 0 && strongTopics.map(topic => (
                    <span key={topic} className="badge badge-green">Reinforce: {topic}</span>
                  ))}
                </div>

                {recommendationMode === 'fallback' && (
                  <div className="text-xs text-amber-600">
                    Using adaptive fallback recommendations because the backend service is currently unavailable.
                  </div>
                )}
              </div>

              {/* Question Cards */}
              {result.questions.map((q, i) => (
                <div
                  key={q.id}
                  className="card p-5 flex flex-col gap-3 hover:border-[var(--border-brand)] transition-all animate-slide-up"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-7 h-7 rounded-lg bg-[var(--brand-500)]/10 flex items-center justify-center text-[var(--brand-500)] font-bold text-xs">
                        {i + 1}
                      </div>
                      <span className="text-xs font-bold text-[var(--text-tertiary)]">{q.id}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      <span className={`badge ${DIFFICULTY_COLORS[q.difficulty] || 'badge-gray'}`}>
                        {q.difficulty}
                      </span>
                      {q.bloom_level && (
                        <span className={`badge ${BLOOM_COLORS[q.bloom_level] || 'badge-gray'}`}>
                          {q.bloom_level}
                        </span>
                      )}
                      <span className="badge badge-purple">
                        <Star size={10} /> {q.similarity}
                      </span>
                    </div>
                  </div>

                  <p className="text-[var(--text-primary)] font-medium leading-relaxed">{q.text}</p>

                  <div className="rounded-xl border border-purple-200 bg-purple-50 px-3 py-2 text-sm text-purple-700">
                    {getReasonForQuestion(q)}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-tertiary)]">
                    <span className="flex items-center gap-1">
                      <BookOpen size={12} /> {q.subject} → {q.topic}
                      {q.subtopic && ` → ${q.subtopic}`}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {q.time_limit}s
                    </span>
                    <span className="flex items-center gap-1">
                      <Award size={12} /> {q.marks} mark{Number(q.marks) !== 1 ? 's' : ''}
                    </span>
                    {q.tags && (
                      <span className="flex items-center gap-1">
                        <Tag size={12} /> {q.tags}
                      </span>
                    )}
                  </div>

                  <button className="btn btn-secondary btn-sm self-start mt-1" onClick={() => router.push('/student/practice')}>
                    Practice This Question <ChevronRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
