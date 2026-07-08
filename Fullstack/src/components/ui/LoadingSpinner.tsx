import styles from './LoadingSpinner.module.css';

interface Props { size?: number; color?: string; }

export function LoadingSpinner({ size = 32, color = 'var(--brand-500)' }: Props) {
  return (
    <div className={styles.wrapper} style={{ width: size, height: size }}>
      <svg viewBox="0 0 50 50" style={{ width: size, height: size }}>
        <circle cx="25" cy="25" r="20" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeDasharray="100 55" className={styles.spinner} />
      </svg>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className={styles.pageLoader}>
      <div className={styles.logoWrap}>
        <div className={styles.logoGlow} />
        <span className={styles.logoText}>ExamAI Pro</span>
      </div>
      <LoadingSpinner size={40} />
    </div>
  );
}
