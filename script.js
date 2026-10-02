const pdf = document.getElementById('deckPdf');
const fallback = document.getElementById('pdfFallback');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const presentBtn = document.getElementById('presentBtn');
const pdfUrl = 'downloads/VOLSHI_ARCHETRON_Caveman_Pitch_Deck_v2(1).pdf';

function changePage(delta) {
  const currentUrl = new URL(pdf.src, window.location.href);
  const match = currentUrl.hash.match(/(?:^|&)page=(\\d+)/);
  const page = Math.max(1, Number(match?.[1] || 1) + delta);
  currentUrl.hash = `toolbar=0&navpanes=0&view=FitH&page=${page}`;
  pdf.src = currentUrl.toString();
}

pdf.addEventListener('load', () => {
  // PDF viewer load events also fire when the browser cannot render PDFs,
  // so the direct PDF link remains available as the universal fallback.
  fallback.hidden = false;
  fallback.classList.add('is-hint');
});
pdf.addEventListener('error', () => {
  fallback.hidden = false;
  fallback.classList.remove('is-hint');
});
prevBtn.addEventListener('click', () => changePage(-1));
nextBtn.addEventListener('click', () => changePage(1));
presentBtn.addEventListener('click', async () => {
  const shell = document.querySelector('.deck-shell');
  try {
    if (!document.fullscreenElement) await shell.requestFullscreen();
    else await document.exitFullscreen();
  } catch {
    // Full-screen can be unavailable in embedded browser contexts.
  }
});
document.addEventListener('keydown', (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === 'ArrowRight' || event.key === 'PageDown') {
    event.preventDefault();
    changePage(1);
  } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
    event.preventDefault();
    changePage(-1);
  } else if (event.key.toLowerCase() === 'f') {
    event.preventDefault();
    presentBtn.click();
  }
});
