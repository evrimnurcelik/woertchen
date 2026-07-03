import { loadStats } from '../../utils/storage';

export default function StatsModal({ onClose }) {
  const stats = loadStats();
  const winPct = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;
  const maxDist = Math.max(...Object.values(stats.distribution), 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div
        className="bg-[#F5F2E8] border border-[#C8C4B8] rounded-xl p-6 max-w-sm w-full space-y-5 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1a1a1a] uppercase tracking-wider">Statistiken</h2>
          <button onClick={onClose} className="text-[#888] hover:text-[#1a1a1a]">✕</button>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { label: 'Gespielt', value: stats.played },
            { label: 'Gewonnen %', value: winPct },
            { label: 'Serie', value: stats.currentStreak },
            { label: 'Bestmarke', value: stats.maxStreak },
          ].map(s => (
            <div key={s.label}>
              <p className="text-2xl font-bold text-[#1a1a1a]">{s.value}</p>
              <p className="text-[#888] text-xs leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        <div>
          <p className="text-[#888] text-xs uppercase tracking-wider mb-2">Rateverteilung</p>
          <div className="space-y-1">
            {[1, 2, 3, 4, 5, 6].map(n => {
              const count = stats.distribution[n] || 0;
              const width = Math.max(Math.round((count / maxDist) * 100), count > 0 ? 8 : 0);
              return (
                <div key={n} className="flex items-center gap-2 text-sm">
                  <span className="text-[#666] w-3 text-right">{n}</span>
                  <div className="flex-1">
                    <div
                      className={`h-5 flex items-center justify-end pr-2 text-xs font-bold rounded transition-all ${
                        count > 0 ? 'bg-[#FFCE00] text-[#1a1a1a]' : 'bg-[#E0DDD5] text-[#888]'
                      }`}
                      style={{ width: `${Math.max(width, 5)}%` }}
                    >
                      {count}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
