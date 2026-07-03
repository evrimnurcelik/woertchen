const KEY = 'woertchen_stats';

const defaultStats = {
  played: 0,
  won: 0,
  currentStreak: 0,
  maxStreak: 0,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
  lastPlayedDay: null,
};

export function loadStats() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaultStats, ...JSON.parse(raw) } : { ...defaultStats };
  } catch {
    return { ...defaultStats };
  }
}

export function saveResult(guessCount, dayNumber) {
  const stats = loadStats();
  const won = guessCount > 0;

  stats.played += 1;
  if (won) {
    stats.won += 1;
    stats.distribution[guessCount] = (stats.distribution[guessCount] || 0) + 1;
    stats.currentStreak = stats.lastPlayedDay === dayNumber - 1
      ? stats.currentStreak + 1
      : 1;
    if (stats.currentStreak > stats.maxStreak) stats.maxStreak = stats.currentStreak;
  } else {
    stats.currentStreak = 0;
  }
  stats.lastPlayedDay = dayNumber;

  localStorage.setItem(KEY, JSON.stringify(stats));
  return stats;
}

export function loadTodayState(dayNumber) {
  try {
    const raw = localStorage.getItem(`woertchen_day_${dayNumber}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveTodayState(dayNumber, state) {
  localStorage.setItem(`woertchen_day_${dayNumber}`, JSON.stringify(state));
}
