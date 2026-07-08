'use client';
import { Bell, Search, Menu, Sun, Moon, Settings, Zap } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import styles from './TopNav.module.css';

interface Props {
  onMenuClick: () => void;
  pageTitle?: string;
}

export function TopNav({ onMenuClick, pageTitle = 'Dashboard' }: Props) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.topnav}>
      <button className={styles.menuBtn} onClick={onMenuClick}>
        <Menu size={18} />
      </button>

      <span className={styles.pageTitle}>{pageTitle}</span>

      <div className={styles.searchWrap}>
        <Search size={16} className={styles.searchIcon} />
        <input
          id="topnav-search"
          type="text"
          className={styles.searchInput}
          placeholder="Search exams, topics, courses..."
        />
      </div>

      <div className={styles.spacer} />

      <div className={styles.actions}>
        {/* AI Quick Action */}
        <button className={`${styles.iconBtn} btn btn-primary btn-sm`} style={{ width: 'auto', padding: '0 0.75rem', gap: '0.375rem', fontSize: '0.75rem', borderRadius: '0.5rem' }} title="AI Assistant">
          <Zap size={13} />
          <span style={{ display: 'none' }}>AI</span>
        </button>

        <div className={styles.divider} />

        <button className={styles.themeBtn} onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button className={styles.iconBtn} id="topnav-notifications" title="Notifications">
          <Bell size={16} />
          <span className={styles.notifBadge}>7</span>
        </button>

        <button className={styles.iconBtn} title="Settings">
          <Settings size={16} />
        </button>

        <div className={styles.divider} />

        <div className={styles.avatar} title="Profile">AS</div>
      </div>
    </div>
  );
}
