'use client';
import { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  BookOpen, 
  FileText, 
  Video, 
  Plus,
  Bell,
  MapPin
} from 'lucide-react';
import { mockScheduleEvents, ScheduleEvent } from '@/lib/db-mock';

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 6)); // July 6, 2026

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Helper to build calendar grid
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const daysArray: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    daysArray.push(i);
  }

  // Get events on a specific day
  const getEventsForDay = (day: number) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return mockScheduleEvents.filter(event => event.date === formattedDate);
  };

  const [selectedDay, setSelectedDay] = useState<number>(6); // July 6 default
  const selectedDayEvents = getEventsForDay(selectedDay);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'exam': return FileText;
      case 'assignment': return BookOpen;
      case 'live-class': return Video;
      default: return Clock;
    }
  };

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, var(--brand-600), var(--accent-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Academic Calendar
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Track classes, practice session reminders, upcoming proctored tests, and homework targets.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => alert('Feature to sync with Google Calendar or add customized event coming soon!')}>
          <Plus size={16} /> Add Study Reminder
        </button>
      </div>

      <div className="dashboard-grid">
        {/* Calendar Grid Box */}
        <div className="col-span-8 card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CalendarIcon size={18} style={{ color: 'var(--brand-600)' }} />
              <span>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
            </h3>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button className="btn btn-secondary btn-icon" onClick={prevMonth} style={{ width: '2rem', height: '2rem' }}>
                <ChevronLeft size={16} />
              </button>
              <button className="btn btn-secondary btn-icon" onClick={nextMonth} style={{ width: '2rem', height: '2rem' }}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center', marginBottom: '1rem' }}>
            {daysOfWeek.map((day, i) => (
              <div key={i} style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', paddingBottom: '0.5rem' }}>
                {day}
              </div>
            ))}

            {daysArray.map((day, index) => {
              if (day === null) {
                return <div key={index} style={{ aspectRatio: '1/1' }} />;
              }

              const dayEvents = getEventsForDay(day);
              const isSelected = selectedDay === day;
              const isToday = day === 6 && month === 6 && year === 2026; // July 6, 2026 is mocked "today"

              return (
                <div
                  key={index}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    aspectRatio: '1/1',
                    border: isSelected ? '2px solid var(--brand-500)' : '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.25rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: isToday ? 'rgba(59, 130, 246, 0.08)' : isSelected ? 'var(--bg-surface)' : 'var(--bg-base)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ 
                    fontSize: '0.8125rem', 
                    fontWeight: isToday || isSelected ? 800 : 'normal',
                    color: isToday ? 'var(--brand-600)' : 'inherit'
                  }}>
                    {day}
                  </span>
                  
                  {/* Event Dots */}
                  <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', justifyContent: 'center', paddingBottom: '2px' }}>
                    {dayEvents.slice(0, 3).map((event, i) => (
                      <div 
                        key={i} 
                        style={{ 
                          width: '5px', 
                          height: '5px', 
                          borderRadius: '50%', 
                          background: event.color 
                        }} 
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.75rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-default)', paddingTop: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} />
              <span>Exam Tests</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }} />
              <span>Self Study</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
              <span>Assignments</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
              <span>Live Classes</span>
            </div>
          </div>
        </div>

        {/* Selected Day Agenda Side panel */}
        <div className="col-span-4 card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>
            Agenda: July {selectedDay}, 2026
          </h3>

          {selectedDayEvents.length === 0 ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <Clock size={32} style={{ margin: '0 auto 0.75rem auto', strokeWidth: 1.5 }} />
              <p style={{ fontSize: '0.875rem' }}>No events scheduled for this date.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {selectedDayEvents.map((event) => {
                const Icon = getEventIcon(event.type);
                return (
                  <div 
                    key={event.id}
                    style={{ 
                      padding: '1rem', 
                      borderRadius: 'var(--radius-lg)', 
                      borderLeft: `4px solid ${event.color}`,
                      background: 'var(--bg-subtle)',
                      display: 'flex',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ color: event.color, marginTop: '2px' }}><Icon size={16} /></div>
                    <div style={{ flex: 1 }}>
                      <span className="badge badge-gray" style={{ fontSize: '0.6875rem', marginBottom: '0.25rem' }}>
                        {event.subject}
                      </span>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>{event.title}</h4>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Clock size={12} />
                          <span>{event.time} ({event.duration}m)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
