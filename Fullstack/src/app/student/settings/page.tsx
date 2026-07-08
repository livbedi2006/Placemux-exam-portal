"use client";
import { useState, useEffect } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Key, 
  Mail, 
  Phone, 
  Camera, 
  Save, 
  Moon, 
  Sun, 
  Trash2,
  Lock,
  Globe,
  Monitor,
  Check
} from 'lucide-react';
import useAuthUser from '@/lib/useAuth';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile');
  
  // Profile state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [dept, setDept] = useState('N/A');
  
  // load from auth
  const authUser = useAuthUser();

  useEffect(() => {
    if (authUser) {
      setName(authUser.name || '');
      setEmail(authUser.email || '');
      setDept((authUser as any).department || 'N/A');
    }
  }, [authUser]);

  const initials = (() => {
    const n = authUser?.name?.trim();
    if (n) return n.split(' ').map((p: string) => p[0]).slice(0,2).join('').toUpperCase();
    if (authUser?.email) return authUser.email[0].toUpperCase();
    return 'ST';
  })();

  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState(false);

  // Preference state
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [examReminders, setExamReminders] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '3rem', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, var(--brand-600), var(--accent-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Portal Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
          Customize your profile, configure push notifications, and manage security options.
        </p>
      </div>

      {/* Tabs Row */}
      <div className="card" style={{ padding: '0.5rem', marginBottom: '1.5rem', display: 'flex', gap: '0.25rem' }}>
        <button className={`btn btn-sm ${activeTab === 'profile' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('profile')} style={{ flex: 1 }}>
          <User size={14} style={{ marginRight: '6px' }} /> Profile Info
        </button>
        <button className={`btn btn-sm ${activeTab === 'security' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('security')} style={{ flex: 1 }}>
          <Shield size={14} style={{ marginRight: '6px' }} /> Security & Access
        </button>
        <button className={`btn btn-sm ${activeTab === 'preferences' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('preferences')} style={{ flex: 1 }}>
          <Palette size={14} style={{ marginRight: '6px' }} /> Preferences
        </button>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Profile Information</h3>
            
            {/* Avatar Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '0.5rem' }}>
              <div style={{ 
                width: '5rem', 
                height: '5rem', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, var(--brand-600), var(--accent-purple))', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 800,
                boxShadow: 'var(--shadow-md)',
                position: 'relative'
              }}>
                {initials}
                <button 
                  type="button"
                  style={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    right: 0, 
                    background: 'var(--bg-surface)', 
                    border: '1px solid var(--border-default)', 
                    borderRadius: '50%', 
                    padding: '0.375rem',
                    color: 'var(--text-secondary)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  onClick={() => alert('Camera/file dialog placeholder')}
                >
                  <Camera size={14} />
                </button>
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Your Avatar Profile</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>
            </div>

            {/* Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>Full Name</label>
                <input type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>Academic Department</label>
                <select className="input" value={dept} onChange={(e) => setDept(e.target.value)}>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>Primary Email Address</label>
              <div className="input-group">
                <Mail className="input-icon" size={16} />
                <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>Mobile Phone</label>
              <div className="input-group">
                <Phone className="input-icon" size={16} />
                <input type="text" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>Biographical Description</label>
              <textarea className="input" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} style={{ resize: 'vertical' }} />
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Change Account Password</h3>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>Current Password</label>
              <input type="password" className="input" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>New Password</label>
                <input type="password" className="input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>Confirm New Password</label>
                <input type="password" className="input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-default)', margin: '0.5rem 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Two-Factor Authentication (2FA)</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
                  Secure your exam session log with mobile OTP verification.
                </p>
              </div>
              <button 
                type="button" 
                className={`btn btn-sm ${twoFactor ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setTwoFactor(!twoFactor)}
              >
                {twoFactor ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-default)', margin: '0.5rem 0' }} />

            <div>
              <h4 style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.75rem' }}>Active Proctored Sessions</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <span>Chrome PC - Windows 11 (Current session)</span>
                  <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>Active</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <span>Safari Mobile - iPhone 15 Pro</span>
                  <span>Logged out 2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>User Interface Customization</h3>

            {/* Theme row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Appearance theme</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
                  Switch between standard light and fluid high-contrast dark modes.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  type="button"
                  className={`btn btn-sm ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleThemeChange('light')}
                >
                  <Sun size={14} style={{ marginRight: '4px' }} /> Light
                </button>
                <button 
                  type="button"
                  className={`btn btn-sm ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleThemeChange('dark')}
                >
                  <Moon size={14} style={{ marginRight: '4px' }} /> Dark
                </button>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-default)', margin: '0.5rem 0' }} />

            {/* Notifications Preferences */}
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.75rem' }}>Communication channels</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input type="checkbox" checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} style={{ width: '1rem', height: '1rem' }} />
                  <span>Email notifications for published results</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input type="checkbox" checked={pushNotifs} onChange={(e) => setPushNotifs(e.target.checked)} style={{ width: '1rem', height: '1rem' }} />
                  <span>Push notifications for live exams activation</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input type="checkbox" checked={examReminders} onChange={(e) => setExamReminders(e.target.checked)} style={{ width: '1rem', height: '1rem' }} />
                  <span>Send hourly SMS reminder before proctored tests</span>
                </label>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-default)', margin: '0.5rem 0' }} />

            {/* Danger Zone */}
            <div style={{ padding: '1rem', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.03)', borderRadius: 'var(--radius-lg)' }}>
              <h4 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--error)', marginBottom: '0.25rem' }}>Danger Zone</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Irreversible account administrative actions.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => alert('Preparing SQL export of your answers and metrics data...')}>Export My Data</button>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => alert('Account deletion request requires faculty advisor authentication.')}>
                  <Trash2 size={12} style={{ marginRight: '4px' }} /> Delete Portal Access
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Submit Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button type="submit" className="btn btn-primary" style={{ minWidth: '150px' }}>
            <Save size={16} /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
