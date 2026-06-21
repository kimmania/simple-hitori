import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createGrid, parseSolutionString } from '../src/hitori/grid';
import { clearSavedGame, loadSavedGame, saveGame } from '../src/hitori/storage';
import type { GameState } from '../src/hitori/types';

function makeState(): GameState {
  const size = 3;
  const values = [
    [1, 2, 3],
    [2, 3, 1],
    [3, 1, 2],
  ];
  return {
    grid: createGrid(size, values),
    solution: parseSolutionString(size, '000000000'),
    values: values.map((row) => [...row]),
    difficulty: 'easy',
    puzzleId: 'test-1',
    selected: { row: 1, col: 1 },
    mistakes: 2,
    status: 'playing',
  };
}

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('round-trips a game state', () => {
    const original = makeState();
    saveGame(original);
    const loaded = loadSavedGame();
    expect(loaded).not.toBeNull();
    expect(loaded!.puzzleId).toBe('test-1');
    expect(loaded!.difficulty).toBe('easy');
    expect(loaded!.mistakes).toBe(2);
    expect(loaded!.status).toBe('playing');
    expect(loaded!.selected).toEqual({ row: 1, col: 1 });
    expect(loaded!.grid.size).toBe(3);
    expect(loaded!.grid.cells[0][0].state).toBe('empty');
    expect(loaded!.grid.cells[0][0].value).toBe(1);
  });

  it('returns null when storage is empty', () => {
    expect(loadSavedGame()).toBeNull();
  });

  it('returns null for corrupted JSON', () => {
    localStorage.setItem('simple-hitori-save', 'not-json');
    expect(loadSavedGame()).toBeNull();
  });

  it('returns null for missing required fields', () => {
    localStorage.setItem('simple-hitori-save', JSON.stringify({ puzzleId: 'x' }));
    expect(loadSavedGame()).toBeNull();
  });

  it('clears saved game', () => {
    saveGame(makeState());
    clearSavedGame();
    expect(loadSavedGame()).toBeNull();
  });

  it('silently handles localStorage write errors', () => {
    const original = makeState();
    const spy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    expect(() => saveGame(original)).not.toThrow();
    spy.mockRestore();
  });

  it('silently handles localStorage remove errors', () => {
    const spy = vi.spyOn(localStorage, 'removeItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    expect(() => clearSavedGame()).not.toThrow();
    spy.mockRestore();
  });
});
