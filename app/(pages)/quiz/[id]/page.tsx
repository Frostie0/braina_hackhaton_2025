'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { X, Share2, Trash2, Clock, HelpCircle, PlayCircle, Award, MoreVertical, ListChecks, CheckCircle2, FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { shuffle } from '@/lib/shuffle';
import serverIp from '@/lib/serverIp';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import ModeSelectionModal from '@/components/ui/ModeSelectionModal';
import GamePreferencesModal, { GamePreferences } from '@/components/ui/GamePreferencesModal';
import MultiplayerConfigModal from '@/components/ui/MultiplayerConfigModal';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getUserId } from '@/lib/storage/userStorage';

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

    const handleCreateMultiplayerRoom = async (config: any) => {
        try {
            setIsMultiplayerConfigOpen(false);

            const totalQuestionsCount = quiz?.questions.length || 0;
            const questionsParam = config?.questionsPerSession === 'all'
                ? totalQuestionsCount
                : (config?.questionsPerSession ?? totalQuestionsCount);

            // Construire la liste des questions à envoyer au backend (si nécessaire)
            const payloadQuestions = (quiz?.questions || []).slice(0, questionsParam).map((q) => ({
                type: q.type,
                question: q.question,
                options: q.options || [],
                correctAnswer: q.correctAnswer,
                explanation: q.explanation
            }));

            const settings = {
                maxPlayers: Number(config?.maxPlayers ?? 5),
                timePerQuestion: Number(config?.timePerQuestion ?? 20),
            };

            const res = await axios.post(`${serverIp}/game/create`, {
                hostId: 'host-temp',
                quizId: id,
                settings,
                questions: payloadQuestions
            });

            const code = res.data?.gameCode;
            if (!code) throw new Error('gameCode manquant');

            const queryParams = new URLSearchParams({
                id,
                room: code,
                maxPlayers: String(settings.maxPlayers),
                questions: String(questionsParam),
                isHost: 'true'
            });

            router.push(`/waintroom?${queryParams.toString()}`);
        } catch (e) {
            console.error('Erreur création salle multi:', e);
        }
    };

    const handleStartMultiplayerGame = () => {
        const totalQuestionsCount = quiz?.questions.length || 0;
        const questionCount = multiplayerConfig.questionsPerSession === 'all'
            ? totalQuestionsCount
            : multiplayerConfig.questionsPerSession;

        const queryParams = new URLSearchParams({
            questions: questionCount.toString(),
            shuffle: 'true',
            multiplayer: 'true',
            room: roomCode
        });

        router.push(`/play/multiplayer/${id}?${queryParams}`);
    };

    const handleStartGame = (preferences: GamePreferences) => {
        const totalQuestionsCount = quiz?.questions.length || 0;
        const questionCount = preferences.questionsPerSession === 'all'
            ? totalQuestionsCount
            : preferences.questionsPerSession;

        const queryParams = new URLSearchParams({
            questions: questionCount.toString(),
            shuffle: preferences.shuffleQuestions.toString()
        });

        router.push(`/play/${selectedMode}/${id}?${queryParams}`);
        setIsPreferencesOpen(false);
    };

    // État de chargement
    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 text-sm">Chargement du quiz...</p>
                </div>
            </div>
        );
    }

    // État d'erreur ou quiz non trouvé
    if (error || !quiz) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white px-4">
                <div className="text-center max-w-md">
                    <h1 className="text-2xl font-serif font-medium mb-3">Quiz introuvable</h1>
                    <p className="text-gray-400 mb-8 text-sm">{error || 'Le quiz demandé n\'existe pas.'}</p>
                    <Link href="/dashboard" className="inline-block px-6 py-3 bg-white text-black rounded-xl hover:bg-gray-200 transition-colors font-medium">
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

    // Nombre de joueurs (ou plutôt nombre de fois joué par tout le monde si on suit le modèle, mais ici on veut le nombre de fois joué par l'utilisateur courant pour la maitrise)
    // Le modèle a `players` qui est un tableau d'objets {id, played, correctAnswers}

    const currentUserId = getUserId();
    const currentPlayer = quiz.players.find((p: any) => p.id === currentUserId);
    const playedCount = currentPlayer?.played || 0;

    // Calcul du pourcentage de maîtrise
    const questionCount = quiz.questions.length;
    let masteryPercentage = 0;
    if (questionCount > 0) {
        const targetPlays = Math.round(Math.sqrt(questionCount * 10));
        masteryPercentage = Math.min(100, Math.round((playedCount / targetPlays) * 100));
    }

    return (
        <div className="min-h-screen bg-black text-white flex justify-center p-4 lg:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md lg:max-w-5xl flex flex-col"
            >
                {/* Header avec bouton Fermer */}
                <header className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-serif font-medium leading-tight mb-2">
                            {quiz.title}
                        </h1>
                        <p className="text-sm text-gray-500">ID: {quiz.quizId}</p>
                    </div>
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </header>

                <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                    {/* Colonne Gauche et Centrale */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Métadonnées (Temps, Questions, Actions) */}
                        <div className="flex items-center justify-between pb-6 border-b border-white/10">
                            <div className="flex items-center gap-6 text-sm">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Clock className="w-4 h-4" />
                                    <span>{timeAgo}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <HelpCircle className="w-4 h-4" />
                                    <span>{quiz.questions.length} questions</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleShare}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white relative group"
                                    title="Copier le lien"
                                >
                                    <Share2 className="w-4 h-4" />
                                    {showCopied && (
                                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-xs py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap">
                                            Copié !
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-gray-400 hover:text-red-400"
                                    title="Supprimer le quiz"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Statistiques Rapides (Questions, Joué, Maitrise) */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col items-center p-5 bg-white/5 rounded-2xl border border-white/10">
                                <span className="text-2xl lg:text-3xl font-serif font-medium text-white">{quiz.questions.length}</span>
                                <span className="text-xs text-gray-400 uppercase tracking-wider mt-2">Questions</span>
                            </div>
                            <div className="flex flex-col items-center p-5 bg-white/5 rounded-2xl border border-white/10">
                                <span className="text-2xl lg:text-3xl font-serif font-medium text-white">{playedCount}</span>
                                <span className="text-xs text-gray-400 uppercase tracking-wider mt-2">Joué</span>
                            </div>
                            <div className="flex flex-col items-center p-5 bg-white/5 rounded-2xl border border-white/10">
                                <span className="text-2xl lg:text-3xl font-serif font-medium text-white">{masteryPercentage}%</span>
                                <span className="text-xs text-gray-400 uppercase tracking-wider mt-2">Maîtrise</span>
                            </div>
                        </div>

                        {/* Section Onglets et Contenu (Questions/Flashcards/Notes) */}
                        <div>
                            {/* Onglets */}
                            <div className="flex gap-2 mb-6">
                                {['Questions', 'Flashcards', 'Résumé'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab.toLowerCase())}
                                        className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${activeTab === tab.toLowerCase()
                                            ? 'bg-white text-black'
                                            : 'text-gray-400 hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Contenu des Onglets */}
                            <div className="space-y-3 mb-3">
                                {activeTab === 'questions' && (
                                    <div className="space-y-3">
                                        {quiz.questions.map((q, index) => (
                                            <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors group">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h3 className="text-white font-medium leading-snug pr-4 text-sm">
                                                        {q.question}
                                                    </h3>
                                                    <button className="text-gray-500 hover:text-white transition opacity-0 group-hover:opacity-100">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center text-xs font-medium text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg w-fit">
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
                                                <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors">
                                                    <div className="text-white font-medium mb-3 text-sm">{card.term}</div>
                                                    <div className="h-px bg-white/10 mb-3" />
                                                    <div className="text-gray-400 text-sm mb-2 leading-relaxed">{card.definition}</div>
                                                    {/* {card.hint && (
                                                        <div className="text-gray-500 text-xs italic mt-3">
                                                            💡 {card.hint}
                                                        </div>
                                                    )} */}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center text-gray-500 py-12 bg-white/5 rounded-2xl border border-dashed border-white/10">
                                                Aucune flashcard disponible
                                            </div>
                                        )}
                                    </div>
                                )}
                                {activeTab === 'résumé' && (
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-5">
                                        <h3 className="text-white font-serif font-medium mb-5 text-lg flex items-center gap-2">
                                            <FileText className="w-5 h-5" />
                                            Résumé du cours
                                        </h3>
                                        <div className="prose prose-invert prose-sm max-w-none 
                                            prose-headings:text-white prose-headings:font-serif prose-headings:font-medium
                                            prose-h2:text-base prose-h2:mt-4 prose-h2:mb-3
                                            prose-h3:text-sm prose-h3:mt-3 prose-h3:mb-2
                                            prose-p:text-gray-300 prose-p:leading-relaxed prose-p:my-3
                                            prose-strong:text-white prose-strong:font-medium
                                            prose-em:text-gray-300 prose-em:italic
                                            prose-ul:my-3 prose-ul:text-gray-300 prose-ul:space-y-1
                                            prose-ol:my-3 prose-ol:text-gray-300 prose-ol:space-y-2
                                            prose-li:my-1
                                            prose-blockquote:border-l-white/20 prose-blockquote:bg-white/5 
                                            prose-blockquote:text-gray-300 prose-blockquote:italic prose-blockquote:pl-4 prose-blockquote:py-3 prose-blockquote:my-4
                                            prose-hr:border-white/10 prose-hr:my-6">
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
                    <div className="lg:sticky lg:top-8 md:top-5 sm:top-3 lg:h-fit space-y-6">
                        {/* Carte Score de Maîtrise */}
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                            <div className="flex items-center gap-3 mb-4">
                                <Award className="w-5 h-5 text-white" />
                                <h2 className="text-lg font-serif font-medium">Score de maîtrise</h2>
                            </div>

                            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                                Votre score reflète votre niveau de connaissance. Améliorez-le en révisant régulièrement.
                            </p>

                            {/* Barre de Progression */}
                            <div className="relative">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-gray-400">Progression</span>
                                    <span className="text-white font-medium">{masteryPercentage}%</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2">
                                    <motion.div
                                        className="bg-white h-2 rounded-full"
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
                            className="w-full py-4 bg-purple-600 hover:bg-purple-700 cursor-pointer text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
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
                    totalQuestions={
                        selectedMode === 'flashcards'
                            ? (quiz?.flashcards.length || 0)
                            : (quiz?.questions.length || 0)
                    }
                />

                <MultiplayerConfigModal
                    isOpen={isMultiplayerConfigOpen}
                    onClose={() => setIsMultiplayerConfigOpen(false)}
                    onCreateRoom={handleCreateMultiplayerRoom}
                    totalQuestions={quiz?.questions.length || 0}
                />


            </motion.div>
        </div>
    );
}
