import { useEffect, useState } from 'react';

const stateClasses = {
  correct: 'bg-correct border-correct text-white',
  present: 'bg-present border-present text-white',
  absent: 'bg-absent border-absent text-white',
  active: 'bg-transparent border-[#565758] text-white',
  empty: 'bg-transparent border-[#3a3a3c] text-white',
};

export default function Tile({ letter, state, delay = 0 }) {
  const [revealed, setRevealed] = useState(false);
  const [popping, setPopping] = useState(false);

  useEffect(() => {
    if (state && state !== 'empty' && state !== 'active') {
      const t = setTimeout(() => setRevealed(true), delay);
      return () => clearTimeout(t);
    } else {
      setRevealed(false);
    }
  }, [state, delay]);

  useEffect(() => {
    if (letter) {
      setPopping(true);
      const t = setTimeout(() => setPopping(false), 100);
      return () => clearTimeout(t);
    }
  }, [letter]);

  const colorClass = revealed
    ? stateClasses[state] || stateClasses.empty
    : letter
    ? stateClasses.active
    : stateClasses.empty;

  return (
    <div
      className={`
        w-14 h-14 sm:w-16 sm:h-16
        border-2 flex items-center justify-center
        text-2xl sm:text-3xl font-bold uppercase select-none
        transition-all duration-100
        ${colorClass}
        ${revealed ? 'tile-flip' : ''}
        ${popping ? 'tile-pop' : ''}
      `}
      style={{ transitionDelay: revealed ? `${delay}ms` : '0ms' }}
    >
      {letter}
    </div>
  );
}
