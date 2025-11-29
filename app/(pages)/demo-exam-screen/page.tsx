'use client';

import ExamScreen from '../play/[mode]/[id]/ExamScreen';

// Données de démo pour l'examen
const DEMO_QUIZ = {
    title: 'HISTOIRE-GÉOGRAPHIE',
    subject: 'Histoire-Géographie',
    questions: [
        {
            id: '1',
            type: 'multiple_choice',
            question: 'Les événements de 1946 marquent, sans conteste, un tournant décisif dans notre histoire. Présentez les éléments qui montrent que le mouvement de 1946 a constitué une révolution.',
            options: [
                'a) Changement politique brutal avec renversement du régime',
                'b) Simple réforme administrative sans impact majeur',
                'c) Mouvement culturel sans conséquence politique',
                'd) Transition pacifique vers la démocratie'
            ],
            correctAnswer: 'a) Changement politique brutal avec renversement du régime',
            explanation: 'Le mouvement de 1946 représente une véritable révolution politique qui a renversé le régime en place.'
        },
        {
            id: '2',
            type: 'multiple_choice',
            question: 'Expliquez le rôle du mouvement de 1946 dans la chute de Lescot et l\'accession de Dumarsais Estimé au pouvoir.',
            options: [
                'a) Le mouvement a forcé la démission de Lescot et facilité l\'arrivée d\'Estimé',
                'b) Lescot a volontairement cédé le pouvoir à Estimé',
                'c) Une intervention étrangère a imposé Estimé',
                'd) Le mouvement n\'a eu aucun impact sur la transition'
            ],
            correctAnswer: 'a) Le mouvement a forcé la démission de Lescot et facilité l\'arrivée d\'Estimé',
            explanation: 'Le mouvement populaire de 1946 a directement causé la chute de Lescot, ouvrant la voie à Dumarsais Estimé.'
        },
        {
            id: '3',
            type: 'multiple_choice',
            question: 'Dégagez le caractère nationaliste du régime de Vincent.',
            options: [
                'a) Politique de renforcement de la souveraineté nationale',
                'b) Soumission totale aux puissances étrangères',
                'c) Absence de politique nationale cohérente',
                'd) Internationalisme radical'
            ],
            correctAnswer: 'a) Politique de renforcement de la souveraineté nationale',
            explanation: 'Le régime de Vincent s\'est caractérisé par des mesures visant à renforcer l\'indépendance nationale.'
        },
        {
            id: '4',
            type: 'multiple_choice',
            question: 'Faites ressortir le rôle de l\'international dans la chute de Vincent.',
            options: [
                'a) Pressions diplomatiques et économiques internationales',
                'b) Intervention militaire directe',
                'c) Soutien international inconditionnel',
                'd) Aucune influence externe'
            ],
            correctAnswer: 'a) Pressions diplomatiques et économiques internationales',
            explanation: 'Le contexte international, notamment les pressions économiques, a contribué à affaiblir le régime de Vincent.'
        },
        {
            id: '5',
            type: 'multiple_choice',
            question: 'Supposez la Seconde Guerre Mondiale. Dans le temps, puis relevez dans le document les éléments qui s\'y réfèrent.',
            options: [
                'a) 1939-1945 : Conflit mondial opposant les Alliés aux forces de l\'Axe',
                'b) 1914-1918 : Première Guerre mondiale',
                'c) 1950-1953 : Guerre de Corée',
                'd) 1939-1945 : Guerre civile européenne uniquement'
            ],
            correctAnswer: 'a) 1939-1945 : Conflit mondial opposant les Alliés aux forces de l\'Axe',
            explanation: 'La Seconde Guerre mondiale s\'est déroulée de 1939 à 1945 et a impliqué la majorité des nations du monde.'
        },
        {
            id: '6',
            type: 'multiple_choice',
            question: 'Définissez l\'URSS. Puis, présentez pour la Seconde Guerre Mondiale : a) deux conséquences économiques ; b) une conséquence géopolitique.',
            options: [
                'a) URSS = Union des Républiques Socialistes Soviétiques ; Destruction économique massive et émergence de deux superpuissances',
                'b) URSS = Union Européenne ; Prospérité économique généralisée',
                'c) URSS = Organisation internationale ; Paix mondiale durable',
                'd) URSS = Royaume uni ; Stabilité économique totale'
            ],
            correctAnswer: 'a) URSS = Union des Républiques Socialistes Soviétiques ; Destruction économique massive et émergence de deux superpuissances',
            explanation: 'L\'URSS était l\'Union Soviétique. La guerre a causé des destructions économiques majeures et créé un monde bipolaire.'
        },
        {
            id: '7',
            type: 'multiple_choice',
            question: 'Selon le document 2, quelles sont les principales aires géographiques de la Triade ?',
            options: [
                'a) Amérique du Nord, Europe Occidentale, Asie de l\'Est (Japon)',
                'b) Afrique, Amérique du Sud, Asie du Sud',
                'c) Europe de l\'Est, Océanie, Amérique Centrale',
                'd) Moyen-Orient, Asie Centrale, Caraïbes'
            ],
            correctAnswer: 'a) Amérique du Nord, Europe Occidentale, Asie de l\'Est (Japon)',
            explanation: 'La Triade regroupe les trois principaux pôles économiques mondiaux : Amérique du Nord, Europe Occidentale et Asie-Pacifique.'
        },
        {
            id: '8',
            type: 'multiple_choice',
            question: 'Définissez le concept de Triade. Puis, citez un pays issu de chacun des pôles de la Triade.',
            options: [
                'a) Triade = 3 pôles économiques dominants ; USA (Amérique), Allemagne (Europe), Japon (Asie)',
                'b) Triade = Alliance militaire ; Russie, Chine, Inde',
                'c) Triade = Organisation commerciale ; Brésil, Afrique du Sud, Australie',
                'd) Triade = Groupe culturel ; France, Italie, Espagne'
            ],
            correctAnswer: 'a) Triade = 3 pôles économiques dominants ; USA (Amérique), Allemagne (Europe), Japon (Asie)',
            explanation: 'La Triade désigne les trois grands pôles de l\'économie mondiale, dominés par les États-Unis, l\'Union Européenne et le Japon.'
        },
        {
            id: '9',
            type: 'multiple_choice',
            question: 'L\'espace mondial est traditionnellement fondé sur les échanges de marchandises, de services, de capitaux, d\'information. Définissez deux de ces flux.',
            options: [
                'a) Marchandises = Biens physiques échangés ; Capitaux = Investissements et flux financiers',
                'b) Marchandises = Données numériques ; Services = Production agricole',
                'c) Capitaux = Main d\'œuvre ; Information = Ressources naturelles',
                'd) Services = Matières premières ; Marchandises = Technologies'
            ],
            correctAnswer: 'a) Marchandises = Biens physiques échangés ; Capitaux = Investissements et flux financiers',
            explanation: 'Les marchandises sont des produits tangibles échangés, tandis que les capitaux représentent les flux financiers et investissements internationaux.'
        },
        {
            id: '10',
            type: 'multiple_choice',
            question: 'Une nouvelle géographie du monde requier de l\'interdépendance mondiale, autour de la Triade. Selon le document, citez deux aires géographiques autour de chacun des pôles de la Triade.',
            options: [
                'a) Autour USA : Amérique Latine, Caraïbes ; Europe : Afrique du Nord, Europe de l\'Est ; Japon : Asie du Sud-Est, Océanie',
                'b) Autour USA : Europe, Asie ; Europe : Amérique, Afrique ; Japon : Europe, Amérique',
                'c) Toutes les régions sont équidistantes de tous les pôles',
                'd) Aucune aire géographique spécifique associée aux pôles'
            ],
            correctAnswer: 'a) Autour USA : Amérique Latine, Caraïbes ; Europe : Afrique du Nord, Europe de l\'Est ; Japon : Asie du Sud-Est, Océanie',
            explanation: 'Chaque pôle de la Triade exerce une influence économique prépondérante sur les régions géographiquement ou historiquement proches.'
        }
    ]
};

export default function DemoExamScreenPage() {
    return <ExamScreen quiz={DEMO_QUIZ} config={{ mode: 'exam', quizId: 'demo' }} />;
}
