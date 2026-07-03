export function getTodaysWord(words, offset = 0) {
  const epoch = new Date('2026-07-03T00:00:00Z');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.floor((today - epoch) / 86400000);
  const index = (((days + offset) % words.length) + words.length) % words.length;
  return { word: words[index], dayNumber: days + 1 };
}

export function getDayNumber() {
  const epoch = new Date('2026-07-03T00:00:00Z');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((today - epoch) / 86400000) + 1;
}

export function seededShuffle(arr, seed) {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  if (a.join('') === arr.join('') && a.length > 1) {
    [a[0], a[1]] = [a[1], a[0]];
  }
  return a;
}
