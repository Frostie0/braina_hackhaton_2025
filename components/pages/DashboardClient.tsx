'use client';

// L'IMPORTATION DE useEffect EST CRUCIALE POUR RÉGLER L'ERREUR SSR
import React, { useState, useEffect } from 'react';
import { Zap, Mic, BookOpen, Menu, Globe } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { Sidebar } from '../layout/Sidebar';
import { RightPanel, RightPanelMobile } from '../layout/RightPanel';
import { QuickStartCard } from '../ui/QuickStartCard';
import QuizFlatList from '../ui/QuizFlatList';
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
const adaptBackendQuizToFrontend = (backendQuiz: BackendQuiz): FrontendQuiz => {
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

    // Calculer le pourcentage de maîtrise (stub - à implémenter selon votre logique)
    const masteryPercentage = 0;

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

    // États pour les données du backend
    const [user, setUser] = useState<User | null>(null);
    const [quizzes, setQuizzes] = useState<FrontendQuiz[]>([]);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(true);
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
                    adaptBackendQuizToFrontend(quiz)
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

    useEffect(() => {
        // 1. Définir que nous sommes montés sur le client
        setIsClient(true);

        // 2. Récupérer l'ID de l'utilisateur depuis localStorage
        const userId = getUserId();

        if (userId) {
            // 3. Charger les données depuis le backend
            fetchUserData(userId);
            fetchUserQuizzes(userId);
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
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden">

            {/* Utiliser AnimatePresence pour le menu mobile et l'overlay */}
            <AnimatePresence initial={false}>

                {/* 1. Overlay pour mobile (apparaît uniquement quand la sidebar est ouverte ET ce n'est PAS un desktop) */}
                {/* On s'assure que isClient est true avant de rendre la logique conditionnelle */}
                {isClient && isSidebarOpen && !isDesktop && (
                    <motion.div
                        key="sidebar-overlay"
                        className="fixed inset-0 bg-black/60 z-40 lg:hidden"
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
                <header className="flex lg:hidden items-center justify-between p-4 bg-gray-800 border-b border-gray-700 sticky top-0 z-30">
                    <div className="flex items-center text-xl font-extrabold text-purple-400">
                        <Globe className="w-6 h-6 mr-2 text-purple-500" />
                        BRAINA
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                {/* Colonne 2: Contenu Principal */}
                <main className="flex-1 p-6 md:p-8 overflow-y-auto">

                    {/* Titre d'accueil */}
                    <h1 className="text-3xl font-bold mb-4 md:mb-8 text-white">
                        {isLoadingUser ? (
                            'Chargement...'
                        ) : user ? (
                            `Welcome ${user.name}!`
                        ) : (
                            'Welcome!'
                        )}
                    </h1>

                    {/* Message d'erreur */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
                            {error}
                        </div>
                    )}

                    {/* Section Quick Start */}
                    <section className="mb-10">
                        <h2 className="text-xl font-semibold mb-4 text-gray-300 border-l-4 border-purple-500 pl-3">Démarrage rapide</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            <Link href='/generate-quiz'>
                                <QuickStartCard
                                    icon={Zap}
                                    title="Générer un quiz"
                                    description="Transformez n'importe quel contenu en flashcards, quiz et podcasts."
                                />
                            </Link>
                            <QuickStartCard
                                icon={BookOpen}
                                title="Tournoi"
                                description="Participez à des tournois inter-classes, départementaux et nationaux et gagnez des crédits."
                                comingSoon={true}
                            />
                            {/* <QuickStartCard
                                icon={Mic}
                                title="Record"
                                description="Record audio directly or upload audio files to generate from."
                            /> */}
                        </div>
                    </section>

                    {/* SECTION: CONTINUER L'APPRENTISSAGE (Quiz FlatList avec données dynamiques) */}
                    {isLoadingQuizzes ? (
                        <div className="text-center py-10">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
                            <p className="mt-4 text-gray-400">Chargement de vos quiz...</p>
                        </div>
                    ) : quizzes.length > 0 ? (
                        <QuizFlatList quizzes={quizzes} title="Continuer l'apprentissage" />
                    ) : (
                        <div className="text-center py-10 bg-gray-800/30 rounded-lg border border-gray-700">
                            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                            <p className="text-gray-400 mb-2">Aucun quiz disponible</p>
                            <p className="text-sm text-gray-500">Créez votre premier quiz pour commencer !</p>
                        </div>
                    )}

                    {/* Panneau de droite sur Mobile (affiché en bas du contenu) */}
                    <RightPanelMobile />

                </main>
            </div>


            {/* Colonne 3: Panneau de Droite (Affiché uniquement sur Grand Écran) */}
            {/* <RightPanel /> */}

        </div>
    );
}
