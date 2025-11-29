'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { shuffle } from '@/lib/shuffle';
import QuizScreen from '@/app/(pages)/quiz/QuizScreen';
import FlashcardScreen from '@/app/(pages)/flashcard/flashcardScreen';
import MultiplayerQuizScreen from './MultiplayerQuizScreen';
import TicTacToeMultiplayerScreen from './TicTacToeMultiplayerScreen';
import ExamScreen from './ExamScreen';

interface PlayConfig {
    mode: 'quiz' | 'flashcards' | 'exam' | 'multiplayer';
    quizId: string;
    questionsPerSession: number | 'all';
    shuffleQuestions: boolean;
    roomCode?: string;
    isHost?: boolean;
    multiplayerConfig?: {
        questionsPerSession: number | 'all';
        maxPlayers: number;
        timePerQuestion: number;
    };
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
                term: "Lotharingi",
                definition: "Royaume médian attribué à Lothaire lors du partage de l'empire carolingien, comprenant l'Italie, la Provence et la Bourgogne.",
                memoryTip: "Lotharingie = Terre de Lothaire"
            }
        ]
    }
};

// Generate or retrieve user ID and name
const getUserId = (): string => {
    if (typeof window === 'undefined') return '';
    let userId = localStorage.getItem('braina_user_id');
    if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('braina_user_id', userId);
    }
    return userId;
};

const getUserName = (): string => {
    if (typeof window === 'undefined') return '';
    let userName = localStorage.getItem('braina_user_name');
    if (!userName) {
        userName = `Joueur${Math.floor(Math.random() * 1000)}`;
        localStorage.setItem('braina_user_name', userName);
    }
    return userName;
};

export default function PlayScreen({ config }: PlayScreenProps) {
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [gameStarted, setGameStarted] = useState(false);
    const [userId] = useState(getUserId);
    const [userName] = useState(getUserName);

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

                    // Mélanger les questions AVANT de limiter si demandé
                    if (config.shuffleQuestions) {
                        questions = shuffle(questions);
                    }

                    // Limiter le nombre de questions selon la configuration
                    if (config.questionsPerSession !== 'all' && typeof config.questionsPerSession === 'number' && config.questionsPerSession < questions.length) {
                        questions = questions.slice(0, config.questionsPerSession);
                    }

                    processedData = {
                        ...mockData,
                        questions
                    };
                }

                // Pour le mode flashcards, traiter les flashcards
                if (config.mode === 'flashcards') {
                    let flashcards = [...mockData.flashcards];

                    // Mélanger les flashcards AVANT de limiter si demandé
                    if (config.shuffleQuestions) {
                        flashcards = shuffle(flashcards);
                    }

                    // Limiter le nombre de flashcards selon la configuration
                    if (config.questionsPerSession !== 'all' && typeof config.questionsPerSession === 'number' && config.questionsPerSession < flashcards.length) {
                        flashcards = flashcards.slice(0, config.questionsPerSession);
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
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 text-sm">Chargement du {config.mode}...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white px-4">
                <div className="text-center max-w-md">
                    <h1 className="text-2xl font-serif font-medium mb-4">Contenu introuvable</h1>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-6 py-3 bg-white text-black rounded-xl hover:bg-gray-200 transition-colors font-medium"
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
        case 'exam':
            return <ExamScreen quiz={data} />;
        case 'multiplayer':
            return (
                <TicTacToeMultiplayerScreen
                    quiz={data}
                    roomCode={config.roomCode || ''}
                    config={{
                        questionsPerSession: config.questionsPerSession,
                        maxPlayers: 5,
                        timePerQuestion: 20,
                        isHost: !!config.isHost,
                    }}
                />
            );
        default:
            return <QuizScreen quiz={data} />;
    }
}
