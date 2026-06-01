import type { CellState, GameState } from './types';
import { cycleCellState, solutionState } from './grid';
import { getViolationCells } from './rules';
import { hasNewRuleViolation, isSolved } from './validate';

function isWrongMarking(
  solution: boolean[][],
  row: number,
  col: number,
  state: CellState,
): boolean {
  if (state === 'empty') return false;
  return state !== solutionState(solution, row, col);
}

export function toggleCell(state: GameState, row: number, col: number): void {
  if (state.status === 'won') return;

  const cell = state.grid.cells[row][col];
  const beforeViolations = getViolationCells(state.grid);
  const prev = cell.state;
  const next = cycleCellState(prev);

  cell.state = next;

  if (isWrongMarking(state.solution, row, col, prev) && !isWrongMarking(state.solution, row, col, next)) {
    state.mistakes = Math.max(0, state.mistakes - 1);
  }

  if (isWrongMarking(state.solution, row, col, next)) {
    state.mistakes += 1;
  } else if (next !== 'empty' && hasNewRuleViolation(state.grid, beforeViolations)) {
    state.mistakes += 1;
  }

  if (isSolved(state.grid, state.solution)) {
    state.status = 'won';
  }
}
