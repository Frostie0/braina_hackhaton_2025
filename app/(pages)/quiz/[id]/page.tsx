'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { X, Share2, Trash2, Clock, HelpCircle, PlayCircle, Award, MoreVertical, ListChecks, CheckCircle2, FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { serverIp } from '@/lib/serverIp';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import ModeSelectionModal from '@/components/ui/ModeSelectionModal';
import GamePreferencesModal, { GamePreferences } from '@/components/ui/GamePreferencesModal';
import MultiplayerConfigModal from '@/components/ui/MultiplayerConfigModal';
import WaitingRoom from '@/components/ui/WaitingRoom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Types pour les données du backend
interface BackendQuiz {
    _id: string;
    quizId: string;
    title: string;
    notes: string;
    tags: string[];
    questions: BackendQuestion[];
    flashcards: BackendFlashcard[];
    players: any[];
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}

interface BackendQuestion {
    type: 'true_false' | 'multiple_choice';
    question: string;
    correctAnswer: boolean | string;
    options?: string[];
    explanation: string;
}

interface BackendFlashcard {
    term: string;
    definition: string;
    hint?: string;
    memoryTip?: string;
}

export default function QuizDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [activeTab, setActiveTab] = useState('questions');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isModeSelectionOpen, setIsModeSelectionOpen] = useState(false);
    const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
    const [isMultiplayerConfigOpen, setIsMultiplayerConfigOpen] = useState(false);
    const [isWaitingRoomOpen, setIsWaitingRoomOpen] = useState(false);
    const [selectedMode, setSelectedMode] = useState<string>('');
    const [roomCode, setRoomCode] = useState('');
    const [multiplayerConfig, setMultiplayerConfig] = useState<any>(null);
    const [showCopied, setShowCopied] = useState(false);

    // États pour les données du backend
    const [quiz, setQuiz] = useState<BackendQuiz | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Charger les données du quiz depuis le backend
    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await axios.get(`${serverIp}/quiz/getQuiz/${id}`);

                if (response.status === 200) {
                    setQuiz(response.data.quiz);
                    console.log('✅ Quiz chargé:', response.data.quiz);
                } else {
                    throw new Error('Quiz non trouvé');
                }
            } catch (err: any) {
                console.error('❌ Erreur lors du chargement du quiz:', err);
                setError(err.response?.data?.error || err.message || 'Erreur lors du chargement du quiz');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchQuizData();
        }
    }, [id]);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${serverIp}/quiz/delete/${id}`);
            router.push('/dashboard');
        } catch (err) {
            console.error('Erreur lors de la suppression:', err);
            // Rediriger quand même vers le dashboard
            router.push('/dashboard');
        }
    };

    const handleSelectMode = (mode: string) => {
        setSelectedMode(mode);
        setIsModeSelectionOpen(false);

        if (mode === 'multiplayer') {
            setIsMultiplayerConfigOpen(true);
        } else {
            setIsPreferencesOpen(true);
        }
    };

    const handleCreateMultiplayerRoom = (config: any) => {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        setRoomCode(code);
        setMultiplayerConfig(config);
        setIsMultiplayerConfigOpen(false);
        setIsWaitingRoomOpen(true);
    };

    const handleStartMultiplayerGame = () => {
        const queryParams = new URLSearchParams({
            questions: multiplayerConfig.questionsPerSession === 'all' ? '10' : multiplayerConfig.questionsPerSession.toString(),
            shuffle: 'true',
            multiplayer: 'true',
            room: roomCode
        });

        router.push(`/play/multiplayer/${id}?${queryParams}`);
    };

    const handleStartGame = (preferences: GamePreferences) => {
        const queryParams = new URLSearchParams({
            questions: preferences.questionsPerSession.toString(),
            shuffle: preferences.shuffleQuestions.toString()
        });

        router.push(`/play/${selectedMode}/${id}?${queryParams}`);
        setIsPreferencesOpen(false);
    };

    // État de chargement
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Chargement du quiz...</p>
                </div>
            </div>
        );
    }

    // État d'erreur ou quiz non trouvé
    if (error || !quiz) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Quiz introuvable</h1>
                    <p className="text-gray-400 mb-6">{error || 'Le quiz demandé n\'existe pas.'}</p>
                    <Link href="/dashboard" className="text-purple-400 hover:underline">
                        Retour au Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    // Calcul du temps écoulé
    const timeAgo = (() => {
        const diff = Date.now() - new Date(quiz.createdAt).getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) return "Aujourd'hui";
        if (days === 1) return "Hier";
        if (days < 30) return `il y a ${days} jours`;
        const months = Math.floor(days / 30);
        if (months === 1) return "il y a 1 mois";
        return `il y a ${months} mois`;
    })();

    // Nombre de joueurs
    const playedCount = quiz.players.length;

    // Calcul du pourcentage de maîtrise (stub - à implémenter selon votre logique)
    const masteryPercentage = 0; // TODO: Calculer selon l'historique du joueur

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
                            ID du Quiz : {quiz.quizId}
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
                                    <span>{quiz.questions.length} Questions</span>
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
                                <span className="text-2xl lg:text-3xl font-bold text-purple-400">{quiz.questions.length}</span>
                                <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">Questions</span>
                            </div>
                            <div className="flex flex-col items-center p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                                <span className="text-2xl lg:text-3xl font-bold text-purple-400">{playedCount}</span>
                                <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">Joué</span>
                            </div>
                            <div className="flex flex-col items-center p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                                <span className="text-2xl lg:text-3xl font-bold text-purple-400">{masteryPercentage}%</span>
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
                                        {quiz.questions.map((q, index) => (
                                            <div key={index} className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 hover:border-purple-500/30 transition-colors group">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h3 className="text-gray-200 font-medium leading-snug pr-4">
                                                        {q.question}
                                                    </h3>
                                                    <button className="text-gray-500 hover:text-white transition opacity-0 group-hover:opacity-100">
                                                        <MoreVertical className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center text-xs font-medium text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-md w-fit">
                                                    {q.type === 'multiple_choice' ? (
                                                        <ListChecks className="w-3.5 h-3.5 mr-1.5" />
                                                    ) : (
                                                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                                                    )}
                                                    {q.type === 'multiple_choice' ? 'Choix Multiple' : 'Vrai ou Faux'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {activeTab === 'flashcards' && (
                                    <div className="space-y-3">
                                        {quiz.flashcards.length > 0 ? (
                                            quiz.flashcards.map((card, index) => (
                                                <div key={index} className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 hover:border-purple-500/30 transition-colors">
                                                    <div className="text-gray-200 font-medium mb-3">{card.term}</div>
                                                    <div className="h-px bg-gray-700/50 mb-3" />
                                                    <div className="text-gray-400 text-sm mb-2">{card.definition}</div>
                                                    {card.hint && (
                                                        <div className="text-purple-400 text-xs italic mt-2">
                                                            💡 {card.hint}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center text-gray-500 py-8">
                                                Aucune flashcard disponible
                                            </div>
                                        )}
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
                                                {quiz.notes || 'Aucun résumé disponible pour ce quiz.'}
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
                                    <span className="text-purple-400 font-bold">{masteryPercentage}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-3">
                                    <motion.div
                                        className="bg-purple-600 h-3 rounded-full shadow-[0_0_10px_rgba(147,51,234,0.5)]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${masteryPercentage}%` }}
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

                <MultiplayerConfigModal
                    isOpen={isMultiplayerConfigOpen}
                    onClose={() => setIsMultiplayerConfigOpen(false)}
                    onCreateRoom={handleCreateMultiplayerRoom}
                />

                {isWaitingRoomOpen && (
                    <WaitingRoom
                        roomCode={roomCode}
                        currentPlayers={[
                            { id: '1', name: 'Shadow', avatar: '#8B5CF6', isHost: true }
                        ]}
                        maxPlayers={multiplayerConfig?.maxPlayers || 5}
                        onClose={() => setIsWaitingRoomOpen(false)}
                        onStartGame={handleStartMultiplayerGame}
                        isHost={true}
                    />
                )}

            </motion.div>
        </div>
    );
}
