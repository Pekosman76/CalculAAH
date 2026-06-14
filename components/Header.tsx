import React from 'react';

interface HeaderProps {
  onNav?: (view: 'simulator' | 'info') => void;
  currentView?: 'simulator' | 'info';
}

const navItems = [
  { href: 'index.html', label: 'Simulateur', view: 'simulator' as const },
  { href: 'guide-2026.html', label: 'Guide 2026' },
  { href: 'conditions-eligibilite-aah.html', label: 'Conditions' },
  { href: 'montant-aah-2026.html', label: 'Montant 2026' },
  { href: 'aah-et-travail.html', label: 'AAH et travail' },
  { href: 'demarches-mdph-caf.html', label: 'Démarches' },
  { href: 'faq-aah.html', label: 'FAQ' },
  { href: 'a-propos.html', label: 'À propos' },
  { href: 'contact.html', label: 'Contact' },
  { href: 'mentions-legales.html', label: 'Mentions légales' },
  { href: 'politique-confidentialite.html', label: 'Confidentialité' },
];

const Header: React.FC<HeaderProps> = ({ onNav, currentView = 'simulator' }) => {
  return (
    <header className="site-header">
      <div className="site-header__container">
        <a className="brand" href="index.html" aria-label="Calcul AAH - accueil">Calcul AAH</a>
        <div className="main-nav-scroll">
          <nav className="main-nav" aria-label="Navigation principale">
            {navItems.map((item) => {
              const isSimulatorButton = item.view === 'simulator' && onNav;
              const isActive = item.view ? currentView === item.view : false;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={isActive ? 'is-active' : undefined}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={isSimulatorButton ? (event) => {
                    event.preventDefault();
                    onNav('simulator');
                  } : undefined}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
