import { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = { title: 'Create Account – ExamAI Pro' };

export default function RegisterPage() {
  return <RegisterForm />;
}
