const chooser = document.getElementById('chooser');
const deckView = document.getElementById('deckView');
const pdf = document.getElementById('deckPdf');
const fallback = document.getElementById('pdfFallback');
const fallbackLink = document.getElementById('fallbackLink');
const downloadLink = document.getElementById('downloadLink');
const backBtn = document.getElementById('backBtn');
const title = document.getElementById('deckTitle');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const presentBtn = document.getElementById('presentBtn');

function openDeck(button) {
  const file = button.dataset.file;
  title.textContent = button.dataset.title;
  pdf.src = file + '#toolbar=0&navpanes=0&view=FitH&page=1';
  downloadLink.href = file;
  downloadLink.hidden = false;
  backBtn.hidden = false;
  fallbackLink.href = file;
  fallback.hidden = false;
  chooser.hidden = true;
  deckView.hidden = false;
}

document.querySelectorAll('.deck-option').forEach(button => {
  button.addEventListener('click', () => openDeck(button));
});
backBtn.addEventListener('click', () => {
  pdf.removeAttribute('src');
  deckView.hidden = true;
  chooser.hidden = false;
  downloadLink.hidden = true;
  backBtn.hidden = true;
});
function changePage(delta) {
  const currentUrl = new URL(pdf.src, window.location.href);
  const match = currentUrl.hash.match(/(?:^|&)page=(\d+)/);
  const page = Math.max(1, Number(match?.[1] || 1) + delta);
  currentUrl.hash = 'toolbar=0&navpanes=0&view=FitH&page=' + page;
  pdf.src = currentUrl.toString();
}
prevBtn.addEventListener('click', () => changePage(-1));
nextBtn.addEventListener('click', () => changePage(1));
presentBtn.addEventListener('click', async () => {
  try {
    if (!document.fullscreenElement) await deckView.requestFullscreen();
    else await document.exitFullscreen();
  } catch {}
});
pdf.addEventListener('error', () => { fallback.hidden = false; });
document.addEventListener('keydown', event => {
  if (chooser.hidden === false || event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === 'ArrowRight' || event.key === 'PageDown') {
    event.preventDefault();
    changePage(1);
  } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
    event.preventDefault();
    changePage(-1);
  }
});
