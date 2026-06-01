export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type CellState = 'empty' | 'black' | 'white';

export interface Cell {
  value: number;
  state: CellState;
}

export interface Grid {
  size: number;
  cells: Cell[][];
}

export interface Puzzle {
  id: string;
  difficulty: Difficulty;
  size: number;
  values: number[][];
  /** Row-major: '1' = shaded (black), '0' = unshaded (white) */
  solution: string;
}

export type GameStatus = 'playing' | 'won';

export interface GameState {
  grid: Grid;
  solution: boolean[][];
  values: number[][];
  difficulty: Difficulty;
  puzzleId: string;
  selected: { row: number; col: number } | null;
  mistakes: number;
  status: GameStatus;
}

export const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

export const DIFFICULTY_SIZE: Record<Difficulty, number> = {
  easy: 5,
  medium: 6,
  hard: 8,
  expert: 12,
};

export const RECENT_PUZZLE_COUNT = 20;
export const STORAGE_KEY = 'simple-hitori-save';
