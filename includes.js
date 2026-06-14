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

function markActiveNav() {
  const fileName = window.location.pathname.split('/').filter(Boolean).pop() || 'index.html';
  const currentPage = fileName.endsWith('.html') ? fileName : 'index.html';
  const navLinks = document.querySelectorAll('.main-nav a');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

(async function initLayoutPartials() {
  await injectPartial('site-header', 'header.html');
  await injectPartial('site-footer', 'footer.html');
  markActiveNav();
})();
