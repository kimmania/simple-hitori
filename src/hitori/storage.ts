import type { CellState, GameState } from './types';
import { STORAGE_KEY } from './types';
import { createGrid, parseSolutionString } from './grid';

interface SavedGame {
  puzzleId: string;
  difficulty: GameState['difficulty'];
  size: number;
  values: number[][];
  solution: string;
  states: CellState[][];
  selected: { row: number; col: number } | null;
  mistakes: number;
  status: GameState['status'];
}

export function saveGame(state: GameState): void {
  const saved: SavedGame = {
    puzzleId: state.puzzleId,
    difficulty: state.difficulty,
    size: state.grid.size,
    values: state.values,
    solution: state.solution.flat().map((b) => (b ? '1' : '0')).join(''),
    states: state.grid.cells.map((row) => row.map((cell) => cell.state)),
    selected: state.selected,
    mistakes: state.mistakes,
    status: state.status,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch {
    // Storage full or unavailable.
  }
}

export function loadSavedGame(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const saved = JSON.parse(raw) as SavedGame;
    const grid = createGrid(saved.size, saved.values);
    for (let row = 0; row < saved.size; row++) {
      for (let col = 0; col < saved.size; col++) {
        grid.cells[row][col].state = saved.states[row][col];
      }
    }

    return {
      grid,
      solution: parseSolutionString(saved.size, saved.solution),
      values: saved.values,
      difficulty: saved.difficulty,
      puzzleId: saved.puzzleId,
      selected: saved.selected,
      mistakes: saved.mistakes,
      status: saved.status,
    };
  } catch {
    return null;
  }
}

export function clearSavedGame(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore.
  }
}
