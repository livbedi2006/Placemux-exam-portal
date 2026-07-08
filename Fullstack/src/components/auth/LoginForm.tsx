'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { signInWithSocialProvider } from '@/lib/auth';
import styles from './AuthForm.module.css';

export function LoginForm() {
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', remember: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    router.push('/student');
  };

  const handleSocialSignIn = async (provider: 'google' | 'microsoft') => {
    setLoading(true);
    const user = await signInWithSocialProvider(provider, 'student');
    setLoading(false);

    if (user) {
      router.push('/student');
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardGlow} />
      {/* Header */}
      <div className={styles.header}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>E</div>
          <span className={styles.logoText}>ExamAI Pro</span>
        </Link>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Sign in to your account to continue</p>
      </div>

      {/* Social logins */}
      <div className={styles.socialRow}>
        <button type="button" className={styles.socialBtn} onClick={() => handleSocialSignIn('google')} disabled={loading}>
          <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2a10.34 10.34 0 00-.164-1.84H9v3.48h4.844a4.14 4.14 0 01-1.796 2.716v2.258h2.908C16.657 14.148 17.64 11.9 17.64 9.2z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
          Google
        </button>
        <button type="button" className={styles.socialBtn} onClick={() => handleSocialSignIn('microsoft')} disabled={loading}>
          <svg width="18" height="18" viewBox="0 0 23 23"><path fill="#f3f3f3" d="M0 0h23v23H0z"/><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>
          Microsoft
        </button>
      </div>

      <div className={styles.divider}><span>or sign in with email</span></div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="login-email">Email address</label>
          <div className="input-group">
            <Mail size={16} className="input-icon" />
            <input
              id="login-email"
              type="email"
              className="input"
              placeholder="you@university.edu"
              value={form.email}
              onChange={e => setForm(p => ({...p, email: e.target.value}))}
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label className={styles.label} htmlFor="login-password">Password</label>
            <Link href="/auth/forgot" className={styles.forgotLink}>Forgot password?</Link>
          </div>
          <div className="input-group">
            <Lock size={16} className="input-icon" />
            <input
              id="login-password"
              type={showPwd ? 'text' : 'password'}
              className="input"
              placeholder="Enter your password"
              style={{ paddingRight: '2.75rem' }}
              value={form.password}
              onChange={e => setForm(p => ({...p, password: e.target.value}))}
              required
            />
            <button
              type="button"
              onClick={() => setShowPwd(v => !v)}
              style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
            >
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className={styles.checkRow}>
          <input id="login-remember" type="checkbox" checked={form.remember} onChange={e => setForm(p => ({...p, remember: e.target.checked}))} />
          <label htmlFor="login-remember" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>Remember me for 30 days</label>
        </div>

        <button type="submit" className={`btn btn-primary btn-lg ${styles.submitBtn}`} disabled={loading}>
          {loading ? (
            <svg width="18" height="18" viewBox="0 0 50 50" style={{ animation: 'spin 1s linear infinite' }}>
              <circle cx="25" cy="25" r="20" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeDasharray="100 55" />
            </svg>
          ) : (
            <><Sparkles size={16} /> Sign In <ArrowRight size={16} /></>
          )}
        </button>
      </form>

      <p className={styles.switchText}>
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className={styles.switchLink}>Create one free</Link>
      </p>
    </div>
  );
}
