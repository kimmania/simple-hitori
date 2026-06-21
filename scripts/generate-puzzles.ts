import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { countWhiteComponents } from '../src/hitori/rules';
import { solutionToString } from '../src/hitori/grid';
import { countSolutions, isValidSolution, solveHitori } from '../src/hitori/solver';
import type { Difficulty, Puzzle } from '../src/hitori/types';
import { DIFFICULTY_SIZE } from '../src/hitori/types';

const TARGET = 50;

const SEEDS: { difficulty: Difficulty; values: number[][] }[] = [
  {
    difficulty: 'easy',
    values: [
      [2, 2, 1, 5, 3],
      [2, 3, 1, 4, 5],
      [1, 1, 1, 3, 5],
      [1, 3, 5, 4, 2],
      [5, 4, 3, 2, 1],
    ],
  },
];

function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function latinSquare(size: number): number[][] {
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => ((row + col) % size) + 1),
  );
}

function canPlaceBlack(blacks: boolean[][], size: number, row: number, col: number): boolean {
  if (row > 0 && blacks[row - 1][col]) return false;
  if (row < size - 1 && blacks[row + 1][col]) return false;
  if (col > 0 && blacks[row][col - 1]) return false;
  if (col < size - 1 && blacks[row][col + 1]) return false;
  return true;
}

function generateBlackPattern(size: number): boolean[][] | null {
  const blacks: boolean[][] = Array.from({ length: size }, () => Array<boolean>(size).fill(false));
  const positions = shuffle(
    Array.from({ length: size * size }, (_, i) => ({
      row: Math.floor(i / size),
      col: i % size,
    })),
  );

  const targetBlacks = Math.floor(size * size * (0.2 + Math.random() * 0.15));

  for (const { row, col } of positions) {
    if (!canPlaceBlack(blacks, size, row, col)) continue;
    blacks[row][col] = true;
    const active = (r: number, c: number) => !blacks[r][c];
    let whiteCount = 0;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (active(r, c)) whiteCount++;
      }
    }
    if (whiteCount > 0 && countWhiteComponents(size, active) !== 1) {
      blacks[row][col] = false;
      continue;
    }
    if (blacks.flat().filter(Boolean).length >= targetBlacks) break;
  }

  const active = (r: number, c: number) => !blacks[r][c];
  const whiteCount = blacks.flat().filter((b) => !b).length;
  if (whiteCount === 0) return null;
  if (countWhiteComponents(size, active) !== 1) return null;
  if (blacks.flat().filter(Boolean).length < Math.max(2, Math.floor(size * 0.6))) return null;

  return blacks;
}

function fillFromPattern(size: number, blacks: boolean[][]): number[][] {
  const values = latinSquare(size);

  for (let row = 0; row < size; row++) {
    const whiteCols: number[] = [];
    for (let col = 0; col < size; col++) {
      if (!blacks[row][col]) whiteCols.push(col);
    }
    for (let col = 0; col < size; col++) {
      if (!blacks[row][col]) continue;
      const sourceCol = whiteCols[Math.floor(Math.random() * whiteCols.length)];
      values[row][col] = values[row][sourceCol];
    }
  }

  for (let col = 0; col < size; col++) {
    const whiteRows: number[] = [];
    for (let row = 0; row < size; row++) {
      if (!blacks[row][col]) whiteRows.push(row);
    }
    for (let row = 0; row < size; row++) {
      if (!blacks[row][col]) continue;
      if (whiteRows.some((wr) => values[wr][col] === values[row][col])) continue;
      const sourceRow = whiteRows[Math.floor(Math.random() * whiteRows.length)];
      values[row][col] = values[sourceRow][col];
    }
  }

  return values;
}

function generateOne(
  size: number,
  requireUnique: boolean,
): { values: number[][]; solution: string } | null {
  const attempts = size >= 10 ? 200 : 300;
  for (let attempt = 0; attempt < attempts; attempt++) {
    const blacks = generateBlackPattern(size);
    if (!blacks) continue;

    const values = fillFromPattern(size, blacks);
    const shades = blacks.map((row) => row.map((b) => b as boolean | null));

    // For large grids, full uniqueness solving is prohibitively slow.
    // The generated pattern is accepted as the solution; puzzles are valid
    // but not guaranteed to have a unique solution.
    if (size >= 10) {
      if (!isValidSolution(values, size, shades)) continue;
      return { values, solution: solutionToString(blacks) };
    }

    const solved = solveHitori(values, size);
    if (!solved) continue;
    if (requireUnique && countSolutions(values, size, 2) !== 1) continue;

    return { values, solution: solutionToString(solved) };
  }
  return null;
}

function puzzleFromSeed(difficulty: Difficulty, values: number[][], index: number): Puzzle | null {
  const size = values.length;
  const solved = solveHitori(values, size);
  if (!solved || countSolutions(values, size, 2) !== 1) return null;
  return {
    id: `${difficulty}-seed-${String(index).padStart(4, '0')}`,
    difficulty,
    size,
    values,
    solution: solutionToString(solved),
  };
}

function generateForDifficulty(difficulty: Difficulty): Puzzle[] {
  const size = DIFFICULTY_SIZE[difficulty];
  const target = difficulty === 'expert' ? 30 : TARGET;
  const requireUnique = size < 10;
  const puzzles: Puzzle[] = [];
  const seen = new Set<string>();

  for (const [index, seed] of SEEDS.entries()) {
    if (seed.difficulty !== difficulty || seed.values.length !== size) continue;
    const puzzle = puzzleFromSeed(difficulty, seed.values, index);
    if (!puzzle || seen.has(puzzle.solution)) continue;
    seen.add(puzzle.solution);
    puzzles.push(puzzle);
  }

  let attempts = 0;
  const maxAttempts = difficulty === 'expert' ? target * 80 : target * 120;

  while (puzzles.length < target && attempts < maxAttempts) {
    attempts++;
    const generated = generateOne(size, requireUnique);
    if (!generated || seen.has(generated.solution)) continue;
    seen.add(generated.solution);

    puzzles.push({
      id: `${difficulty}-${String(puzzles.length + 1).padStart(4, '0')}`,
      difficulty,
      size,
      values: generated.values,
      solution: generated.solution,
    });

    if (puzzles.length % 10 === 0) {
      console.log(`${difficulty}: ${puzzles.length}/${target}`);
    }
  }

  return puzzles;
}

const outDir = join(process.cwd(), 'public', 'puzzles');
mkdirSync(outDir, { recursive: true });

for (const difficulty of ['easy', 'medium', 'hard', 'expert'] as Difficulty[]) {
  const puzzles = generateForDifficulty(difficulty);
  const path = join(outDir, `${difficulty}.json`);
  writeFileSync(path, JSON.stringify(puzzles));
  console.log(`Wrote ${puzzles.length} puzzles to ${path}`);
  if (puzzles.length === 0) {
    process.exitCode = 1;
  }
}
