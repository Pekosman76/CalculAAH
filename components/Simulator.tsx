import React, { useState } from 'react';
import { SimulationData, Nationality, LivingSituation, CalculationResult } from '../types';
import { calculateAAH } from '../services/calculation';

const initialData: SimulationData = {
  age: 0, // Initialisé à 0 pour permettre l'affichage du placeholder
  nationalite: 'Française',
  isHandicapped: true,
  handicapRate: 80,
  hasRSDAE: false,
  livingSituation: 'Seul',
  hasChildren: false,
  childrenCount: 0,
  hasProfessionalIncome: false,
  professionalIncomes: {
    salaire: 0,
    primeActivite: 0,
    stageFormation: 0,
    remunerationStage: 0,
    autoEntrepreneur: 0,
    agricole: 0,
    microEntreprise: 0,
    liberal: 0,
  },
  hasAllocations: false,
  allocations: {
    rsa: 0,
    pensionInvalidite: 0,
    pensionAlimentaire: 0,
  },
  resourcesN2: {
    activite: 0,
    autres: 0,
    pensions: 0,
    fraisReels: 0,
    pensionsRecues: 0,
    pensionsVersees: 0,
    foncierNet: 0,
  },
  isHospitalized: false
};

// Extraction du composant InputField à l'extérieur pour éviter la perte de focus lors du re-render
const InputField = ({ label, value, onChange, type = "number", min = 0, placeholder }: any) => {
  // Si la valeur est 0, on affiche une chaîne vide pour laisser place au placeholder
  const displayValue = value === 0 ? '' : value;

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input 
        type={type}
        min={min}
        placeholder={placeholder}
        value={displayValue}
        onChange={(e) => {
          // Supprimer les zéros non significatifs en début de chaîne (ex: 05 -> 5)
          // Mais conserver le zéro si c'est "0." pour les décimaux
          let val = e.target.value.replace(/^0+(?=\d)/, '');
          onChange(val === '' ? 0 : parseFloat(val));
        }}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0063B1] focus:border-transparent outline-none transition-all"
      />
    </div>
  );
};

const Simulator: React.FC = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<SimulationData>(initialData);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  const restart = () => {
    setData(initialData);
    setResult(null);
    setStep(1);
  };

  const handleCalculate = () => {
    const res = calculateAAH(data);
    setResult(res);
  };

  const updateNested = (category: keyof SimulationData, field: string, value: number) => {
    setData(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] as object),
        [field]: value
      }
    }));
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Progress Bar */}
        {!result && (
          <div className="h-2 bg-slate-100 flex">
            {[1, 2, 3, 4, 5].map(i => (
              <div 
                key={i} 
                className={`flex-1 transition-all duration-500 ${step >= i ? 'bg-[#0063B1]' : 'bg-slate-200'}`}
              />
            ))}
          </div>
        )}

        <div className="p-8">
          {result ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-[#00205B] mb-6">Résultat de votre estimation</h2>
              
              <div className={`p-6 rounded-2xl mb-6 ${result.isEligible ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className="text-lg font-medium mb-1">
                  {result.isEligible ? 'Éligibilité probable' : 'Non éligible selon ces critères'}
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {result.isEligible ? `${result.amount.toFixed(2)} € / mois` : '0,00 €'}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {result.messages.map((msg, idx) => (
                  <div key={idx} className="flex gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                    <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    {msg}
                  </div>
                ))}
                <p className="text-xs text-slate-400 italic">
                  Note : Cette simulation est fournie à titre indicatif. Seule une décision officielle de la Caf ou de la MSA après dépôt de dossier est valable.
                </p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={restart}
                  className="flex-1 bg-white border-2 border-[#0063B1] text-[#0063B1] font-bold py-3 px-6 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Recommencer
                </button>
                <button 
                  onClick={() => setResult(null)}
                  className="flex-1 bg-[#00205B] text-white font-bold py-3 px-6 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Modifier mes infos
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: Personal */}
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h2 className="text-2xl font-bold text-[#00205B] mb-6">Étape 1 : Informations personnelles</h2>
                  <InputField 
                    label="Quel est votre âge ?" 
                    value={data.age} 
                    onChange={(v: number) => setData({...data, age: v})}
                    min={16}
                    placeholder="25"
                  />
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nationalité</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {(['Française', 'EEE - UE - Suisse', 'Hors UE'] as Nationality[]).map(n => (
                        <button
                          key={n}
                          onClick={() => setData({...data, nationalite: n})}
                          className={`py-2 px-4 rounded-lg border-2 text-sm font-medium transition-all ${data.nationalite === n ? 'border-[#0063B1] bg-blue-50 text-[#0063B1]' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Êtes-vous en situation de handicap reconnu ?</label>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setData({...data, isHandicapped: true})}
                        className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${data.isHandicapped ? 'border-[#0063B1] bg-blue-50 text-[#0063B1]' : 'border-slate-200'}`}
                      >
                        Oui
                      </button>
                      <button 
                        onClick={() => setData({...data, isHandicapped: false})}
                        className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${!data.isHandicapped ? 'border-red-500 bg-red-50 text-red-500' : 'border-slate-200'}`}
                      >
                        Non
                      </button>
                    </div>
                  </div>

                  {data.isHandicapped && (
                    <div className="p-4 bg-slate-50 rounded-xl mb-6">
                      <label className="block text-sm font-medium text-slate-700 mb-3">Taux de handicap : <span className="text-[#0063B1] font-bold">{data.handicapRate}%</span></label>
                      <input 
                        type="range" min="0" max="100" step="1" 
                        value={data.handicapRate}
                        onChange={(e) => setData({...data, handicapRate: parseInt(e.target.value)})}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0063B1]"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>0%</span>
                        <span>50%</span>
                        <span>80%</span>
                        <span>100%</span>
                      </div>
                      
                      {data.handicapRate >= 50 && data.handicapRate < 80 && (
                        <div className="mt-4 flex items-start gap-3 p-3 bg-blue-100 rounded-lg">
                           <input 
                              type="checkbox" 
                              checked={data.hasRSDAE} 
                              onChange={(e) => setData({...data, hasRSDAE: e.target.checked})}
                              className="mt-1"
                           />
                           <label className="text-xs text-blue-800">
                             J'ai une Restriction Substantielle et Durable d'Accès à l'Emploi (RSDAE) reconnue.
                           </label>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: Family */}
              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h2 className="text-2xl font-bold text-[#00205B] mb-6">Étape 2 : Situation familiale</h2>
                  
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-slate-700 mb-3">Votre situation de vie</label>
                    <div className="flex gap-4">
                      {(['Seul', 'En couple'] as LivingSituation[]).map(ls => (
                        <button
                          key={ls}
                          onClick={() => setData({...data, livingSituation: ls})}
                          className={`flex-1 py-4 rounded-xl border-2 font-bold transition-all ${data.livingSituation === ls ? 'border-[#0063B1] bg-blue-50 text-[#0063B1]' : 'border-slate-200 text-slate-500'}`}
                        >
                          {ls}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-3">Avez-vous des enfants à charge ?</label>
                    <div className="flex gap-4 mb-4">
                      <button 
                        onClick={() => setData({...data, hasChildren: true})}
                        className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${data.hasChildren ? 'border-[#0063B1] bg-blue-50 text-[#0063B1]' : 'border-slate-200'}`}
                      >
                        Oui
                      </button>
                      <button 
                        onClick={() => setData({...data, hasChildren: false, childrenCount: 0})}
                        className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${!data.hasChildren ? 'border-[#0063B1] bg-blue-50 text-[#0063B1]' : 'border-slate-200'}`}
                      >
                        Non
                      </button>
                    </div>
                    {data.hasChildren && (
                      <InputField 
                        label="Nombre d'enfants" 
                        value={data.childrenCount} 
                        onChange={(v: number) => setData({...data, childrenCount: v})}
                        min={1}
                        placeholder="0"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: Professional Income */}
              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h2 className="text-2xl font-bold text-[#00205B] mb-2">Étape 3 : Revenus professionnels</h2>
                  <p className="text-slate-500 text-sm mb-6">Indiquez vos revenus mensuels nets actuels.</p>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-3">Percevez-vous des revenus pro ?</label>
                    <div className="flex gap-4 mb-6">
                      <button 
                        onClick={() => setData({...data, hasProfessionalIncome: true})}
                        className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${data.hasProfessionalIncome ? 'border-[#0063B1] bg-blue-50 text-[#0063B1]' : 'border-slate-200'}`}
                      >
                        Oui
                      </button>
                      <button 
                        onClick={() => setData({...data, hasProfessionalIncome: false})}
                        className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${!data.hasProfessionalIncome ? 'border-[#0063B1] bg-blue-50 text-[#0063B1]' : 'border-slate-200'}`}
                      >
                        Non
                      </button>
                    </div>

                    {data.hasProfessionalIncome && (
                      <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                        <InputField label="Salaire net (primes incluses)" value={data.professionalIncomes.salaire} onChange={(v: number) => updateNested('professionalIncomes', 'salaire', v)} placeholder="0" />
                        <InputField label="Prime d'activité" value={data.professionalIncomes.primeActivite} onChange={(v: number) => updateNested('professionalIncomes', 'primeActivite', v)} placeholder="0" />
                        <InputField label="Micro-entreprise / Auto-entrepreneur" value={data.professionalIncomes.autoEntrepreneur} onChange={(v: number) => updateNested('professionalIncomes', 'autoEntrepreneur', v)} placeholder="0" />
                        <InputField label="Autres (Stage, Libéral, Agricole)" value={data.professionalIncomes.liberal} onChange={(v: number) => updateNested('professionalIncomes', 'liberal', v)} placeholder="0" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: Other Resources */}
              {step === 4 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h2 className="text-2xl font-bold text-[#00205B] mb-2">Étape 4 : Autres ressources</h2>
                  <p className="text-slate-500 text-sm mb-6">Allocations et revenus imposables de l'année 2022 (N-2).</p>

                  <div className="space-y-6">
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <h3 className="text-sm font-bold text-slate-800 mb-4">Allocations mensuelles</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="RSA" value={data.allocations.rsa} onChange={(v: number) => updateNested('allocations', 'rsa', v)} placeholder="0" />
                        <InputField label="Pension Invalidité" value={data.allocations.pensionInvalidite} onChange={(v: number) => updateNested('allocations', 'pensionInvalidite', v)} placeholder="0" />
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl">
                      <h3 className="text-sm font-bold text-slate-800 mb-4">Revenus annuels N-2 (2022)</h3>
                      <div className="space-y-4">
                        <InputField label="Revenus d'activité annuels" value={data.resourcesN2.activite} onChange={(v: number) => updateNested('resourcesN2', 'activite', v)} placeholder="0" />
                        <InputField label="Pensions, Retraites, Rentes annuelles" value={data.resourcesN2.pensions} onChange={(v: number) => updateNested('resourcesN2', 'pensions', v)} placeholder="0" />
                        <InputField label="Revenus fonciers nets annuels" value={data.resourcesN2.foncierNet} onChange={(v: number) => updateNested('resourcesN2', 'foncierNet', v)} placeholder="0" />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                       <input 
                          type="checkbox" 
                          checked={data.isHospitalized} 
                          onChange={(e) => setData({...data, isHospitalized: e.target.checked})}
                          className="w-4 h-4"
                       />
                       <label className="text-xs text-yellow-800 font-medium">
                         Je suis hospitalisé ou incarcéré depuis plus de 60 jours.
                       </label>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Summary */}
              {step === 5 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h2 className="text-2xl font-bold text-[#00205B] mb-6">Dernière étape : Récapitulatif</h2>
                  
                  <div className="space-y-3 bg-slate-50 p-6 rounded-2xl mb-8">
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-500">Âge :</span>
                      <span className="font-bold">{data.age || '--'} ans</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-500">Handicap :</span>
                      <span className="font-bold">{data.handicapRate}% {data.hasRSDAE ? '(RSDAE)' : ''}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-500">Situation :</span>
                      <span className="font-bold">{data.livingSituation} {data.hasChildren ? `(${data.childrenCount} enf.)` : ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total revenus pro mensuels :</span>
                      <span className="font-bold text-[#0063B1]">
                        {(Object.values(data.professionalIncomes) as number[]).reduce((a, b) => a + b, 0).toFixed(2)} €
                      </span>
                    </div>
                  </div>

                  <p className="text-center text-sm text-slate-500 mb-8 px-4">
                    En cliquant sur calculer, vous acceptez que ces données soient traitées localement pour estimer vos droits.
                  </p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-slate-100">
                {step > 1 && (
                  <button 
                    onClick={prevStep}
                    className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 px-6 rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Précédent
                  </button>
                )}
                {step < 5 ? (
                  <button 
                    onClick={nextStep}
                    className="flex-1 bg-[#0063B1] text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Suivant
                  </button>
                ) : (
                  <button 
                    onClick={handleCalculate}
                    className="flex-1 bg-[#00205B] text-white font-bold py-3 px-6 rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
                  >
                    Calculer mon AAH
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Simulator;