'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar
} from 'recharts';
import {
  Zap, Play, Brain, Download, BookOpen, Target, TrendingUp, TrendingDown,
  Award, Flame, Star, Clock, CheckCircle, AlertCircle, ChevronRight,
  Users, FileText, BarChart2, Trophy, Sparkles, Rocket
} from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import useAuthUser from '@/lib/useAuth';
import { getStreak, formatLastActive } from '@/lib/streak';
import styles from './StudentDashboard.module.css';

// Mock data
const weeklyData = [
  { day: 'Mon', score: 72, time: 45 },
  { day: 'Tue', score: 68, time: 60 },
  { day: 'Wed', score: 80, time: 90 },
  { day: 'Thu', score: 85, time: 75 },
  { day: 'Fri', score: 78, time: 55 },
  { day: 'Sat', score: 91, time: 120 },
  { day: 'Sun', score: 88, time: 80 },
];

const monthlyData = [
  { day: 'W1', score: 70 },
  { day: 'W2', score: 75 },
  { day: 'W3', score: 82 },
  { day: 'W4', score: 88 },
];

const upcomingExams = [
  { name: 'Data Structures & Algorithms', subject: 'CS301', date: 'Today, 2:00 PM', color: '#2563eb', status: 'today', score: null },
  { name: 'Database Management Systems', subject: 'CS302', date: 'Tomorrow, 10:00 AM', color: '#7c3aed', status: 'upcoming', score: null },
  { name: 'Operating Systems', subject: 'CS303', date: 'Jul 10, 3:00 PM', color: '#0891b2', status: 'upcoming', score: null },
];

const recentResults = [
  { name: 'Computer Networks', subject: 'CS304', date: 'Jul 4', color: '#059669', score: 92 },
  { name: 'Software Engineering', subject: 'CS305', date: 'Jul 2', color: '#d97706', score: 78 },
  { name: 'Machine Learning', subject: 'CS306', date: 'Jun 30', color: '#7c3aed', score: 85 },
];

const subjects = [
  { name: 'Data Structures', pct: 85, color: 'progress-blue' },
  { name: 'Algorithms', pct: 72, color: 'progress-purple' },
  { name: 'Database Systems', pct: 91, color: 'progress-green' },
  { name: 'Operating Systems', pct: 63, color: 'progress-amber' },
  { name: 'Computer Networks', pct: 78, color: 'progress-blue' },
];

const leaderboard = [
  { name: 'Priya Sharma', score: 9840, color: '#f59e0b', isYou: false },
  { name: 'Rahul Gupta', score: 9210, color: '#6366f1', isYou: false },
  { name: 'You', score: 8950, color: '#2563eb', isYou: true },
  { name: 'Ananya Singh', score: 8720, color: '#ec4899', isYou: false },
  { name: 'Karthik Rao', score: 8500, color: '#10b981', isYou: false },
];

const badges = [
  { emoji: '🏆', name: 'Top 3' },
  { emoji: '🔥', name: '30 Streak' },
  { emoji: '⚡', name: 'Speed' },
  { emoji: '🎯', name: 'Accurate' },
  { emoji: '🌟', name: 'Star' },
  { emoji: '🤖', name: 'AI Pro' },
  { emoji: '📚', name: 'Scholar' },
  { emoji: '💎', name: 'Diamond' },
];

const activities = [
  { icon: CheckCircle, text: 'Completed Computer Networks mock test', time: '2h ago', color: '#10b981' },
  { icon: Brain, text: 'AI generated study plan for OS', time: '4h ago', color: '#8b5cf6' },
  { icon: Trophy, text: 'Earned "Speed Demon" badge', time: '1d ago', color: '#f59e0b' },
  { icon: BookOpen, text: 'Revised Data Structures flashcards', time: '1d ago', color: '#2563eb' },
  { icon: Target, text: 'Achieved daily study goal', time: '2d ago', color: '#06b6d4' },
];

const aiRecs = [
  { icon: AlertCircle, title: 'Weak Topic: Process Scheduling', desc: 'Practice 10 more questions on CPU scheduling algorithms', color: '#ef4444' },
  { icon: Rocket, title: 'Ready for: Networks Exam', desc: 'You are 92% ready. Take the mock exam now!', color: '#10b981' },
  { icon: Sparkles, title: 'Today\'s Challenge', desc: 'Dynamic Programming – 15 min challenge to earn 500 XP', color: '#8b5cf6' },
];

const radialData = [{ value: 85, fill: 'url(#aiGrad)' }];

const days = Array.from({ length: 21 }, (_, i) => ({
  active: Math.random() > 0.3,
  today: i === 20,
  label: `D${i + 1}`,
}));

export function StudentDashboard() {
  const [chartTab, setChartTab] = useState<'week' | 'month'>('week');
  const chartData = chartTab === 'week' ? weeklyData : monthlyData;
  const user = useAuthUser();
  const displayName = user?.name?.trim() ?? null;
  const [streakRec, setStreakRec] = useState(() => user ? getStreak(user.id) : { currentStreak: 0, longestStreak: 0, lastSolvedDate: null, totalDaysActive: 0 });

  useEffect(() => {
    const refresh = () => { if (user) setStreakRec(getStreak(user.id)); };
    refresh();
    window.addEventListener('streak:changed', refresh as EventListener);
    window.addEventListener('storage', refresh as EventListener);
    return () => {
      window.removeEventListener('streak:changed', refresh as EventListener);
      window.removeEventListener('storage', refresh as EventListener);
    };
  }, [user]);

  const getTimeGreeting = () => {
    const hr = new Date().getHours();
    if (hr >= 5 && hr < 12) return 'Good Morning';
    if (hr >= 12 && hr < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className={styles.page}>
      {/* Welcome Card */}
      <div className={styles.welcomeCard}>
        <div className={styles.welcomeBg} />
        <div className={styles.welcomeContent}>
          <div className={styles.welcomeLeft}>
            <p className={styles.welcomeGreeting}>👋 {getTimeGreeting()},</p>
            <h1 className={styles.welcomeName}>Hello, {displayName || 'Student'}!</h1>
            <p className={styles.welcomeQuote}>
              "Success is the sum of small efforts, repeated day in and day out."
            </p>
            <div className={styles.quickActions}>
              <Link href="/student/exams" className={styles.qaBtn}>
                <Play size={14} /> Start Exam
              </Link>
              <Link href="/student/practice" className={styles.qaBtn}>
                <Target size={14} /> Practice
              </Link>
              <Link href="/student/ai" className={styles.qaBtn}>
                <Brain size={14} /> Ask AI
              </Link>
              <a href="#" className={styles.qaBtn}>
                <Zap size={14} /> Quick Quiz
              </a>
              <a href="#" className={styles.qaBtn}>
                <Download size={14} /> Report
              </a>
            </div>
          </div>
          <div className={styles.welcomeRight}>
            <div className={styles.welcomeStat}>
              <span className={styles.welcomeStatValue}>🔥 {streakRec.currentStreak}</span>
              <span className={styles.welcomeStatLabel}>Current Streak</span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>{formatLastActive(streakRec.lastSolvedDate)}</div>
            </div>
            <div className={styles.welcomeStat}>
              <span className={styles.welcomeStatValue}>🏆 {streakRec.longestStreak}</span>
              <span className={styles.welcomeStatLabel}>Longest Streak</span>
            </div>
            <div className={styles.welcomeStat}>
              <span className={styles.welcomeStatValue}>🔥 {streakRec.totalDaysActive}</span>
              <span className={styles.welcomeStatLabel}>Total Days Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className={styles.statsRow}>
        {[
          { icon: FileText, label: 'Total Exams',     value: 42,  delta: '+3 this week', up: true,  color: '#2563eb',  bg: 'linear-gradient(135deg,#2563eb,#3b82f6)' },
          { icon: CheckCircle, label: 'Completed',   value: 38,  delta: '+2 this week', up: true,  color: '#10b981',  bg: 'linear-gradient(135deg,#059669,#10b981)' },
          { icon: Clock,    label: 'Study Hours',     value: 128, delta: '+12 this week', up: true, color: '#8b5cf6',  bg: 'linear-gradient(135deg,#7c3aed,#8b5cf6)' },
          { icon: Trophy,   label: 'XP Points',       value: 8950,delta: '+450 today',   up: true,  color: '#f59e0b',  bg: 'linear-gradient(135deg,#d97706,#f59e0b)' },
          { icon: Star,     label: 'Avg Score',       value: 87,  delta: '+5 vs last wk', up: true, color: '#06b6d4', bg: 'linear-gradient(135deg,#0891b2,#06b6d4)', suffix: '%' },
          { icon: Flame,    label: 'Pending Exams',   value: 4,   delta: '2 due soon',   up: false, color: '#ef4444',  bg: 'linear-gradient(135deg,#dc2626,#ef4444)' },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`card ${styles.statCard}`}>
              <div className={styles.statIconWrap} style={{ background: stat.bg }}>
                <Icon size={18} />
              </div>
              <div>
                <div className={styles.statValue}>
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
              <div className={`${styles.statDelta} ${stat.up ? styles.deltaUp : styles.deltaDown}`}>
                {stat.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {stat.delta}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className={styles.threeCol}>
        {/* Performance Chart */}
        <div className={`card ${styles.chartCard}`}>
          <div className={styles.chartHeader}>
            <div className={styles.sectionTitle}>
              <BarChart2 size={16} style={{ color: 'var(--brand-500)' }} />
              Performance Graph
            </div>
            <div className={styles.chartTabs}>
              {(['week', 'month'] as const).map(tab => (
                <button
                  key={tab}
                  className={`${styles.chartTab} ${chartTab === tab ? styles.active : ''}`}
                  onClick={() => setChartTab(tab)}
                >
                  {tab === 'week' ? '7 Days' : '30 Days'}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.chartWrap}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"  stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} domain={[50, 100]} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: '0.75rem', fontSize: '0.8rem', boxShadow: 'var(--shadow-md)' }}
                  labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                  itemStyle={{ color: 'var(--brand-500)' }}
                />
                <Area type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={2.5} fill="url(#scoreGrad)" dot={{ fill: '#2563eb', strokeWidth: 0, r: 3 }} activeDot={{ r: 5, fill: '#2563eb' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Readiness */}
        <div className={`card ${styles.aiScoreCard}`}>
          <div className={styles.aiScoreGlow} />
          <div className={styles.sectionTitle} style={{ justifyContent: 'center' }}>
            <Brain size={16} style={{ color: 'var(--accent-purple)' }} />
            AI Readiness Score
          </div>
          <div className={styles.aiRingWrap}>
            <RadialBarChart width={140} height={140} innerRadius={48} outerRadius={64} data={radialData} startAngle={90} endAngle={-270} barSize={12}>
              <defs>
                <linearGradient id="aiGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <RadialBar dataKey="value" cornerRadius={8} background={{ fill: 'var(--bg-muted)' }} />
            </RadialBarChart>
            <div className={styles.aiRingLabel}>
              <span className={styles.aiRingValue}>85%</span>
              <span className={styles.aiRingSub}>Ready</span>
            </div>
          </div>
          <div className={styles.aiInsights}>
            {[
              { text: 'Strong in OOP concepts', color: '#10b981' },
              { text: 'Weak in Process Scheduling', color: '#ef4444' },
              { text: 'Improving in Networks', color: '#3b82f6' },
            ].map(i => (
              <div key={i.text} className={styles.aiInsightRow}>
                <div className={styles.aiInsightDot} style={{ background: i.color }} />
                {i.text}
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1rem' }}>
            <div className="progress-track">
              <div className="progress-fill progress-purple" style={{ width: '85%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Exams + Activity + Leaderboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {/* Upcoming Exams */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}><FileText size={15} style={{ color: 'var(--brand-500)' }} /> Upcoming Exams</div>
            <Link href="/student/exams" className={styles.sectionLink}>View all <ChevronRight size={12} style={{ display: 'inline' }} /></Link>
          </div>
          {upcomingExams.map(exam => (
            <div key={exam.name} className={styles.examItem}>
              <div className={styles.examIcon} style={{ background: exam.color }}>{exam.subject.slice(-2)}</div>
              <div className={styles.examInfo}>
                <div className={styles.examName}>{exam.name}</div>
                <div className={styles.examMeta}>{exam.date}</div>
              </div>
              {exam.status === 'today' && <span className="badge badge-red">Today</span>}
            </div>
          ))}
        </div>

        {/* Recent Results */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}><Trophy size={15} style={{ color: '#f59e0b' }} /> Recent Results</div>
            <a className={styles.sectionLink}>View all <ChevronRight size={12} style={{ display: 'inline' }} /></a>
          </div>
          {recentResults.map(exam => (
            <div key={exam.name} className={styles.examItem}>
              <div className={styles.examIcon} style={{ background: exam.color }}>{exam.subject.slice(-2)}</div>
              <div className={styles.examInfo}>
                <div className={styles.examName}>{exam.name}</div>
                <div className={styles.examMeta}>{exam.date}</div>
              </div>
              <div className={styles.examScore}>{exam.score}%</div>
            </div>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}><Users size={15} style={{ color: '#8b5cf6' }} /> Leaderboard</div>
            <a className={styles.sectionLink}>Full <ChevronRight size={12} style={{ display: 'inline' }} /></a>
          </div>
          {leaderboard.map((rowUser, idx) => {
            const effectiveUser = user && rowUser.isYou ? { ...rowUser, name: user.name } : rowUser;
            const isYou = effectiveUser.isYou;
            return (
            <div key={effectiveUser.name} className={`${styles.leaderItem} ${isYou ? styles.you : ''}`}>
              <span className={`${styles.leaderRank} ${idx === 0 ? styles.gold : idx === 1 ? styles.silver : idx === 2 ? styles.bronze : ''}`}>
                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
              </span>
              <div className={styles.leaderAvatar} style={{ background: effectiveUser.color }}>{effectiveUser.name.split(' ').map(n => n[0]).join('')}</div>
              <div className={styles.leaderName}>{isYou ? `${effectiveUser.name} (You)` : effectiveUser.name}</div>
              <div className={styles.leaderScore}>{effectiveUser.score.toLocaleString()}</div>
            </div>
            );
          })}
          ))}
        </div>
      </div>

      {/* Bottom Row */}
      <div className={styles.twoCol}>
        {/* Subject Progress */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}><BarChart2 size={15} style={{ color: 'var(--accent-cyan)' }} /> Subject Progress</div>
          </div>
          <div className={styles.subjectRow}>
            {subjects.map(s => (
              <div key={s.name} className={styles.subjectItem}>
                <div className={styles.subjectTop}>
                  <span className={styles.subjectName}>{s.name}</span>
                  <span className={styles.subjectPct}>{s.pct}%</span>
                </div>
                <div className="progress-track">
                  <div className={`progress-fill ${s.color}`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations + XP/Badges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* AI Recommendations */}
          <div className="card" style={{ padding: '1.25rem', flex: 1 }}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}><Sparkles size={15} style={{ color: 'var(--accent-purple)' }} /> AI Recommendations</div>
            </div>
            {aiRecs.map(rec => {
              const Icon = rec.icon;
              return (
                <div key={rec.title} className={styles.aiRecCard}>
                  <div className={styles.aiRecIcon} style={{ background: rec.color }}><Icon size={16} /></div>
                  <div className={styles.aiRecContent}>
                    <div className={styles.aiRecTitle}>{rec.title}</div>
                    <div className={styles.aiRecDesc}>{rec.desc}</div>
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                </div>
              );
            })}
          </div>

          {/* XP & Badges */}
          <div className={`card ${styles.xpCard}`}>
            <div className={styles.xpRow}>
              <div>
                <div className={styles.xpLabel}>Your XP Points</div>
                <div className={styles.xpValue}>8,950 XP</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className={styles.xpLabel}>Next Level</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>1,050 to go</div>
              </div>
            </div>
            <div className="progress-track">
              <div className="progress-fill progress-purple" style={{ width: '89.5%' }} />
            </div>
            <div className={styles.badgeGrid}>
              {badges.map(b => (
                <div key={b.name} className={styles.badgeItem}>
                  <span className={styles.badgeEmoji}>{b.emoji}</span>
                  <span className={styles.badgeName}>{b.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activity + Streak */}
      <div className={styles.twoCol}>
        {/* Activity */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}><Clock size={15} style={{ color: 'var(--accent-emerald)' }} /> Recent Activity</div>
          </div>
          {activities.map(act => {
            const Icon = act.icon;
            return (
              <div key={act.text} className={styles.activityItem}>
                <div className={styles.activityDot} style={{ background: act.color }}>
                  <Icon size={12} />
                </div>
                <div className={styles.activityContent}>
                  <div className={styles.activityText}>{act.text}</div>
                  <div className={styles.activityTime}>{act.time}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Study Streak */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}><Flame size={15} style={{ color: '#f59e0b' }} /> Study Streak</div>
            <span className="badge badge-amber">🔥 30 Days</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Keep up the momentum! You're on a 30-day streak.</p>
          <div className={styles.streakRow}>
            {days.map((d, i) => (
              <div
                key={i}
                className={`${styles.streakDay} ${d.today ? styles.streakToday : d.active ? styles.streakActive : styles.streakInactive}`}
                title={d.today ? 'Today' : d.active ? 'Studied' : 'Missed'}
              >
                {d.today ? '★' : ''}
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[
              { label: 'Best Streak', value: '45 days', icon: '🏆' },
              { label: 'This Month', value: '24 days', icon: '📅' },
              { label: 'Focus Time', value: '4.2 hrs', icon: '⏱️' },
              { label: 'Coins Earned', value: '1,240', icon: '🪙' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--bg-subtle)', borderRadius: '0.625rem', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{s.value}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
