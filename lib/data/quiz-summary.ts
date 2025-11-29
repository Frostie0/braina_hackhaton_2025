export const quizSummaries: Record<string, string> = {
    "q1": `## Le Partage de l'Empire Carolingien

Le **traité de Verdun (843)** marque un tournant majeur dans l'histoire européenne. Il officialise la division définitive de l'Empire carolingien en trois royaumes distincts, posant les bases de la carte politique de l'Europe moderne.

### Les Trois Royaumes

- **Francie Occidentale** : Attribuée à Charles le Chauve, elle préfigure le royaume de France
- **Francie Orientale** : Accordée à Louis le Germanique, future base de l'Allemagne
- **Lotharingie** : Confiée à Lothaire, comprenant les territoires médians (Italie, Provence, Bourgogne)

Ce partage marque symboliquement la fin de l'unité impériale héritée de Charlemagne et dessine les contours des futures nations européennes.


## Société et Organisation

La société carolingienne s'organise selon une hiérarchie stricte, théorisée par les penseurs de l'époque en **trois ordres fonctionnels** :

1. **Oratores** (Ceux qui prient)
   - Le clergé séculier et régulier
   - Garants de la spiritualité et de la culture écrite

2. **Bellatores** (Ceux qui combattent)
   - La noblesse guerrière
   - Protecteurs du royaume et des populations

3. **Laboratores** (Ceux qui travaillent)
   - La paysannerie et les artisans
   - Producteurs de richesses et base économique

> **Note économique** : L'économie reste majoritairement domaniale et agricole, structurée autour du système de la villa carolingienne. Les échanges commerciaux, bien qu'affaiblis par rapport à l'Antiquité, persistent notamment grâce aux routes fluviales et aux foires.


### Administration et Gouvernance

L'administration carolingienne repose sur plusieurs piliers :

- **Les comtes** : Administrateurs locaux nommés par le roi, responsables d'un territoire (comté)
- **Missi Dominici** ("Envoyés du maître") : Inspecteurs royaux itinérants chargés de surveiller les comtes
- **Capitulaires** : Actes législatifs royaux, véritable corpus juridique de l'époque
- **L'Église** : Acteur central, non seulement spirituel mais aussi politique et culturel


### La Renaissance Carolingienne

Cette période voit un renouveau culturel sans précédent :

- Standardisation de l'écriture (minuscule caroline)
- Création d'écoles palatines et épiscopales
- Préservation et copie de manuscrits antiques
- Développement de la littérature latine chrétienne

Ce mouvement intellectuel, soutenu par Charlemagne et ses successeurs, sauve de l'oubli une partie considérable du patrimoine culturel occidental.


---

**Synthèse** : L'époque carolingienne représente une transition cruciale entre l'Antiquité tardive et le Moyen Âge classique, posant les fondements institutionnels, culturels et territoriaux de l'Europe médiévale.`,

    // Ajoutez d'autres résumés pour d'autres quiz ici
    "default": `## Résumé du cours

Ce résumé sera disponible prochainement.

Consultez les **Questions** et **Flashcards** pour réviser le contenu du quiz.`
};

// Fonction helper pour récupérer le résumé d'un quiz
export function getQuizSummary(quizId: string): string {
    return quizSummaries[quizId] || quizSummaries["default"];
}
