import styles from './SkeletonLoader.module.css';

interface Props { width?: string; height?: string; borderRadius?: string; className?: string; }

export function Skeleton({ width = '100%', height = '1rem', borderRadius = '0.5rem', className = '' }: Props) {
  return <div className={`skeleton ${styles.skeleton} ${className}`} style={{ width, height, borderRadius }} />;
}

export function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <Skeleton width="2.5rem" height="2.5rem" borderRadius="50%" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <Skeleton width="60%" height="0.875rem" />
          <Skeleton width="40%" height="0.75rem" />
        </div>
      </div>
      <Skeleton height="0.75rem" />
      <Skeleton height="0.75rem" width="80%" />
      <Skeleton height="0.75rem" width="60%" />
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className={styles.statCard}>
      <Skeleton width="3rem" height="3rem" borderRadius="0.75rem" />
      <Skeleton width="40%" height="1.5rem" />
      <Skeleton width="70%" height="0.875rem" />
    </div>
  );
}
