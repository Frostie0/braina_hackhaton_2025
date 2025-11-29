'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QuizScreen from '@/app/(pages)/quiz/QuizScreen';
import FlashcardScreen from '@/app/(pages)/flashcard/flashcardScreen';

interface PlayConfig {
    mode: 'quiz' | 'flashcards' | 'multiplayer';
    quizId: string;
    questionsPerSession: number;
    shuffleQuestions: boolean;
}

interface PlayScreenProps {
    config: PlayConfig;
}

// Mock data - à remplacer par de vraies données d'API
const MOCK_QUIZ_DATA = {
    "q1": {
        title: "L'Empire Carolingien",
        questions: [
            {
                id: '1',
                type: 'multiple_choice',
                question: "Quel traité a officialisé le partage de l'empire carolingien ?",
                options: ["Traité de Rome", "Traité de Versailles", "Traité de Verdun", "Traité de Paris"],
                correctAnswer: "Traité de Verdun",
                explanation: "Le Traité de Verdun, signé en 843, a divisé l'empire carolingien entre les petits-fils de Charlemagne."
            },
            {
                id: '2',
                type: 'true_false',
                question: "La France Occidentale, issue du partage de l'empire carolingien, est l'ancêtre de l'Allemagne actuelle.",
                options: ["Vrai", "Faux"],
                correctAnswer: "Faux",
                explanation: "La Francie Occidentale est l'ancêtre de la France, tandis que la Francie Orientale a donné naissance à l'Allemagne."
            },
            {
                id: '3',
                type: 'multiple_choice',
                question: "Comment appelle-t-on les anciens esclaves qui ont été libérés ?",
                options: ["Les serfs", "Les affranchis", "Les vassaux", "Les citoyens"],
                correctAnswer: "Les affranchis",
                explanation: "Les affranchis sont des anciens esclaves qui ont obtenu leur liberté."
            },
            {
                id: '4',
                type: 'true_false',
                question: "Les affranchis avaient le même statut social que les nobles.",
                options: ["Vrai", "Faux"],
                correctAnswer: "Faux",
                explanation: "Bien que libres, les affranchis conservaient un statut inférieur à celui des nobles et même des hommes libres de naissance."
            },
            {
                id: '5',
                type: 'multiple_choice',
                question: "Qui a été sacré empereur en l'an 800 ?",
                options: ["Clovis", "Charlemagne", "Louis XIV", "Napoléon"],
                correctAnswer: "Charlemagne",
                explanation: "Charlemagne a été sacré empereur d'Occident par le pape Léon III à Rome le jour de Noël de l'an 800."
            },
            {
                id: '6',
                type: 'multiple_choice',
                question: "Quel était le rôle des Missi Dominici ?",
                options: ["Collecter les impôts", "Surveiller les comtes", "Diriger l'armée", "Enseigner dans les écoles"],
                correctAnswer: "Surveiller les comtes",
                explanation: "Les Missi Dominici (envoyés du maître) étaient chargés d'inspecter les comtés et de s'assurer que les comtes respectaient les ordres royaux."
            },
            {
                id: '7',
                type: 'true_false',
                question: "La Renaissance carolingienne a contribué à la préservation des textes antiques.",
                options: ["Vrai", "Faux"],
                correctAnswer: "Vrai",
                explanation: "La Renaissance carolingienne a permis la copie et la préservation de nombreux manuscrits antiques dans les scriptoria des monastères."
            },
            {
                id: '8',
                type: 'multiple_choice',
                question: "Quelle écriture a été standardisée sous Charlemagne ?",
                options: ["Écriture gothique", "Minuscule caroline", "Capitale romaine", "Onciale"],
                correctAnswer: "Minuscule caroline",
                explanation: "La minuscule caroline était une écriture claire et lisible qui a facilité la copie et la diffusion des textes."
            },
            {
                id: '9',
                type: 'multiple_choice',
                question: "Quels sont les trois ordres de la société carolingienne ?",
                options: [
                    "Nobles, bourgeois, paysans",
                    "Oratores, Bellatores, Laboratores",
                    "Rois, prêtres, soldats",
                    "Maîtres, artisans, esclaves"
                ],
                correctAnswer: "Oratores, Bellatores, Laboratores",
                explanation: "La société était divisée en ceux qui prient (oratores), ceux qui combattent (bellatores) et ceux qui travaillent (laboratores)."
            },
            {
                id: '10',
                type: 'true_false',
                question: "L'économie carolingienne était principalement basée sur le commerce maritime.",
                options: ["Vrai", "Faux"],
                correctAnswer: "Faux",
                explanation: "L'économie carolingienne était majoritairement domaniale et agricole, bien que des échanges commerciaux existaient, notamment via les routes fluviales."
            }
        ],
        flashcards: [
            {
                term: "Traité de Verdun",
                definition: "Traité signé en 843 partageant l'empire carolingien en trois royaumes entre les petits-fils de Charlemagne.",
                memoryTip: "Verdun = Véritable Division"
            },
            {
                term: "Missi Dominici",
                definition: "Envoyés du maître chargés d'inspecter les comtés et de surveiller les comtes pour le compte du roi.",
                memoryTip: "Missi = Mission, Dominici = Du Dominus (maître)"
            },
            {
                term: "Capitulaire",
                definition: "Acte législatif émanant des rois carolingiens, divisé en chapitres (capitula).",
                memoryTip: "Capitulaire vient de Capitula (chapitres)"
            },
            {
                term: "Affranchis",
                definition: "Anciens esclaves qui ont été libérés mais conservaient un statut social inférieur.",
                memoryTip: "Affranchi = Libre de la servitude"
            },
            {
                term: "Renaissance carolingienne",
                definition: "Renouveau culturel et intellectuel sous Charlemagne : préservation des textes antiques, création d'écoles, standardisation de l'écriture.",
                memoryTip: "Renaissance = Renouveau de la culture"
            },
            {
                term: "Minuscule caroline",
                definition: "Écriture standardisée sous Charlemagne, claire et lisible, facilitant la copie des manuscrits.",
                memoryTip: "Caroline = de Charlemagne (Carolus)"
            },
            {
                term: "Oratores",
                definition: "Premier ordre de la société : ceux qui prient (le clergé).",
                memoryTip: "Orare = Prier en latin"
            },
            {
                term: "Bellatores",
                definition: "Deuxième ordre de la société : ceux qui combattent (la noblesse guerrière).",
                memoryTip: "Bellum = Guerre en latin"
            },
            {
                term: "Laboratores",
                definition: "Troisième ordre de la société : ceux qui travaillent (paysans et artisans).",
                memoryTip: "Labor = Travail en latin"
            },
            {
                term: "Lotharingie",
                definition: "Royaume médian attribué à Lothaire lors du partage de l'empire carolingien, comprenant l'Italie, la Provence et la Bourgogne.",
                memoryTip: "Lotharingie = Terre de Lothaire"
            }
        ]
    }
};

export default function PlayScreen({ config }: PlayScreenProps) {
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simuler le chargement des données
        const loadData = async () => {
            try {
                // En production, ce serait un appel API
                // const response = await fetch(`/api/quiz/${config.quizId}`);
                // const responseData = await response.json();

                // Pour l'instant, utiliser les données mockées
                const mockData = MOCK_QUIZ_DATA[config.quizId as keyof typeof MOCK_QUIZ_DATA] || MOCK_QUIZ_DATA["q1"];

                let processedData: any = { ...mockData };

                // Pour le mode quiz, traiter les questions
                if (config.mode === 'quiz') {
                    let questions = [...mockData.questions];

                    // Limiter le nombre de questions selon la configuration
                    if (config.questionsPerSession < questions.length) {
                        questions = questions.slice(0, config.questionsPerSession);
                    }

                    // Mélanger les questions si demandé
                    if (config.shuffleQuestions) {
                        questions = questions.sort(() => Math.random() - 0.5);
                    }

                    processedData = {
                        ...mockData,
                        questions
                    };
                }

                // Pour le mode flashcards, traiter les flashcards
                if (config.mode === 'flashcards') {
                    let flashcards = [...mockData.flashcards];

                    // Limiter le nombre de flashcards selon la configuration
                    if (config.questionsPerSession < flashcards.length) {
                        flashcards = flashcards.slice(0, config.questionsPerSession);
                    }

                    // Mélanger les flashcards si demandé
                    if (config.shuffleQuestions) {
                        flashcards = flashcards.sort(() => Math.random() - 0.5);
                    }

                    processedData = {
                        flashcards
                    };
                }

                setData(processedData);
                setLoading(false);
            } catch (error) {
                console.error('Error loading data:', error);
                router.push('/dashboard');
            }
        };

        loadData();
    }, [config, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-400">Chargement du {config.mode}...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Contenu introuvable</h1>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="text-purple-400 hover:underline"
                    >
                        Retour au Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Redirection vers le bon composant selon le mode
    switch (config.mode) {
        case 'quiz':
            return <QuizScreen quiz={data} />;
        case 'flashcards':
            return <FlashcardScreen quiz={data} />;
        case 'multiplayer':
            // TODO: Créer MultiplayerScreen component
            return (
                <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Mode Multijoueur</h1>
                        <p className="text-gray-400 mb-6">Cette fonctionnalité sera bientôt disponible !</p>
                        <button
                            onClick={() => router.push(`/quiz/${config.quizId}`)}
                            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
                        >
                            Retour au quiz
                        </button>
                    </div>
                </div>
            );
        default:
            return <QuizScreen quiz={data} />;
    }
}
