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

const routeAliases = {
  '': 'home', 'index.html': 'home',
  'conditions': 'conditions', 'conditions-eligibilite': 'conditions', 'conditions-eligibilite-aah.html': 'conditions',
  'montant-2026': 'montant-2026', 'montant-aah-2026.html': 'montant-2026',
  'guide-2026': 'guide-2026', 'guide-2026.html': 'guide-2026',
  'aah-travail': 'aah-travail', 'aah-et-travail.html': 'aah-travail',
  'demarches': 'demarches', 'demarches-mdph-caf.html': 'demarches',
  'faq': 'faq', 'faq-aah.html': 'faq',
  'a-propos': 'a-propos', 'a-propos.html': 'a-propos',
  'contact': 'contact', 'contact.html': 'contact',
  'mentions-legales': 'mentions-legales', 'mentions-legales.html': 'mentions-legales',
  'politique-confidentialite': 'politique-confidentialite', 'politique-confidentialite.html': 'politique-confidentialite'
};
const understandRoutes = new Set(['conditions','montant-2026','guide-2026','mini-blog','aah-travail','blog']);
function currentRoute() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  if (parts[0] === 'blog') return 'blog';
  const last = parts.pop() || '';
  if ((last === 'guide-2026' || last === 'guide-2026.html') && window.location.hash === '#mini-blog') return 'mini-blog';
  return routeAliases[last] || 'home';
}
function closeDisclosure(disclosure) {
  const button = disclosure.querySelector('.site-header__disclosure-button');
  const menu = disclosure.querySelector('.site-header__submenu');
  disclosure.classList.remove('is-open'); button?.setAttribute('aria-expanded','false'); if (menu) menu.hidden = true;
}
function openDisclosure(disclosure) {
  const button = disclosure.querySelector('.site-header__disclosure-button');
  const menu = disclosure.querySelector('.site-header__submenu');
  disclosure.classList.add('is-open'); button?.setAttribute('aria-expanded','true'); if (menu) menu.hidden = false;
}
function setupHeaderNav() {
  const header = document.querySelector('.site-header'); if (!header) return;
  const mobilePanel = header.querySelector('#mobile-nav');
  const primary = header.querySelector('.site-header__primary');
  const utility = header.querySelector('.site-header__utility');
  if (mobilePanel && primary && utility) mobilePanel.innerHTML = primary.innerHTML + utility.innerHTML;
  header.querySelectorAll('.site-header__disclosure').forEach((disclosure) => {
    const button = disclosure.querySelector('.site-header__disclosure-button');
    button?.addEventListener('click', (event) => { event.stopPropagation(); disclosure.classList.contains('is-open') ? closeDisclosure(disclosure) : openDisclosure(disclosure); });
  });
  header.querySelector('.site-header__mobile-toggle')?.addEventListener('click', (event) => {
    const btn = event.currentTarget; const isOpen = mobilePanel.classList.toggle('is-open'); mobilePanel.hidden = !isOpen; btn.setAttribute('aria-expanded', String(isOpen));
  });
  document.addEventListener('click', (event) => { if (!header.contains(event.target)) header.querySelectorAll('.site-header__disclosure').forEach(closeDisclosure); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') header.querySelectorAll('.site-header__disclosure').forEach(closeDisclosure); });
}
function markActiveNav() {
  const active = currentRoute();
  document.querySelectorAll('.site-header [aria-current="page"]').forEach((el)=>el.removeAttribute('aria-current'));
  document.querySelectorAll('.site-header__link--active').forEach((el)=>el.classList.remove('site-header__link--active'));
  document.querySelectorAll('.site-header__disclosure.is-active').forEach((el)=>el.classList.remove('is-active'));
  document.querySelectorAll(`.site-header [data-route="${active}"]`).forEach((link)=>{ link.classList.add('site-header__link--active'); link.setAttribute('aria-current','page'); link.closest('.site-header__disclosure')?.classList.add('is-active'); });
  if (understandRoutes.has(active)) document.querySelectorAll('.site-header__disclosure').forEach((el)=>el.classList.add('is-active'));
}
(async function initLayoutPartials() { await injectPartial('site-header', '/header.html'); await injectPartial('site-footer', '/footer.html'); setupHeaderNav(); markActiveNav(); })();
