'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Trophy, 
  Filter, 
  Search, 
  BookOpen, 
  ShieldAlert, 
  Info,
  CalendarDays,
  FileCheck,
  XCircle
} from 'lucide-react';
import { mockExamSchedule, ScheduledExam } from '@/lib/db-mock';

export default function ExamsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming' | 'completed' | 'missed'>('all');
  const [search, setSearch] = useState('');
  const [selectedExam, setSelectedExam] = useState<ScheduledExam | null>(null);
  const [lockedExamIds, setLockedExamIds] = useState<string[]>([]);

  // Time ticks to update countdowns
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncLockedExams = () => {
      const stored = JSON.parse(localStorage.getItem('completed-exams') || '[]') as string[];
      setLockedExamIds(stored);
    };

    syncLockedExams();
    window.addEventListener('exam-completion-changed', syncLockedExams);
    return () => window.removeEventListener('exam-completion-changed', syncLockedExams);
  }, []);

  const getCountdown = (startTimeStr: string) => {
    const start = new Date(startTimeStr);
    const diffMs = start.getTime() - now.getTime();
    if (diffMs <= 0) return 'Starting now...';
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 24) {
      const days = Math.floor(diffHours / 24);
      return `Starts in ${days} day${days > 1 ? 's' : ''}`;
    }
    return `Starts in ${diffHours}h ${diffMins}m`;
  };

  const filteredExams = mockExamSchedule.filter(exam => {
    const displayStatus = lockedExamIds.includes(exam.id) ? 'completed' : exam.status;
    const matchesFilter = filter === 'all' || displayStatus === filter;
    const matchesSearch = 
      exam.title.toLowerCase().includes(search.toLowerCase()) ||
      exam.subject.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, var(--brand-600), var(--accent-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            My Examinations
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Manage and attempt your scheduled exams and review past performance.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div className="badge badge-blue">
            <Info size={12} /> AI-Proctored Environment
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
          {(['all', 'live', 'upcoming', 'completed', 'missed'] as const).map((tab) => (
            <button
              key={tab}
              className={`btn btn-sm ${filter === tab ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter(tab)}
              style={{ textTransform: 'capitalize' }}
            >
              {tab === 'live' && <span className="pulse-dot" style={{ marginRight: '6px', display: 'inline-block' }} />}
              {tab}
            </button>
          ))}
        </div>
        <div className="input-group" style={{ maxWidth: '320px', width: '100%' }}>
          <Search className="input-icon" size={16} />
          <input
            type="text"
            className="input"
            placeholder="Search by exam name or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Exam Grid */}
      {filteredExams.length === 0 ? (
        <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', borderStyle: 'dashed' }}>
          <BookOpen size={48} style={{ color: 'var(--text-tertiary)', margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No exams found</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
            There are no examinations matching your current filters. Check back later or adjust your filters.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filteredExams.map((exam) => {
            const isLocked = lockedExamIds.includes(exam.id);
            const displayStatus = isLocked ? 'completed' : exam.status;
            const isLive = displayStatus === 'live';
            const isUpcoming = displayStatus === 'upcoming';
            const isCompleted = displayStatus === 'completed';
            const isMissed = displayStatus === 'missed';

            return (
              <div 
                key={exam.id} 
                className="card" 
                style={{ 
                  padding: '1.5rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  borderTop: isLive ? '4px solid var(--accent-emerald)' : isUpcoming ? '4px solid var(--brand-500)' : '1px solid var(--border-default)' 
                }}
              >
                <div>
                  {/* Badge Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span className="badge badge-gray">{exam.subject}</span>
                    <div>
                      {isLive && (
                        <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <span className="pulse-dot" /> LIVE NOW
                        </span>
                      )}
                      {isUpcoming && <span className="badge badge-blue">UPCOMING</span>}
                      {isCompleted && <span className={`badge ${isLocked ? 'badge-gray' : 'badge-gray'}`}>{isLocked ? 'LOCKED' : 'COMPLETED'}</span>}
                      {isMissed && <span className="badge badge-red">MISSED</span>}
                    </div>
                  </div>

                  {/* Title & Stats */}
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.4 }}>
                    {exam.title}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={14} />
                      <span>{exam.duration} Minutes • {exam.totalQuestions} Questions</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={14} />
                      <span>{new Date(exam.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileCheck size={14} />
                      <span>Passing Marks: {exam.passingMarks}/{exam.totalMarks} ({Math.round(exam.passingMarks/exam.totalMarks * 100)}%)</span>
                    </div>
                  </div>
                </div>

                {/* Footer / CTA Area */}
                <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                  {isLive && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{isLocked ? 'Attempt already submitted' : 'Closing soon'}</span>
                      <button className={`btn btn-sm ${isLocked ? 'btn-secondary' : 'btn-primary'}`} onClick={() => {
                        if (isLocked) {
                          setSelectedExam(exam);
                          return;
                        }
                        router.push(`/student/exams/${exam.id}`);
                      }} disabled={isLocked}>
                        {isLocked ? <CheckCircle2 size={12} style={{ marginRight: '4px' }} /> : <Play size={12} fill="white" />}
                        {isLocked ? 'Locked' : 'Start Exam'}
                      </button>
                    </div>
                  )}

                  {isUpcoming && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--brand-600)' }}>
                        {getCountdown(exam.startTime)}
                      </span>
                      <button className="btn btn-secondary btn-sm" onClick={() => setSelectedExam(exam)}>
                        Details
                      </button>
                    </div>
                  )}

                  {isCompleted && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{isLocked ? 'Submission Locked' : 'Your Score'}</div>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: (exam.score || 0) >= exam.passingMarks ? 'var(--accent-emerald)' : 'var(--error)' }}>
                          {isLocked ? 'Completed & Locked' : `${exam.score}/${exam.totalMarks} (${exam.percentage}%)`}
                        </div>
                      </div>
                      <button className="btn btn-secondary btn-sm" onClick={() => setSelectedExam(exam)}>
                        <Trophy size={12} style={{ marginRight: '4px' }} /> {isLocked ? 'Details' : 'Review'}
                      </button>
                    </div>
                  )}

                  {isMissed && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--error)', fontWeight: 500 }}>Absence Registered</span>
                      <button className="btn btn-ghost btn-sm" onClick={() => setSelectedExam(exam)} style={{ color: 'var(--text-tertiary)' }}>
                        Details
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {selectedExam && (
        <div className="modal-backdrop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setSelectedExam(null)}>
          <div className="modal-content" style={{ width: '100%', maxWidth: '520px', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <span className="badge badge-blue" style={{ marginBottom: '0.5rem' }}>{selectedExam.subject}</span>
                <h2 style={{ fontSize: '1.375rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{selectedExam.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedExam(null)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', padding: '0.25rem', cursor: 'pointer' }}
              >
                <XCircle size={20} />
              </button>
            </div>

            <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Exam Guidelines:</h4>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <li>This is an AI-proctored examination requiring camera and audio access.</li>
                <li>Tab switching, window resizing, or leaving the screen will record a violation flag.</li>
                <li>Ensure you have a stable internet connection. In case of disruption, log back in immediately.</li>
                <li>Each question may have individual time limits if configured.</li>
              </ul>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              <div>
                <span style={{ color: 'var(--text-tertiary)' }}>Total Duration</span>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '0.125rem' }}>{selectedExam.duration} Minutes</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)' }}>Questions</span>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '0.125rem' }}>{selectedExam.totalQuestions} Questions</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)' }}>Maximum Marks</span>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '0.125rem' }}>{selectedExam.totalMarks} Marks</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)' }}>Security Protocol</span>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '0.125rem', color: selectedExam.proctoringLevel === 'STRICT' ? 'var(--error)' : 'inherit' }}>
                  {selectedExam.proctoringLevel} PROCTORING
                </div>
              </div>
            </div>

            {selectedExam.status === 'completed' && (
              <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Your Results:</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg-base)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Marks Obtained</span>
                    <div style={{ fontSize: '1.125rem', fontWeight: 800 }}>{selectedExam.score} / {selectedExam.totalMarks}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Percentage</span>
                    <div style={{ fontSize: '1.125rem', fontWeight: 800 }}>{selectedExam.percentage}%</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Class Rank</span>
                    <div style={{ fontSize: '1.125rem', fontWeight: 800 }}>#{selectedExam.rank}</div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedExam(null)}>Close</button>
              {selectedExam.status === 'live' && !lockedExamIds.includes(selectedExam.id) && (
                <button className="btn btn-primary" onClick={() => router.push(`/student/exams/${selectedExam.id}`)}>
                  <Play size={12} fill="white" /> Acknowledge & Start
                </button>
              )}
              {lockedExamIds.includes(selectedExam.id) && (
                <button className="btn btn-secondary" disabled>
                  <CheckCircle2 size={12} style={{ marginRight: '4px' }} /> Already Submitted
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
