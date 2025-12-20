
import React from 'react';

interface HeaderProps {
  onNav: (view: 'simulator' | 'info') => void;
  currentView: 'simulator' | 'info';
}

const Header: React.FC<HeaderProps> = ({ onNav, currentView }) => {
  return (
    <header className="bg-[#00205B] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1 rounded">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#00205B"/>
                <path d="M2 17L12 22L22 17" stroke="#00205B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="#00205B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
          </div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight">Simulation AAH 2025</h1>
        </div>
        <nav className="flex gap-4">
          <button 
            onClick={() => onNav('simulator')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${currentView === 'simulator' ? 'bg-[#0063B1]' : 'hover:bg-blue-800'}`}
          >
            Simulateur
          </button>
          <button 
            onClick={() => onNav('info')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${currentView === 'info' ? 'bg-[#0063B1]' : 'hover:bg-blue-800'}`}
          >
            En savoir plus
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
