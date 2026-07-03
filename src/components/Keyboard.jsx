const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P', 'Ü'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ö', 'Ä'],
  ['ENTER', 'Y', 'X', 'C', 'V', 'B', 'N', 'M', 'ß', '⌫'],
];

const keyColorClass = {
  correct: 'bg-correct text-white border-correct',
  present: 'bg-present text-white border-present',
  absent: 'bg-[#3a3a3c] text-white border-[#3a3a3c]',
};

export default function Keyboard({ onLetter, onDelete, onEnter, keyboardColors }) {
  return (
    <div className="flex flex-col gap-1.5 items-center w-full max-w-[500px] mx-auto px-1 pb-4">
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-1.5 w-full justify-center">
          {row.map((key) => {
            const color = keyboardColors[key];
            const colorClass = color ? keyColorClass[color] : 'bg-[#818384] text-white border-[#818384]';
            const isWide = key === 'ENTER' || key === '⌫';

            return (
              <button
                key={key}
                onClick={() => {
                  if (key === '⌫') onDelete();
                  else if (key === 'ENTER') onEnter();
                  else onLetter(key);
                }}
                className={`
                  ${isWide ? 'px-1.5 text-xs min-w-[40px]' : 'w-8 sm:w-9'}
                  h-12 sm:h-14 rounded font-bold uppercase border
                  flex items-center justify-center
                  active:brightness-75 transition-colors
                  select-none touch-manipulation
                  ${colorClass}
                `}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
