import { useState, useEffect } from 'react';
import { useGame } from './hooks/useGame';
import Header from './components/Header';
import Board from './components/Board';
import Keyboard from './components/Keyboard';
import HintPanel from './components/HintPanel';
import WinModal from './components/modals/WinModal';
import LoseModal from './components/modals/LoseModal';
import StatsModal from './components/modals/StatsModal';
import HelpModal from './components/modals/HelpModal';

export default function App() {
  const game = useGame();
  const [showStats, setShowStats] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Show result modal after a short delay when game ends
  useEffect(() => {
    if (game.gameStatus === 'won' || game.gameStatus === 'lost') {
      const delay = game.gameStatus === 'won' ? 1800 : 2000;
      const t = setTimeout(() => setShowResult(true), delay);
      return () => clearTimeout(t);
    }
  }, [game.gameStatus]);

  // Show help on first visit
  useEffect(() => {
    const seen = localStorage.getItem('woertchen_seen_help');
    if (!seen) {
      setShowHelp(true);
      localStorage.setItem('woertchen_seen_help', '1');
    }
  }, []);

  return (
    <div className="flex flex-col min-h-dvh bg-[#121213]">
      <Header onStatsClick={() => setShowStats(true)} onHelpClick={() => setShowHelp(true)} />

      <main className="flex flex-col flex-1 items-center max-w-lg mx-auto w-full">
        {game.message && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 bg-white text-black text-sm font-bold px-4 py-2 rounded-lg shadow-lg">
            {game.message}
          </div>
        )}

        <Board
          guesses={game.guesses}
          tileStates={game.tileStates}
          currentGuess={game.currentGuess}
          maxGuesses={game.maxGuesses}
          wordLength={game.wordLength}
          shaking={game.shaking}
        />

        <HintPanel
          wordData={game.wordData}
          hintsUnlocked={game.hintsUnlocked}
          guessCount={game.guesses.length}
        />

        <div className="mt-auto w-full">
          <Keyboard
            onLetter={game.addLetter}
            onDelete={game.removeLetter}
            onEnter={game.submitGuess}
            keyboardColors={game.keyboardColors}
          />
        </div>
      </main>

      {showResult && game.gameStatus === 'won' && (
        <WinModal
          wordData={game.wordData}
          guesses={game.guesses}
          tileStates={game.tileStates}
          dayNumber={game.dayNumber}
          stats={game.stats}
          onClose={() => setShowResult(false)}
        />
      )}
      {showResult && game.gameStatus === 'lost' && (
        <LoseModal
          wordData={game.wordData}
          onClose={() => setShowResult(false)}
        />
      )}
      {showStats && (
        <StatsModal onClose={() => setShowStats(false)} />
      )}
      {showHelp && (
        <HelpModal onClose={() => setShowHelp(false)} />
      )}
    </div>
  );
}
