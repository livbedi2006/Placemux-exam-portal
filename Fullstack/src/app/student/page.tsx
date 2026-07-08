import { Metadata } from 'next';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';

export const metadata: Metadata = {
  title: 'Student Dashboard',
  description: 'Your personalized AI-powered learning dashboard',
};

export default function StudentPage() {
  return <StudentDashboard />;
}
