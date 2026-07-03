import Tile from './Tile';

export default function Board({ guesses, tileStates, currentGuess, maxGuesses, wordLength, shaking }) {
  const rows = [];

  for (let i = 0; i < maxGuesses; i++) {
    if (i < guesses.length) {
      // Submitted guess
      const guess = guesses[i].toUpperCase().padEnd(wordLength, '');
      rows.push(
        <div key={i} className="flex gap-1">
          {[...guess].map((letter, j) => (
            <Tile
              key={j}
              letter={letter}
              state={tileStates[i]?.[j] || 'empty'}
              delay={j * 300}
            />
          ))}
        </div>
      );
    } else if (i === guesses.length) {
      // Current row
      rows.push(
        <div key={i} className={`flex gap-1 ${shaking ? 'tile-shake' : ''}`}>
          {Array.from({ length: wordLength }, (_, j) => (
            <Tile
              key={j}
              letter={j < currentGuess.length ? currentGuess[j].toUpperCase() : ''}
              state={j < currentGuess.length ? 'active' : 'empty'}
            />
          ))}
        </div>
      );
    } else {
      // Empty row
      rows.push(
        <div key={i} className="flex gap-1">
          {Array.from({ length: wordLength }).map((_, j) => (
            <Tile key={j} letter="" state="empty" />
          ))}
        </div>
      );
    }
  }

  return (
    <div className="flex flex-col gap-1 items-center py-2">
      {rows}
    </div>
  );
}
