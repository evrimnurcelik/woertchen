export default function Header({ onStatsClick, onHelpClick }) {
  return (
    <header className="bg-cream border-b border-[#C8C4B8]">
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto w-full">
        <button
          onClick={onHelpClick}
          className="text-[#888] hover:text-[#1a1a1a] transition-colors p-1"
          aria-label="Hilfe"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </button>

        <div className="text-center">
          <h1 className="text-2xl font-black tracking-[0.15em] text-[#1a1a1a] leading-none">
            WÖRTCHEN
          </h1>
          <p className="text-[#888] text-[10px] tracking-widest uppercase mt-0.5">
            Deutsches Tages-Worträtsel
          </p>
        </div>

        <button
          onClick={onStatsClick}
          className="text-[#888] hover:text-[#1a1a1a] transition-colors p-1"
          aria-label="Statistiken"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
        </button>
      </div>

      {/* German flag stripe */}
      <div className="flex h-[5px]">
        <div className="flex-1 bg-[#1a1a1a]" />
        <div className="flex-1 bg-[#CC0000]" />
        <div className="flex-1 bg-[#FFCE00]" />
      </div>
    </header>
  );
}
