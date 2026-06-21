import type { GameState } from '../hitori/types';
import { getConflictCells, getHighlightCells, getWrongCells } from '../hitori/validate';

type BoardElements = {
  container: HTMLElement;
  cells: HTMLElement[][];
};

export function createBoard(container: HTMLElement): BoardElements {
  container.tabIndex = 0;
  return { container, cells: [] };
}

export function ensureBoardSize(board: BoardElements, size: number): void {
  if (board.cells.length === size && board.cells[0]?.length === size) return;

  board.container.innerHTML = '';
  board.container.style.setProperty('--board-n', String(size));
  board.container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  board.container.style.gridTemplateRows = `repeat(${size}, 1fr)`;
  board.container.setAttribute('aria-rowcount', String(size));
  board.container.setAttribute('aria-colcount', String(size));

  const cells: HTMLElement[][] = [];
  for (let row = 0; row < size; row++) {
    cells[row] = [];
    for (let col = 0; col < size; col++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.setAttribute('role', 'gridcell');
      cell.dataset.row = String(row);
      cell.dataset.col = String(col);
      cell.tabIndex = -1;

      const valueEl = document.createElement('span');
      valueEl.className = 'cell-value';
      valueEl.textContent = '';
      cell.appendChild(valueEl);

      board.container.appendChild(cell);
      cells[row][col] = cell;
    }
  }
  board.cells = cells;
}

export function renderBoard(board: BoardElements, state: GameState): void {
  ensureBoardSize(board, state.grid.size);

  const conflicts = getConflictCells(state.grid);
  const wrong = getWrongCells(state.grid, state.solution);
  const related =
    state.selected !== null
      ? getHighlightCells(state.grid, state.selected.row, state.selected.col)
      : new Set<string>();

  for (let row = 0; row < state.grid.size; row++) {
    for (let col = 0; col < state.grid.size; col++) {
      const key = `${row},${col}`;
      const cellData = state.grid.cells[row][col];
      const cellEl = board.cells[row][col];
      const valueEl = cellEl.querySelector('.cell-value') as HTMLElement;

      cellEl.classList.toggle('black', cellData.state === 'black');
      cellEl.classList.toggle('white', cellData.state === 'white');
      cellEl.classList.toggle(
        'selected',
        state.selected?.row === row && state.selected?.col === col,
      );
      cellEl.classList.toggle(
        'related',
        related.has(key) && !(state.selected?.row === row && state.selected?.col === col),
      );
      cellEl.classList.toggle('conflict', conflicts.has(key));
      cellEl.classList.toggle('wrong', wrong.has(key));

      const marking =
        cellData.state === 'black' ? 'shaded' : cellData.state === 'white' ? 'kept' : 'undecided';
      valueEl.textContent = String(cellData.value);
      cellEl.setAttribute(
        'aria-label',
        `Row ${row + 1} column ${col + 1}, ${cellData.value}, ${marking}`,
      );
      cellEl.setAttribute(
        'aria-selected',
        String(state.selected?.row === row && state.selected?.col === col),
      );
    }
  }
}

export function bindBoardClick(
  board: BoardElements,
  onCell: (row: number, col: number) => void,
): void {
  board.container.addEventListener('click', (event) => {
    const target = (event.target as HTMLElement).closest('.cell') as HTMLElement | null;
    if (!target) return;
    const row = parseInt(target.dataset.row ?? '', 10);
    const col = parseInt(target.dataset.col ?? '', 10);
    if (Number.isNaN(row) || Number.isNaN(col)) return;
    onCell(row, col);
  });
}
