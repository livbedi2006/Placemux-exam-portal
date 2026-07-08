export type SocialProvider = 'google' | 'microsoft';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  provider: SocialProvider;
  role: 'student' | 'faculty' | 'admin';
}

const AUTH_STORAGE_KEY = 'examai-auth-user';
const VERIFICATION_STORAGE_KEY = 'examai-pending-verification';

export interface PasswordStrengthResult {
  isValid: boolean;
  score: number;
  message: string;
}

export const validateEmailAddress = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const validatePasswordStrength = (password: string): PasswordStrengthResult => {
  if (!password) {
    return { isValid: false, score: 0, message: 'Password is required.' };
  }

  const checks = [
    /.{8,}/.test(password),
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  const score = checks.filter(Boolean).length;

  if (score < 4) {
    return {
      isValid: false,
      score,
      message: 'Use at least 8 characters, upper and lower case letters, a number, and a special character.',
    };
  }

  return {
    isValid: true,
    score,
    message: 'Strong password.',
  };
};

export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const savePendingVerification = (email: string, code: string) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(VERIFICATION_STORAGE_KEY, JSON.stringify({ email: email.trim().toLowerCase(), code }));
};

export const getPendingVerification = () => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = window.localStorage.getItem(VERIFICATION_STORAGE_KEY);
    return stored ? JSON.parse(stored) as { email: string; code: string } : null;
  } catch {
    return null;
  }
};

export const clearPendingVerification = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(VERIFICATION_STORAGE_KEY);
};

export const saveAuthUser = (user: AuthUser) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
};

export const getStoredAuthUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  } catch {
    return null;
  }
};

export const clearAuthUser = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const signInWithSocialProvider = async (
  provider: SocialProvider,
  role: AuthUser['role'] = 'student'
) => {
  if (typeof window === 'undefined') return null;

  const label = provider === 'google' ? 'Google' : 'Microsoft';
  const defaultEmail = `${role === 'faculty' ? 'faculty' : role === 'admin' ? 'admin' : 'student'}@examai.local`;

  const email = window.prompt(`Enter your ${label} email to continue`, defaultEmail);
  if (!email?.trim()) return null;

  const name = window.prompt('Enter your display name', email.split('@')[0] || 'Student');

  const user: AuthUser = {
    id: `${provider}-${Date.now()}`,
    name: name?.trim() || email.split('@')[0] || 'Student',
    email: email.trim(),
    provider,
    role,
  };

  saveAuthUser(user);
  return user;
};
