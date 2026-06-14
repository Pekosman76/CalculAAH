import React, { useState } from 'react';

interface HeaderProps {
  onNav?: (view: 'simulator' | 'info') => void;
  currentView?: 'simulator' | 'info';
}

const understandItems = [
  { href: '/conditions', label: 'Conditions' },
  { href: '/montant-2026', label: 'Montant 2026' },
  { href: '/guide-2026', label: 'Guide 2026' },
  { href: '/guide-2026#mini-blog', label: 'Mini-blog pratique' },
  { href: '/aah-travail', label: 'AAH et travail' },
];

const Header: React.FC<HeaderProps> = ({ onNav, currentView = 'simulator' }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isSimulatorActive = currentView === 'simulator';

  return (
    <header className="site-header">
      <div className="site-header__container">
        <a className="brand" href="/" aria-label="Calcul AAH - accueil">Calcul AAH</a>
        <div className="main-nav-scroll">
          <nav className="main-nav" aria-label="Navigation principale">
            <a
              href="/"
              className={isSimulatorActive ? 'is-active' : undefined}
              aria-current={isSimulatorActive ? 'page' : undefined}
              onClick={onNav ? (event) => {
                event.preventDefault();
                onNav('simulator');
              } : undefined}
            >
              Simulateur
            </a>
            <div className={`nav-dropdown${isDropdownOpen ? ' is-open' : ''}`}>
              <button
                className="nav-dropdown__button"
                type="button"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
                onClick={() => setIsDropdownOpen((open) => !open)}
              >
                Comprendre l’AAH
                <span className="nav-dropdown__chevron" aria-hidden="true">▾</span>
              </button>
              <div className="nav-dropdown__menu" role="menu">
                {understandItems.map((item) => (
                  <a key={item.href} href={item.href} role="menuitem">{item.label}</a>
                ))}
              </div>
            </div>
            <a href="/demarches">Démarches</a>
            <a href="/faq">FAQ</a>
            <a href="/contact">Contact</a>
            <a className="nav-secondary" href="/a-propos">À propos</a>
            <a className="nav-secondary" href="/mentions-legales">Mentions légales</a>
            <a className="nav-secondary" href="/politique-confidentialite">Confidentialité</a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
