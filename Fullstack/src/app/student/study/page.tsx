'use client';
import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  FileText, 
  Layers, 
  Bookmark, 
  Clock, 
  Brain, 
  ChevronRight, 
  Plus, 
  Timer, 
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  BookMarked
} from 'lucide-react';

export default function StudyPage() {
  // Pomodoro states
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(1);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (seconds === 0) {
          if (minutes === 0) {
            // Timer finished
            setIsActive(false);
            alert('Session complete! Time for a short break.');
            setMinutes(25);
            setSeconds(0);
            setSessionCount(prev => prev + 1);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
  };

  const subjects = [
    { name: 'Data Structures', progress: 78, topics: 14, icon: BookOpen, color: 'var(--brand-500)' },
    { name: 'Algorithms & Complexity', progress: 65, topics: 12, icon: Brain, color: 'var(--accent-purple)' },
    { name: 'Database Systems', progress: 82, topics: 8, icon: BookMarked, color: 'var(--accent-emerald)' },
    { name: 'Operating Systems', progress: 54, topics: 16, icon: Clock, color: 'var(--accent-amber)' },
    { name: 'Computer Networks', progress: 71, topics: 10, icon: FileText, color: 'var(--accent-cyan)' },
    { name: 'AI & Machine Learning', progress: 43, topics: 20, icon: Sparkles, color: 'var(--accent-pink)' }
  ];

  const tools = [
    { name: 'Study Notes', desc: 'Create & review class highlights', count: '24 files', icon: FileText, action: 'View Notes' },
    { name: 'Active Flashcards', desc: 'LIFO & FIFO active recall decks', count: '156 cards', icon: Layers, action: 'Quiz Me' },
    { name: 'Bookmarks', desc: 'Tricky questions saved for review', count: '18 saved', icon: Bookmark, action: 'Practice' },
    { name: 'AI Syllabus Planner', desc: 'Auto-schedule curriculum chapters', count: 'Dynamic', icon: Sparkles, action: 'Configure' }
  ];

  const recentSessions = [
    { subject: 'Data Structures', duration: '45 mins', date: 'Today, 10:30 AM', topic: 'AVL Tree Balancing' },
    { subject: 'Database Systems', duration: '30 mins', date: 'Yesterday, 04:15 PM', topic: 'BCNF Decomposition' },
    { subject: 'Algorithms', duration: '60 mins', date: '04 Jul, 02:00 PM', topic: 'Quick Sort Dividers' },
    { subject: 'Operating Systems', duration: '25 mins', date: '02 Jul, 11:00 AM', topic: 'Thread Semaphores' },
    { subject: 'AI & Machine Learning', duration: '50 mins', date: '30 Jun, 09:45 AM', topic: 'Random Forest Features' }
  ];

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, var(--brand-600), var(--accent-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Study Center & Materials
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Access class notes, interact with flashcards, and use focused study tools.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsActive(true)}>
          <Plus size={16} /> Start Study Session
        </button>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        {/* Subjects list */}
        <div className="col-span-8 card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem' }}>My Subjects Courseware</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {subjects.map((sub, idx) => {
              const Icon = sub.icon;
              return (
                <div key={idx} style={{ 
                  background: 'var(--bg-base)', 
                  border: '1px solid var(--border-default)', 
                  borderRadius: 'var(--radius-lg)', 
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: 'var(--radius-md)', background: `rgba(59, 130, 246, 0.08)`, display: 'flex', alignItems: 'center', color: sub.color, justifyContent: 'center' }}>
                        <Icon size={18} />
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>{sub.topics} Topics</span>
                    </div>

                    <h4 style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.75rem' }}>{sub.name}</h4>

                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                        <span>Progress</span>
                        <span style={{ fontWeight: 600 }}>{sub.progress}%</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill progress-blue" style={{ width: `${sub.progress}%` }} />
                      </div>
                    </div>
                  </div>

                  <button className="btn btn-secondary btn-sm w-full" style={{ justifyContent: 'space-between' }} onClick={() => alert(`Opening resources for ${sub.name}...`)}>
                    <span>Continue Studies</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pomodoro Focus Timer */}
        <div className="col-span-4 card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Timer size={18} style={{ color: 'var(--accent-purple)' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Focused Pomodoro</h3>
          </div>

          <div style={{ 
            width: '160px', 
            height: '160px', 
            borderRadius: '50%', 
            border: '8px solid var(--bg-muted)', 
            borderTopColor: isActive ? 'var(--accent-purple)' : 'var(--border-default)', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '1.5rem',
            animation: isActive ? 'spin 12s linear infinite' : 'none',
            transform: 'none'
          }}>
            <div style={{ 
              animation: isActive ? 'spin 12s linear infinite reverse' : 'none', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Session #{sessionCount}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <button className={`btn btn-sm ${isActive ? 'btn-secondary' : 'btn-primary'}`} onClick={toggleTimer} style={{ minWidth: '80px' }}>
              {isActive ? <Pause size={14} /> : <Play size={14} />}
              <span>{isActive ? 'Pause' : 'Start'}</span>
            </button>
            <button className="btn btn-secondary btn-sm btn-icon" onClick={resetTimer}>
              <RotateCcw size={14} />
            </button>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Recommended: 25m Focus, 5m Break</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Dynamic Study Tools */}
        <div className="col-span-6 card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>Core Revision Resources</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {tools.map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <div key={idx} className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', minHeight: '130px', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ color: 'var(--brand-600)' }}><Icon size={20} /></div>
                    <span className="badge badge-gray">{tool.count}</span>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.125rem' }}>{tool.name}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{tool.desc}</p>
                  </div>
                  <button className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', marginTop: '0.5rem' }} onClick={() => alert(`Starting ${tool.name}...`)}>
                    {tool.action}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Study History */}
        <div className="col-span-6 card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>Recent Study Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentSessions.map((session, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)' }}>
                <div>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>{session.subject}</span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.125rem' }}>Focus: {session.topic}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-blue">{session.duration}</span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.125rem' }}>{session.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
