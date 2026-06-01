import { countWhiteComponents } from './rules';

/** null = undecided, false = white (unshaded), true = black (shaded) */
type Shade = boolean | null;

export function solveHitori(values: number[][], size: number): boolean[][] | null {
  const shades: Shade[][] = Array.from({ length: size }, () => Array<Shade>(size).fill(null));
  const result = backtrack(values, size, shades, 0);
  if (!result) return null;
  return shades.map((row) => row.map((s) => s === true));
}

export function countSolutions(values: number[][], size: number, limit = 2): number {
  const shades: Shade[][] = Array.from({ length: size }, () => Array<Shade>(size).fill(null));
  return countBacktrack(values, size, shades, 0, limit);
}

function backtrack(
  values: number[][],
  size: number,
  shades: Shade[][],
  index: number,
): boolean {
  if (index === size * size) {
    return isValidSolution(values, size, shades);
  }

  const row = Math.floor(index / size);
  const col = index % size;

  shades[row][col] = false;
  if (isPartialValid(values, size, shades, row, col) && backtrack(values, size, shades, index + 1)) {
    return true;
  }

  shades[row][col] = true;
  if (isPartialValid(values, size, shades, row, col) && backtrack(values, size, shades, index + 1)) {
    return true;
  }

  shades[row][col] = null;
  return false;
}

function countBacktrack(
  values: number[][],
  size: number,
  shades: Shade[][],
  index: number,
  limit: number,
  count = { n: 0 },
): number {
  if (count.n >= limit) return count.n;
  if (index === size * size) {
    if (isValidSolution(values, size, shades)) count.n++;
    return count.n;
  }

  const row = Math.floor(index / size);
  const col = index % size;

  shades[row][col] = false;
  if (isPartialValid(values, size, shades, row, col)) {
    countBacktrack(values, size, shades, index + 1, limit, count);
    if (count.n >= limit) return count.n;
  }

  shades[row][col] = true;
  if (isPartialValid(values, size, shades, row, col)) {
    countBacktrack(values, size, shades, index + 1, limit, count);
    if (count.n >= limit) return count.n;
  }

  shades[row][col] = null;
  return count.n;
}

function isWhite(shade: Shade): boolean {
  return shade === false;
}

function isBlack(shade: Shade): boolean {
  return shade === true;
}

function isPartialValid(
  values: number[][],
  size: number,
  shades: Shade[][],
  row: number,
  col: number,
): boolean {
  if (isBlack(shades[row][col])) {
    if (row > 0 && isBlack(shades[row - 1][col])) return false;
    if (row < size - 1 && isBlack(shades[row + 1][col])) return false;
    if (col > 0 && isBlack(shades[row][col - 1])) return false;
    if (col < size - 1 && isBlack(shades[row][col + 1])) return false;
  }

  for (let c = 0; c < size; c++) {
    if (!isWhite(shades[row][c])) continue;
    for (let c2 = c + 1; c2 < size; c2++) {
      if (!isWhite(shades[row][c2])) continue;
      if (values[row][c] === values[row][c2]) return false;
    }
  }

  for (let r = 0; r < size; r++) {
    if (!isWhite(shades[r][col])) continue;
    for (let r2 = r + 1; r2 < size; r2++) {
      if (!isWhite(shades[r2][col])) continue;
      if (values[r][col] === values[r2][col]) return false;
    }
  }

  return true;
}

export function isValidSolution(values: number[][], size: number, shades: Shade[][]): boolean {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (shades[row][col] === null) return false;
      if (!isPartialValid(values, size, shades, row, col)) return false;
    }
  }

  const active = (r: number, c: number) => isWhite(shades[r][c]);
  return countWhiteComponents(size, active) === 1;
}
