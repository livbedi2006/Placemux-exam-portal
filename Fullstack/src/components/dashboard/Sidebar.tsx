'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, FileText, Brain, Trophy, BarChart2,
  Calendar, MessageSquare, Settings, Bell, Users,
  Zap, Target, Award, ChevronLeft, ChevronRight, LogOut
} from 'lucide-react';
import styles from './Sidebar.module.css';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string | number;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navSections: Record<'student' | 'faculty' | 'admin', NavSection[]> = {
  student: [
    {
      label: 'Main',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard',    href: '/student' },
        { icon: BookOpen,        label: 'Study',        href: '/student/study' },
        { icon: FileText,        label: 'Exams',        href: '/student/exams', badge: 3 },
        { icon: Brain,           label: 'AI Recommendations', href: '/student/recommendations' },
        { icon: Target,          label: 'Practice',     href: '/student/practice' },
      ],
    },
    {
      label: 'Progress',
      items: [
        { icon: BarChart2,  label: 'Analytics',    href: '/student/analytics' },
        { icon: Trophy,     label: 'Leaderboard',  href: '/student/leaderboard' },
        { icon: Award,      label: 'Achievements', href: '/student/achievements' },
        { icon: Calendar,   label: 'Schedule',     href: '/student/schedule' },
      ],
    },
    {
      label: 'Community',
      items: [
        { icon: MessageSquare, label: 'Discussion',    href: '/student/discussion' },
        { icon: Bell,          label: 'Notifications', href: '/student/notifications', badge: 7 },
      ],
    },
    {
      label: 'Account',
      items: [
        { icon: Settings, label: 'Settings', href: '/student/settings' },
      ],
    },
  ],
  faculty: [
    {
      label: 'Main',
      items: [
        { icon: LayoutDashboard, label: 'Overview', href: '/faculty' },
        { icon: BookOpen, label: 'Subjects', href: '/faculty/subjects' },
        { icon: Target, label: 'Question Bank', href: '/faculty/questions' },
        { icon: FileText, label: 'Exams', href: '/faculty/exams' },
        { icon: Users, label: 'Students', href: '/faculty/students' },
      ]
    },
    {
      label: 'Management',
      items: [
        { icon: BarChart2, label: 'Analytics', href: '/faculty/analytics' },
        { icon: Settings, label: 'Settings', href: '/faculty/settings' },
      ]
    }
  ],
  admin: [
    {
      label: 'Admin Panel',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
        { icon: Users, label: 'Users', href: '/admin/users' },
        { icon: Target, label: 'System Logs', href: '/admin/logs' },
        { icon: BarChart2, label: 'Analytics', href: '/admin/analytics' },
        { icon: Settings, label: 'Settings', href: '/admin/settings' },
      ]
    }
  ]
};

interface SidebarProps {
  role?: 'student' | 'faculty' | 'admin';
  collapsed: boolean;
  onToggle: () => void;
  onClose?: () => void;
  showOverlay?: boolean;
}

export function Sidebar({ role = 'student', collapsed, onToggle, onClose, showOverlay }: SidebarProps) {
  const pathname = usePathname();
  const currentNav = navSections[role];

  return (
    <>
      {showOverlay && <div className={styles.overlay} onClick={onClose} />}
      <div className={styles.sidebar}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}>E</div>
          {!collapsed && (
            <div>
              <div className={styles.logoText}>ExamAI Pro</div>
              <div className={styles.logoSub}>{role === 'admin' ? 'Admin Panel' : role === 'faculty' ? 'Faculty Portal' : 'Student Portal'}</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className={styles.nav}>
          {currentNav.map(section => (
            <div key={section.label} className={styles.section}>
              {!collapsed && <div className={styles.sectionLabel}>{section.label}</div>}
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== `/${role}` && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={18} className={styles.navIcon} />
                    {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className={styles.navBadge}>{item.badge}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Footer */}
        <div className={styles.footer}>
          <div className={styles.userCard}>
            <div className={styles.avatarFallback}>{role === 'admin' ? 'AD' : role === 'faculty' ? 'FA' : 'AS'}</div>
            {!collapsed && (
              <div className={styles.userInfo}>
                <div className={styles.userName}>{role === 'admin' ? 'System Admin' : role === 'faculty' ? 'Dr. Faculty' : 'Alex Smith'}</div>
                <div className={styles.userRole}>{role === 'admin' ? 'Super Admin' : role === 'faculty' ? 'Computer Science' : 'Student • CS Dept'}</div>
              </div>
            )}
            {!collapsed && (
              <button className="btn btn-ghost btn-icon" title="Logout">
                <LogOut size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Collapse toggle */}
        <button className={styles.collapseBtn} onClick={onToggle}>
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>
    </>
  );
}
