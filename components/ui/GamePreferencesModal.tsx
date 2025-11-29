'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PlayCircle } from 'lucide-react';

interface GamePreferencesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStart: (preferences: GamePreferences) => void;
    mode: string;
    totalQuestions: number;
}

export interface GamePreferences {
    questionsPerSession: number | 'all';
    shuffleQuestions: boolean;
    totalQuestions?: number; // To know the max
}

export default function GamePreferencesModal({
    isOpen,
    onClose,
    onStart,
    mode,
    totalQuestions
}: GamePreferencesModalProps) {
    const [questionsPerSession, setQuestionsPerSession] = useState<number | 'all'>('all');
    const [shuffleQuestions, setShuffleQuestions] = useState(false);

    // Générer les options de questions (multiples de 5)
    const generateQuestionOptions = (): (number | 'all')[] => {
        const options: (number | 'all')[] = ['all'];

        // Generate multiples of 5, but only if they don't exceed total questions
        // If we have 7 questions, we only show 5, not 10
        for (let i = 5; i < totalQuestions; i += 5) {
            options.push(i);
        }

        // Only add the exact total if it's a multiple of 5
        if (totalQuestions % 5 === 0 && totalQuestions > 0) {
            options.push(totalQuestions);
        }

        return options;
    };

    const questionOptions = generateQuestionOptions();

    const handleStart = () => {
        onStart({
            questionsPerSession,
            shuffleQuestions
        });
    };

    // Titre personnalisé selon le mode
    const getTitle = () => {
        switch (mode) {
            case 'quiz':
                return 'Comment aimeriez-vous jouer?';
            case 'flashcards':
                return 'Configurez vos flashcards';
            case 'multiplayer':
                return 'Paramètres du jeu multijoueur';
            default:
                return 'Préférences de jeu';
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-xl font-bold text-white">{getTitle()}</h3>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <p className="text-gray-400 text-sm mb-6">
                                    Vous pourrez ajuster ces préférences dans les paramètres.
                                </p>

                                <div className="space-y-6">
                                    {/* Questions per session */}
                                    <div>
                                        <h4 className="text-white font-medium mb-3">Questions par session</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {questionOptions.map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => setQuestionsPerSession(option)}
                                                    className={`px-6 py-2.5 rounded-lg font-medium transition-all ${questionsPerSession === option
                                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                                        }`}
                                                >
                                                    {option === 'all' ? 'Tout' : option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Shuffle toggle */}
                                    <div className="flex items-center justify-between py-3 px-4 bg-gray-800/40 rounded-xl border border-gray-700/50">
                                        <span className="text-white font-medium">Mélanger les questions</span>
                                        <button
                                            onClick={() => setShuffleQuestions(!shuffleQuestions)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${shuffleQuestions ? 'bg-purple-600' : 'bg-gray-600'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${shuffleQuestions ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* Start Button */}
                                <button
                                    onClick={handleStart}
                                    className="w-full mt-6 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2"
                                >
                                    <PlayCircle className="w-5 h-5" />
                                    Commencer
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
