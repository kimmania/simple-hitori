import type { CellState, Grid } from './types';

/** Cells that count as unshaded for duplicate and connectivity checks */
export function isUnshaded(state: CellState): boolean {
  return state !== 'black';
}

export function countWhiteComponents(
  size: number,
  isActive: (row: number, col: number) => boolean,
): number {
  const visited = Array.from({ length: size }, () => Array<boolean>(size).fill(false));
  let components = 0;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (!isActive(row, col) || visited[row][col]) continue;
      components++;
      const stack: [number, number][] = [[row, col]];
      visited[row][col] = true;

      while (stack.length > 0) {
        const [r, c] = stack.pop()!;
        for (const [nr, nc] of [
          [r - 1, c],
          [r + 1, c],
          [r, c - 1],
          [r, c + 1],
        ] as [number, number][]) {
          if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;
          if (!isActive(nr, nc) || visited[nr][nc]) continue;
          visited[nr][nc] = true;
          stack.push([nr, nc]);
        }
      }
    }
  }

  return components;
}

export function hasAdjacentBlacks(grid: Grid): boolean {
  const { size, cells } = grid;
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (cells[row][col].state !== 'black') continue;
      if (row > 0 && cells[row - 1][col].state === 'black') return true;
      if (row < size - 1 && cells[row + 1][col].state === 'black') return true;
      if (col > 0 && cells[row][col - 1].state === 'black') return true;
      if (col < size - 1 && cells[row][col + 1].state === 'black') return true;
    }
  }
  return false;
}

export function getDuplicateCells(grid: Grid): Set<string> {
  const duplicates = new Set<string>();
  const { size, cells } = grid;

  for (let row = 0; row < size; row++) {
    const byValue = new Map<number, number[]>();
    for (let col = 0; col < size; col++) {
      if (!isUnshaded(cells[row][col].state)) continue;
      const value = cells[row][col].value;
      const list = byValue.get(value) ?? [];
      list.push(col);
      byValue.set(value, list);
    }
    for (const cols of byValue.values()) {
      if (cols.length > 1) {
        for (const col of cols) duplicates.add(`${row},${col}`);
      }
    }
  }

  for (let col = 0; col < size; col++) {
    const byValue = new Map<number, number[]>();
    for (let row = 0; row < size; row++) {
      if (!isUnshaded(cells[row][col].state)) continue;
      const value = cells[row][col].value;
      const list = byValue.get(value) ?? [];
      list.push(row);
      byValue.set(value, list);
    }
    for (const rows of byValue.values()) {
      if (rows.length > 1) {
        for (const row of rows) duplicates.add(`${row},${col}`);
      }
    }
  }

  return duplicates;
}

export function isDisconnected(grid: Grid): boolean {
  const { size, cells } = grid;
  const active = (row: number, col: number) => isUnshaded(cells[row][col].state);
  let hasActive = false;
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (active(row, col)) hasActive = true;
    }
  }
  if (!hasActive) return false;
  return countWhiteComponents(size, active) > 1;
}

export function getViolationCells(grid: Grid): Set<string> {
  const violations = new Set<string>(getDuplicateCells(grid));

  const { size, cells } = grid;
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (cells[row][col].state !== 'black') continue;
      if (row > 0 && cells[row - 1][col].state === 'black') {
        violations.add(`${row},${col}`);
        violations.add(`${row - 1},${col}`);
      }
      if (row < size - 1 && cells[row + 1][col].state === 'black') {
        violations.add(`${row},${col}`);
        violations.add(`${row + 1},${col}`);
      }
      if (col > 0 && cells[row][col - 1].state === 'black') {
        violations.add(`${row},${col}`);
        violations.add(`${row},${col - 1}`);
      }
      if (col < size - 1 && cells[row][col + 1].state === 'black') {
        violations.add(`${row},${col}`);
        violations.add(`${row},${col + 1}`);
      }
    }
  }

  if (isDisconnected(grid)) {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (isUnshaded(cells[row][col].state)) violations.add(`${row},${col}`);
      }
    }
  }

  return violations;
}

export function rulesSatisfied(grid: Grid): boolean {
  return getViolationCells(grid).size === 0;
}

export function allCellsDecided(grid: Grid): boolean {
  for (const row of grid.cells) {
    for (const cell of row) {
      if (cell.state === 'empty') return false;
    }
  }
  return true;
}
