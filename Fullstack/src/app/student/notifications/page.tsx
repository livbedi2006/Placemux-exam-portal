'use client';
import { useState } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Trophy, 
  FileText, 
  Check, 
  Trash2, 
  Sparkles,
  ShieldCheck,
  UserX
} from 'lucide-react';
import { mockNotifications, AppNotification } from '@/lib/db-mock';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'exam' | 'result' | 'announcement' | 'achievement' | 'system'>('all');

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => filter === 'all' || n.type === filter);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'exam': return FileText;
      case 'result': return Trophy;
      case 'announcement': return Info;
      case 'achievement': return Sparkles;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'exam': return 'var(--brand-500)';
      case 'result': return 'var(--accent-emerald)';
      case 'announcement': return 'var(--accent-amber)';
      case 'achievement': return 'var(--accent-purple)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '3rem', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, var(--brand-600), var(--accent-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={28} style={{ color: 'var(--brand-600)' }} />
            <span>Notification Center</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            You have {unreadCount} unread alert{unreadCount !== 1 && 's'} in your backlog.
          </p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={handleMarkAllRead}>
            <Check size={14} style={{ marginRight: '4px' }} /> Mark All Read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '0.75rem 1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.25rem', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {(['all', 'exam', 'result', 'announcement', 'achievement', 'system'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`btn btn-sm ${filter === tab ? 'btn-primary' : 'btn-ghost'}`}
            style={{ textTransform: 'capitalize' }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      {filteredNotifications.length === 0 ? (
        <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', borderStyle: 'dashed' }}>
          <Bell size={48} style={{ color: 'var(--text-tertiary)', margin: '0 auto 1rem auto', strokeWidth: 1.5 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Inbox is clean</h3>
          <p style={{ color: 'var(--text-secondary)' }}>You don't have any notifications under this filter category.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredNotifications.map((notif) => {
            const Icon = getNotificationIcon(notif.type);
            const iconColor = getNotificationColor(notif.type);
            
            return (
              <div 
                key={notif.id}
                className="card"
                style={{ 
                  padding: '1.25rem',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                  background: notif.read ? 'var(--bg-surface)' : 'rgba(59, 130, 246, 0.04)',
                  borderLeft: notif.read ? '1px solid var(--border-default)' : `4px solid ${iconColor}`,
                  transition: 'background var(--transition-fast)'
                }}
              >
                {/* Icon Container */}
                <div style={{ 
                  width: '2.5rem', 
                  height: '2.5rem', 
                  borderRadius: 'var(--radius-lg)', 
                  background: 'var(--bg-subtle)',
                  color: iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={18} />
                </div>

                {/* Text Body */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.25rem' }}>
                    <h4 style={{ 
                      fontSize: '0.9375rem', 
                      fontWeight: notif.read ? 600 : 800,
                      color: 'var(--text-primary)'
                    }}>
                      {notif.title}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                      {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {notif.description}
                  </p>

                  {/* Actions row */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem', borderTop: '1px solid var(--border-default)', paddingTop: '0.5rem' }}>
                    {!notif.read && (
                      <button 
                        className="btn btn-ghost btn-sm" 
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--brand-600)' }}
                        onClick={() => handleMarkAsRead(notif.id)}
                      >
                        <Check size={12} style={{ marginRight: '2px' }} /> Mark read
                      </button>
                    )}
                    <button 
                      className="btn btn-ghost btn-sm text-red-500" 
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--error)' }}
                      onClick={() => handleDelete(notif.id)}
                    >
                      <Trash2 size={12} style={{ marginRight: '2px' }} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
