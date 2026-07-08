'use client';
import { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  BookOpen, 
  Users, 
  FileText, 
  Database, 
  Plus, 
  TrendingUp, 
  Eye, 
  Award, 
  BarChart3, 
  Clock,
  Sparkles,
  Monitor
} from 'lucide-react';
import { mockFacultyData } from '@/lib/db-mock';

export default function FacultyPage() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const stats = [
    { label: 'Total Subjects Managed', value: '12', icon: BookOpen, color: 'var(--brand-500)' },
    { label: 'Total Questions Created', value: '1,248', icon: Database, color: 'var(--accent-purple)' },
    { label: 'Active Exams', value: '4', icon: FileText, color: 'var(--accent-emerald)' },
    { label: 'Assigned Students', value: '450', icon: Users, color: 'var(--accent-amber)' },
  ];

  // Pie chart colors
  const COLORS = ['var(--brand-500)', 'var(--accent-purple)', 'var(--accent-emerald)', 'var(--accent-amber)', 'var(--accent-cyan)', 'var(--accent-pink)'];

  const handleActionClick = (actionName: string) => {
    setSelectedAction(actionName);
    alert(`Triggering action: ${actionName}`);
  };

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, var(--brand-600), var(--accent-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Faculty Administration Panel
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Author evaluations, compile test questions, monitor student telemetry logs, and export performance reports.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => handleActionClick('Create New Exam')}>
          <Plus size={16} /> Create New Exam
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '3rem', 
                height: '3rem', 
                borderRadius: 'var(--radius-lg)', 
                background: 'rgba(59, 130, 246, 0.08)', 
                color: stat.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stat.value}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Dashboard Rows */}
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        {/* Exam stats */}
        <div className="col-span-8 card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem' }}>Student Midterm Pass Rates</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockFacultyData.examPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
                <XAxis dataKey="exam" stroke="var(--text-tertiary)" style={{ fontSize: '11px' }} />
                <YAxis stroke="var(--text-tertiary)" style={{ fontSize: '11px' }} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-elevated)', 
                    border: '1px solid var(--border-default)', 
                    borderRadius: 'var(--radius-md)'
                  }} 
                />
                <Legend style={{ fontSize: '11px' }} />
                <Bar dataKey="passRate" fill="var(--accent-emerald)" name="Pass Rate (%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgScore" fill="var(--brand-500)" name="Average Score (%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Question formats */}
        <div className="col-span-4 card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem', alignSelf: 'flex-start' }}>Question Format Bank</h3>
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockFacultyData.questionDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="type"
                >
                  {mockFacultyData.questionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-elevated)', 
                    border: '1px solid var(--border-default)', 
                    borderRadius: 'var(--radius-md)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Custom Legends Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.6875rem', width: '100%', borderTop: '1px solid var(--border-default)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
            {mockFacultyData.questionDistribution.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[idx % COLORS.length] }} />
                <span style={{ color: 'var(--text-secondary)' }}>{item.type} ({item.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Recent Results */}
        <div className="col-span-8 card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>Recent Submissions Log</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-tertiary)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 0.5rem' }}>Student Name</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Evaluation Exam</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Score</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>Outcome</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {mockFacultyData.recentResults.map((result, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-default)' }}>
                  <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>{result.student}</td>
                  <td style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)' }}>{result.exam}</td>
                  <td style={{ padding: '1rem 0.5rem', textAlign: 'right', fontWeight: 700 }}>{result.score}%</td>
                  <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                    <span className={`badge ${result.status === 'passed' ? 'badge-green' : 'badge-red'}`} style={{ textTransform: 'uppercase' }}>
                      {result.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', color: 'var(--text-tertiary)' }}>{result.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Shortcuts */}
        <div className="col-span-4 card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>Class Operations</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button className="btn btn-secondary w-full" style={{ justifyContent: 'flex-start' }} onClick={() => handleActionClick('Add Questions')}>
                <Database size={16} style={{ color: 'var(--brand-500)', marginRight: '6px' }} /> Import Question Bank CSV
              </button>
              <button className="btn btn-secondary w-full" style={{ justifyContent: 'flex-start' }} onClick={() => handleActionClick('Manage Subjects')}>
                <BookOpen size={16} style={{ color: 'var(--accent-purple)', marginRight: '6px' }} /> Configure Subjects & Syllabus
              </button>
              <button className="btn btn-secondary w-full" style={{ justifyContent: 'flex-start' }} onClick={() => handleActionClick('Grade Submissions')}>
                <FileText size={16} style={{ color: 'var(--accent-emerald)', marginRight: '6px' }} /> Evaluator & Grading Rubric
              </button>
              <button className="btn btn-secondary w-full" style={{ justifyContent: 'flex-start' }} onClick={() => handleActionClick('Monitor Live Exam')}>
                <Monitor size={16} style={{ color: 'var(--accent-amber)', marginRight: '6px' }} /> Real-time Proctoring Monitor
              </button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: '1.25rem', marginTop: '1.5rem', background: 'rgba(59, 130, 246, 0.04)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>
              AI Proctoring Analytics
            </span>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', lineHeight: 1.3 }}>
              Computer vision monitoring tracks head movements, multiple face occurrences and tab switches automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
