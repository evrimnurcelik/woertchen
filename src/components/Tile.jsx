import { useEffect, useState } from 'react';

const stateClasses = {
  correct: 'bg-[#FFCE00] border-[#FFCE00] text-[#1a1a1a]',
  present: 'bg-[#CC0000] border-[#CC0000] text-white',
  absent: 'bg-[#4a4a4a] border-[#4a4a4a] text-white',
  active: 'bg-white border-[#1a1a1a] text-[#1a1a1a]',
  empty: 'bg-white border-[#C8C4B8] text-[#1a1a1a]',
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
        w-12 h-12 sm:w-14 sm:h-14
        border-2 flex items-center justify-center
        text-xl sm:text-2xl font-bold uppercase select-none
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
