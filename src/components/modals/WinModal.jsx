import { useState } from 'react';

const LEVEL_COLORS = {
  A1: 'bg-emerald-500',
  A2: 'bg-green-500',
  B1: 'bg-yellow-500',
  B2: 'bg-orange-500',
  C1: 'bg-red-600',
  C2: 'bg-purple-600',
};

export default function WinModal({ wordData, guesses, tileStates, dayNumber, stats, onClose }) {
  const [copied, setCopied] = useState(false);

  const wordDisplay = wordData.article
    ? `${wordData.article} ${wordData.word.charAt(0).toUpperCase()}${wordData.word.slice(1).toLowerCase()}`
    : wordData.word.charAt(0).toUpperCase() + wordData.word.slice(1).toLowerCase();

  function buildShareText() {
    const emojiMap = { correct: '🟨', present: '🟥', absent: '⬛' };
    const grid = tileStates
      .map(row => row.map(s => emojiMap[s] || '⬛').join(''))
      .join('\n');
    return `Wörtchen #${dayNumber} — ${wordData.level}\n${grid} (${guesses.length}/6)\nwörtchen.de`;
  }

  async function handleShare() {
    const text = buildShareText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert(text);
    }
  }

  const levelColor = LEVEL_COLORS[wordData.level] || 'bg-gray-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div
        className="bg-[#F5F2E8] border border-[#C8C4B8] rounded-xl p-6 max-w-sm w-full text-center space-y-4 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-4xl">🎉</div>
        <h2 className="text-xl font-bold text-[#1a1a1a]">Ausgezeichnet!</h2>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${levelColor}`}>
              {wordData.level}
            </span>
          </div>
          <p className="text-3xl font-bold text-[#1a1a1a]">{wordDisplay}</p>
          <p className="text-[#666] text-base">{wordData.translation}</p>
        </div>

        <div className="bg-white border border-[#C8C4B8] rounded-lg p-3 text-sm text-left space-y-1">
          <p className="text-[#aaa] text-xs uppercase tracking-wider">Beispiel</p>
          <p className="text-[#1a1a1a] italic">{wordData.example}</p>
          <p className="text-[#666]">{wordData.example_en}</p>
        </div>

        {stats && (
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: 'Gespielt', value: stats.played },
              { label: 'Gewonnen', value: Math.round((stats.won / stats.played) * 100) + '%' },
              { label: 'Serie', value: stats.currentStreak },
              { label: 'Bestmarke', value: stats.maxStreak },
            ].map(s => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-[#1a1a1a]">{s.value}</p>
                <p className="text-[#888] text-xs leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleShare}
          className="w-full bg-[#FFCE00] hover:bg-[#f0bf00] text-[#1a1a1a] font-bold py-3 rounded-lg transition-colors"
        >
          {copied ? '✓ Kopiert!' : 'Ergebnis teilen'}
        </button>
      </div>
    </div>
  );
}
