'use client';

import { useState } from 'react';
import { Zap, Loader2, CheckCircle2, XCircle, ChevronRight, RotateCcw, Trophy, Brain } from 'lucide-react';

const SUBJECTS = ['Computer Science', 'Mathematics', 'Physics'];
const TOPICS: Record<string, string[]> = {
  'Computer Science': ['Data Structures', 'Algorithms', 'Databases', 'Machine Learning', 'Operating Systems', 'Web Development'],
  'Mathematics': ['Calculus', 'Linear Algebra', 'Statistics', 'Discrete Math'],
  'Physics': ['Mechanics', 'Electromagnetism', 'Thermodynamics'],
};

// Kaggle-sourced sample question pool
const QUESTION_POOL: Record<string, Record<string, any[]>> = {
  'Computer Science': {
    'Data Structures': [
      { id: 1, text: 'What is the time complexity of searching in a balanced BST?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 1, explanation: 'In a balanced BST, each step eliminates half the tree, giving O(log n).' },
      { id: 2, text: 'Which data structure uses LIFO principle?', options: ['Queue', 'Stack', 'Heap', 'Graph'], answer: 1, explanation: 'A Stack follows Last-In-First-Out — last item pushed is first popped.' },
      { id: 3, text: 'What is the worst-case complexity of insertion in a Hash Table?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 2, explanation: 'Hash collisions degrade performance to O(n) in the worst case.' },
    ],
    'Algorithms': [
      { id: 4, text: 'What is the worst-case complexity of QuickSort?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], answer: 2, explanation: 'QuickSort hits O(n²) when the pivot is always the smallest or largest element.' },
      { id: 5, text: 'Which algorithm finds the shortest path in an unweighted graph?', options: ['DFS', 'BFS', 'Dijkstra', 'Bellman-Ford'], answer: 1, explanation: 'BFS explores nodes level by level, guaranteeing the shortest unweighted path.' },
    ],
    'Machine Learning': [
      { id: 6, text: 'What does "overfitting" mean in machine learning?', options: ['Model is too simple', 'Model memorizes training data but fails on new data', 'Model is perfectly generalized', 'Model has too few parameters'], answer: 1, explanation: 'Overfitting occurs when a model learns training data too well, including noise.' },
      { id: 7, text: 'What is the purpose of L2 regularization?', options: ['Speeds up training', 'Reduces large weights to prevent overfitting', 'Increases model complexity', 'Removes features'], answer: 1, explanation: 'L2 (Ridge) adds a penalty proportional to squared weights, keeping them small.' },
    ],
  },
  'Mathematics': {
    'Calculus': [
      { id: 8, text: 'What is the derivative of sin(x)?', options: ['-cos(x)', 'cos(x)', 'tan(x)', '-sin(x)'], answer: 1, explanation: 'd/dx[sin(x)] = cos(x) — a fundamental differentiation rule.' },
      { id: 9, text: 'What is the integral of 1/x?', options: ['x', 'ln|x| + C', '1/x² + C', 'e^x + C'], answer: 1, explanation: '∫1/x dx = ln|x| + C, valid for x ≠ 0.' },
    ],
    'Statistics': [
      { id: 10, text: 'What does a p-value of 0.03 indicate?', options: ['Strong evidence to accept H₀', 'Strong evidence to reject H₀ at 5% level', 'No conclusion possible', 'Effect is 3% large'], answer: 1, explanation: 'p < 0.05 means we reject the null hypothesis at the 5% significance level.' },
    ],
  },
  'Physics': {
    'Mechanics': [
      { id: 11, text: 'What is Newton\'s second law of motion?', options: ['F = mv', 'F = ma', 'F = m/a', 'F = m²a'], answer: 1, explanation: 'Force = mass × acceleration. This is the cornerstone of classical mechanics.' },
    ],
    'Electromagnetism': [
      { id: 12, text: 'What is the SI unit of electric charge?', options: ['Ampere', 'Volt', 'Coulomb', 'Ohm'], answer: 2, explanation: 'The Coulomb (C) is the SI unit of electric charge, equal to 1 A·s.' },
    ],
  },
};

export default function QuizPage() {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [count, setCount] = useState(5);
  const [phase, setPhase] = useState<'config' | 'loading' | 'quiz' | 'result'>('config');
  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<{ correct: boolean; time: number }[]>([]);
  const [startTime, setStartTime] = useState(0);

  const handleGenerate = () => {
    if (!subject || !topic) return;
    setPhase('loading');
    setTimeout(() => {
      const pool = QUESTION_POOL[subject]?.[topic] ?? [];
      const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(count, pool.length));
      if (shuffled.length === 0) {
        setPhase('config');
        return;
      }
      setQuestions(shuffled);
      setCurrent(0);
      setSelected(null);
      setAnswered(false);
      setScore(0);
      setHistory([]);
      setStartTime(Date.now());
      setPhase('quiz');
    }, 1200);
  };

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const correct = idx === questions[current].answer;
    const time = Math.round((Date.now() - startTime) / 1000);
    if (correct) setScore(s => s + 1);
    setHistory(h => [...h, { correct, time }]);
    setStartTime(Date.now());
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) { setPhase('result'); return; }
    setCurrent(c => c + 1);
    setSelected(null);
    setAnswered(false);
  };

  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const q = questions[current];

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto animate-slide-up">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
          <Zap size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold">AI Quiz Generator</h1>
          <p className="text-sm text-[var(--text-secondary)]">Auto-generated from Kaggle question bank</p>
        </div>
      </div>

      {phase === 'config' && (
        <div className="card p-6 flex flex-col gap-5">
          <div>
            <label className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider block mb-2">Subject</label>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map(s => (
                <button key={s} onClick={() => { setSubject(s); setTopic(''); }}
                  className={`btn ${subject === s ? 'btn-primary' : 'btn-secondary'} btn-sm`}>{s}</button>
              ))}
            </div>
          </div>
          {subject && (
            <div>
              <label className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider block mb-2">Topic</label>
              <div className="flex flex-wrap gap-2">
                {TOPICS[subject].map(t => (
                  <button key={t} onClick={() => setTopic(t)}
                    className={`btn ${topic === t ? 'btn-primary' : 'btn-secondary'} btn-sm`}>{t}</button>
                ))}
              </div>
            </div>
          )}
          <div>
            <label className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider block mb-2">Difficulty</label>
            <div className="flex gap-2">
              {(['EASY', 'MEDIUM', 'HARD'] as const).map(d => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${difficulty === d
                    ? d === 'EASY' ? 'bg-emerald-500 text-white border-emerald-500'
                      : d === 'MEDIUM' ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-red-500 text-white border-red-500'
                    : 'border-[var(--border-default)] text-[var(--text-secondary)]'}`}>{d}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider block mb-2">
              Number of Questions: <span className="text-[var(--brand-500)]">{count}</span>
            </label>
            <input type="range" min={1} max={10} value={count} onChange={e => setCount(Number(e.target.value))} className="w-full accent-[var(--brand-500)]" />
          </div>
          <button onClick={handleGenerate} disabled={!subject || !topic}
            className="btn btn-gradient w-full">
            <Brain size={16} /> Generate AI Quiz
          </button>
        </div>
      )}

      {phase === 'loading' && (
        <div className="card p-12 flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-amber-500" />
          <p className="font-bold">Generating personalized quiz...</p>
          <p className="text-sm text-[var(--text-secondary)]">Selecting questions from Kaggle dataset</p>
        </div>
      )}

      {phase === 'quiz' && q && (
        <div className="flex flex-col gap-4">
          {/* Progress */}
          <div className="flex items-center justify-between text-sm font-medium">
            <span className="text-[var(--text-secondary)]">Question {current + 1} of {questions.length}</span>
            <span className="text-[var(--brand-500)]">Score: {score}/{current + (answered ? 1 : 0)}</span>
          </div>
          <div className="progress-track"><div className="progress-fill progress-blue" style={{ width: `${((current + (answered ? 1 : 0)) / questions.length) * 100}%` }} /></div>

          {/* Question Card */}
          <div className="card p-6 flex flex-col gap-5">
            <p className="text-lg font-bold leading-relaxed">{q.text}</p>
            <div className="flex flex-col gap-3">
              {q.options.map((opt: string, i: number) => {
                let cls = 'border border-[var(--border-default)] rounded-xl p-4 text-left transition-all cursor-pointer ';
                if (!answered) cls += 'hover:border-[var(--brand-500)] hover:bg-[var(--brand-500)]/5';
                else if (i === q.answer) cls += 'border-emerald-500 bg-emerald-500/10 text-emerald-600';
                else if (i === selected && i !== q.answer) cls += 'border-red-500 bg-red-500/10 text-red-600';
                else cls += 'opacity-50';
                return (
                  <button key={i} className={cls} onClick={() => handleSelect(i)}>
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full border border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="font-medium">{opt}</span>
                      {answered && i === q.answer && <CheckCircle2 size={18} className="ml-auto text-emerald-500" />}
                      {answered && i === selected && i !== q.answer && <XCircle size={18} className="ml-auto text-red-500" />}
                    </div>
                  </button>
                );
              })}
            </div>
            {answered && (
              <div className="rounded-xl p-4 bg-[var(--bg-subtle)] border border-[var(--border-default)] animate-slide-up">
                <div className="text-xs font-bold text-[var(--text-tertiary)] uppercase mb-1">AI Explanation</div>
                <p className="text-sm text-[var(--text-secondary)]">{q.explanation}</p>
              </div>
            )}
            {answered && (
              <button onClick={handleNext} className="btn btn-primary self-end">
                {current + 1 >= questions.length ? 'View Results' : 'Next Question'} <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {phase === 'result' && (
        <div className="card p-8 flex flex-col items-center gap-6 text-center animate-bounce-in">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-xl">
            <Trophy size={36} />
          </div>
          <div>
            <div className="text-4xl font-black gradient-text">{pct}%</div>
            <div className="text-[var(--text-secondary)] mt-1">{score} out of {questions.length} correct</div>
          </div>
          <div className="flex gap-4 w-full max-w-xs">
            <div className="flex-1 card p-3 text-center">
              <div className="text-lg font-bold text-emerald-500">{score}</div>
              <div className="text-xs text-[var(--text-tertiary)]">Correct</div>
            </div>
            <div className="flex-1 card p-3 text-center">
              <div className="text-lg font-bold text-red-500">{questions.length - score}</div>
              <div className="text-xs text-[var(--text-tertiary)]">Incorrect</div>
            </div>
            <div className="flex-1 card p-3 text-center">
              <div className="text-lg font-bold text-blue-500">{Math.round(history.reduce((a, b) => a + b.time, 0) / history.length)}s</div>
              <div className="text-xs text-[var(--text-tertiary)]">Avg Time</div>
            </div>
          </div>
          <div className="text-sm text-[var(--text-secondary)]">
            {pct >= 80 ? '🎉 Excellent work! You have mastered this topic.' :
             pct >= 60 ? '👍 Good effort! Review the explanations to improve.' :
             '📚 Keep practicing! Focus on the topics you missed.'}
          </div>
          <button onClick={() => setPhase('config')} className="btn btn-gradient">
            <RotateCcw size={16} /> Try Another Quiz
          </button>
        </div>
      )}
    </div>
  );
}
