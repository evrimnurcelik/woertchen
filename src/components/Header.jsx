export default function Header({ onStatsClick, onHelpClick }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-[#3a3a3c] max-w-lg mx-auto w-full">
      <button
        onClick={onHelpClick}
        className="text-[#818384] hover:text-white transition-colors p-1"
        aria-label="Hilfe"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </button>

      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-widest text-white">WÖRTCHEN</h1>
        <p className="text-[#818384] text-xs">Deutsches Tages-Worträtsel</p>
      </div>

      <button
        onClick={onStatsClick}
        className="text-[#818384] hover:text-white transition-colors p-1"
        aria-label="Statistiken"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      </button>
    </header>
  );
}
