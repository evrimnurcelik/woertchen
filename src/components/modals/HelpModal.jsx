export default function HelpModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div
        className="bg-[#F5F2E8] border border-[#C8C4B8] rounded-xl p-6 max-w-sm w-full space-y-4 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1a1a1a] uppercase tracking-wider">Wie spielt man?</h2>
          <button onClick={onClose} className="text-[#888] hover:text-[#1a1a1a]">✕</button>
        </div>

        <p className="text-[#555] text-sm">
          Errate das deutsche Wort in <strong className="text-[#1a1a1a]">6 Versuchen</strong>. Nach jedem falschen Versuch wird ein neuer Übersetzungshinweis freigeschaltet.
        </p>

        <div className="space-y-3">
          <p className="text-[#888] text-xs uppercase tracking-wider">Farben der Buchstaben</p>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFCE00] border-2 border-[#FFCE00] flex items-center justify-center text-[#1a1a1a] font-bold text-lg rounded">W</div>
            <p className="text-[#555] text-sm">Richtiger Buchstabe, richtige Position</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#CC0000] border-2 border-[#CC0000] flex items-center justify-center text-white font-bold text-lg rounded">O</div>
            <p className="text-[#555] text-sm">Buchstabe im Wort, falsche Position</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#4a4a4a] border-2 border-[#4a4a4a] flex items-center justify-center text-white font-bold text-lg rounded">R</div>
            <p className="text-[#555] text-sm">Buchstabe nicht im Wort</p>
          </div>
        </div>

        <div className="bg-white border border-[#C8C4B8] rounded-lg p-3 text-sm space-y-1">
          <p className="text-[#aaa] text-xs uppercase tracking-wider">Hinweis-System</p>
          <p className="text-[#555]">Nach jedem falschen Versuch wird ein weiterer Hinweis zur englischen Übersetzung enthüllt — von der Wortart bis zur vollständigen Übersetzung.</p>
        </div>

        <p className="text-[#aaa] text-xs text-center">Jeden Tag ein neues Wort · Alle Niveaus A1–C2</p>

        <button
          onClick={onClose}
          className="w-full bg-[#FFCE00] hover:bg-[#f0bf00] text-[#1a1a1a] font-bold py-3 rounded-lg transition-colors"
        >
          Los geht's!
        </button>
      </div>
    </div>
  );
}
