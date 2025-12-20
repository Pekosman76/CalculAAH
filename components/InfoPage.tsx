
import React from 'react';

interface InfoPageProps {
  onBack: () => void;
}

const InfoPage: React.FC<InfoPageProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto py-6 md:py-10 px-4 info-page-container">
      <button 
        onClick={onBack}
        className="mb-4 md:mb-8 flex items-center gap-2 text-[#0063B1] font-semibold hover:underline"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        Retour au simulateur
      </button>

      <h1 className="text-xl md:text-3xl font-bold text-[#00205B] mb-6 md:mb-8 info-banner-title">Tout savoir sur l'AAH en 2025</h1>

      <div className="space-y-12">
        <section id="definition">
          <h2 className="text-2xl font-semibold text-[#0063B1] mb-4">Qu'est-ce que l'AAH ?</h2>
          <p className="text-slate-700 leading-relaxed">
            L'Allocation aux Adultes Handicapés (AAH) est une aide financière qui permet d'assurer un revenu minimum aux personnes handicapées. Elle est versée par la Caf ou la MSA sous conditions d'âge, de résidence, de handicap et de ressources.
          </p>
        </section>

        <section id="conditions">
          <h2 className="text-2xl font-semibold text-[#0063B1] mb-4">Conditions d'attribution</h2>
          <ul className="list-disc pl-5 space-y-3 text-slate-700">
            <li><strong>Résidence :</strong> Habiter en France de manière permanente.</li>
            <li><strong>Âge :</strong> Avoir au moins 20 ans (ou 16 ans si vous n'êtes plus à la charge de vos parents).</li>
            <li><strong>Handicap :</strong> 
              <ul className="list-circle pl-5 mt-2 space-y-1">
                <li>Taux d'incapacité supérieur ou égal à 80%.</li>
                <li>Ou taux compris entre 50% et 79% avec une Restriction Substantielle et Durable d'Accès à l'Emploi (RSDAE).</li>
              </ul>
            </li>
            <li><strong>Ressources :</strong> Vos revenus annuels ne doivent pas dépasser un certain plafond (ex: 12 399,84 € pour une personne seule).</li>
          </ul>
        </section>

        <section id="calcul">
          <h2 className="text-2xl font-semibold text-[#0063B1] mb-4">Calcul et montant</h2>
          <p className="text-slate-700 mb-4">
            Depuis avril 2024, le montant maximal de l'AAH est de <strong>1 033,32 €</strong> par mois.
          </p>
          <div className="bg-slate-100 p-6 rounded-xl">
            <h3 className="font-bold mb-2">Exemple de calcul simplifié :</h3>
            <p className="text-sm italic text-slate-600">
              Si vous gagnez 600€ nets par mois :<br/>
              - Une partie de vos revenus est abattue (ex: 80% sur les premiers 540€).<br/>
              - Le montant de l'AAH est la différence entre le montant max (1033€) et vos revenus restants après abattement.
            </p>
          </div>
        </section>

        <section id="demarches">
          <h2 className="text-2xl font-semibold text-[#0063B1] mb-4">Démarches pour demander l'AAH</h2>
          <ol className="list-decimal pl-5 space-y-3 text-slate-700">
            <li>Retirer un dossier auprès de votre <strong>MDPH</strong> (Maison Départementale des Personnes Handicapées).</li>
            <li>Remplir le formulaire et joindre un certificat médical récent.</li>
            <li>Le dossier est évalué par la <strong>CDAPH</strong> qui décide de votre taux d'incapacité.</li>
            <li>Si le droit est accordé, la <strong>Caf</strong> ou la <strong>MSA</strong> procède au paiement.</li>
          </ol>
        </section>

        <section id="majoration">
          <h2 className="text-2xl font-semibold text-[#0063B1] mb-4">Majorations possibles</h2>
          <p className="text-slate-700">
            <strong>Majoration pour la Vie Autonome (MVA) :</strong> Un montant de 104,77 € peut s'ajouter si vous avez un taux de handicap d'au moins 80%, ne travaillez pas, vivez dans un logement indépendant et percevez une aide au logement.
          </p>
        </section>

        {/* Section SEO supplémentaire */}
        <section id="seo-details" className="pt-8 border-t border-slate-200">
          <h2 className="text-xl font-semibold text-[#00205B] mb-4">Informations complémentaires sur l'AAH 2025</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            L’<strong>allocation aux adultes handicapés</strong> est une prestation de solidarité visant à garantir un niveau de ressources minimal aux personnes en situation de handicap. Pour l'année 2025, l'<strong>aide financière handicap 2025</strong> demeure un dispositif central de l'inclusion sociale en France. Le <strong>montant AAH</strong> fait l'objet de revalorisations annuelles pour s'ajuster à l'inflation, permettant ainsi aux bénéficiaires de faire face aux dépenses quotidiennes.
          </p>
          <p className="text-slate-600 text-sm leading-relaxed">
            Pour être éligible, le respect des <strong>conditions d'éligibilité</strong> est impératif : au-delà du critère médical lié au taux d'incapacité, les plafonds de ressources sont étudiés avec soin par la Caisse d'Allocations Familiales. Réaliser une <strong>simulation AAH</strong> est une étape recommandée avant d'entamer les <strong>démarches MDPH</strong>. Ce simulateur vous permet d'estimer votre reste à percevoir en tenant compte de vos revenus professionnels et de votre situation familiale. Que vous soyez une personne seule ou en couple, le calcul différentiel de l'allocation adulte handicapé s'adapte à votre réalité financière pour vous offrir un soutien juste et équitable.
          </p>
        </section>
      </div>

      <footer className="mt-20 pt-8 border-t border-slate-200 text-sm text-slate-500">
        <p>Source : <a href="https://solidarites.gouv.fr" className="underline hover:text-[#0063B1]">solidarites.gouv.fr</a> - Données estimatives pour 2025.</p>
      </footer>
    </div>
  );
};

export default InfoPage;
