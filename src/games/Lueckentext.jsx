import { useState, useEffect, useCallback, useRef } from 'react';
import sentences from '../data/sentences.json';
import { getDayNumber } from '../utils/wordSelector';
import { loadTodayState, saveTodayState } from '../utils/storage';

const LEVEL_COLORS = {
  A1: 'bg-emerald-500', A2: 'bg-green-500', B1: 'bg-yellow-500',
  B2: 'bg-orange-500', C1: 'bg-red-600', C2: 'bg-purple-600',
};
const MAX_ATTEMPTS = 3;
const STORAGE_KEY_PREFIX = 'lueckentext_day_';

function getTodaysSentence() {
  const dayNumber = getDayNumber();
  const index = ((dayNumber - 1) % sentences.length + sentences.length) % sentences.length;
  return sentences[index];
}

export default function Lueckentext() {
  const dayNumber = getDayNumber();
  const sentenceData = getTodaysSentence();
  const answer = sentenceData.answer.toLowerCase();

  const [input, setInput] = useState('');
  const [attempts, setAttempts] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');
  const [hintsShown, setHintsShown] = useState(0);
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const saved = loadTodayState(STORAGE_KEY_PREFIX + dayNumber);
    if (saved) {
      setAttempts(saved.attempts);
      setGameStatus(saved.gameStatus);
      setHintsShown(saved.hintsShown);
      setInput('');
    }
  }, [dayNumber]);

  const persist = useCallback((att, status, hints) => {
    saveTodayState(STORAGE_KEY_PREFIX + dayNumber, { attempts: att, gameStatus: status, hintsShown: hints });
  }, [dayNumber]);

  function handleSubmit() {
    if (!input.trim() || gameStatus !== 'playing') return;
    const guess = input.trim().toLowerCase();
    const correct = guess === answer;
    const newAttempts = [...attempts, { guess, correct }];
    setAttempts(newAttempts);
    setInput('');

    if (correct) {
      setGameStatus('won');
      persist(newAttempts, 'won', hintsShown);
    } else {
      const newHints = Math.min(hintsShown + 1, sentenceData.hints.length);
      setHintsShown(newHints);
      setShake(true);
      setTimeout(() => setShake(false), 400);
      if (newAttempts.length >= MAX_ATTEMPTS) {
        setGameStatus('lost');
        persist(newAttempts, 'lost', newHints);
      } else {
        persist(newAttempts, 'playing', newHints);
      }
    }
    inputRef.current?.focus();
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit();
  }

  const levelColor = LEVEL_COLORS[sentenceData.level] || 'bg-gray-500';
  const attemptsLeft = MAX_ATTEMPTS - attempts.length;

  // Build the displayed sentence with blank
  const parts = sentenceData.sentence.split('___');

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto w-full px-4 py-6 gap-5">
      {/* Header info */}
      <div className="text-center space-y-1 w-full">
        <div className="flex items-center justify-center gap-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${levelColor}`}>
            {sentenceData.level}
          </span>
          <span className="text-[#888] text-xs uppercase tracking-wider">Lückentext #{dayNumber}</span>
        </div>
        <p className="text-[#555] text-sm">Ergänze das fehlende Wort im Satz.</p>
      </div>

      {/* Sentence display */}
      <div className="w-full bg-white border border-[#C8C4B8] rounded-xl p-5 shadow-sm text-center">
        <p className="text-[#1a1a1a] text-lg sm:text-xl font-medium leading-relaxed">
          {parts[0]}
          <span className={`inline-block border-b-2 mx-1 font-bold min-w-[80px] text-center ${
            gameStatus === 'won'
              ? 'border-[#4a7c59] text-[#4a7c59]'
              : gameStatus === 'lost'
              ? 'border-[#CC0000] text-[#CC0000]'
              : 'border-[#1a1a1a] text-[#1a1a1a]'
          }`}>
            {gameStatus !== 'playing' ? sentenceData.answer : (input || '     ')}
          </span>
          {parts[1]}
        </p>
        <p className="text-[#888] text-sm mt-2 italic">{sentenceData.translation.replace('___', '___')}</p>
      </div>

      {/* Hints */}
      {hintsShown > 0 && gameStatus === 'playing' && (
        <div className="w-full bg-[#fffbeb] border border-[#FFCE00] rounded-lg p-3 space-y-2">
          <p className="text-[#888] text-xs uppercase tracking-wider">Hinweise</p>
          {sentenceData.hints.slice(0, hintsShown).map((hint, i) => (
            <div key={i} className={`flex gap-2 text-sm ${i === hintsShown - 1 ? 'text-[#1a1a1a] font-medium' : 'text-[#666]'}`}>
              <span className="text-[#bbb] font-mono text-xs mt-0.5">{i + 1}.</span>
              <span>{hint}</span>
            </div>
          ))}
        </div>
      )}

      {/* Previous attempts */}
      {attempts.length > 0 && (
        <div className="w-full space-y-1.5">
          {attempts.map((att, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border ${
                att.correct
                  ? 'bg-[#edf7f0] border-[#4a7c59] text-[#4a7c59]'
                  : 'bg-[#f7f0ed] border-[#CC0000] text-[#CC0000]'
              }`}
            >
              <span className="font-bold">{att.correct ? '✓' : '✗'}</span>
              <span className="font-mono font-semibold">{att.guess}</span>
              {!att.correct && <span className="text-[#888] text-xs ml-auto">falsch</span>}
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      {gameStatus === 'playing' && (
        <div className={`w-full flex gap-2 ${shake ? 'tile-shake' : ''}`}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Deine Antwort..."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            className="flex-1 px-4 py-3 border-2 border-[#C8C4B8] rounded-lg bg-white text-[#1a1a1a]
              text-base outline-none focus:border-[#1a1a1a] transition-colors placeholder:text-[#bbb]"
          />
          <button
            onClick={handleSubmit}
            className="px-5 py-3 bg-[#1a1a1a] text-white font-bold rounded-lg hover:bg-[#333] transition-colors"
          >
            ↵
          </button>
        </div>
      )}

      {gameStatus === 'playing' && (
        <p className="text-[#aaa] text-xs">
          {attemptsLeft === MAX_ATTEMPTS
            ? `${MAX_ATTEMPTS} Versuche`
            : `Noch ${attemptsLeft} Versuch${attemptsLeft !== 1 ? 'e' : ''}`}
        </p>
      )}

      {/* Result */}
      {gameStatus === 'won' && (
        <div className="w-full bg-[#edf7f0] border border-[#4a7c59] rounded-xl p-4 text-center space-y-1">
          <p className="text-2xl">✓</p>
          <p className="font-bold text-[#4a7c59]">Richtig!</p>
          <p className="text-[#1a1a1a] text-sm">
            <strong>{sentenceData.answer}</strong> = {sentenceData.answer_translation}
          </p>
          <p className="text-[#555] text-sm">Morgen gibt es einen neuen Satz!</p>
        </div>
      )}
      {gameStatus === 'lost' && (
        <div className="w-full bg-[#f7f0ed] border border-[#CC0000] rounded-xl p-4 text-center space-y-1">
          <p className="text-2xl">✗</p>
          <p className="font-bold text-[#CC0000]">Die Antwort war:</p>
          <p className="text-[#1a1a1a] font-bold text-lg">{sentenceData.answer}</p>
          <p className="text-[#555] text-sm">{sentenceData.answer_translation}</p>
          <p className="text-[#888] text-xs">Morgen gibt es einen neuen Satz!</p>
        </div>
      )}
    </div>
  );
}
