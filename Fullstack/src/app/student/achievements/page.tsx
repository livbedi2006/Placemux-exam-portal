'use client';
import { 
  Trophy, 
  Star, 
  Flame, 
  Medal, 
  Award, 
  Target, 
  Zap, 
  Crown, 
  Lock, 
  ShieldAlert, 
  BookOpen, 
  Clock, 
  CheckCircle2,
  Calendar,
  Sparkles,
  Download
} from 'lucide-react';
import { mockAchievements } from '@/lib/db-mock';

export default function AchievementsPage() {
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return Zap;
      case 'Flame': return Flame;
      case 'Award': return Award;
      case 'TrendingUp': return Target;
      case 'Clock': return Clock;
      case 'CheckCircle': return CheckCircle2;
      case 'Trophy': return Trophy;
      case 'BookOpen': return BookOpen;
      case 'Sparkles': return Sparkles;
      default: return Medal;
    }
  };

  const milestones = [
    { title: 'Level 12 Reached', date: 'Jul 04, 2026', xp: '+500 XP', icon: Crown },
    { title: 'Locked Speed Demon Badge', date: 'Jul 02, 2026', xp: '+250 XP', icon: Flame },
    { title: 'Database Certification Exam Passed', date: 'Jul 01, 2026', xp: '+1000 XP', icon: Award },
    { title: '7-Day Practice Streak Completed', date: 'Jun 25, 2026', xp: '+300 XP', icon: Target },
    { title: 'First 100% Score on AVL Quiz', date: 'Jun 15, 2026', xp: '+400 XP', icon: Star }
  ];

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '3rem' }}>
      {/* Hero Level Banner */}
      <div className="bg-gradient-brand card" style={{ padding: '2rem', color: 'white', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Crown size={28} style={{ color: '#fcd34d' }} />
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)', margin: 0, color: 'white' }}>
              Level {mockAchievements.level} • Knowledge Seeker
            </h1>
          </div>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9375rem', marginBottom: '1.25rem' }}>
            Earn Experience Points (XP) by completing exams and mock quizzes to climb up grades.
          </p>
          <div style={{ marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
              <span>Level Progress</span>
              <span style={{ fontWeight: 600 }}>{mockAchievements.xp} / {mockAchievements.xpToNext} XP</span>
            </div>
            <div className="progress-track" style={{ background: 'rgba(255, 255, 255, 0.2)', height: '8px' }}>
              <div className="progress-fill" style={{ width: `${(mockAchievements.xp / mockAchievements.xpToNext) * 100}%`, background: 'white' }} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', background: 'rgba(255, 255, 255, 0.1)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-xl)', backdropFilter: 'blur(10px)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24', justifyContent: 'center' }}>
              <Flame size={20} fill="#fbbf24" />
              <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{mockAchievements.streak}</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)' }}>Active Streak</span>
          </div>
          <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.2)' }} />
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#60a5fa', display: 'block' }}>12,450</span>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)' }}>Total XP</span>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '1.25rem' }}>Badges & Milestones</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {mockAchievements.badges.map((badge) => {
          const BadgeIcon = getBadgeIcon(badge.icon);
          return (
            <div 
              key={badge.id} 
              className="card" 
              style={{ 
                padding: '1.25rem', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                textAlign: 'center',
                opacity: badge.earned ? 1 : 0.6,
                background: badge.earned ? 'var(--bg-surface)' : 'rgba(0, 0, 0, 0.02)',
                position: 'relative'
              }}
            >
              {!badge.earned && (
                <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', color: 'var(--text-tertiary)' }}>
                  <Lock size={14} />
                </div>
              )}
              
              <div style={{ 
                width: '3.25rem', 
                height: '3.25rem', 
                borderRadius: '50%', 
                background: badge.earned ? 'linear-gradient(135deg, var(--brand-100), var(--brand-50))' : 'var(--bg-muted)', 
                color: badge.earned ? 'var(--brand-600)' : 'var(--text-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                boxShadow: badge.earned ? 'var(--shadow-glow)' : 'none'
              }}>
                <BadgeIcon size={22} />
              </div>

              <h4 style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.25rem' }}>{badge.name}</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', lineHeight: 1.3 }}>{badge.description}</p>
              
              {badge.earned ? (
                <span className="badge badge-green" style={{ fontSize: '0.6875rem' }}>Earned {badge.earnedDate}</span>
              ) : (
                <span className="badge badge-gray" style={{ fontSize: '0.6875rem' }}>Locked</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid">
        {/* Certificates */}
        <div className="col-span-7 card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>Verified Certificates</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mockAchievements.certificates.map((cert) => (
              <div 
                key={cert.id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '1.25rem', 
                  background: 'var(--bg-base)', 
                  border: '1px solid var(--border-default)', 
                  borderRadius: 'var(--radius-lg)' 
                }}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ color: 'var(--accent-purple)' }}><Award size={32} /></div>
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{cert.title}</h4>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
                      Subject: {cert.subject} • Issued on {cert.issueDate}
                    </div>
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => alert(`Downloading certificate PDF for ${cert.title}...`)}>
                  <Download size={12} style={{ marginRight: '4px' }} /> PDF
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone Timeline */}
        <div className="col-span-5 card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>History Timeline</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', paddingLeft: '1.25rem' }}>
            {/* Timeline line */}
            <div style={{ position: 'absolute', left: '4px', top: '8px', bottom: '8px', width: '2px', background: 'var(--border-default)' }} />
            
            {milestones.map((m, idx) => {
              const MilestoneIcon = m.icon;
              return (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                  {/* Point */}
                  <div style={{ 
                    position: 'absolute', 
                    left: '-23px', 
                    top: '3px', 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    background: 'var(--brand-500)', 
                    border: '3px solid var(--bg-surface)' 
                  }} />
                  
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>{m.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{m.date}</div>
                  </div>
                  <span className="badge badge-blue" style={{ fontSize: '0.6875rem' }}>{m.xp}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
