export const CORRECT = 'correct';
export const PRESENT = 'present';
export const ABSENT = 'absent';
export const EMPTY = 'empty';
export const ACTIVE = 'active';

export function evaluateGuess(guess, answer) {
  const g = [...guess.toUpperCase()];
  const a = [...answer.toUpperCase()];
  const result = new Array(g.length).fill(ABSENT);
  const answerPool = [...a];

  // First pass: correct positions
  g.forEach((letter, i) => {
    if (letter === a[i]) {
      result[i] = CORRECT;
      answerPool[i] = null;
    }
  });

  // Second pass: present (wrong position)
  g.forEach((letter, i) => {
    if (result[i] === CORRECT) return;
    const poolIdx = answerPool.indexOf(letter);
    if (poolIdx !== -1) {
      result[i] = PRESENT;
      answerPool[poolIdx] = null;
    }
  });

  return result;
}

export function buildKeyboardColors(guesses, tileStates) {
  const colors = {};
  const priority = { [CORRECT]: 3, [PRESENT]: 2, [ABSENT]: 1 };
  guesses.forEach((guess, gi) => {
    [...guess.toUpperCase()].forEach((letter, li) => {
      const state = tileStates[gi]?.[li];
      if (!state) return;
      if (!colors[letter] || priority[state] > priority[colors[letter]]) {
        colors[letter] = state;
      }
    });
  });
  return colors;
}
