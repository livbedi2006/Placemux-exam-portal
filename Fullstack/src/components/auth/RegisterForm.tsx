'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import {
  clearPendingVerification,
  generateVerificationCode,
  getPendingVerification,
  saveAuthUser,
  savePendingVerification,
  signInWithSocialProvider,
  validateEmailAddress,
  validatePasswordStrength,
} from '@/lib/auth';
import styles from './AuthForm.module.css';

const roles = [
  { value: 'student', label: 'Student', icon: '🎓' },
  { value: 'faculty', label: 'Faculty', icon: '👨‍🏫' },
  { value: 'admin', label: 'Admin', icon: '🛡️' },
];

export function RegisterForm() {
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationInput, setVerificationInput] = useState('');
  const [message, setMessage] = useState('');
  const [passwordMeter, setPasswordMeter] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setMessage('Please enter your full name.');
      return;
    }

    if (!validateEmailAddress(form.email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    const passwordCheck = validatePasswordStrength(form.password);
    if (!passwordCheck.isValid) {
      setMessage(passwordCheck.message);
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setLoading(false);

    const code = generateVerificationCode();
    savePendingVerification(form.email, code);
    setVerificationCode(code);
    setVerificationStep(true);
    setVerificationInput('');
    setMessage(`Verification code sent to ${form.email}. Enter ${code} to confirm.`);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();

    if (verificationInput.trim() === verificationCode) {
      clearPendingVerification();
      saveAuthUser({
        id: `local-${Date.now()}`,
        name: form.name.trim(),
        email: form.email.trim(),
        provider: 'google',
        role: role as 'student' | 'faculty' | 'admin',
      });
      setMessage('Email verified successfully. Redirecting...');
      router.push('/student');
      return;
    }

    setMessage('The verification code is incorrect. Please try again.');
  };

  const handleSocialSignIn = async (provider: 'google' | 'microsoft') => {
    setLoading(true);
    const user = await signInWithSocialProvider(provider, role as 'student' | 'faculty' | 'admin');
    setLoading(false);

    if (user) {
      router.push('/student');
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardGlow} />
      <div className={styles.header}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>E</div>
          <span className={styles.logoText}>ExamAI Pro</span>
        </Link>
        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.subtitle}>Join 50,000+ students & educators</p>
      </div>

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

      <div className={styles.divider}><span>or create with email</span></div>

      {message ? (
        <div style={{ marginBottom: '0.75rem', padding: '0.75rem 0.9rem', borderRadius: '0.8rem', background: 'rgba(59,130,246,0.1)', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
          {message}
        </div>
      ) : null}

      {/* Role selector */}
      <div className={styles.roleRow}>
        {roles.map(r => (
          <button
            key={r.value}
            type="button"
            className={`${styles.roleBtn} ${role === r.value ? styles.roleBtnActive : ''}`}
            onClick={() => setRole(r.value)}
          >
            <span>{r.icon}</span>
            <span>{r.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="reg-name">Full name</label>
          <div className="input-group">
            <User size={16} className="input-icon" />
            <input id="reg-name" type="text" className="input" placeholder="Alex Smith" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required />
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="reg-email">Email address</label>
          <div className="input-group">
            <Mail size={16} className="input-icon" />
            <input id="reg-email" type="email" className="input" placeholder="you@university.edu" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} required />
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="reg-password">Password</label>
          <div className="input-group">
            <Lock size={16} className="input-icon" />
            <input
              id="reg-password"
              type={showPwd ? 'text' : 'password'}
              className="input"
              placeholder="Min 8 characters"
              style={{ paddingRight: '2.75rem' }}
              value={form.password}
              onChange={(e) => {
                const next = e.target.value;
                setForm(p => ({ ...p, password: next }));
                setPasswordMeter(validatePasswordStrength(next).score);
              }}
              required
            />
            <button type="button" onClick={() => setShowPwd(v => !v)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <div style={{ flex: 1, height: '0.35rem', borderRadius: '999px', background: 'rgba(148,163,184,0.25)' }}>
                <div style={{ width: `${Math.min(passwordMeter * 20, 100)}%`, height: '100%', borderRadius: '999px', background: passwordMeter >= 4 ? '#16a34a' : passwordMeter >= 3 ? '#f59e0b' : '#dc2626' }} />
              </div>
              <span>{passwordMeter >= 4 ? 'Strong' : passwordMeter >= 3 ? 'Medium' : 'Weak'}</span>
            </div>
            Use 8+ characters, uppercase, lowercase, a number, and a symbol.
          </div>
        </div>

        {!verificationStep ? (
          <button type="submit" className={`btn btn-primary btn-lg ${styles.submitBtn}`} disabled={loading}>
          {loading ? (
            <svg width="18" height="18" viewBox="0 0 50 50" style={{ animation: 'spin 1s linear infinite' }}><circle cx="25" cy="25" r="20" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeDasharray="100 55" /></svg>
          ) : (
            <><Sparkles size={16} /> Create Account <ArrowRight size={16} /></>
          )}
          </button>
        ) : (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{ padding: '0.85rem', borderRadius: '0.9rem', background: 'rgba(99,102,241,0.08)', color: 'var(--text-primary)' }}>
              We sent a 6-digit code to your email. Enter it below to verify your account.
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="reg-verification">Verification code</label>
              <div className="input-group">
                <Mail size={16} className="input-icon" />
                <input id="reg-verification" type="text" className="input" placeholder="Enter 6-digit code" value={verificationInput} onChange={e => setVerificationInput(e.target.value)} required />
              </div>
            </div>
            <button type="button" className={`btn btn-primary btn-lg ${styles.submitBtn}`} onClick={handleVerify}>
              Verify Email <ArrowRight size={16} />
            </button>
          </div>
        )}
      </form>

      <p className={styles.switchText} style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: '0.75rem' }}>
        By signing up, you agree to our <a href="#" style={{ color: 'var(--brand-500)' }}>Terms</a> & <a href="#" style={{ color: 'var(--brand-500)' }}>Privacy Policy</a>
      </p>
      <p className={styles.switchText}>
        Already have an account?{' '}
        <Link href="/auth/login" className={styles.switchLink}>Sign in</Link>
      </p>
    </div>
  );
}
