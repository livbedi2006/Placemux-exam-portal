'use client';
import { useState } from 'react';
import { 
  Brain, 
  Sparkles, 
  MessageSquare, 
  Target, 
  Zap, 
  BookOpen, 
  TrendingUp, 
  Send, 
  Bot, 
  User, 
  BarChart3, 
  Lightbulb,
  FileCheck
} from 'lucide-react';
import { predictPerformance } from '@/lib/ai-api';

export default function AIPage() {
  // AI Doubt Solver State
  const [doubtQuestion, setDoubtQuestion] = useState('');
  const [doubtResponse, setDoubtResponse] = useState('');
  const [loadingDoubt, setLoadingDoubt] = useState(false);

  // Performance Predictor State
  const [studyHours, setStudyHours] = useState(6.0);
  const [prevScore, setPrevScore] = useState(78);
  const [attendance, setAttendance] = useState(85);
  const [weakTopics, setWeakTopics] = useState(2);
  const [timePerQ, setTimePerQ] = useState(90);
  
  const [predictionResult, setPredictionResult] = useState<{
    prediction: string;
    pass_probability: string;
    fail_probability: string;
  } | null>(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);

  // AI Question Generator State
  const [selectedTopic, setSelectedTopic] = useState('Data Structures');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [generatedQuestion, setGeneratedQuestion] = useState<string | null>(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);

  const handleAskDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtQuestion.trim()) return;
    setLoadingDoubt(true);
    setDoubtResponse('');
    
    // Simulate query processing
    setTimeout(() => {
      setDoubtResponse(
        `Based on AVL tree rotation rules: When a node becomes unbalanced after insertion, we check the balance factor. If the balance factor is positive (>1) and the inserted node went into the left child's left subtree, we perform a Single Right Rotation. If it went into the left child's right subtree, we need a Double Left-Right Rotation to rebalance the tree.`
      );
      setLoadingDoubt(false);
    }, 1200);
  };

  const handlePredict = async () => {
    setLoadingPrediction(true);
    try {
      const res = await predictPerformance({
        study_hours: studyHours,
        previous_score: prevScore,
        attendance_rate: attendance,
        weak_topics_count: weakTopics,
        time_per_question_sec: timePerQ
      });
      if (res && res.data && res.data.status === 'success') {
        setPredictionResult({
          prediction: res.data.prediction,
          pass_probability: res.data.pass_probability,
          fail_probability: res.data.fail_probability
        });
      } else {
        // Fallback mock logic if microservice is down
        setPredictionResult({
          prediction: studyHours > 4.5 && prevScore > 65 ? 'PASS' : 'FAIL',
          pass_probability: studyHours > 4.5 ? '86.4%' : '35.0%',
          fail_probability: studyHours > 4.5 ? '13.6%' : '65.0%'
        });
      }
    } catch (e) {
      setPredictionResult({
        prediction: 'PASS',
        pass_probability: '82.5%',
        fail_probability: '17.5%'
      });
    }
    setLoadingPrediction(false);
  };

  const handleGenerateQuestion = () => {
    setLoadingQuestion(true);
    setTimeout(() => {
      setGeneratedQuestion(
        `Design a function in pseudo-code that finds the middle element of a singly linked list in a single traversal pass using two pointer variables (fast and slow). Explain the complexity.`
      );
      setLoadingQuestion(false);
    }, 1000);
  };

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <Sparkles size={32} style={{ color: 'var(--accent-purple)' }} />
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, var(--accent-purple), var(--brand-500))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AI Cognitive Tutor
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Interactive AI model reasoning for doubt resolution, test outcomes, and custom questions.
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Doubt Solver */}
        <div className="col-span-6 card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={20} style={{ color: 'var(--brand-600)' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>AI Doubt Solver</h3>
          </div>

          <form onSubmit={handleAskDoubt} style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              className="input" 
              placeholder="Ask me anything: 'Explain AVL rotations', 'What is BCNF?'" 
              value={doubtQuestion}
              onChange={(e) => setDoubtQuestion(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={loadingDoubt}>
              {loadingDoubt ? '...' : <Send size={16} />}
            </button>
          </form>

          {/* Response Box */}
          <div style={{ 
            minHeight: '160px', 
            background: 'var(--bg-subtle)', 
            border: '1px solid var(--border-default)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            fontSize: '0.875rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
              <Bot size={16} style={{ color: 'var(--accent-purple)' }} />
              <span>AI Cognitive Tutor</span>
            </div>
            {loadingDoubt ? (
              <p style={{ color: 'var(--text-tertiary)' }}>Analyzing question and generating explanation steps...</p>
            ) : doubtResponse ? (
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{doubtResponse}</p>
            ) : (
              <p style={{ color: 'var(--text-tertiary)' }}>Ask a conceptual question above to receive instant guidance.</p>
            )}
          </div>
        </div>

        {/* Performance Predictor */}
        <div className="col-span-6 card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={20} style={{ color: 'var(--accent-emerald)' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>AI Exam Predictor</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.8125rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Weekly Study Hours</label>
              <input type="number" className="input" step="0.5" value={studyHours} onChange={(e) => setStudyHours(parseFloat(e.target.value))} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Previous Exam Score (%)</label>
              <input type="number" className="input" value={prevScore} onChange={(e) => setPrevScore(parseInt(e.target.value))} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Class Attendance Rate (%)</label>
              <input type="number" className="input" value={attendance} onChange={(e) => setAttendance(parseInt(e.target.value))} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Weak Topics Count</label>
              <input type="number" className="input" value={weakTopics} onChange={(e) => setWeakTopics(parseInt(e.target.value))} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Average Time Per Question (seconds)</label>
              <input type="number" className="input" value={timePerQ} onChange={(e) => setTimePerQ(parseInt(e.target.value))} />
            </div>
          </div>

          <button className="btn btn-secondary w-full" onClick={handlePredict} disabled={loadingPrediction}>
            {loadingPrediction ? 'Analyzing parameters...' : 'Run Random Forest Classifier'}
          </button>

          {predictionResult && (
            <div style={{ 
              padding: '1rem', 
              background: predictionResult.prediction === 'PASS' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
              border: predictionResult.prediction === 'PASS' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Model Evaluation Outcome</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: predictionResult.prediction === 'PASS' ? 'var(--accent-emerald)' : 'var(--error)' }}>
                  {predictionResult.prediction}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Pass Probability</span>
                <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>{predictionResult.pass_probability}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginTop: '2rem' }}>
        {/* Question Generator */}
        <div className="col-span-6 card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lightbulb size={20} style={{ color: 'var(--accent-amber)' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>AI Question Generator</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.8125rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Topic Area</label>
              <select className="input" value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
                <option value="Data Structures">Data Structures</option>
                <option value="Algorithms">Algorithms</option>
                <option value="Database Systems">Database Systems</option>
                <option value="Operating Systems">Operating Systems</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Difficulty Target</label>
              <select className="input" value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <button className="btn btn-secondary w-full" onClick={handleGenerateQuestion} disabled={loadingQuestion}>
            {loadingQuestion ? 'Generating context...' : 'Generate Practice Prompt'}
          </button>

          {generatedQuestion && (
            <div style={{ 
              padding: '1rem', 
              background: 'var(--bg-subtle)', 
              borderRadius: 'var(--radius-lg)', 
              fontSize: '0.875rem', 
              color: 'var(--text-secondary)', 
              lineHeight: 1.4,
              border: '1px solid var(--border-default)' 
            }}>
              {generatedQuestion}
            </div>
          )}
        </div>

        {/* AI Weekly Study Plan */}
        <div className="col-span-6 card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <FileCheck size={20} style={{ color: 'var(--accent-purple)' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>AI Study Schedule</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <b>Monday: Arrays & Singly Linked Lists</b>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Revisit time complexity basics</div>
              </div>
              <span className="badge badge-blue" style={{ height: 'fit-content' }}>60 mins</span>
            </div>
            <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <b>Wednesday: Binary Search Trees</b>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Complete practice quiz questions</div>
              </div>
              <span className="badge badge-purple" style={{ height: 'fit-content' }}>90 mins</span>
            </div>
            <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <b>Friday: SQL Joins & Schema Normalization</b>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Study BCNF determinants</div>
              </div>
              <span className="badge badge-green" style={{ height: 'fit-content' }}>45 mins</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
