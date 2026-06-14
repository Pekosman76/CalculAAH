async function injectPartial(targetId, filePath) {
  const mount = document.getElementById(targetId);
  if (!mount) return;
  try {
    const res = await fetch(filePath, { cache: 'no-cache' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    mount.innerHTML = await res.text();
  } catch (err) {
    console.warn(`Impossible de charger ${filePath}:`, err);
  }
}

const prettyPathToFile = {
  '': 'index.html',
  'guide-2026': 'guide-2026.html',
  'conditions-eligibilite': 'conditions-eligibilite-aah.html',
  'montant-2026': 'montant-aah-2026.html',
  'aah-travail': 'aah-et-travail.html',
  'demarches': 'demarches-mdph-caf.html',
  'faq': 'faq-aah.html',
  'a-propos': 'a-propos.html',
  'contact': 'contact.html',
  'mentions-legales': 'mentions-legales.html',
  'politique-confidentialite': 'politique-confidentialite.html',
};

function getCurrentPageKey() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  const lastPart = parts.pop() || '';
  const fileName = lastPart.endsWith('.html') ? lastPart : prettyPathToFile[lastPart] || 'index.html';
  return window.location.hash ? `${fileName}${window.location.hash}` : fileName;
}

function setupDropdownNav() {
  const dropdowns = document.querySelectorAll('.nav-dropdown');

  dropdowns.forEach((dropdown) => {
    const button = dropdown.querySelector('.nav-dropdown__button');
    if (!button) return;

    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = dropdown.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(isOpen));
    });
  });

  document.addEventListener('click', () => {
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove('is-open');
      dropdown.querySelector('.nav-dropdown__button')?.setAttribute('aria-expanded', 'false');
    });
  });
}

function markActiveNav() {
  const currentPageKey = getCurrentPageKey();
  const currentFile = currentPageKey.split('#')[0];
  const navLinks = document.querySelectorAll('.main-nav a');

  navLinks.forEach((link) => {
    const matchKey = link.getAttribute('data-active-match') || '';
    const isExactHashMatch = matchKey.includes('#') && matchKey === currentPageKey;
    const hashTargetsSamePage = window.location.hash && currentFile === 'guide-2026.html' && matchKey === 'guide-2026.html';
    const isPageMatch = !matchKey.includes('#') && matchKey === currentFile && !hashTargetsSamePage;

    if (isExactHashMatch || isPageMatch) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
      link.closest('.nav-dropdown')?.classList.add('is-active');
    }
  });
}

(async function initLayoutPartials() {
  await injectPartial('site-header', 'header.html');
  await injectPartial('site-footer', 'footer.html');
  setupDropdownNav();
  markActiveNav();
})();
