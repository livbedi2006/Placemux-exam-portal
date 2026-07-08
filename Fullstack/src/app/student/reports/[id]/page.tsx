'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getReport } from '@/lib/reports';

export default function ReportDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getReport(id).then(r => setReport(r)).catch(() => setReport(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: '1rem' }}>Loading...</div>;
  if (!report) return <div style={{ padding: '1rem' }}>Report not found</div>;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{report.examName}</h1>
          <div style={{ color: 'var(--text-tertiary)' }}>{report.subject || 'General'} • Submitted {new Date(report.submittedAt).toLocaleString()}</div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {report.pdfPath ? <a href={report.pdfPath} className="btn btn-outline" target="_blank" rel="noreferrer">Download PDF</a> : <button className="btn btn-ghost" onClick={() => window.print()}>Print / Save PDF</button>}
        </div>
      </div>

      <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1rem' }}>
        <div>
          <div className="card" style={{ padding: '1rem' }}>
            <h3 style={{ fontWeight: 700 }}>Student</h3>
            <div>{report.studentName}</div>
            <div style={{ color: 'var(--text-tertiary)' }}>ID: {report.studentId}</div>
            <div style={{ color: 'var(--text-tertiary)' }}>Dept: {report.department || 'N/A'}</div>
          </div>

          <div className="card" style={{ padding: '1rem', marginTop: '1rem' }}>
            <h3 style={{ fontWeight: 700 }}>Summary</h3>
            <div>Total Questions: {report.totalQuestions}</div>
            <div>Attempted: {report.attempted}</div>
            <div>Correct: {report.correctAnswers}</div>
            <div>Wrong: {report.wrongAnswers}</div>
            <div>Skipped: {report.skippedAnswers}</div>
            <div style={{ marginTop: '0.5rem', fontWeight: 800 }}>Marks: {report.marksObtained}/{report.totalMarks} • {Math.round(report.percentage)}%</div>
            <div>Grade: {report.grade || 'N/A'}</div>
            <div>Result: {report.passFail || 'N/A'}</div>
          </div>

          <div className="card" style={{ padding: '1rem', marginTop: '1rem' }}>
            <h3 style={{ fontWeight: 700 }}>AI Feedback</h3>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>{JSON.stringify(report.aiFeedback || {}, null, 2)}</pre>
          </div>
        </div>

        <div>
          <div className="card" style={{ padding: '1rem' }}>
            <h3 style={{ fontWeight: 700 }}>Performance</h3>
            <div>Time Taken: {Math.round(report.timeTakenSec / 60)} min</div>
            <div>Last Active: {new Date(report.submittedAt).toLocaleString()}</div>
          </div>

          <div className="card" style={{ padding: '1rem', marginTop: '1rem' }}>
            <h3 style={{ fontWeight: 700 }}>Topic Performance</h3>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>{JSON.stringify(report.topicPerformance || {}, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
