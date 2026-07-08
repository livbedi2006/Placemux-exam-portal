'use client';
import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopNav } from '@/components/dashboard/TopNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const collapsedClass = collapsed && !isMobile ? 'sidebar-collapsed' : '';
  const sidebarOpenClass = sidebarOpen && isMobile ? 'sidebar-open' : '';

  return (
    <div className={`dashboard-layout ${collapsedClass} ${sidebarOpenClass}`}>
      <div className="dashboard-sidebar">
        <Sidebar
          role="admin"
          collapsed={collapsed && !isMobile}
          onToggle={() => isMobile ? setSidebarOpen(false) : setCollapsed(c => !c)}
          onClose={() => setSidebarOpen(false)}
          showOverlay={sidebarOpen && isMobile}
        />
      </div>
      <div className="dashboard-main">
        <div className="dashboard-topnav">
          <TopNav
            onMenuClick={() => isMobile ? setSidebarOpen(o => !o) : setCollapsed(c => !c)}
          />
        </div>
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}
