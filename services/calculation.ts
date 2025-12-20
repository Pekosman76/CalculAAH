
import { SimulationData, CalculationResult } from '../types';
import { 
  MONTANT_MAX_AAH, 
  SEUIL_ABATTEMENT_ORDINAIRE, 
  TAUX_ABATTEMENT_TRANCHE_1, 
  TAUX_ABATTEMENT_TRANCHE_2,
  RATIO_HOSPITALISATION
} from '../constants';

export const calculateAAH = (data: SimulationData): CalculationResult => {
  const messages: string[] = [];
  
  // 1. Basic Eligibility Checks
  if (data.age < 16) {
    return { isEligible: false, amount: 0, ceiling: 0, totalIncomeUsed: 0, messages: ["L'âge minimum pour l'AAH est de 16 ans."] };
  }

  if (!data.isHandicapped || data.handicapRate < 50) {
    return { isEligible: false, amount: 0, ceiling: 0, totalIncomeUsed: 0, messages: ["Le taux de handicap doit être d'au moins 50%."] };
  }

  if (data.handicapRate < 80 && !data.hasRSDAE) {
    messages.push("Attention : Pour un taux entre 50% et 79%, vous devez justifier d'une Restriction Substantielle et Durable d'Accès à l'Emploi (RSDAE) reconnue par la CDAPH.");
  }

  // 2. Resource Calculation with Abatements
  // Fix: Added explicit type cast for Object.values result to ensure type safety in reduce
  const sumProfessionalIncomes = (Object.values(data.professionalIncomes) as number[]).reduce((a, b) => a + b, 0);
  
  // Logic for abatements on professional income
  let incomeAfterAbatement = 0;
  if (sumProfessionalIncomes > 0) {
    const tranche1 = Math.min(sumProfessionalIncomes, SEUIL_ABATTEMENT_ORDINAIRE);
    const tranche2 = Math.max(0, sumProfessionalIncomes - SEUIL_ABATTEMENT_ORDINAIRE);
    
    // On garde 20% de la tranche 1 et 60% de la tranche 2
    incomeAfterAbatement = (tranche1 * (1 - TAUX_ABATTEMENT_TRANCHE_1)) + (tranche2 * (1 - TAUX_ABATTEMENT_TRANCHE_2));
  }

  // Monthly Resources N-2 (Simplified)
  const resN2 = data.resourcesN2;
  const sumN2Monthly = (
    resN2.activite + 
    resN2.autres + 
    resN2.pensions + 
    resN2.pensionsRecues + 
    resN2.foncierNet - 
    resN2.fraisReels - 
    resN2.pensionsVersees
  ) / 12;

  // Monthly Allocations
  const monthlyAllocations = data.allocations.rsa + data.allocations.pensionInvalidite + data.allocations.pensionAlimentaire;

  const totalResourcesMonthly = incomeAfterAbatement + Math.max(0, sumN2Monthly) + monthlyAllocations;

  // 3. Final AAH Calculation
  let baseAmount = MONTANT_MAX_AAH;
  
  // Hospitalization adjustment
  if (data.isHospitalized) {
    baseAmount = MONTANT_MAX_AAH * RATIO_HOSPITALISATION;
    messages.push(`Montant ajusté pour hospitalisation ou incarcération (> 60 jours) : ~${baseAmount.toFixed(2)} €.`);
  }

  let finalAmount = Math.max(0, baseAmount - totalResourcesMonthly);

  // 4. Resource Ceiling (Simple monthly approximation)
  // Standard ceiling single: ~1033.32. Coupled ceiling logic is complex, 
  // but usually AAH is "decoupled" since 2023. We focus on the user's individual resources.
  // We add a simplified check for the " plafond de ressources"
  const ceilingMonthly = 1033.32 + (data.hasChildren ? (data.childrenCount * 516.66) : 0);

  if (totalResourcesMonthly > ceilingMonthly) {
    return { 
      isEligible: false, 
      amount: 0, 
      ceiling: ceilingMonthly, 
      totalIncomeUsed: totalResourcesMonthly,
      messages: ["Vos ressources dépassent le plafond mensuel estimé."] 
    };
  }

  return {
    isEligible: true,
    amount: finalAmount,
    ceiling: ceilingMonthly,
    totalIncomeUsed: totalResourcesMonthly,
    messages
  };
};
