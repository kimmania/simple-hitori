import type { GameState } from './hitori/types';
import { applySnapshot, captureSnapshot, type HistorySnapshot } from './hitori/history';
import { toggleCell } from './hitori/moves';
import { resetGameState, startNewGame } from './hitori/puzzle';
import { clearSavedGame, loadSavedGame, saveGame } from './hitori/storage';
import { bindBoardClick, createBoard, renderBoard } from './ui/board';
import {
  bindControlHandlers,
  getSelectedDifficulty,
  setDifficulty,
  setUndoEnabled,
  showWinBanner,
  updateMistakes,
  updatePlayStatus,
  updatePuzzleId,
} from './ui/controls';
import { getPlayStatus } from './hitori/validate';
import { closeHelp, openHelp } from './ui/help';

export class HitoriApp {
  private state: GameState | null = null;
  private board = createBoard(document.getElementById('board')!);
  private loading = false;
  // Intentionally single-step: we only preserve the state immediately before the latest move.
  private previousSnapshot: HistorySnapshot | null = null;

  async init(): Promise<void> {
    bindBoardClick(this.board, (row, col) => this.handleCell(row, col));
    bindControlHandlers({
      onNewGame: () => void this.newGame(),
      onReset: () => this.handleReset(),
      onUndo: () => this.handleUndo(),
      onHelp: () => openHelp(),
      onDifficultyChange: () => void this.newGame(),
    });

    document.getElementById('play-again')?.addEventListener('click', () => void this.newGame());

    document.addEventListener('keydown', (event) => this.handleKeydown(event));

    const saved = loadSavedGame();
    if (saved && saved.status === 'playing') {
      this.state = saved;
      setDifficulty(saved.difficulty);
      this.clearUndo();
      this.refresh();
      return;
    }

    await this.newGame();
  }

  private async newGame(): Promise<void> {
    if (this.loading) return;
    this.loading = true;
    clearSavedGame();
    this.clearUndo();
    closeHelp();

    try {
      const difficulty = getSelectedDifficulty();
      this.state = await startNewGame(difficulty);
      this.refresh();
    } catch (error) {
      console.error(error);
      alert('Could not load a puzzle. Please try again.');
    } finally {
      this.loading = false;
    }
  }

  private handleReset(): void {
    if (!this.state) return;
    resetGameState(this.state);
    this.clearUndo();
    this.refresh();
  }

  private clearUndo(): void {
    this.previousSnapshot = null;
    setUndoEnabled(false);
  }

  private stashSnapshot(): void {
    if (!this.state || this.state.status === 'won') return;
    this.previousSnapshot = captureSnapshot(this.state);
  }

  private handleCell(row: number, col: number): void {
    if (!this.state || this.state.status === 'won') return;

    this.stashSnapshot();
    this.state.selected = { row, col };
    toggleCell(this.state, row, col);
    this.refresh();
  }

  private handleUndo(): void {
    if (!this.state || !this.previousSnapshot) return;
    applySnapshot(this.state, this.previousSnapshot);
    this.previousSnapshot = null;
    this.refresh();
  }

  private handleKeydown(event: KeyboardEvent): void {
    // Help dialog takes precedence; still let Escape close it
    if (document.querySelector('#help-dialog[open]')) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeHelp();
      }
      return;
    }

    if (!this.state || this.state.status === 'won') return;

    const target = event.target as HTMLElement;
    if (target.tagName === 'SELECT' || target.tagName === 'BUTTON') return;

    if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
      event.preventDefault();
      this.handleUndo();
      return;
    }

    const selected = this.state.selected;
    let row = selected?.row ?? 0;
    let col = selected?.col ?? 0;
    const max = this.state.grid.size - 1;

    if (!selected) {
      const isNav = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Enter'].includes(
        event.key,
      );
      if (!isNav) return;
      event.preventDefault();
      this.state.selected = { row, col };
      if (event.key === ' ' || event.key === 'Enter') {
        this.handleCell(row, col);
      } else {
        this.refresh();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowUp':
        row = Math.max(0, row - 1);
        break;
      case 'ArrowDown':
        row = Math.min(max, row + 1);
        break;
      case 'ArrowLeft':
        col = Math.max(0, col - 1);
        break;
      case 'ArrowRight':
        col = Math.min(max, col + 1);
        break;
      case ' ':
      case 'Enter':
        event.preventDefault();
        this.handleCell(row, col);
        return;
      default:
        return;
    }

    event.preventDefault();
    this.state.selected = { row, col };
    this.refresh();
  }

  private refresh(): void {
    if (!this.state) return;

    renderBoard(this.board, this.state);
    updateMistakes(this.state.mistakes);
    updatePuzzleId(this.state.puzzleId);
    setUndoEnabled(this.previousSnapshot !== null);

    const playStatus = getPlayStatus(this.state.grid, this.state.solution);
    if (playStatus.won && this.state.status !== 'won') {
      this.state.status = 'won';
    }
    updatePlayStatus(playStatus.message, playStatus.detail);
    showWinBanner(this.state.status === 'won', playStatus.detail);

    if (this.state.status === 'playing') {
      saveGame(this.state);
    } else {
      clearSavedGame();
    }
  }
}

export async function bootstrap(): Promise<void> {
  const app = new HitoriApp();
  await app.init();
}
