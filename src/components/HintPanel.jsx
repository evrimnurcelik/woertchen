const LEVEL_COLORS = {
  A1: 'bg-emerald-600',
  A2: 'bg-green-500',
  B1: 'bg-yellow-500',
  B2: 'bg-orange-500',
  C1: 'bg-red-500',
  C2: 'bg-purple-600',
};

export default function HintPanel({ wordData, hintsUnlocked, guessCount }) {
  if (guessCount === 0) return null;

  const visibleHints = wordData.hints.slice(0, hintsUnlocked + 1);
  const levelColor = LEVEL_COLORS[wordData.level] || 'bg-gray-500';

  return (
    <div className="mx-auto w-full max-w-sm px-4 mb-2">
      <div className="bg-[#1a1a1b] border border-[#3a3a3c] rounded-lg p-3 space-y-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${levelColor}`}>
            {wordData.level}
          </span>
          <span className="text-[#818384] text-xs uppercase tracking-wider">Hinweise</span>
        </div>
        {visibleHints.map((hint, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 text-sm transition-opacity duration-500 ${
              i === visibleHints.length - 1 ? 'text-white animate-pulse' : 'text-[#9ca3af]'
            }`}
          >
            <span className="text-[#565758] font-mono text-xs mt-0.5">{i + 1}.</span>
            <span>{hint}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
