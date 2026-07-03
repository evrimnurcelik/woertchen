export default function HelpModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={onClose}>
      <div
        className="bg-[#121213] border border-[#3a3a3c] rounded-xl p-6 max-w-sm w-full space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">Wie spielt man?</h2>
          <button onClick={onClose} className="text-[#818384] hover:text-white">✕</button>
        </div>

        <p className="text-[#9ca3af] text-sm">
          Errate das deutsche Wort in <strong className="text-white">6 Versuchen</strong>. Nach jedem falschen Versuch wird ein neuer Übersetzungshinweis freigeschaltet.
        </p>

        <div className="space-y-3">
          <p className="text-[#818384] text-xs uppercase tracking-wider">Farben der Buchstaben</p>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-correct border-2 border-correct flex items-center justify-center text-white font-bold text-lg rounded">W</div>
            <p className="text-[#9ca3af] text-sm">Richtiger Buchstabe, richtige Position</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-present border-2 border-present flex items-center justify-center text-white font-bold text-lg rounded">O</div>
            <p className="text-[#9ca3af] text-sm">Buchstabe im Wort, falsche Position</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-absent border-2 border-absent flex items-center justify-center text-white font-bold text-lg rounded">R</div>
            <p className="text-[#9ca3af] text-sm">Buchstabe nicht im Wort</p>
          </div>
        </div>

        <div className="bg-[#1a1a1b] rounded-lg p-3 text-sm space-y-1">
          <p className="text-[#565758] text-xs uppercase tracking-wider">Hinweis-System</p>
          <p className="text-[#9ca3af]">Nach jedem falschen Versuch wird ein weiterer Hinweis zur englischen Übersetzung enthüllt — von der Wortart bis zur vollständigen Übersetzung.</p>
        </div>

        <p className="text-[#565758] text-xs text-center">Jeden Tag ein neues Wort · Alle Niveaus A1–C2</p>

        <button
          onClick={onClose}
          className="w-full bg-correct hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors"
        >
          Los geht's!
        </button>
      </div>
    </div>
  );
}
