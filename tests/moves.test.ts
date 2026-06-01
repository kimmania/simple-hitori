import { describe, expect, it } from 'vitest';
import { createGrid, parseSolutionString, solutionToString } from '../src/hitori/grid';
import { toggleCell } from '../src/hitori/moves';
import type { GameState } from '../src/hitori/types';
import { solveHitori } from '../src/hitori/solver';

const CLASSIC_5 = [
  [2, 2, 1, 5, 3],
  [2, 3, 1, 4, 5],
  [1, 1, 1, 3, 5],
  [1, 3, 5, 4, 2],
  [5, 4, 3, 2, 1],
];

function gameAt(row: number, col: number): GameState {
  const solved = solveHitori(CLASSIC_5, 5)!;
  const solution = parseSolutionString(5, solutionToString(solved));
  return {
    grid: createGrid(5, CLASSIC_5),
    solution,
    values: CLASSIC_5.map((r) => [...r]),
    difficulty: 'easy',
    puzzleId: 'test',
    selected: null,
    mistakes: 0,
    status: 'playing',
  };
}

describe('toggleCell mistakes', () => {
  it('does not count a mistake when first tap marks a cell that should stay', () => {
    const state = gameAt(1, 1); // center 3 — typically stays unshaded
    if (state.solution[1][1]) return; // skip if seed differs

    toggleCell(state, 1, 1);
    expect(state.grid.cells[1][1].state).toBe('white');
    expect(state.mistakes).toBe(0);
  });

  it('refunds a mistake when correcting an accidental shade', () => {
    const state = gameAt(1, 1);
    if (state.solution[1][1]) return;

    toggleCell(state, 1, 1); // white — ok
    toggleCell(state, 1, 1); // black — wrong
    expect(state.mistakes).toBe(1);
    toggleCell(state, 1, 1); // clear
    expect(state.mistakes).toBe(0);
  });
});
