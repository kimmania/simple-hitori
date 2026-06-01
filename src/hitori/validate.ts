import type { CellState, Grid } from './types';
import { isDecided, solutionState } from './grid';
import {
  allCellsDecided,
  getDuplicateCells,
  getViolationCells,
  rulesSatisfied,
} from './rules';

export function getConflictCells(grid: Grid): Set<string> {
  return getViolationCells(grid);
}

export function getWrongCells(grid: Grid, solution: boolean[][]): Set<string> {
  const wrong = new Set<string>();
  for (let row = 0; row < grid.size; row++) {
    for (let col = 0; col < grid.size; col++) {
      const cell = grid.cells[row][col];
      if (!isDecided(cell.state)) continue;
      const expected = solutionState(solution, row, col);
      if (cell.state !== expected) wrong.add(`${row},${col}`);
    }
  }
  return wrong;
}

export function getRelatedCells(grid: Grid, row: number, col: number): Set<string> {
  const related = new Set<string>();
  const value = grid.cells[row][col].value;
  for (let c = 0; c < grid.size; c++) {
    if (grid.cells[row][c].value === value) related.add(`${row},${c}`);
  }
  for (let r = 0; r < grid.size; r++) {
    if (grid.cells[r][col].value === value) related.add(`${r},${col}`);
  }
  return related;
}

export function hasNewRuleViolation(grid: Grid, before: Set<string>): boolean {
  const after = getViolationCells(grid);
  if (after.size <= before.size) return false;
  for (const key of after) {
    if (!before.has(key)) return true;
  }
  return false;
}

/** Win when all three rules hold and every required shade is placed (empty = unshaded). */
export function isSolved(grid: Grid, solution: boolean[][]): boolean {
  if (!rulesSatisfied(grid)) return false;

  for (let row = 0; row < grid.size; row++) {
    for (let col = 0; col < grid.size; col++) {
      const cell = grid.cells[row][col];
      const shouldShade = solution[row][col];
      if (shouldShade && cell.state !== 'black') return false;
      if (!shouldShade && cell.state === 'black') return false;
    }
  }
  return true;
}

export interface PlayStatus {
  message: string;
  detail: string;
  won: boolean;
}

export function getPlayStatus(grid: Grid, solution: boolean[][]): PlayStatus {
  if (isSolved(grid, solution)) {
    return {
      won: true,
      message: 'You win!',
      detail: 'All three rules are satisfied. Tap New Game for another puzzle.',
    };
  }

  const violations = getViolationCells(grid);
  if (violations.size > 0) {
    return {
      won: false,
      message: 'Fix the conflicts',
      detail: 'Highlighted cells break a rule (duplicate, touching shades, or disconnected whites).',
    };
  }

  let shadesStillNeeded = 0;
  let wrongShades = 0;
  for (let row = 0; row < grid.size; row++) {
    for (let col = 0; col < grid.size; col++) {
      const shouldShade = solution[row][col];
      const state = grid.cells[row][col].state;
      if (shouldShade && state !== 'black') shadesStillNeeded++;
      if (!shouldShade && state === 'black') wrongShades++;
    }
  }

  if (wrongShades > 0) {
    return {
      won: false,
      message: 'Some shades are wrong',
      detail: 'Tap a black cell again to clear or change it. Duplicates must be shaded, not removed numbers.',
    };
  }

  if (shadesStillNeeded > 0) {
    return {
      won: false,
      message: `Shade ${shadesStillNeeded} more cell${shadesStillNeeded === 1 ? '' : 's'}`,
      detail:
        'When the same number appears twice in a row or column, tap once for a white ring (keep) or twice to shade (black).',
    };
  }

  return {
    won: false,
    message: 'Keep going',
    detail: 'Shade duplicate numbers so each row and column has no repeats among unshaded cells.',
  };
}

export function getHighlightCells(grid: Grid, row: number, col: number): Set<string> {
  return getRelatedCells(grid, row, col);
}

export { getDuplicateCells, rulesSatisfied, allCellsDecided };
