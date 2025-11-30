'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Sparkles } from 'lucide-react';

interface QuizGenerationModalProps {
    isOpen: boolean;
    onClose: () => void;
    status: 'idle' | 'extracting' | 'analyzing' | 'generating' | 'success' | 'error';
    progress: number; // 0-100
    error?: string;
}

// Conseils aléatoires pour afficher pendant la génération
const tips = [
    "Les quiz interactifs améliorent la rétention de 60% !",
    "La répétition espacée est la clé de la mémorisation à long terme",
    "Testez-vous régulièrement pour mieux ancrer vos connaissances",
    "Les flashcards numériques sont 2x plus efficaces que le papier",
    "Variez les formats de questions pour un apprentissage optimal",
    "Révisez dans des environnements différents pour mieux retenir",
    "Les quiz visuels stimulent davantage votre mémoire",
    "Alternez entre quiz et flashcards pour de meilleurs résultats",
    "Commencez facile puis augmentez la difficulté progressivement",
    "20 minutes de quiz quotidien = 80% de rétention en plus",
];

export const QuizGenerationModal: React.FC<QuizGenerationModalProps> = ({
    isOpen,
    onClose,
    status,
    progress,
    error,
}) => {
    const [currentTip, setCurrentTip] = useState(tips[0]);
    const [tipIndex, setTipIndex] = useState(0);

    // Changer de conseil toutes les 3 secondes
    useEffect(() => {
        if (status === 'extracting' || status === 'analyzing' || status === 'generating') {
            const interval = setInterval(() => {
                setTipIndex((prev) => {
                    const next = (prev + 1) % tips.length;
                    setCurrentTip(tips[next]);
                    return next;
                });
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [status]);

    // Messages selon l'étape
    const getStatusMessage = () => {
        switch (status) {
            case 'extracting':
                return 'Extraction du texte des images...';
            case 'analyzing':
                return 'Analyse du contenu par l\'IA...';
            case 'generating':
                return 'Génération du quiz et des flashcards...';
            case 'success':
                return 'Quiz créé avec succès !';
            case 'error':
                return 'Une erreur est survenue';
            default:
                return 'Préparation...';
        }
    };

    // Icône selon l'état
    const StatusIcon = () => {
        if (status === 'success') {
            return <CheckCircle className="w-16 h-16 text-green-500 animate-bounce" />;
        }
        if (status === 'error') {
            return <XCircle className="w-16 h-16 text-red-500 animate-shake" />;
        }
        return (
            <div className="relative">
                <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-full animate-pulse"></div>
                <Loader2 className="relative w-16 h-16 text-purple-500 animate-spin" />
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full max-w-md bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden"
                >
                    {/* Effet de glow en haut */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500"></div>

                    <div className="p-8">
                        {/* Icône de statut */}
                        <div className="flex justify-center mb-6">
                            <StatusIcon />
                        </div>

                        {/* Message de statut */}
                        <h2 className="text-2xl font-bold text-white text-center mb-2">
                            {getStatusMessage()}
                        </h2>

                        {/* Message d'erreur */}
                        {status === 'error' && error && (
                            <p className="text-red-400 text-sm text-center mb-6 bg-red-500/10 p-3 rounded-lg border border-red-500/30">
                                {error}
                            </p>
                        )}

                        {/* Barre de progression */}
                        {(status === 'extracting' || status === 'analyzing' || status === 'generating') && (
                            <div className="mb-6">
                                <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        className="absolute top-0 left-0 h-full bg-purple-500 rounded-full"
                                        initial={{ width: '0%' }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.5, ease: 'easeOut' }}
                                    />
                                </div>
                                <p className="text-gray-400 text-xs text-center mt-2">
                                    {Math.round(progress)}% complété
                                </p>
                            </div>
                        )}

                        {/* Étapes de progression */}
                        {(status === 'extracting' || status === 'analyzing' || status === 'generating') && (
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {[
                                    { key: 'extracting', label: 'Extraction', icon: '' },
                                    { key: 'analyzing', label: 'Analyse', icon: '' },
                                    { key: 'generating', label: 'Génération', icon: '' },
                                ].map((step, index) => {
                                    const isActive = status === step.key;
                                    const isCompleted =
                                        (status === 'analyzing' && step.key === 'extracting') ||
                                        (status === 'generating' && (step.key === 'extracting' || step.key === 'analyzing'));

                                    return (
                                        <div
                                            key={step.key}
                                            className={`p-3 rounded-lg border transition-all duration-300 ${isActive
                                                ? 'bg-purple-500/20 border-purple-500 scale-105'
                                                : isCompleted
                                                    ? 'bg-green-500/20 border-green-500'
                                                    : 'bg-gray-800 border-gray-700'
                                                }`}
                                        >
                                            {/* <div className="text-2xl text-center mb-1">{step.icon}</div> */}
                                            <p className={`text-xs text-center font-medium ${isActive ? 'text-purple-400' : isCompleted ? 'text-green-400' : 'text-gray-500'
                                                }`}>
                                                {step.label}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Conseils rotatifs */}
                        {(status === 'extracting' || status === 'analyzing' || status === 'generating') && (
                            <motion.div
                                key={tipIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.5 }}
                                className="flex items-start gap-3 p-4 bg-purple-500/10 rounded-lg border border-purple-500/30"
                            >
                                <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-gray-300 leading-relaxed">{currentTip}</p>
                            </motion.div>
                        )}

                        {/* Bouton de fermeture (seulement en cas de succès ou d'erreur) */}
                        {(status === 'success' || status === 'error') && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                onClick={onClose}
                                className={`w-full mt-6 py-3 rounded-lg font-semibold transition-all duration-200 ${status === 'success'
                                    ? 'bg-green-500 hover:bg-green-600 text-white'
                                    : 'bg-red-500 hover:bg-red-600 text-white'
                                    }`}
                            >
                                {status === 'success' ? 'Voir le quiz' : 'Réessayer'}
                            </motion.button>
                        )}
                    </div>
                </motion.div>

                {/* Style pour l'animation de gradient et shimmer */}
                <style jsx global>{`
                    @keyframes gradient {
                        0% {
                            background-position: 0% 50%;
                        }
                        50% {
                            background-position: 100% 50%;
                        }
                        100% {
                            background-position: 0% 50%;
                        }
                    }
                    
                    @keyframes shimmer {
                        0% {
                            transform: translateX(-100%);
                        }
                        100% {
                            transform: translateX(100%);
                        }
                    }
                    
                    @keyframes shake {
                        0%, 100% {
                            transform: translateX(0);
                        }
                        25% {
                            transform: translateX(-10px);
                        }
                        75% {
                            transform: translateX(10px);
                        }
                    }

                    .animate-gradient {
                        background-size: 200% 200%;
                        animation: gradient 3s ease infinite;
                    }

                    .animate-shimmer {
                        animation: shimmer 2s infinite;
                    }

                    .animate-shake {
                        animation: shake 0.5s ease-in-out;
                    }
                `}</style>
            </div>
        </AnimatePresence>
    );
};
