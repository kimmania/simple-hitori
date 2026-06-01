import type { Cell, CellState, Grid } from './types';

export function createGrid(size: number, values: number[][]): Grid {
  const cells: Cell[][] = [];
  for (let row = 0; row < size; row++) {
    cells[row] = [];
    for (let col = 0; col < size; col++) {
      cells[row][col] = { value: values[row][col], state: 'empty' };
    }
  }
  return { size, cells };
}

export function cloneGrid(grid: Grid): Grid {
  return {
    size: grid.size,
    cells: grid.cells.map((row) => row.map((cell) => ({ ...cell }))),
  };
}

export function parseSolutionString(size: number, solution: string): boolean[][] {
  const expected = size * size;
  if (solution.length !== expected) {
    throw new Error(`Solution length ${solution.length} expected ${expected}`);
  }

  const blacks: boolean[][] = [];
  for (let row = 0; row < size; row++) {
    blacks[row] = [];
    for (let col = 0; col < size; col++) {
      const ch = solution[row * size + col];
      if (ch !== '0' && ch !== '1') {
        throw new Error(`Invalid solution character: ${ch}`);
      }
      blacks[row][col] = ch === '1';
    }
  }
  return blacks;
}

export function solutionToString(blacks: boolean[][]): string {
  return blacks.flat().map((b) => (b ? '1' : '0')).join('');
}

/** First tap marks “keep” (white ring); second tap shades (black) — matches pencil-mark workflow. */
export function cycleCellState(state: CellState): CellState {
  if (state === 'empty') return 'white';
  if (state === 'white') return 'black';
  return 'empty';
}

export function isDecided(state: CellState): boolean {
  return state !== 'empty';
}

export function solutionState(blacks: boolean[][], row: number, col: number): CellState {
  return blacks[row][col] ? 'black' : 'white';
}
