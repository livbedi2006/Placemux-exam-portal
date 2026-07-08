export interface StreakRecord {
  currentStreak: number;
  longestStreak: number;
  lastSolvedDate: string | null; // YYYY-MM-DD in local timezone
  totalDaysActive: number;
}

const KEY_PREFIX = 'streak-';

const thresholds = [7, 30, 50, 100];

const localDateStr = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const parseLocalDate = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const getStreak = (userId: string): StreakRecord => {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + userId);
    if (raw) return JSON.parse(raw) as StreakRecord;
  } catch (e) {
    // ignore
  }
  const init: StreakRecord = { currentStreak: 0, longestStreak: 0, lastSolvedDate: null, totalDaysActive: 0 };
  return init;
};

export const saveStreak = (userId: string, rec: StreakRecord) => {
  try {
    localStorage.setItem(KEY_PREFIX + userId, JSON.stringify(rec));
    window.dispatchEvent(new CustomEvent('streak:changed', { detail: { userId, streak: rec } }));
  } catch (e) {
    // ignore
  }
};

export const updateStreakOnActivity = (userId: string) => {
  if (!userId) return { updated: false };
  const today = localDateStr();
  const rec = getStreak(userId);

  if (rec.lastSolvedDate === today) {
    return { updated: false, streak: rec };
  }

  let newCurrent = 1;
  if (rec.lastSolvedDate) {
    const last = parseLocalDate(rec.lastSolvedDate);
    const td = parseLocalDate(today);
    const diff = Math.floor((td.getTime() - last.getTime()) / (24 * 60 * 60 * 1000));
    if (diff === 1) {
      newCurrent = rec.currentStreak + 1;
    } else {
      // missed one or more days -> reset
      newCurrent = 1;
    }
  }

  rec.currentStreak = newCurrent;
  if (rec.currentStreak > rec.longestStreak) rec.longestStreak = rec.currentStreak;
  rec.lastSolvedDate = today;
  rec.totalDaysActive = (rec.totalDaysActive || 0) + 1;

  saveStreak(userId, rec);

  const badges: number[] = [];
  if (thresholds.includes(rec.currentStreak)) badges.push(rec.currentStreak);

  return { updated: true, streak: rec, badges };
};

export const formatLastActive = (lastSolvedDate: string | null) => {
  if (!lastSolvedDate) return 'Never';
  const today = parseLocalDate(localDateStr());
  const last = parseLocalDate(lastSolvedDate);
  const diff = Math.floor((today.getTime() - last.getTime()) / (24 * 60 * 60 * 1000));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return `${diff} days ago`;
};

export default { getStreak, updateStreakOnActivity, saveStreak, formatLastActive };
