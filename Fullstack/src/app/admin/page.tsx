'use client';
import { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from 'recharts';
import { 
  ShieldAlert, 
  Users, 
  Server, 
  Activity, 
  Cpu, 
  Clock, 
  Terminal,
  Database,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { mockAdminData } from '@/lib/db-mock';

export default function AdminPage() {
  const [activeSystemTab, setActiveSystemTab] = useState<'users' | 'servers'>('users');

  const stats = [
    { label: 'Total Registered Users', value: '3,250', icon: Users, color: 'var(--brand-500)', change: '+12% this month' },
    { label: 'System Uptime Status', value: '99.98%', icon: Activity, color: 'var(--accent-emerald)', change: '0 incident reports' },
    { label: 'Media storage storage', value: '142.5 GB', icon: Server, color: 'var(--accent-purple)', change: '74% remaining space' },
    { label: 'Proctoring Flag Alerts', value: '3 Active', icon: ShieldAlert, color: 'var(--error)', change: '1 high-severity violation' },
  ];

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, var(--brand-600), var(--accent-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            System Administrator Operations
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Manage compute clusters, audit administrative logs, analyze database storage, and retrain proctoring models.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => alert('Generating full system status report PDF...')}>
          Generate System Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
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
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.125rem' }}>{stat.change}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Stats Charts */}
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        {/* User growth Area Chart */}
        <div className="col-span-8 card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem' }}>Monthly Active User Account Growth</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockAdminData.userGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="studentColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand-500)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--brand-500)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="facultyColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-purple)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--accent-purple)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
                <XAxis dataKey="month" stroke="var(--text-tertiary)" style={{ fontSize: '11px' }} />
                <YAxis stroke="var(--text-tertiary)" style={{ fontSize: '11px' }} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-elevated)', 
                    border: '1px solid var(--border-default)', 
                    borderRadius: 'var(--radius-md)'
                  }} 
                />
                <Legend style={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="students" stroke="var(--brand-500)" strokeWidth={2.5} fillOpacity={1} fill="url(#studentColor)" name="Students" />
                <Area type="monotone" dataKey="faculty" stroke="var(--accent-purple)" strokeWidth={2.5} fillOpacity={1} fill="url(#facultyColor)" name="Faculty Members" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Compute Resource Usage */}
        <div className="col-span-4 card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Host Node Hardware Telemetry</h3>
          
          {mockAdminData.systemMetrics.map((metric, idx) => (
            <div key={idx} style={{ padding: '0.75rem 1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8125rem' }}>
                <span style={{ fontWeight: 700 }}>{metric.label}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{metric.value}{metric.unit}</span>
              </div>
              <div className="progress-track" style={{ height: '6px' }}>
                <div 
                  className={`progress-fill ${metric.value > 80 ? 'progress-amber' : 'progress-blue'}`} 
                  style={{ width: `${metric.label.includes('Latency') ? (metric.value / 100) * 100 : metric.value}%` }} 
                />
              </div>
              <span style={{ fontSize: '0.6875rem', color: metric.trend > 0 ? 'var(--error)' : 'var(--accent-emerald)', marginTop: '0.25rem', display: 'block', fontWeight: 600 }}>
                {metric.trend > 0 ? `+${metric.trend}% increase` : `${metric.trend}% decrease`} vs last hour
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Proctoring Alerts */}
        <div className="col-span-6 card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} style={{ color: 'var(--error)' }} />
            <span>Active Proctoring Violations Log</span>
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-tertiary)', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>Student</th>
                <th style={{ padding: '0.5rem' }}>Exam</th>
                <th style={{ padding: '0.5rem' }}>Violation Category</th>
                <th style={{ padding: '0.5rem', textAlign: 'center' }}>Risk</th>
              </tr>
            </thead>
            <tbody>
              {mockAdminData.violations.map((v) => (
                <tr key={v.id} style={{ borderBottom: '1px solid var(--border-default)' }}>
                  <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{v.student}</td>
                  <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>{v.exam}</td>
                  <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>{v.type}</td>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                    <span className={`badge ${v.severity === 'high' ? 'badge-red' : v.severity === 'medium' ? 'badge-amber' : 'badge-gray'}`} style={{ textTransform: 'uppercase', fontSize: '0.625rem' }}>
                      {v.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Audit Log */}
        <div className="col-span-6 card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Terminal size={18} style={{ color: 'var(--accent-purple)' }} />
            <span>Access Auditing Trails</span>
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-tertiary)', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>Action Description</th>
                <th style={{ padding: '0.5rem' }}>Account</th>
                <th style={{ padding: '0.5rem' }}>Timestamp</th>
                <th style={{ padding: '0.5rem' }}>Source IP</th>
              </tr>
            </thead>
            <tbody>
              {mockAdminData.auditLog.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border-default)' }}>
                  <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{log.action}</td>
                  <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>{log.user}</td>
                  <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>{log.timestamp}</td>
                  <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model retraining config */}
      <div className="card" style={{ padding: '1.5rem', marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h4 style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.25rem' }}>Proctoring SVM Model Retraining Pipeline</h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Last retrained: <b>Jul 04, 2026</b> • Classifier accuracy: <b>98.42%</b>
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => alert('Triggering pipeline compilation of the OpenCV/MediaPipe SVM model in backend/models...')}>
          <RotateCcw size={12} style={{ marginRight: '4px' }} /> Retrain Model Now
        </button>
      </div>

    </div>
  );
}
