export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-base)',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 60% at 20% 30%, rgba(37,99,235,0.1) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 70%, rgba(139,92,246,0.1) 0%, transparent 60%)',
        pointerEvents: 'none'
      }} />
      <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
        {children}
      </div>
    </div>
  );
}
