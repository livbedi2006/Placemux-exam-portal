'use client';
import { useState } from 'react';
import { 
  Trophy, 
  Medal, 
  Crown, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Users, 
  Star, 
  Filter,
  Search,
  BookOpen
} from 'lucide-react';
import { mockLeaderboard, LeaderboardUser } from '@/lib/db-mock';

export default function LeaderboardPage() {
  const [tab, setTab] = useState<'weekly' | 'monthly' | 'all'>('weekly');
  const [subject, setSubject] = useState('all');

  // Podium top 3
  const top1 = mockLeaderboard.find(u => u.rank === 1);
  const top2 = mockLeaderboard.find(u => u.rank === 2);
  const top3 = mockLeaderboard.find(u => u.rank === 3);

  // Rows 4-15
  const tableRows = mockLeaderboard.filter(u => u.rank > 3);

  // Render trend icon
  const renderTrend = (trend: 'up' | 'down' | 'same') => {
    switch (trend) {
      case 'up': return <TrendingUp size={14} style={{ color: 'var(--accent-emerald)' }} />;
      case 'down': return <TrendingDown size={14} style={{ color: 'var(--error)' }} />;
      default: return <Minus size={14} style={{ color: 'var(--text-tertiary)' }} />;
    }
  };

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, var(--brand-600), var(--accent-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            System Leaderboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Compete with students across all engineering branches. Climb ranks using XP earned.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-surface)', padding: '0.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)' }}>
          {(['weekly', 'monthly', 'all'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`btn btn-sm ${tab === t ? 'btn-secondary' : 'btn-ghost'}`}
              style={{ textTransform: 'capitalize', fontSize: '0.8125rem' }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Podium Visualization */}
      <div className="card" style={{ padding: '2rem 1.5rem', marginBottom: '2.5rem', background: 'radial-gradient(circle at top, rgba(99, 102, 241, 0.05) 0%, transparent 70%), var(--bg-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '1.5rem', margin: '0 auto', maxWidth: '640px', minHeight: '260px', flexWrap: 'wrap' }}>
          
          {/* Rank 2 Podium */}
          {top2 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '120px' }}>
              <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800, border: '2px solid #94a3b8' }}>
                  {top2.avatar}
                </div>
                <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: '#94a3b8', color: 'white', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 800 }}>
                  2
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>{top2.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>{top2.xp} XP</div>
              {/* Podium Column */}
              <div style={{ 
                width: '100px', 
                height: '110px', 
                background: 'linear-gradient(180deg, rgba(148, 163, 184, 0.15), rgba(148, 163, 184, 0.05))', 
                borderTop: '3px solid #94a3b8', 
                borderRadius: '8px 8px 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Medal size={28} style={{ color: '#94a3b8' }} />
              </div>
            </div>
          )}

          {/* Rank 1 Podium (Center, Tallest) */}
          {top1 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '140px', transform: 'translateY(-10px)' }}>
              <Crown size={28} style={{ color: '#fbbf24', marginBottom: '0.25rem', animation: 'float 4s ease-in-out infinite' }} />
              <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                <div style={{ width: '5rem', height: '5rem', borderRadius: '50%', background: 'linear-gradient(135deg, var(--brand-600), var(--brand-400))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, border: '3px solid #fbbf24', boxShadow: 'var(--shadow-glow)' }}>
                  {top1.avatar}
                </div>
                <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: '#fbbf24', color: 'var(--text-inverse)', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                  1
                </div>
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.9375rem', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>{top1.name}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-brand)', fontWeight: 700, marginBottom: '0.5rem' }}>{top1.xp} XP</div>
              {/* Podium Column */}
              <div style={{ 
                width: '120px', 
                height: '140px', 
                background: 'linear-gradient(180deg, rgba(251, 191, 36, 0.2), rgba(251, 191, 36, 0.05))', 
                borderTop: '4px solid #fbbf24', 
                borderRadius: '8px 8px 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(251, 191, 36, 0.1)'
              }}>
                <Trophy size={36} style={{ color: '#fbbf24' }} />
              </div>
            </div>
          )}

          {/* Rank 3 Podium */}
          {top3 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '120px' }}>
              <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800, border: '2px solid #d97706' }}>
                  {top3.avatar}
                </div>
                <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: '#d97706', color: 'white', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 800 }}>
                  3
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>{top3.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>{top3.xp} XP</div>
              {/* Podium Column */}
              <div style={{ 
                width: '100px', 
                height: '90px', 
                background: 'linear-gradient(180deg, rgba(217, 119, 6, 0.15), rgba(217, 119, 6, 0.05))', 
                borderTop: '3px solid #d97706', 
                borderRadius: '8px 8px 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Medal size={28} style={{ color: '#d97706' }} />
              </div>
            </div>
          )}

        </div>
      </div>

      <div className="dashboard-grid">
        {/* Full Rankings Table */}
        <div className="col-span-8 card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>Active Standings</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-tertiary)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 0.5rem' }}>Rank</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Student</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Department</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>XP</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Accuracy</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>Trend</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((user) => {
                const isCurrentUser = user.name.includes('(You)');
                return (
                  <tr 
                    key={user.rank} 
                    style={{ 
                      borderBottom: '1px solid var(--border-default)', 
                      background: isCurrentUser ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                      fontWeight: isCurrentUser ? 700 : 'normal'
                    }}
                  >
                    <td style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>#{user.rank}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ 
                          width: '2rem', 
                          height: '2rem', 
                          borderRadius: '50%', 
                          background: isCurrentUser ? 'var(--brand-600)' : 'var(--bg-muted)', 
                          color: isCurrentUser ? 'white' : 'var(--text-primary)',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          {user.avatar}
                        </div>
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)' }}>{user.department}</td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'right', fontWeight: 700 }}>{user.xp}</td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'right', color: 'var(--text-secondary)' }}>{user.score}%</td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>{renderTrend(user.trend)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Your stats card */}
        <div className="col-span-4 card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'fit-content' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Your Progress Overview</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Current Rank</span>
                <span style={{ fontWeight: 800 }}>#7 of 3,250</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Branch Percentile</span>
                <span style={{ fontWeight: 800, color: 'var(--accent-purple)' }}>Top 15%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Weekly Delta</span>
                <span style={{ fontWeight: 800, color: 'var(--accent-emerald)' }}>+3 Ranks</span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: '1.25rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block', marginBottom: '0.75rem' }}>
              Earn +550 XP to surpass <b>Neha Gupta</b> at #6
            </span>
            <button className="btn btn-primary btn-sm w-full" onClick={() => window.location.href = '/student/practice'}>
              Launch Fast Practice (+50 XP)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
