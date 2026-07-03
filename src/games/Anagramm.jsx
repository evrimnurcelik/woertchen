import { useState, useEffect, useCallback } from 'react';
import words from '../data/words.json';
import { getTodaysWord, seededShuffle, getDayNumber } from '../utils/wordSelector';
import { loadTodayState, saveTodayState } from '../utils/storage';

const LEVEL_COLORS = {
  A1: 'bg-emerald-500', A2: 'bg-green-500', B1: 'bg-yellow-500',
  B2: 'bg-orange-500', C1: 'bg-red-600', C2: 'bg-purple-600',
};

const OFFSET = Math.floor(words.length / 2);
const STORAGE_KEY_PREFIX = 'anagramm_day_';

export default function Anagramm() {
  const { word: wordData, dayNumber } = getTodaysWord(words, OFFSET);
  const answer = wordData.word.toUpperCase();
  const letters = answer.split('');

  const [tiles, setTiles] = useState(() => {
    const shuffled = seededShuffle(letters, dayNumber * 31337);
    return shuffled.map((letter, i) => ({ id: i, letter, placed: false }));
  });
  const [placed, setPlaced] = useState(Array(letters.length).fill(null));
  const [gameStatus, setGameStatus] = useState('playing');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [message, setMessage] = useState('');
  const [shake, setShake] = useState(false);

  // Restore saved state
  useEffect(() => {
    const saved = loadTodayState(STORAGE_KEY_PREFIX + dayNumber);
    if (saved) {
      setTiles(saved.tiles);
      setPlaced(saved.placed);
      setGameStatus(saved.gameStatus);
      setHintsUsed(saved.hintsUsed);
    }
  }, [dayNumber]);

  const persist = useCallback((t, p, status, hints) => {
    saveTodayState(STORAGE_KEY_PREFIX + dayNumber, { tiles: t, placed: p, gameStatus: status, hintsUsed: hints });
  }, [dayNumber]);

  const showMessage = useCallback((msg, duration = 2000) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), duration);
  }, []);

  function handleScrambledClick(tileId) {
    if (gameStatus !== 'playing') return;
    const nextSlot = placed.findIndex(p => p === null);
    if (nextSlot === -1) return;
    const newTiles = tiles.map(t => t.id === tileId ? { ...t, placed: true } : t);
    const newPlaced = [...placed];
    newPlaced[nextSlot] = tiles.find(t => t.id === tileId);
    setTiles(newTiles);
    setPlaced(newPlaced);

    // Check win
    const word = newPlaced.map(p => p?.letter || '').join('');
    if (!newPlaced.includes(null) && word === answer) {
      setGameStatus('won');
      persist(newTiles, newPlaced, 'won', hintsUsed);
    } else {
      persist(newTiles, newPlaced, gameStatus, hintsUsed);
    }
  }

  function handlePlacedClick(slotIdx) {
    if (gameStatus !== 'playing') return;
    const tile = placed[slotIdx];
    if (!tile) return;
    const newPlaced = [...placed];
    newPlaced[slotIdx] = null;
    const newTiles = tiles.map(t => t.id === tile.id ? { ...t, placed: false } : t);
    setPlaced(newPlaced);
    setTiles(newTiles);
    persist(newTiles, newPlaced, gameStatus, hintsUsed);
  }

  function handleClear() {
    const newTiles = tiles.map(t => ({ ...t, placed: false }));
    const newPlaced = Array(letters.length).fill(null);
    setTiles(newTiles);
    setPlaced(newPlaced);
    persist(newTiles, newPlaced, gameStatus, hintsUsed);
  }

  function handleHint() {
    if (hintsUsed >= wordData.hints.length) return;
    const newHints = hintsUsed + 1;
    setHintsUsed(newHints);
    persist(tiles, placed, gameStatus, newHints);
  }

  function handleGiveUp() {
    if (gameStatus !== 'playing') return;
    // Place letters in correct order
    const newTiles = tiles.map(t => ({ ...t, placed: true }));
    const newPlaced = answer.split('').map((letter, i) => ({ id: i, letter }));
    setTiles(newTiles);
    setPlaced(newPlaced);
    setGameStatus('lost');
    persist(newTiles, newPlaced, 'lost', hintsUsed);
  }

  const levelColor = LEVEL_COLORS[wordData.level] || 'bg-gray-500';
  const wordDisplay = wordData.article
    ? `${wordData.article} ${answer.charAt(0) + answer.slice(1).toLowerCase()}`
    : answer.charAt(0) + answer.slice(1).toLowerCase();

  const currentWord = placed.map(p => p?.letter || '').join('');
  const isWrong = !placed.includes(null) && currentWord !== answer && gameStatus === 'playing';

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto w-full px-4 py-6 gap-6">
      {message && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 bg-[#1a1a1a] text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg">
          {message}
        </div>
      )}

      {/* Clue */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${levelColor}`}>
            {wordData.level}
          </span>
          <span className="text-[#888] text-xs uppercase tracking-wider">Anagramm #{getDayNumber()}</span>
        </div>
        <p className="text-[#555] text-sm">Ordne die Buchstaben zum richtigen deutschen Wort.</p>
        <p className="text-[#1a1a1a] font-semibold text-base italic">„{wordData.translation}"</p>
      </div>

      {/* Answer slots */}
      <div className={`flex gap-1 ${isWrong ? 'tile-shake' : ''}`}>
        {placed.map((tile, i) => (
          <button
            key={i}
            onClick={() => handlePlacedClick(i)}
            className={`
              w-12 h-12 sm:w-14 sm:h-14 border-2 flex items-center justify-center
              text-xl sm:text-2xl font-bold uppercase select-none transition-all
              ${gameStatus === 'won'
                ? 'bg-[#4a7c59] border-[#4a7c59] text-white'
                : gameStatus === 'lost'
                ? 'bg-[#4a4a4a] border-[#4a4a4a] text-white'
                : tile
                ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white cursor-pointer hover:bg-[#333]'
                : 'bg-white border-[#C8C4B8] text-[#1a1a1a]'}
            `}
          >
            {tile?.letter || ''}
          </button>
        ))}
      </div>

      {/* Scrambled tiles */}
      {gameStatus === 'playing' && (
        <div className="flex gap-1.5 flex-wrap justify-center">
          {tiles.filter(t => !t.placed).map(tile => (
            <button
              key={tile.id}
              onClick={() => handleScrambledClick(tile.id)}
              className="w-12 h-12 sm:w-14 sm:h-14 border-2 border-[#C8C4B8] bg-white
                flex items-center justify-center text-xl sm:text-2xl font-bold uppercase
                hover:border-[#1a1a1a] hover:bg-[#f0ede5] transition-all select-none cursor-pointer"
            >
              {tile.letter}
            </button>
          ))}
        </div>
      )}

      {/* Hints */}
      {hintsUsed > 0 && (
        <div className="w-full bg-white border border-[#C8C4B8] rounded-lg p-3 space-y-2 shadow-sm">
          <p className="text-[#888] text-xs uppercase tracking-wider">Hinweise</p>
          {wordData.hints.slice(0, hintsUsed).map((hint, i) => (
            <div key={i} className={`flex gap-2 text-sm ${i === hintsUsed - 1 ? 'text-[#1a1a1a] font-medium' : 'text-[#666]'}`}>
              <span className="text-[#bbb] font-mono text-xs mt-0.5">{i + 1}.</span>
              <span>{hint}</span>
            </div>
          ))}
        </div>
      )}

      {/* Result */}
      {gameStatus === 'won' && (
        <div className="w-full bg-[#edf7f0] border border-[#4a7c59] rounded-lg p-4 text-center space-y-1">
          <p className="text-2xl">🎉</p>
          <p className="font-bold text-[#1a1a1a] text-lg">{wordDisplay}</p>
          <p className="text-[#555] text-sm">{wordData.example}</p>
          <p className="text-[#888] text-xs italic">{wordData.example_en}</p>
        </div>
      )}
      {gameStatus === 'lost' && (
        <div className="w-full bg-[#f7f0ed] border border-[#CC0000] rounded-lg p-4 text-center space-y-1">
          <p className="text-[#1a1a1a] font-bold">Das Wort war: <span className="text-[#CC0000]">{wordDisplay}</span></p>
          <p className="text-[#555] text-sm">{wordData.example}</p>
          <p className="text-[#888] text-xs italic">{wordData.example_en}</p>
        </div>
      )}

      {/* Controls */}
      {gameStatus === 'playing' && (
        <div className="flex gap-2 w-full">
          <button
            onClick={handleClear}
            className="flex-1 py-2.5 rounded-lg border border-[#C8C4B8] bg-white text-[#555] text-sm font-semibold hover:bg-[#f0ede5] transition-colors"
          >
            Zurücksetzen
          </button>
          {hintsUsed < wordData.hints.length && (
            <button
              onClick={handleHint}
              className="flex-1 py-2.5 rounded-lg border border-[#FFCE00] bg-[#FFCE00] text-[#1a1a1a] text-sm font-semibold hover:bg-[#f0bf00] transition-colors"
            >
              Hinweis ({wordData.hints.length - hintsUsed} übrig)
            </button>
          )}
          <button
            onClick={handleGiveUp}
            className="flex-1 py-2.5 rounded-lg border border-[#C8C4B8] bg-white text-[#CC0000] text-sm font-semibold hover:bg-[#f0ede5] transition-colors"
          >
            Aufgeben
          </button>
        </div>
      )}
    </div>
  );
}
