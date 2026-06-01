import { describe, expect, it } from 'vitest';
import { createGrid, parseSolutionString } from '../src/hitori/grid';
import { getPlayStatus, isSolved } from '../src/hitori/validate';

const CLASSIC_5 = [
  [2, 2, 1, 5, 3],
  [2, 3, 1, 4, 5],
  [1, 1, 1, 3, 5],
  [1, 3, 5, 4, 2],
  [5, 4, 3, 2, 1],
];

import { solveHitori } from '../src/hitori/solver';
import { solutionToString } from '../src/hitori/grid';

describe('isSolved', () => {
  it('wins with correct shades even when other cells are undecided', () => {
    const solved = solveHitori(CLASSIC_5, 5)!;
    const solutionStr = solutionToString(solved);
    const solution = parseSolutionString(5, solutionStr);
    const grid = createGrid(5, CLASSIC_5);

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (solution[row][col]) {
          grid.cells[row][col].state = 'black';
        }
      }
    }

    expect(isSolved(grid, solution)).toBe(true);
    expect(getPlayStatus(grid, solution).won).toBe(true);
  });
});
