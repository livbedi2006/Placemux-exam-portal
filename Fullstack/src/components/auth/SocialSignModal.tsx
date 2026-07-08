"use client";
import React, { useState, useEffect } from 'react';

interface Props {
  open: boolean;
  provider: 'google' | 'microsoft' | null;
  defaultEmail?: string;
  onConfirm: (data: { email: string; name: string }) => void;
  onCancel: () => void;
}

export default function SocialSignModal({ open, provider, defaultEmail, onConfirm, onCancel }: Props) {
  const [email, setEmail] = useState(defaultEmail || '');
  const [name, setName] = useState('');

  useEffect(() => {
    if (open) {
      setEmail(defaultEmail || '');
      setName('');
    }
  }, [open, defaultEmail]);

  if (!open || !provider) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(2,6,23,0.6)' }} onClick={onCancel} />
      <div style={{ position: 'relative', width: 'min(560px,90%)', background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 10px 30px rgba(2,6,23,0.3)' }}>
        <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>{provider === 'google' ? 'Continue with Google' : 'Continue with Microsoft'}</h3>
        <p style={{ marginTop: 0, marginBottom: '0.75rem', color: 'var(--text-tertiary, #6b7280)' }}>Enter the email and display name to finish social sign-in.</p>

        <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-tertiary, #6b7280)' }}>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #e5e7eb' }} />

          <label style={{ fontSize: '0.85rem', color: 'var(--text-tertiary, #6b7280)' }}>Display name</label>
          <input value={name} onChange={e => setName(e.target.value)} style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ background: 'transparent', border: '1px solid #e5e7eb', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>Cancel</button>
          <button onClick={() => onConfirm({ email: email.trim(), name: name.trim() || (email.split('@')[0] || '') })} style={{ background: 'var(--brand-500, #2563eb)', color: 'white', border: 'none', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>Continue</button>
        </div>
      </div>
    </div>
  );
}
