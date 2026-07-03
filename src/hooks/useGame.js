import { useState, useEffect, useCallback } from 'react';
import words from '../data/words.json';
import { getTodaysWord } from '../utils/wordSelector';
import { evaluateGuess, buildKeyboardColors } from '../utils/tileState';
import { saveResult, loadTodayState, saveTodayState } from '../utils/storage';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

export function useGame() {
  const { word: wordData, dayNumber } = getTodaysWord(words);
  const answer = wordData.word.toUpperCase();

  const [guesses, setGuesses] = useState([]);
  const [tileStates, setTileStates] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing' | 'won' | 'lost'
  const [hintsUnlocked, setHintsUnlocked] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState(null);

  // Restore today's saved state
  useEffect(() => {
    const saved = loadTodayState(dayNumber);
    if (saved) {
      setGuesses(saved.guesses);
      setTileStates(saved.tileStates);
      setCurrentGuess('');
      setGameStatus(saved.gameStatus);
      setHintsUnlocked(saved.hintsUnlocked);
    }
  }, [dayNumber]);

  const showMessage = useCallback((msg, duration = 2000) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), duration);
  }, []);

  const submitGuess = useCallback(() => {
    if (gameStatus !== 'playing') return;
    if (currentGuess.length !== WORD_LENGTH) {
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
      showMessage('Wort muss 5 Buchstaben haben!');
      return;
    }

    const states = evaluateGuess(currentGuess, answer);
    const newGuesses = [...guesses, currentGuess];
    const newTileStates = [...tileStates, states];
    const won = states.every(s => s === 'correct');
    const lost = !won && newGuesses.length >= MAX_GUESSES;
    const newStatus = won ? 'won' : lost ? 'lost' : 'playing';
    const newHints = won || lost ? hintsUnlocked : Math.min(hintsUnlocked + 1, wordData.hints.length - 1);

    setGuesses(newGuesses);
    setTileStates(newTileStates);
    setCurrentGuess('');
    setGameStatus(newStatus);
    setHintsUnlocked(newHints);

    const newState = {
      guesses: newGuesses,
      tileStates: newTileStates,
      gameStatus: newStatus,
      hintsUnlocked: newHints,
    };
    saveTodayState(dayNumber, newState);

    if (won || lost) {
      const updatedStats = saveResult(won ? newGuesses.length : 0, dayNumber);
      setStats(updatedStats);
    }
  }, [gameStatus, currentGuess, answer, guesses, tileStates, hintsUnlocked, wordData.hints.length, dayNumber, showMessage]);

  const addLetter = useCallback((letter) => {
    if (gameStatus !== 'playing') return;
    if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + letter.toUpperCase());
    }
  }, [gameStatus, currentGuess.length]);

  const removeLetter = useCallback(() => {
    setCurrentGuess(prev => prev.slice(0, -1));
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (gameStatus !== 'playing') return;
      const key = e.key;
      if (key === 'Enter') { submitGuess(); return; }
      if (key === 'Backspace') { removeLetter(); return; }
      const letter = key.toUpperCase();
      if (/^[A-ZÄÖÜSS]$/.test(letter) || letter === 'ß' || letter === 'SS') {
        addLetter(letter);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStatus, submitGuess, removeLetter, addLetter]);

  const keyboardColors = buildKeyboardColors(guesses, tileStates);

  return {
    wordData,
    answer,
    dayNumber,
    guesses,
    tileStates,
    currentGuess,
    gameStatus,
    hintsUnlocked,
    shaking,
    message,
    stats,
    keyboardColors,
    addLetter,
    removeLetter,
    submitGuess,
    maxGuesses: MAX_GUESSES,
    wordLength: WORD_LENGTH,
  };
}
