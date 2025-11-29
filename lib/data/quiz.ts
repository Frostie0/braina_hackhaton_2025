// Types pour les quiz
export interface Quiz {
  id: string;
  title: string;
  date: string; // Format: "DD MMM YYYY"
  dateTimestamp: number; // Timestamp pour le tri
  questions: number;
  masteryPercentage: number;
  category: 'history' | 'science' | 'technology' | 'literature' | 'math' | 'other';
}

// Données de quiz factices
export const quizData: Quiz[] = [
  {
    id: '1',
    title: "Quiz d'Histoire: Partage Carolingien & Administration",
    date: "09 sept. 2024",
    dateTimestamp: new Date('2024-09-09').getTime(),
    questions: 8,
    masteryPercentage: 75,
    category: 'history'
  },
  {
    id: '2',
    title: "Chimie Organique: Nomenclature et Isomérie",
    date: "15 sept. 2024",
    dateTimestamp: new Date('2024-09-15').getTime(),
    questions: 12,
    masteryPercentage: 45,
    category: 'science'
  },
  {
    id: '3',
    title: "Introduction au Développement Web (React)",
    date: "22 oct. 2024",
    dateTimestamp: new Date('2024-10-22').getTime(),
    questions: 20,
    masteryPercentage: 90,
    category: 'technology'
  },
  {
    id: '4',
    title: "Littérature Française: Le Réalisme du XIXe siècle",
    date: "29 oct. 2024",
    dateTimestamp: new Date('2024-10-29').getTime(),
    questions: 10,
    masteryPercentage: 60,
    category: 'literature'
  },
  {
    id: '5',
    title: "Mathématiques: Dérivées et Intégrales",
    date: "05 nov. 2024",
    dateTimestamp: new Date('2024-11-05').getTime(),
    questions: 15,
    masteryPercentage: 82,
    category: 'math'
  },
  {
    id: '6',
    title: "Histoire de l'Art: Renaissance Italienne",
    date: "12 nov. 2024",
    dateTimestamp: new Date('2024-11-12').getTime(),
    questions: 18,
    masteryPercentage: 55,
    category: 'history'
  },
  {
    id: '7',
    title: "Physique Quantique: Principes Fondamentaux",
    date: "20 nov. 2024",
    dateTimestamp: new Date('2024-11-20').getTime(),
    questions: 25,
    masteryPercentage: 38,
    category: 'science'
  },
  {
    id: '8',
    title: "JavaScript ES6+: Nouveautés et Asynchrone",
    date: "25 nov. 2024",
    dateTimestamp: new Date('2024-11-25').getTime(),
    questions: 14,
    masteryPercentage: 95,
    category: 'technology'
  }
];

// Types pour le tri
export type SortOrder = 'newest' | 'oldest' | 'mastery-high' | 'mastery-low';

// Fonction de tri
export const sortQuizzes = (quizzes: Quiz[], sortOrder: SortOrder): Quiz[] => {
  const sorted = [...quizzes];

  switch (sortOrder) {
    case 'newest':
      return sorted.sort((a, b) => b.dateTimestamp - a.dateTimestamp);
    case 'oldest':
      return sorted.sort((a, b) => a.dateTimestamp - b.dateTimestamp);
    case 'mastery-high':
      return sorted.sort((a, b) => b.masteryPercentage - a.masteryPercentage);
    case 'mastery-low':
      return sorted.sort((a, b) => a.masteryPercentage - b.masteryPercentage);
    default:
      return sorted;
  }
};
