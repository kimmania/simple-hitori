const HELP_HTML = `
<h2 id="help-title">How to play Hitori</h2>
<p>
  <strong>Your job:</strong> decide which cells to <strong>shade black</strong>. Shaded cells are
  “removed” — the number still shows, but it no longer counts in that row or column.
</p>
<p>
  <strong>You win</strong> when all three rules are true at once. The status line above the board
  tells you if you still need more shades or if something is wrong. A green <strong>You win!</strong>
  banner appears when the puzzle is complete.
</p>

<h3>The three rules</h3>
<ol>
  <li><strong>No duplicates</strong> — In every row and column, each number appears at most once among cells you leave unshaded.</li>
  <li><strong>No touching shades</strong> — Two shaded cells cannot share an edge (diagonal is fine).</li>
  <li><strong>Stay connected</strong> — All unshaded cells must form one group via up/down/left/right moves.</li>
</ol>

<h3>Using this app</h3>
<ul>
  <li><strong>Tap a cell</strong> to cycle: undecided → white ring (keep) → black (shade) → undecided. Tap once to confirm a safe cell; tap twice to shade a duplicate. If you shade by accident, tap again to fix it — the mistake is removed.</li>
  <li><strong>Reset</strong> clears your markings on the current puzzle.</li>
  <li><strong>Undo</strong> reverts your last cell change (⌘Z / Ctrl+Z).</li>
  <li><strong>Mistakes</strong> count wrong markings vs. the solution and new rule violations.</li>
</ul>

<h3>Difficulty</h3>
<p>Grid size sets difficulty: 5×5 Easy, 6×6 Medium, 8×8 Hard, 12×12 Expert.</p>

<h3>Starter patterns</h3>

<div class="help-example">
  <p><strong>Triplet</strong> — three identical numbers in a row: the middle cannot be shaded; the ends must be shaded.</p>
  <div class="mini-grid mini-grid--5" aria-hidden="true">
    <span class="m">5</span><span class="m b">5</span><span class="m">5</span><span></span><span></span>
    <span></span><span></span><span></span><span></span><span></span>
    <span></span><span></span><span></span><span></span><span></span>
    <span></span><span></span><span></span><span></span><span></span>
    <span></span><span></span><span></span><span></span><span></span>
  </div>
</div>

<div class="help-example">
  <p><strong>Pair + duplicate</strong> — two identical neighbors plus the same number elsewhere in the line: the distant one must be shaded.</p>
</div>

<div class="help-example">
  <p><strong>Sandwich</strong> — same number on both sides: the middle cannot be shaded.</p>
  <div class="mini-grid mini-grid--3" aria-hidden="true">
    <span class="m">4</span><span class="m w">2</span><span class="m">4</span>
    <span></span><span></span><span></span>
    <span></span><span></span><span></span>
  </div>
</div>

<div class="help-example">
  <p><strong>Connectivity</strong> — if shading would split unshaded cells into islands, that shade is wrong; keep a path open.</p>
</div>

<p class="help-credit">
  Puzzle type from Nikoli. Rules reference:
  <a href="https://en.wikipedia.org/wiki/Hitori" target="_blank" rel="noopener noreferrer">Wikipedia — Hitori</a>.
</p>
`;

let dialog: HTMLDialogElement | null = null;

function getDialog(): HTMLDialogElement {
  if (dialog) return dialog;

  dialog = document.createElement('dialog');
  dialog.id = 'help-dialog';
  dialog.className = 'help-dialog';
  dialog.setAttribute('aria-labelledby', 'help-title');

  const content = document.createElement('div');
  content.className = 'help-dialog-content';
  content.innerHTML = HELP_HTML;

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'btn btn-primary help-close';
  closeBtn.textContent = 'Close';
  closeBtn.addEventListener('click', () => dialog?.close());

  dialog.appendChild(content);
  dialog.appendChild(closeBtn);
  document.body.appendChild(dialog);

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog?.close();
  });

  return dialog;
}

export function openHelp(): void {
  const el = getDialog();
  if (typeof el.showModal === 'function') {
    el.showModal();
  } else {
    el.setAttribute('open', '');
  }
}

export function closeHelp(): void {
  dialog?.close();
}
