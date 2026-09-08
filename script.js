/* DrawBreath research page. All illustration state stays in the browser. */
'use strict';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav-links');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('is-open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', event => {
  if (!event.target.closest('.nav')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  document.documentElement.classList.add('js-reveal');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
}
reducedMotion.addEventListener('change', event => {
  if (event.matches) document.documentElement.classList.remove('js-reveal');
});
const progress = document.querySelector('.reading-progress');
const sections = [...document.querySelectorAll('main section[id]')];
let framePending = false;
function updateScroll() {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${Math.max(0, Math.min(1, window.scrollY / (available || 1)))})`;
  let active = '';
  sections.forEach(section => {
    if (section.getBoundingClientRect().top <= 180) active = section.id;
  });
  navigation.querySelectorAll('a').forEach(link => {
    const selected = link.getAttribute('href') === `#${active}`;
    link.classList.toggle('active', selected);
    if (selected) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  framePending = false;
}
window.addEventListener('scroll', () => {
  if (!framePending) { framePending = true; requestAnimationFrame(updateScroll); }
}, { passive: true });
window.addEventListener('resize', updateScroll);
updateScroll();

// Stay and Observe deliberately retain the same sidebar appearance.
const stateData = {
  stay: { number: '01', title: 'Stay within reach.', description: 'When evidence favors continued availability—for example, during an active support exchange—the assistant stays present.', rule: 'The sidebar remains visible and available.' },
  observe: { number: '02', title: 'Give the process time.', description: 'When evidence is uncertain or conflicting, the system defers withdrawal and waits for more context. A pause alone is not a reason to step back.', rule: 'The same sidebar stays available. No extra contribution is introduced.' },
  withdraw: { number: '03', title: 'Make a little room.', description: 'When evidence supports stepping back, a validated Withdraw judgment can initiate a gradual fade. The child can interrupt it or bring support back afterward.', rule: 'An interruptible fade begins; the drawing workspace stays unchanged.' }
};
const stateTabs = [...document.querySelectorAll('[data-state]')];
const statePanel = document.querySelector('#state-panel');
const restoreButton = document.querySelector('#restore-ai');
const cancelButton = document.querySelector('#cancel-fade');
const quietLabel = document.querySelector('.quiet-label');
const stateHint = document.querySelector('#demo-hint');
let fadeTimer;
function setState(state, source = 'tab') {
  clearTimeout(fadeTimer);
  const data = stateData[state];
  stateTabs.forEach(tab => {
    const selected = tab.dataset.state === state;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  statePanel.dataset.current = state;
  statePanel.setAttribute('aria-labelledby', `tab-${state}`);
  for (const [id, value] of Object.entries({ 'state-number': data.number, 'state-title': data.title, 'state-description': data.description, 'state-rule': data.rule })) {
    document.getElementById(id).textContent = value;
  }
  restoreButton.hidden = true;
  quietLabel.hidden = true;
  cancelButton.hidden = state !== 'withdraw';
  stateHint.textContent = source === 'return' ? 'Support is available again, at the child’s initiative.' : source === 'cancel' ? 'The fade was cancelled. Support stays available.' : 'Select a judgment to explore the design.';
  if (source !== 'tab') document.querySelector('#tab-stay').focus({ preventScroll: true });
  if (state === 'withdraw') {
    stateHint.textContent = 'Try cancelling the fade, or let it finish and bring AI back.';
    fadeTimer = setTimeout(() => {
      if (statePanel.dataset.current !== 'withdraw') return;
      const cancelHadFocus = document.activeElement === cancelButton;
      cancelButton.hidden = true;
      restoreButton.hidden = false;
      quietLabel.hidden = false;
      document.querySelector('#state-rule').textContent = 'The fade has completed. The child can restore support whenever they choose.';
      stateHint.textContent = 'Select “Bring AI back” to explore child-initiated re-entry.';
      if (cancelHadFocus) restoreButton.focus({ preventScroll: true });
    }, reducedMotion.matches ? 150 : 2900);
  }
}
stateTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => setState(tab.dataset.state));
  tab.addEventListener('keydown', event => {
    const last = stateTabs.length - 1;
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % stateTabs.length;
    if (event.key === 'ArrowLeft') next = (index + last) % stateTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = last;
    if (next !== undefined) {
      event.preventDefault(); stateTabs[next].focus(); setState(stateTabs[next].dataset.state);
    }
  });
});
restoreButton.addEventListener('click', () => setState('stay', 'return'));
cancelButton.addEventListener('click', () => setState('stay', 'cancel'));

// Figure viewer: all six original research figures, with keyboard navigation.
const figures = [
  { key: 'overview', title: 'Adaptive participation over the creative process', caption: 'Figure 1 · The drawing continuation task and the tension between premature withdrawal and continued foreground presence.' },
  { key: 'system', title: 'The DrawBreath system', caption: 'Figure 2 · Study setting, drawing workspace, and sidebar progression. The child can cancel the fade or restore support.' },
  { key: 'participation', title: 'Participation trajectories', caption: 'Figure 3 · 65 task records in 30-second intervals. Colors represent predominant participation states; symbols mark re-entry and cancelled fades.' },
  { key: 'continuation', title: 'Activity after completed withdrawal', caption: 'Figure 4 · 65 completed withdrawals aligned at t = 0. Each marker shows the first observed event within 90 seconds.' },
  { key: 'perceptions', title: 'Perceptions and withdrawal positions', caption: 'Figure 5 · Left: six questionnaire items (N = 65; Q2 is negatively worded). Right: first completed withdrawal within time and action progress (61 records).' },
  { key: 'trajectories', title: 'Three paths through the creative process', caption: 'Figure 6 · A: elaboration. B: revision. C: reorientation with renewed AI engagement. Canvas snapshots proceed from left to right.' }
];
const dialog = document.querySelector('#figure-dialog');
let figureIndex = 0;
let figureTrigger;
function showFigure(index) {
  figureIndex = (index + figures.length) % figures.length;
  const figure = figures[figureIndex];
  const sourceImage = document.querySelector(`[data-figure="${figure.key}"] img`);
  const fullImage = document.querySelector('#lightbox-image');
  fullImage.src = sourceImage.src;
  fullImage.alt = sourceImage.alt;
  document.querySelector('#lightbox-title').textContent = figure.title;
  document.querySelector('#lightbox-caption').textContent = figure.caption;
  document.querySelector('#lightbox-index').textContent = `FIGURE ${String(figureIndex + 1).padStart(2, '0')} / 06`;
  document.querySelector('#figure-original').href = sourceImage.src;
}
document.querySelectorAll('[data-figure]').forEach(button => {
  button.addEventListener('click', () => {
    figureTrigger = button;
    showFigure(figures.findIndex(figure => figure.key === button.dataset.figure));
    dialog.showModal();
    document.body.classList.add('modal-open');
    document.querySelector('.lightbox-close').focus();
  });
});
document.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
document.querySelector('#figure-prev').addEventListener('click', () => showFigure(figureIndex - 1));
document.querySelector('#figure-next').addEventListener('click', () => showFigure(figureIndex + 1));
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});
dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault(); showFigure(figureIndex + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  figureTrigger?.focus({ preventScroll: true });
});

document.querySelector('#copy-citation').addEventListener('click', async () => {
  const bibtex = document.querySelector('#bibtex');
  const status = document.querySelector('#copy-status');
  const copyButton = document.querySelector('#copy-citation');
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(bibtex.textContent);
    status.textContent = 'BibTeX copied to clipboard.';
    copyButton.textContent = 'Copied ✓';
  } catch {
    const range = document.createRange();
    range.selectNodeContents(bibtex);
    const selection = window.getSelection();
    selection.removeAllRanges(); selection.addRange(range);
    status.textContent = 'Citation selected. Press Ctrl+C (or ⌘C) to copy.';
  }
});
