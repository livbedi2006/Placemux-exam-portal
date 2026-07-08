'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import useAuthUser from '@/lib/useAuth';
import { listReports } from '@/lib/reports';

export default function ReportsPage() {
  const user = useAuthUser();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    listReports(user.id).then(r => {
      setReports(r.reports || []);
    }).catch(() => setReports([])).finally(() => setLoading(false));
  }, [user]);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Exam Reports</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Your submitted exam reports appear below.</p>

      {loading ? <div>Loading...</div> : (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {reports.map(r => (
            <div key={r.id} className="card" style={{ padding: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{r.examName}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>{r.subject || 'General'} • {new Date(r.submittedAt).toLocaleString()}</div>
                <div style={{ fontSize: '0.85rem', marginTop: '0.4rem' }}>Score: {r.marksObtained}/{r.totalMarks} • {Math.round(r.percentage)}%</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {r.pdfPath ? (
                  <a href={r.pdfPath} className="btn btn-outline" target="_blank" rel="noreferrer">Download PDF</a>
                ) : (
                  <button className="btn btn-ghost" onClick={() => window.alert('Use View to print as PDF')}>Download PDF</button>
                )}
                <Link href={`/student/reports/${r.id}`} className="btn btn-primary">View Details</Link>
              </div>
            </div>
          ))}
          {reports.length === 0 && <div style={{ color: 'var(--text-secondary)' }}>No reports yet.</div>}
        </div>
      )}
    </div>
  );
}
