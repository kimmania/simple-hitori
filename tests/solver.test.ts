import { describe, expect, it } from 'vitest';
import { solutionToString } from '../src/hitori/grid';
import { countSolutions, solveHitori } from '../src/hitori/solver';

const CLASSIC_5 = [
  [2, 2, 1, 5, 3],
  [2, 3, 1, 4, 5],
  [1, 1, 1, 3, 5],
  [1, 3, 5, 4, 2],
  [5, 4, 3, 2, 1],
];

describe('solver', () => {
  it('solves the classic 5×5 puzzle uniquely', () => {
    const solution = solveHitori(CLASSIC_5, 5);
    expect(solution).not.toBeNull();
    expect(countSolutions(CLASSIC_5, 5, 2)).toBe(1);

    const encoded = solutionToString(solution!);
    expect(encoded.length).toBe(25);
    expect(encoded.match(/1/g)?.length).toBeGreaterThan(0);
  });
});
