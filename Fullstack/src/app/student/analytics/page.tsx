'use client';
import { useState } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Area, 
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Award, 
  Clock, 
  Users, 
  Brain, 
  Calendar, 
  BookOpen, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { mockAnalyticsData } from '@/lib/db-mock';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month');

  // Hardcoded stats matching our mock telemetry
  const stats = [
    { label: 'Overall Accuracy', value: '78.5%', change: '+2.4% this week', icon: Award, color: 'var(--brand-500)' },
    { label: 'Total Practice Exams', value: '24', change: '4 completed recently', icon: BookOpen, color: 'var(--accent-purple)' },
    { label: 'Total Study Time', value: '142.5 hrs', change: '12 hrs active this week', icon: Clock, color: 'var(--accent-emerald)' },
    { label: 'Leaderboard Rank', value: '#7', change: 'Moved up 3 positions', icon: Users, color: 'var(--accent-amber)' },
  ];

  // AI Generated performance recommendations
  const aiInsights = [
    {
      topic: 'Algorithms & Complexity',
      text: 'Your performance in Dynamic Programming is currently 53.3%. We recommend focusing on the 0/1 Knapsack subtopics and recursion basics.',
      impact: 'High Impact'
    },
    {
      topic: 'Database Management Systems',
      text: 'You have achieved 91.2% accuracy in SQL Joins. You are ready to tackle advanced indexing and transaction isolation level questions.',
      impact: 'Topic Mastered'
    },
    {
      topic: 'Study Schedule Optimization',
      text: 'Your average time per question is 92 seconds. Practice mock quizzes with countdown timers to improve speed on standard MCQs.',
      impact: 'Speed Optimization'
    }
  ];

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, var(--brand-600), var(--accent-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Performance Analytics
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            A deep-dive statistical review of your subject performance, accuracy trends, and AI-driven study insights.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-surface)', padding: '0.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)' }}>
          {(['week', 'month', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`btn btn-sm ${timeRange === range ? 'btn-secondary' : 'btn-ghost'}`}
              style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}
            >
              {range === 'week' ? 'Weekly' : range === 'month' ? 'Monthly' : 'All-Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '3rem', 
                height: '3rem', 
                borderRadius: 'var(--radius-lg)', 
                background: `rgba(59, 130, 246, 0.08)`, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: stat.color
              }}>
                <Icon size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stat.value}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{stat.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '0.125rem', fontWeight: 600 }}>{stat.change}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        {/* Trend Area Chart */}
        <div className="col-span-8 card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem' }}>Practice Scores Trend</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockAnalyticsData.weeklyScores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand-500)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--brand-500)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
                <XAxis dataKey="week" stroke="var(--text-tertiary)" style={{ fontSize: '11px' }} />
                <YAxis domain={[40, 100]} stroke="var(--text-tertiary)" style={{ fontSize: '11px' }} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-elevated)', 
                    border: '1px solid var(--border-default)', 
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)'
                  }} 
                />
                <Area type="monotone" dataKey="score" stroke="var(--brand-500)" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreColor)" name="Average Score" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Accuracy Radar */}
        <div className="col-span-4 card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem' }}>Subject Mastery Radar</h3>
          <div style={{ width: '100%', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={mockAnalyticsData.subjectAccuracy}>
                <PolarGrid stroke="var(--border-default)" />
                <PolarAngleAxis dataKey="subject" stroke="var(--text-secondary)" style={{ fontSize: '10px', fontWeight: 500 }} />
                <Radar name="Accuracy %" dataKey="accuracy" stroke="var(--accent-purple)" fill="var(--accent-purple)" fillOpacity={0.3} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-elevated)', 
                    border: '1px solid var(--border-default)', 
                    borderRadius: 'var(--radius-md)'
                  }} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Topic performance bar chart */}
        <div className="col-span-6 card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem' }}>Subtopic Strengths Breakdown</h3>
          <div style={{ width: '100%', height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockAnalyticsData.topicPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
                <XAxis dataKey="topic" stroke="var(--text-tertiary)" style={{ fontSize: '10px' }} />
                <YAxis stroke="var(--text-tertiary)" style={{ fontSize: '10px' }} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-elevated)', 
                    border: '1px solid var(--border-default)', 
                    borderRadius: 'var(--radius-md)'
                  }} 
                />
                <Bar dataKey="correct" fill="var(--accent-emerald)" radius={[4, 4, 0, 0]} name="Correct Answers" />
                <Bar dataKey="total" fill="var(--bg-muted)" radius={[4, 4, 0, 0]} name="Total Questions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Actionable Insights */}
        <div className="col-span-6 card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Sparkles size={18} style={{ color: 'var(--accent-purple)' }} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>AI Performance Study Plan</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {aiInsights.map((insight, i) => (
                <div key={i} style={{ padding: '1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', borderLeft: '3px solid var(--brand-500)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.8125rem', fontWeight: 700 }}>
                    <span>{insight.topic}</span>
                    <span style={{ 
                      color: insight.impact === 'Topic Mastered' ? 'var(--accent-emerald)' : insight.impact === 'High Impact' ? 'var(--error)' : 'var(--accent-amber)',
                      fontSize: '0.75rem' 
                    }}>
                      {insight.impact}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {insight.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary btn-sm" onClick={() => window.location.href = '/student/practice'}>
              Generate Custom AI Practice Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
