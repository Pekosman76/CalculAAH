# Analyse rapide du dépôt CalculAAH

## Points forts
- Structure claire (composants React séparés, logique métier isolée dans `services/calculation.ts`).
- Typage TypeScript en place avec des interfaces explicites (`SimulationData`, `CalculationResult`).
- Parcours utilisateur découpé en étapes, ce qui facilite la saisie.

## Risques / limites identifiés
1. **Règles AAH simplifiées**
   - Le calcul applique des hypothèses simplifiées (plafond fixe mensuel, logique découplée du couple, N-2 simplifié).
   - Le résultat doit rester présenté comme une **estimation** et non un droit opposable.

2. **Critères non bloquants pour 50–79% sans RSDAE**
   - Si le taux est entre 50% et 79% sans RSDAE, le calcul continue et affiche seulement un message d'alerte.
   - Selon l'objectif métier, vous pourriez vouloir rendre ce cas non éligible strict.

3. **Nationalité non vérifiée dans le moteur de calcul**
   - Le champ `nationalite` existe dans les types et l'UI, mais n'est pas utilisé dans la logique de décision.

4. **Écart entre constantes et logique effective**
   - Certaines constantes (`PLAFOND_ANNUEL_SOLO`, `MAJORATION_PAR_ENFANT_ANNUELLE`) ne pilotent pas le calcul actuel.
   - Le moteur utilise un plafond mensuel codé en dur (`1033.32 + enfants * 516.66`).

5. **Validation de saisie légère**
   - Les champs numériques peuvent accepter des décimales / valeurs atypiques selon les cas (ex. nombre d'enfants).

## Améliorations suggérées (priorisées)
1. **Priorité haute :** centraliser les règles métier (plafonds, majorations, conditions d'éligibilité) dans des constantes uniques et éviter les valeurs codées en dur.
2. **Priorité haute :** formaliser les cas bloquants (notamment 50–79% sans RSDAE) avec des tests unitaires.
3. **Priorité moyenne :** expliciter dans l'interface que le simulateur est indicatif et lister les hypothèses utilisées.
4. **Priorité moyenne :** ajouter une validation stricte des champs (entiers positifs pour enfants, bornes cohérentes).
5. **Priorité moyenne :** ajouter une suite de tests automatisés pour `calculateAAH` (cas nominal, plafond dépassé, hospitalisation, profils non éligibles).

## Commandes utiles pour continuer
- `npm install`
- `npm run build`

