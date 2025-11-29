'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { X, Share2, Trash2, Clock, HelpCircle, PlayCircle, Award, MoreVertical, ListChecks, CheckCircle2, FileText } from 'lucide-react';
import { quizData } from '@/lib/data/quiz';
import { getQuizSummary } from '@/lib/data/quiz-summary';
import Link from 'next/link';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import ModeSelectionModal from '@/components/ui/ModeSelectionModal';
import GamePreferencesModal, { GamePreferences } from '@/components/ui/GamePreferencesModal';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function QuizDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const [activeTab, setActiveTab] = useState('questions');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isModeSelectionOpen, setIsModeSelectionOpen] = useState(false);
    const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
    const [selectedMode, setSelectedMode] = useState<string>('');

    const [showCopied, setShowCopied] = useState(false);

    // Trouver le quiz correspondant (dans une vraie app, ce serait un fetch)
    const quiz = quizData.find((q) => q.id === id);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleDelete = () => {
        // Ici, on appellerait une API pour supprimer le quiz
        // Pour l'instant, on redirige juste vers le dashboard
        router.push('/dashboard');
    };

    const handleSelectMode = (mode: string) => {
        // Stocker le mode sélectionné et ouvrir le modal de préférences
        setSelectedMode(mode);
        setIsModeSelectionOpen(false);
        setIsPreferencesOpen(true);
    };

    const handleStartGame = (preferences: GamePreferences) => {
        // Navigation avec les préférences
        const queryParams = new URLSearchParams({
            questions: preferences.questionsPerSession.toString(),
            shuffle: preferences.shuffleQuestions.toString()
        });

        router.push(`/play/${selectedMode}/${id}?${queryParams}`);
        setIsPreferencesOpen(false);
    };

    if (!quiz) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Quiz introuvable</h1>
                    <Link href="/dashboard" className="text-purple-400 hover:underline">
                        Retour au Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    // Données simulées pour l'affichage (à remplacer par des vraies données plus tard)
    const playedCount = 3; // Exemple
    const timeAgo = "il y a 1 mois"; // Exemple, pourrait être calculé depuis quiz.dateTimestamp

    // Données mockées pour les questions (basées sur l'image fournie)
    const mockQuestions = [
        { id: 1, text: "Quel traité a officialisé le partage de l'empire carolingien ?", type: "Multiple Choice" },
        { id: 2, text: "La France Occidentale, issue du partage de l'empire carolingien, est l'ancêtre de l'Allemagne actuelle.", type: "True or False" },
        { id: 3, text: "Comment appelle-t-on les anciens esclaves qui ont été libérés ?", type: "Multiple Choice" },
        { id: 4, text: "Les affranchis avaient le même statut social que les nobles.", type: "True or False" },
    ];

    // Données mockées pour les flashcards
    const mockFlashcards = [
        { id: 1, front: "Traité de Verdun", back: "Traité signé en 843 partageant l'empire carolingien en trois royaumes." },
        { id: 2, front: "Missi Dominici", back: "Envoyés du maître chargés d'inspecter les comtés." },
        { id: 3, front: "Capitulaire", back: "Acte législatif émanant des rois carolingiens." },
    ];

    // Récupération du résumé depuis le fichier de données
    const quizSummary = getQuizSummary(quiz.id);

    return (
        <div className="min-h-screen bg-gray-900 text-white flex justify-center p-4 lg:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md lg:max-w-4xl bg-gray-900 flex flex-col"
            >
                {/* Header avec bouton Fermer */}
                <header className="flex justify-between items-start mb-6 pt-4">
                    <h1 className="text-2xl lg:text-3xl font-bold leading-tight max-w-[85%]">
                        {quiz.title}
                    </h1>
                    <button
                        onClick={() => router.back()}
                        className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </header>

                <div className="lg:grid lg:grid-cols-2 lg:gap-12">
                    {/* Colonne Gauche (Desktop) */}
                    <div>
                        {/* ID du Quiz */}
                        <div className="text-gray-500 text-sm mb-6">
                            ID du Quiz : {quiz.id}
                        </div>

                        {/* Métadonnées (Temps, Questions, Actions) */}
                        <div className="flex items-center justify-between text-gray-400 text-sm mb-8">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{timeAgo}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <HelpCircle className="w-4 h-4" />
                                    <span>{quiz.questions} Questions</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleShare}
                                    className="hover:text-white transition relative group"
                                    title="Copier le lien"
                                >
                                    <Share2 className="w-5 h-5" />
                                    {showCopied && (
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap">
                                            Copié !
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="hover:text-red-400 transition"
                                    title="Supprimer le quiz"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Statistiques Rapides (Questions, Joué, Maitrise) */}
                        <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                            <div className="flex flex-col items-center p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                                <span className="text-2xl lg:text-3xl font-bold text-purple-400">{quiz.questions}</span>
                                <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">Questions</span>
                            </div>
                            <div className="flex flex-col items-center p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                                <span className="text-2xl lg:text-3xl font-bold text-purple-400">{playedCount}</span>
                                <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">Joué</span>
                            </div>
                            <div className="flex flex-col items-center p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                                <span className="text-2xl lg:text-3xl font-bold text-purple-400">{quiz.masteryPercentage}%</span>
                                <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">Maitrise</span>
                            </div>
                        </div>

                        {/* Section Onglets et Contenu (Questions/Flashcards/Notes) */}
                        <div className="mb-8 lg:mb-0">
                            {/* Onglets */}
                            <div className="flex p-1 bg-gray-800/50 rounded-xl mb-6">
                                {['Questions', 'Flashcards', 'Notes'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab.toLowerCase())}
                                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === tab.toLowerCase()
                                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20'
                                            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Contenu des Onglets */}
                            <div className="space-y-4">
                                {activeTab === 'questions' && (
                                    <div className="space-y-3">
                                        {mockQuestions.map((q) => (
                                            <div key={q.id} className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 hover:border-purple-500/30 transition-colors group">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h3 className="text-gray-200 font-medium leading-snug pr-4">
                                                        {q.text}
                                                    </h3>
                                                    <button className="text-gray-500 hover:text-white transition opacity-0 group-hover:opacity-100">
                                                        <MoreVertical className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center text-xs font-medium text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-md w-fit">
                                                    {q.type === 'Multiple Choice' ? (
                                                        <ListChecks className="w-3.5 h-3.5 mr-1.5" />
                                                    ) : (
                                                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                                                    )}
                                                    {q.type}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {activeTab === 'flashcards' && (
                                    <div className="space-y-3">
                                        {mockFlashcards.map((card) => (
                                            <div key={card.id} className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 hover:border-purple-500/30 transition-colors">
                                                <div className="text-gray-200 font-medium mb-3">{card.front}</div>
                                                <div className="h-px bg-gray-700/50 mb-3" />
                                                <div className="text-gray-400 text-sm">{card.back}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {activeTab === 'notes' && (
                                    <div className="bg-yellow-900/10 border border-yellow-700/20 rounded-xl p-6">
                                        <h3 className="text-yellow-500 font-semibold mb-4 text-lg flex items-center gap-2">
                                            <FileText className="w-5 h-5" />
                                            Résumé du cours
                                        </h3>
                                        <div className="prose prose-invert prose-sm max-w-none 
                                            prose-headings:text-yellow-400 prose-headings:font-semibold
                                            prose-h2:text-base prose-h2:mt-4 prose-h2:mb-3
                                            prose-h3:text-sm prose-h3:mt-3 prose-h3:mb-2
                                            prose-p:text-gray-300 prose-p:leading-relaxed prose-p:my-3
                                            prose-strong:text-yellow-300 prose-strong:font-semibold
                                            prose-em:text-gray-200 prose-em:italic
                                            prose-ul:my-3 prose-ul:text-gray-300 prose-ul:space-y-1
                                            prose-ol:my-3 prose-ol:text-gray-300 prose-ol:space-y-2
                                            prose-li:my-1
                                            prose-blockquote:border-l-yellow-600 prose-blockquote:bg-yellow-900/20 
                                            prose-blockquote:text-gray-300 prose-blockquote:italic prose-blockquote:pl-4 prose-blockquote:py-3 prose-blockquote:my-4
                                            prose-hr:border-yellow-700/30 prose-hr:my-6">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {quizSummary}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Colonne Droite (Desktop) - Sticky */}
                    <div className="lg:sticky lg:top-8 lg:h-fit space-y-6">
                        {/* Carte Score de Maîtrise */}
                        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                            <div className="flex items-center gap-3 mb-4">
                                <Award className="w-6 h-6 text-purple-500" />
                                <h2 className="text-lg font-semibold">Score de maîtrise</h2>
                            </div>

                            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                                Votre score de maîtrise reflète votre niveau de connaissance d'un sujet.
                                Améliorez-le en répondant correctement à davantage de questions et en révisant régulièrement.
                            </p>

                            {/* Barre de Progression Large */}
                            <div className="relative pt-2">
                                <div className="flex items-center justify-between mb-2">
                                    <Award className="w-6 h-6 text-purple-400" />
                                    <span className="text-purple-400 font-bold">{quiz.masteryPercentage}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-3">
                                    <motion.div
                                        className="bg-purple-600 h-3 rounded-full shadow-[0_0_10px_rgba(147,51,234,0.5)]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${quiz.masteryPercentage}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bouton d'action principal */}
                        <button
                            onClick={() => setIsModeSelectionOpen(true)}
                            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2"
                        >
                            <PlayCircle className="w-5 h-5" />
                            Commencer le Quiz
                        </button>
                    </div>
                </div>

                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDelete}
                    title="Supprimer le quiz"
                    message="Êtes-vous sûr de vouloir supprimer ce quiz ? Cette action est irréversible et toutes les données associées seront perdues."
                    confirmText="Supprimer"
                    variant="danger"
                />

                <ModeSelectionModal
                    isOpen={isModeSelectionOpen}
                    onClose={() => setIsModeSelectionOpen(false)}
                    onSelectMode={handleSelectMode}
                />

                <GamePreferencesModal
                    isOpen={isPreferencesOpen}
                    onClose={() => setIsPreferencesOpen(false)}
                    onStart={handleStartGame}
                    mode={selectedMode}
                />

            </motion.div>
        </div>
    );
}

