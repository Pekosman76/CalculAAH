
export type Nationality = 'Française' | 'EEE - UE - Suisse' | 'Hors UE';
export type LivingSituation = 'Seul' | 'En couple';

export interface ResourcesN2 {
  activite: number;
  autres: number;
  pensions: number;
  fraisReels: number;
  pensionsRecues: number;
  pensionsVersees: number;
  foncierNet: number;
}

export interface ProfessionalIncomes {
  salaire: number;
  primeActivite: number;
  stageFormation: number;
  remunerationStage: number;
  autoEntrepreneur: number;
  agricole: number;
  microEntreprise: number;
  liberal: number;
}

export interface SimulationData {
  age: number;
  nationalite: Nationality;
  isHandicapped: boolean;
  handicapRate: number;
  hasRSDAE: boolean; // Restriction Substantielle et Durable d'Accès à l'Emploi
  livingSituation: LivingSituation;
  hasChildren: boolean;
  childrenCount: number;
  hasProfessionalIncome: boolean;
  professionalIncomes: ProfessionalIncomes;
  hasAllocations: boolean;
  allocations: {
    rsa: number;
    pensionInvalidite: number;
    pensionAlimentaire: number;
  };
  resourcesN2: ResourcesN2;
  isHospitalized: boolean;
}

export interface CalculationResult {
  isEligible: boolean;
  amount: number;
  messages: string[];
  ceiling: number;
  totalIncomeUsed: number;
}
