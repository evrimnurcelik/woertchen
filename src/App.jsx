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
import Anagramm from './games/Anagramm';
import Lueckentext from './games/Lueckentext';

function WoertchenGame({ onShowStats, onShowHelp }) {
  const game = useGame();
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (game.gameStatus === 'won' || game.gameStatus === 'lost') {
      const delay = game.gameStatus === 'won' ? 1800 : 2000;
      const t = setTimeout(() => setShowResult(true), delay);
      return () => clearTimeout(t);
    }
  }, [game.gameStatus]);

  return (
    <>
      <main className="flex flex-col flex-1 items-center max-w-lg mx-auto w-full">
        {game.message && (
          <div className="fixed top-28 left-1/2 -translate-x-1/2 z-40 bg-[#1a1a1a] text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg">
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
        <LoseModal wordData={game.wordData} onClose={() => setShowResult(false)} />
      )}
    </>
  );
}

export default function App() {
  const [activeGame, setActiveGame] = useState('woertchen');
  const [showStats, setShowStats] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('woertchen_seen_help');
    if (!seen) {
      setShowHelp(true);
      localStorage.setItem('woertchen_seen_help', '1');
    }
  }, []);

  return (
    <div className="flex flex-col min-h-dvh bg-[#F5F2E8]">
      <Header
        activeGame={activeGame}
        onGameChange={setActiveGame}
        onStatsClick={() => setShowStats(true)}
        onHelpClick={() => setShowHelp(true)}
      />

      {activeGame === 'woertchen' && (
        <WoertchenGame onShowStats={() => setShowStats(true)} onShowHelp={() => setShowHelp(true)} />
      )}
      {activeGame === 'anagramm' && <Anagramm />}
      {activeGame === 'lueckentext' && <Lueckentext />}

      {showStats && <StatsModal onClose={() => setShowStats(false)} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}
