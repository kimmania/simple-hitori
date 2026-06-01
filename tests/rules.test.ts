import { describe, expect, it } from 'vitest';
import { createGrid } from '../src/hitori/grid';
import { getDuplicateCells, isDisconnected, rulesSatisfied } from '../src/hitori/rules';

describe('rules', () => {
  it('detects duplicate unshaded numbers in a row', () => {
    const grid = createGrid(3, [
      [1, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ]);
    const dupes = getDuplicateCells(grid);
    expect(dupes.has('0,0')).toBe(true);
    expect(dupes.has('0,1')).toBe(true);
  });

  it('detects disconnected unshaded regions', () => {
    const grid = createGrid(3, [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);
    grid.cells[1][0].state = 'black';
    grid.cells[1][1].state = 'black';
    grid.cells[1][2].state = 'black';
    expect(isDisconnected(grid)).toBe(true);
  });

  it('accepts a valid partial marking', () => {
    const grid = createGrid(2, [
      [1, 2],
      [2, 1],
    ]);
    grid.cells[0][0].state = 'black';
    expect(rulesSatisfied(grid)).toBe(true);
  });
});
