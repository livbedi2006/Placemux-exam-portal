export interface ReportPayload {
  studentId: string;
  studentName: string;
  department?: string | null;
  examId: string;
  examName: string;
  subject?: string | null;
  timeTakenSec: number;
  submittedAt: string;
  totalQuestions: number;
  attempted: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade?: string | null;
  passFail?: string | null;
  topicPerformance?: Record<string, any> | null;
  aiFeedback?: Record<string, any> | null;
}

const BASE = 'http://127.0.0.1:8000';

export async function createReport(payload: ReportPayload) {
  const res = await fetch(`${BASE}/api/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create report');
  return res.json();
}

export async function listReports(studentId?: string) {
  const url = new URL(`${BASE}/api/reports`);
  if (studentId) url.searchParams.set('studentId', studentId);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to list reports');
  return res.json();
}

export async function getReport(reportId: string) {
  const res = await fetch(`${BASE}/api/reports/${reportId}`);
  if (!res.ok) throw new Error('Failed to get report');
  return res.json();
}

export async function uploadReportPdf(reportId: string, file: File) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(`${BASE}/api/reports/${reportId}/pdf`, { method: 'POST', body: fd });
  if (!res.ok) throw new Error('Failed to upload PDF');
  return res.json();
}

export default { createReport, listReports, getReport, uploadReportPdf };
