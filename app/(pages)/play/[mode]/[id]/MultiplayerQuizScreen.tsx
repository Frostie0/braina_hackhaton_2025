'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import LiveLeaderboard from '@/components/ui/LiveLeaderboard';

interface Question {
    id: string;
    type: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

interface QuizData {
    title: string;
    questions: Question[];
}

interface Player {
    id: string;
    name: string;
    score: number;
    avatar: string;
    timeBonus: number;
}

interface MultiplayerQuizScreenProps {
    quiz: QuizData;
    roomCode: string;
    config: {
        questionsPerSession: number | 'all';
        maxPlayers: number;
        timePerQuestion: number;
    };
}

export default function MultiplayerQuizScreen({
    quiz,
    roomCode,
    config
}: MultiplayerQuizScreenProps) {
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(config.timePerQuestion);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [myScore, setMyScore] = useState(0);
    const [myPosition, setMyPosition] = useState(1);

    // Mock players data (replace with real multiplayer state)
    const [players, setPlayers] = useState<Player[]>([
        { id: '1', name: 'Vous', score: 0, avatar: '#3B82F6', timeBonus: 0 },
        { id: '2', name: 'Shadow', score: 0, avatar: '#8B5CF6', timeBonus: 0 },
        { id: '3', name: 'Phoenix', score: 0, avatar: '#F59E0B', timeBonus: 0 }
    ]);

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

    // Timer countdown
    useEffect(() => {
        if (hasAnswered || showLeaderboard) return;

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [hasAnswered, showLeaderboard, currentQuestionIndex]);

    const calculateScore = (isCorrect: boolean, timeLeft: number): number => {
        if (!isCorrect) return 0;
        const basePoints = 100;
        const timeBonus = Math.floor((timeLeft / config.timePerQuestion) * 50);
        return basePoints + timeBonus;
    };

    const handleOptionSelect = (option: string) => {
        if (!hasAnswered) {
            setSelectedOption(option);
        }
    };

    const handleSubmit = () => {
        if (hasAnswered) return;

        const isCorrect = selectedOption === currentQuestion.correctAnswer;
        const earnedPoints = calculateScore(isCorrect, timeRemaining);

        setHasAnswered(true);
        setMyScore(myScore + earnedPoints);

        // Update players scores (mock - replace with real multiplayer logic)
        setPlayers(prevPlayers => {
            const updated = prevPlayers.map(p => {
                if (p.id === '1') {
                    return { ...p, score: p.score + earnedPoints, timeBonus: timeRemaining };
                }
                // Simulate other players' scores
                const randomScore = Math.random() > 0.5 ? Math.floor(Math.random() * 150) : 0;
                return { ...p, score: p.score + randomScore };
            }).sort((a, b) => b.score - a.score);

            // Update position
            const position = updated.findIndex(p => p.id === '1') + 1;
            setMyPosition(position);

            return updated;
        });

        // Show leaderboard after a brief moment
        setTimeout(() => {
            setShowLeaderboard(true);
        }, 1500);
    };

    const handleNext = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setHasAnswered(false);
            setTimeRemaining(config.timePerQuestion);
            setShowLeaderboard(false);
        } else {
            // Game ended - navigate to results
            router.push(`/play/multiplayer/results/${roomCode}`);
        }
    };

    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    return (
        <div className="min-h-screen bg-black flex flex-col p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 max-w-4xl mx-auto w-full">
                <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${timeRemaining <= 5 ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/10'
                        }`}>
                        <Clock className={`w-5 h-5 ${timeRemaining <= 5 ? 'text-red-400' : 'text-white'}`} />
                        <span className={`font-bold ${timeRemaining <= 5 ? 'text-red-400' : 'text-white'}`}>
                            {timeRemaining}s
                        </span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                        <Trophy className="w-5 h-5 text-white" />
                        <span className="text-white font-medium">#{myPosition}/{players.length}</span>
                    </div>
                </div>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Progress Bar */}
            <div className="max-w-4xl mx-auto w-full mb-8">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-white"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
                <p className="text-gray-400 text-sm mt-2 text-center">
                    Question {currentQuestionIndex + 1} sur {quiz.questions.length}
                </p>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-4xl mx-auto w-full">
                <AnimatePresence mode="wait">
                    {!showLeaderboard ? (
                        <motion.div
                            key={`question-${currentQuestionIndex}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Question */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                                <h2 className="text-2xl font-serif font-medium text-white leading-relaxed">
                                    {currentQuestion.question}
                                </h2>
                            </div>

                            {/* Options */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {currentQuestion.options.map((option, index) => {
                                    const isSelected = selectedOption === option;
                                    const isCorrectOption = option === currentQuestion.correctAnswer;
                                    const showCorrect = hasAnswered && isCorrectOption;
                                    const showIncorrect = hasAnswered && isSelected && !isCorrect;

                                    return (
                                        <motion.button
                                            key={index}
                                            onClick={() => handleOptionSelect(option)}
                                            disabled={hasAnswered}
                                            whileHover={!hasAnswered ? { scale: 1.02 } : {}}
                                            whileTap={!hasAnswered ? { scale: 0.98 } : {}}
                                            className={`p-5 rounded-xl border-2 text-left transition-all ${showCorrect
                                                    ? 'bg-green-500/10 border-green-500/50'
                                                    : showIncorrect
                                                        ? 'bg-red-500/10 border-red-500/50'
                                                        : isSelected
                                                            ? 'bg-white/20 border-white/50'
                                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                                } ${hasAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                                        >
                                            <span className={`font-medium ${showCorrect ? 'text-green-400' : showIncorrect ? 'text-red-400' : 'text-white'
                                                }`}>
                                                {option}
                                            </span>
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Submit Button */}
                            {!hasAnswered && selectedOption && (
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={handleSubmit}
                                    className="w-full py-4 bg-white hover:bg-gray-200 text-black font-bold rounded-xl transition-colors"
                                >
                                    Valider
                                </motion.button>
                            )}

                            {/* Explanation */}
                            {hasAnswered && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-6"
                                >
                                    <h3 className="text-white font-medium mb-2">Explication</h3>
                                    <p className="text-gray-300 leading-relaxed">{currentQuestion.explanation}</p>
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="leaderboard"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <LiveLeaderboard
                                players={players}
                                currentUserId="1"
                                variant="mini"
                            />
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={handleNext}
                                className="w-full max-w-sm mx-auto block mt-6 py-4 bg-white hover:bg-gray-200 text-black font-bold rounded-xl transition-colors"
                            >
                                {currentQuestionIndex < quiz.questions.length - 1 ? 'Question suivante' : 'Voir les résultats'}
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
