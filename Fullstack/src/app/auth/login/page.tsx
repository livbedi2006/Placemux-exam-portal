import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = { title: 'Sign In – ExamAI Pro' };

export default function LoginPage() {
  return <LoginForm />;
}
