import React, { useState } from 'react';
import Header from './components/Header';
import Simulator from './components/Simulator';
import InfoPage from './components/InfoPage';

const App: React.FC = () => {
  const [view, setView] = useState<'simulator' | 'info'>('simulator');

  return (
    <div className="min-h-screen flex flex-col">
      <Header onNav={setView} currentView={view} />
      
      <main className="flex-grow">
        {view === 'simulator' ? (
          <div className="py-6 md:py-10">
            <div className="text-center mb-6 md:mb-10 px-4 intro-section">
              <h1 className="text-2xl md:text-4xl font-extrabold text-[#00205B] mb-2 md:mb-3 intro-title">Estimez vos droits à l'AAH 2025</h1>
              <p className="text-slate-600 max-w-xl mx-auto intro-text">
                Répondez à quelques questions pour obtenir une simulation personnalisée de votre allocation mensuelle.
              </p>
            </div>
            <Simulator />
          </div>
        ) : (
          <InfoPage onBack={() => setView('simulator')} />
        )}
      </main>

      <footer className="bg-slate-100 border-t border-slate-200 py-10 mt-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-500 mb-4">
            Simulateur non-officiel à visée informative uniquement. 
            Données basées sur les barèmes AAH 2024/2025.
          </p>
          <div className="flex justify-center gap-6 text-xs text-[#0063B1] font-semibold">
            <a href="https://www.service-public.fr/particuliers/vosdroits/F12233" target="_blank" rel="noopener noreferrer" className="hover:underline">Service-Public.fr</a>
            <a href="https://www.caf.fr/allocataires/aides-et-demarches/droits-et-prestations/handicap/l-allocation-aux-adultes-handicapes-aah" target="_blank" rel="noopener noreferrer" className="hover:underline">Caf.fr</a>
            <a href="https://www.msa.fr/lfy/handicap/aah" target="_blank" rel="noopener noreferrer" className="hover:underline">MSA.fr</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;