'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Trophy, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useGameRoom } from '@/hooks/useGameRoom';
import LiveLeaderboard from '@/components/ui/LiveLeaderboard';

interface Question {
    type: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

interface Player {
    userId: string;
    userName: string;
    score: number;
    isHost: boolean;
    isConnected: boolean;
    answeredQuestions: Array<{
        questionIndex: number;
        answer: any;
        isCorrect: boolean;
        timeSpent: number;
    }>;
}

interface MultiplayerQuizScreenProps {
    roomCode: string;
    userId: string;
    userName: string;
}

export default function MultiplayerQuizScreen({
    roomCode,
    userId,
    userName
}: MultiplayerQuizScreenProps) {
    const router = useRouter();
    const { gameRoom, submitAnswer, nextQuestion, currentPlayer, isHost } = useGameRoom(userId, userName);

    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(15);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());

    const currentQuestion = gameRoom?.questions[gameRoom.currentQuestionIndex];
    const progress = gameRoom ? ((gameRoom.currentQuestionIndex + 1) / gameRoom.questions.length) * 100 : 0;
    const timePerQuestion = gameRoom?.settings.timePerQuestion || 15;

    // Reset state when question changes
    useEffect(() => {
        if (gameRoom) {
            setSelectedOption(null);
            setHasAnswered(false);
            setTimeRemaining(timePerQuestion);
            setShowLeaderboard(false);
            setQuestionStartTime(Date.now());
        }
    }, [gameRoom?.currentQuestionIndex, timePerQuestion]);

    // Timer countdown
    useEffect(() => {
        if (!gameRoom || hasAnswered || showLeaderboard || gameRoom.gameState !== 'playing') return;

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
    }, [hasAnswered, showLeaderboard, gameRoom?.gameState, gameRoom?.currentQuestionIndex]);

    // Check if all players have answered
    useEffect(() => {
        if (!gameRoom || !hasAnswered) return;

        const connectedPlayers = gameRoom.players.filter(p => p.isConnected);
        const allAnswered = connectedPlayers.every(p =>
            p.answeredQuestions.some(aq => aq.questionIndex === gameRoom.currentQuestionIndex)
        );

        if (allAnswered) {
            setShowLeaderboard(true);
        }
    }, [gameRoom?.players, hasAnswered, gameRoom?.currentQuestionIndex]);

    // Navigate to results when game ends
    useEffect(() => {
        if (gameRoom?.gameState === 'ended') {
            router.push(`/play/multiplayer/results/${roomCode}`);
        }
    }, [gameRoom?.gameState, roomCode, router]);

    const handleOptionSelect = (option: string) => {
        if (!hasAnswered) {
            setSelectedOption(option);
        }
    };

    const handleSubmit = useCallback(() => {
        if (hasAnswered || !selectedOption || !gameRoom) return;

        const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
        setHasAnswered(true);
        submitAnswer(selectedOption, timeSpent);

        // Show leaderboard after a brief moment
        setTimeout(() => {
            setShowLeaderboard(true);
        }, 1500);
    }, [hasAnswered, selectedOption, gameRoom, questionStartTime, submitAnswer]);

    const handleNext = () => {
        if (!gameRoom || !isHost) return;

        if (gameRoom.currentQuestionIndex < gameRoom.questions.length - 1) {
            nextQuestion();
        } else {
            nextQuestion(); // This will trigger game end on backend
        }
    };

    if (!gameRoom || !currentQuestion) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 text-sm">Chargement du jeu...</p>
                </div>
            </div>
        );
    }

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    const myPosition = gameRoom.players
        .filter(p => p.isConnected)
        .sort((a, b) => b.score - a.score)
        .findIndex(p => p.userId === userId) + 1;

    // Convert players to LiveLeaderboard format
    const leaderboardPlayers = gameRoom.players
        .filter(p => p.isConnected)
        .map(p => ({
            id: p.userId,
            name: p.userName,
            score: p.score,
            avatar: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            timeBonus: 0
        }));

    // Count players who have answered current question
    const playersAnswered = gameRoom.players.filter(p =>
        p.isConnected && p.answeredQuestions.some(aq => aq.questionIndex === gameRoom.currentQuestionIndex)
    ).length;
    const totalPlayers = gameRoom.players.filter(p => p.isConnected).length;

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
                        <span className="text-white font-medium">#{myPosition}/{totalPlayers}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                        <Users className="w-5 h-5 text-white" />
                        <span className="text-white font-medium">{playersAnswered}/{totalPlayers}</span>
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
                    Question {gameRoom.currentQuestionIndex + 1} sur {gameRoom.questions.length}
                </p>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-4xl mx-auto w-full">
                <AnimatePresence mode="wait">
                    {!showLeaderboard ? (
                        <motion.div
                            key={`question-${gameRoom.currentQuestionIndex}`}
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
                                players={leaderboardPlayers}
                                currentUserId={userId}
                                variant="mini"
                            />
                            {isHost && (
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={handleNext}
                                    className="w-full max-w-sm mx-auto block mt-6 py-4 bg-white hover:bg-gray-200 text-black font-bold rounded-xl transition-colors"
                                >
                                    {gameRoom.currentQuestionIndex < gameRoom.questions.length - 1 ? 'Question suivante' : 'Voir les résultats'}
                                </motion.button>
                            )}
                            {!isHost && (
                                <p className="text-center text-gray-400 text-sm mt-6">
                                    En attente que l'hôte passe à la question suivante...
                                </p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
