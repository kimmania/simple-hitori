import type { Difficulty } from '../hitori/types';

export function getDifficultySelect(): HTMLSelectElement {
  return document.getElementById('difficulty') as HTMLSelectElement;
}

export function getSelectedDifficulty(): Difficulty {
  return getDifficultySelect().value as Difficulty;
}

export function setDifficulty(difficulty: Difficulty): void {
  getDifficultySelect().value = difficulty;
}

export function updateMistakes(count: number): void {
  const el = document.getElementById('mistakes');
  if (el) el.textContent = `Mistakes: ${count}`;
}

export function updatePuzzleId(id: string): void {
  const label = id ? `#${id}` : '';
  document.getElementById('puzzle-id')?.replaceChildren(document.createTextNode(label));
  document.getElementById('puzzle-id-footer')?.replaceChildren(document.createTextNode(label));
}

export function setUndoEnabled(enabled: boolean): void {
  const btn = document.getElementById('undo') as HTMLButtonElement | null;
  if (!btn) return;
  btn.disabled = !enabled;
}

export function showWinBanner(show: boolean, detail?: string): void {
  const banner = document.getElementById('win-banner');
  if (!banner) return;
  banner.classList.toggle('hidden', !show);
  const detailEl = document.getElementById('win-banner-detail');
  if (detailEl && detail) {
    detailEl.textContent = detail;
  }
}

export function updatePlayStatus(message: string, detail: string): void {
  const goalEl = document.getElementById('goal-status');
  const detailEl = document.getElementById('goal-detail');
  if (goalEl) goalEl.textContent = message;
  if (detailEl) detailEl.textContent = detail;
}

export function bindControlHandlers(handlers: {
  onNewGame: () => void;
  onReset: () => void;
  onUndo: () => void;
  onHelp: () => void;
  onDifficultyChange: () => void;
}): void {
  document.getElementById('new-game')?.addEventListener('click', handlers.onNewGame);
  document.getElementById('reset')?.addEventListener('click', handlers.onReset);
  document.getElementById('undo')?.addEventListener('click', handlers.onUndo);
  document.getElementById('help')?.addEventListener('click', handlers.onHelp);
  getDifficultySelect().addEventListener('change', handlers.onDifficultyChange);
}
