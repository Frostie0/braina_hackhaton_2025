'use client';

// L'IMPORTATION DE useEffect EST CRUCIALE POUR RÉGLER L'ERREUR SSR
import React, { useState, useEffect } from 'react';
import { Zap, Mic, BookOpen, Menu, Globe, ScrollText, Plus, TrendingUp } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ApplicationLogo from '@/components/ui/ApplicationLogo';

import { Sidebar } from '../layout/Sidebar';
import { RightPanel, RightPanelMobile } from '../layout/RightPanel';
import { QuickStartCard } from '../ui/QuickStartCard';
import QuizFlatList from '../ui/QuizFlatList';
import ExamsList from '../ui/ExamsList';
import Link from 'next/link';
import axios from 'axios';
import { serverIp } from '@/lib/serverIp';
import { getUserId } from '@/lib/storage/userStorage';
import { Quiz as FrontendQuiz } from '@/lib/data/quiz';

// Types pour les données backend
interface User {
    _id: string;
    userId: string;
    name: string;
    email: string;
    profile?: string;
    creditBuy?: number;
    creditOffer?: number;
}

interface BackendQuiz {
    _id: string;
    quizId: string;
    title: string;
    notes: string;
    tags: string[];
    questions: any[];
    flashcards: any[];
    players: any[];
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Adapter pour convertir un quiz du backend vers le format frontend
 */
const adaptBackendQuizToFrontend = (backendQuiz: BackendQuiz, userId: string): FrontendQuiz => {
    // Formater la date au format "DD MMM YYYY"
    const date = new Date(backendQuiz.createdAt);
    const formattedDate = date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    // Déterminer la catégorie basée sur les tags (ou 'other' par défaut)
    const categoryMap: Record<string, 'history' | 'science' | 'technology' | 'literature' | 'math' | 'other'> = {
        'histoire': 'history',
        'history': 'history',
        'science': 'science',
        'chimie': 'science',
        'physique': 'science',
        'technologie': 'technology',
        'technology': 'technology',
        'programmation': 'technology',
        'littérature': 'literature',
        'literature': 'literature',
        'mathématiques': 'math',
        'math': 'math',
        'maths': 'math',
    };

    let category: 'history' | 'science' | 'technology' | 'literature' | 'math' | 'other' = 'other';

    // Trouver la première catégorie correspondante dans les tags
    for (const tag of backendQuiz.tags) {
        const normalizedTag = tag.toLowerCase();
        if (categoryMap[normalizedTag]) {
            category = categoryMap[normalizedTag];
            break;
        }
    }

    // Calcul du pourcentage de maîtrise
    const questionCount = backendQuiz.questions.length;
    const player = backendQuiz.players?.find((p: any) => p.id === userId);
    const playedCount = player?.played || 0;

    let masteryPercentage = 0;
    if (questionCount > 0) {
        const targetPlays = Math.round(Math.sqrt(questionCount * 10));
        masteryPercentage = Math.min(100, Math.round((playedCount / targetPlays) * 100));
    }

    return {
        id: backendQuiz.quizId,
        title: backendQuiz.title,
        date: formattedDate,
        dateTimestamp: date.getTime(),
        questions: backendQuiz.questions.length,
        masteryPercentage,
        category,
    };
};

// Le composant principal
export default function DashboardClient() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [showAllQuizzes, setShowAllQuizzes] = useState(false);

    // États pour les données du backend
    const [user, setUser] = useState<User | null>(null);
    const [quizzes, setQuizzes] = useState<FrontendQuiz[]>([]);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(true);
    const [isLoadingExams, setIsLoadingExams] = useState(true);
    const [exams, setExams] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Fonction pour récupérer les données utilisateur
    const fetchUserData = async (userId: string) => {
        try {
            setIsLoadingUser(true);
            const response = await axios.get(`${serverIp}/user/getUser/${userId}`);

            if (response.status === 200) {
                setUser(response.data.user);
                console.log('✅ Données utilisateur récupérées:', response.data.user);
            }
        } catch (error: any) {
            console.error('❌ Erreur lors de la récupération de l\'utilisateur:', error);
            setError('Impossible de charger les données utilisateur');
        } finally {
            setIsLoadingUser(false);
        }
    };

    // Fonction pour récupérer les quiz de l'utilisateur
    const fetchUserQuizzes = async (userId: string) => {
        try {
            setIsLoadingQuizzes(true);
            const response = await axios.get(`${serverIp}/quiz/getAllQuizByUser/${userId}`);

            if (response.status === 200) {
                // Convertir les quiz du backend au format frontend
                const adaptedQuizzes = response.data.quizs.map((quiz: BackendQuiz) =>
                    adaptBackendQuizToFrontend(quiz, userId)
                );
                setQuizzes(adaptedQuizzes);
                console.log('✅ Quiz récupérés:', response.data.count, 'quiz trouvés');
            }
        } catch (error: any) {
            console.error('❌ Erreur lors de la récupération des quiz:', error);
            setError('Impossible de charger les quiz');
        } finally {
            setIsLoadingQuizzes(false);
        }
    };

    const handleExamDeleted = (deletedId: string) => {
        setExams(prev => prev.filter(e => e.examId !== deletedId));
    };

    // Fonction pour récupérer les examens de l'utilisateur
    const fetchUserExams = async (userId: string) => {
        try {
            setIsLoadingExams(true);
            const response = await axios.get(`${serverIp}/exam/user/${userId}`);

            if (response.status === 200) {
                setExams(response.data.exams);
                console.log('✅ Examens récupérés:', response.data.count, 'examen(s) trouvé(s)');
            }
        } catch (error: any) {
            console.error('❌ Erreur lors de la récupération des examens:', error);
            // Ne pas définir error ici pour ne pas gêner l'affichage des quiz
        } finally {
            setIsLoadingExams(false);
        }
    };

    useEffect(() => {
        // 1. Définir que nous sommes montés sur le client
        setIsClient(true);

        // 2. Récupérer l'ID de l'utilisateur depuis localStorage
        const userId = getUserId();

        if (userId) {
            // 3. Charger les données depuis le backend
            fetchUserData(userId);
            fetchUserQuizzes(userId);
            fetchUserExams(userId);
        } else {
            console.warn('⚠️ Aucun userId trouvé dans localStorage');
            setError('Utilisateur non connecté');
            setIsLoadingUser(false);
            setIsLoadingQuizzes(false);
        }

        // 4. Cette fonction vérifie si l'écran est large (Desktop)
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };

        // Exécution initiale
        handleResize();

        // Écoute les changements de taille de fenêtre
        window.addEventListener('resize', handleResize);

        // Nettoyage de l'écouteur
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // [] garantit que cela ne s'exécute qu'une fois au montage

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden font-sans">

            {/* Utiliser AnimatePresence pour le menu mobile et l'overlay */}
            <AnimatePresence initial={false}>

                {/* 1. Overlay pour mobile (apparaît uniquement quand la sidebar est ouverte ET ce n'est PAS un desktop) */}
                {/* On s'assure que isClient est true avant de rendre la logique conditionnelle */}
                {isClient && isSidebarOpen && !isDesktop && (
                    <motion.div
                        key="sidebar-overlay"
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                )}

                {/* 2. Sidebar: Rendu si isSidebarOpen est vrai (mobile) OU si c'est un desktop */}
                {/* Le rendu est BLOQUÉ pendant le SSR par le check isClient */}
                {isClient && (isSidebarOpen || isDesktop) && (
                    <Sidebar
                        key="sidebar"
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                        isDesktop={isDesktop} // PASSAGE DE LA PROP isDesktop
                    />
                )}

            </AnimatePresence>

            {/* Conteneur principal */}
            <div className="flex-1 flex flex-col overflow-y-auto">

                {/* Topbar Mobile (Menu Hamburger & Logo) */}
                <header className="flex lg:hidden items-center justify-between p-4 bg-black border-b border-white/10 sticky top-0 z-30">
                    <div className="flex items-center">
                        <ApplicationLogo size={24} />
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                {/* Colonne 2: Contenu Principal */}
                <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-7xl mx-auto w-full">

                    {/* Titre d'accueil */}
                    <div className="mb-12">
                        <h1 className="text-3xl md:text-4xl font-serif font-medium text-white mb-2">
                            {isLoadingUser ? (
                                'Bonjour...'
                            ) : user ? (
                                `Bonjour, ${user.name}`
                            ) : (
                                'Bonjour'
                            )}
                        </h1>
                        <p className="text-gray-400 text-lg">Prêt à apprendre quelque chose de nouveau aujourd'hui ?</p>
                    </div>

                    {/* Message d'erreur */}
                    {error && (
                        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Section Quick Start */}
                    <section className="mb-16">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-serif font-medium text-white">Démarrage rapide</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Link href='/generate-quiz'>
                                <QuickStartCard
                                    icon={Zap}
                                    title="Générer un quiz"
                                    description="Transformez vos notes en matériel d'étude interactif."
                                />
                            </Link>
                            <Link href='/generate-exam'>
                                <QuickStartCard
                                    icon={ScrollText}
                                    title="Examen blanc"
                                    description="Préparez-vous avec des examens types personnalisés."
                                />
                            </Link>
                            <QuickStartCard
                                icon={BookOpen}
                                title="Tournoi"
                                description="Défiez vos camarades et grimpez dans le classement."
                                comingSoon={true}
                            />
                        </div>
                    </section>

                    {/* SECTION: CONTINUER L'APPRENTISSAGE (Quiz FlatList avec données dynamiques) */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-serif font-medium text-white">Vos activités récentes</h2>
                            {quizzes.length > 5 && (
                                <button
                                    onClick={() => setShowAllQuizzes(!showAllQuizzes)}
                                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium"
                                >
                                    {showAllQuizzes ? 'Voir moins' : 'Voir tout'}
                                </button>
                            )}
                        </div>

                        {isLoadingQuizzes ? (
                            <div className="flex items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl">
                                <div className="flex flex-col items-center">
                                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
                                    <p className="text-gray-500 text-sm">Chargement de vos quiz...</p>
                                </div>
                            </div>
                        ) : quizzes.length > 0 ? (
                            <QuizFlatList quizzes={quizzes} title="" maxVisible={showAllQuizzes ? undefined : 5} />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-gray-500">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <p className="text-gray-400 font-medium mb-1">Aucune activité pour le moment</p>
                                <p className="text-gray-500 text-sm mb-6">Créez votre premier quiz pour commencer votre apprentissage.</p>
                                <Link href='/generate-quiz'>
                                    <button className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                                        Créer un quiz
                                    </button>
                                </Link>
                            </div>
                        )}
                    </section>

                    {/* SECTION: EXAMENS BLANCS */}
                    {!isLoadingExams && exams.length > 0 && (
                        <section className="mt-12">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-serif font-medium text-white">Vos examens blancs</h2>
                            </div>
                            <ExamsList exams={exams} onDelete={handleExamDeleted} />
                        </section>
                    )}

                    {/* Panneau de droite sur Mobile (affiché en bas du contenu) */}
                    <div className="mt-12 lg:hidden">
                        <RightPanelMobile />
                    </div>

                </main>
            </div>


            {/* Colonne 3: Panneau de Droite (Affiché uniquement sur Grand Écran) */}
            {/* <RightPanel /> */}

        </div>
    );
}
