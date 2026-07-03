export function getTodaysWord(words) {
  const epoch = new Date('2026-07-03T00:00:00Z');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.floor((today - epoch) / 86400000);
  const index = ((days % words.length) + words.length) % words.length;
  return { word: words[index], dayNumber: days + 1 };
}
