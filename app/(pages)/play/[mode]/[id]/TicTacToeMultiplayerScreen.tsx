'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Trophy, Circle, User, AlertCircle, CheckCircle2, XCircle, Timer, Heart, HeartCrack } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
    symbol: 'X' | 'O';
    score: number;
    avatar: React.ReactNode;
    color: string;
    borderColor: string;
    bgColor: string;
    chances: number; // Added chances
}

interface TicTacToeMultiplayerScreenProps {
    quiz: QuizData;
    roomCode: string;
    config: {
        questionsPerSession: number | 'all';
        maxPlayers: number;
        timePerQuestion: number;
    };
}

type GridCell = 'X' | 'O' | null;

const TURN_DURATION = 15; // Seconds to choose a cell
const MAX_CHANCES = 5; // Maximum chances per player

// Colors from lib/colors.js
const THEME = {
    black: '#0f172a',
    gray2: '#1E293B',
    grayText: '#C9CDD3',
    white: '#FAFAFA',
    red: '#EF4444',
    green: '#10B981',
    blue: '#6366F1'
};

export default function TicTacToeMultiplayerScreen({
    quiz,
    roomCode,
    config
}: TicTacToeMultiplayerScreenProps) {
    const router = useRouter();

    // Game State
    const [grid, setGrid] = useState<GridCell[]>(Array(9).fill(null));
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
    const [winningLine, setWinningLine] = useState<number[] | null>(null);
    const [turnTimeRemaining, setTurnTimeRemaining] = useState(TURN_DURATION);

    // Question State
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [selectedGridIndex, setSelectedGridIndex] = useState<number | null>(null);
    const [questionTimeRemaining, setQuestionTimeRemaining] = useState(config.timePerQuestion);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);

    // Players
    const [players, setPlayers] = useState<Player[]>([
        {
            id: '1',
            name: 'Vous',
            symbol: 'X',
            score: 0,
            avatar: <User className="w-5 h-5" />,
            color: 'text-blue-400',
            borderColor: 'border-blue-500/50',
            bgColor: 'bg-blue-500/10',
            chances: MAX_CHANCES
        },
        {
            id: '2',
            name: 'Adversaire',
            symbol: 'O',
            score: 0,
            avatar: <User className="w-5 h-5" />,
            color: 'text-red-400',
            borderColor: 'border-red-500/50',
            bgColor: 'bg-red-500/10',
            chances: MAX_CHANCES
        }
    ]);

    const currentPlayer = players[currentPlayerIndex];

    // Turn Timer Logic (Choosing a cell)
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (!isQuestionModalOpen && !winner && turnTimeRemaining > 0) {
            timer = setInterval(() => {
                setTurnTimeRemaining((prev) => {
                    if (prev <= 1) {
                        handleTurnTimeUp();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isQuestionModalOpen, winner, turnTimeRemaining, currentPlayerIndex]);

    // Question Timer Logic (Answering)
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isQuestionModalOpen && !hasAnswered && questionTimeRemaining > 0) {
            timer = setInterval(() => {
                setQuestionTimeRemaining((prev) => {
                    if (prev <= 1) {
                        handleQuestionTimeUp();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isQuestionModalOpen, hasAnswered, questionTimeRemaining]);

    const handleTurnTimeUp = () => {
        // Player ran out of time to choose a cell -> Lose a chance and switch turn
        handleLoseChance(currentPlayerIndex);
    };

    const handleQuestionTimeUp = () => {
        setHasAnswered(true);
        setIsCorrectAnswer(false);
        // Player ran out of time to answer -> Lose a chance
        handleLoseChance(currentPlayerIndex);

        // Wait a bit to show the correct answer/explanation then close
        setTimeout(closeQuestionModal, 4000);
    };

    const handleLoseChance = (playerIndex: number) => {
        const updatedPlayers = [...players];
        updatedPlayers[playerIndex].chances -= 1;
        setPlayers(updatedPlayers);

        if (updatedPlayers[playerIndex].chances <= 0) {
            // Game Over: Other player wins
            const otherPlayer = updatedPlayers[(playerIndex + 1) % updatedPlayers.length];
            setWinner(otherPlayer);
        } else if (!isQuestionModalOpen) {
            // Only switch turn immediately if not in modal (modal handles its own switch after delay)
            switchTurn();
        }
    };

    const switchTurn = () => {
        if (winner) return; // Don't switch if game is over
        setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
        setTurnTimeRemaining(TURN_DURATION);
    };

    const handleCellClick = (index: number) => {
        if (grid[index] || winner || isQuestionModalOpen) return;

        // Select a random question
        const randomQuestion = quiz.questions[Math.floor(Math.random() * quiz.questions.length)];
        setCurrentQuestion(randomQuestion);
        setSelectedGridIndex(index);
        setQuestionTimeRemaining(config.timePerQuestion);
        setSelectedOption(null);
        setHasAnswered(false);
        setIsQuestionModalOpen(true);
    };

    const handleOptionSelect = (option: string) => {
        if (hasAnswered || !currentQuestion) return;

        setSelectedOption(option);
        const correct = option === currentQuestion.correctAnswer;
        setHasAnswered(true);
        setIsCorrectAnswer(correct);

        if (correct) {
            // Place symbol on grid
            if (selectedGridIndex !== null) {
                const newGrid = [...grid];
                newGrid[selectedGridIndex] = currentPlayer.symbol;
                setGrid(newGrid);
                checkWin(newGrid, currentPlayer);
            }
        } else {
            // Wrong answer -> Lose a chance
            const updatedPlayers = [...players];
            updatedPlayers[currentPlayerIndex].chances -= 1;
            setPlayers(updatedPlayers);
            if (updatedPlayers[currentPlayerIndex].chances <= 0) {
                // Game Over logic will be handled in closeQuestionModal or effect, 
                // but let's set winner here to be safe if we want immediate feedback
                // actually, let's wait for explanation to close
            }
        }

        // Wait longer to read explanation
        setTimeout(closeQuestionModal, 4000);
    };

    const closeQuestionModal = () => {
        setIsQuestionModalOpen(false);
        setCurrentQuestion(null);

        // Check for game over due to chances
        const currentPlayer = players[currentPlayerIndex];
        if (currentPlayer.chances <= 0) {
            const otherPlayer = players[(currentPlayerIndex + 1) % players.length];
            setWinner(otherPlayer);
            return;
        }

        if (!winner) {
            switchTurn();
        }
    };

    const checkWin = (currentGrid: GridCell[], player: Player) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (const line of lines) {
            const [a, b, c] = line;
            if (currentGrid[a] === player.symbol &&
                currentGrid[b] === player.symbol &&
                currentGrid[c] === player.symbol) {
                setWinner(player);
                setWinningLine(line);
                return;
            }
        }

        if (!currentGrid.includes(null)) {
            setWinner('Draw');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-4 relative overflow-hidden font-sans" style={{ backgroundColor: THEME.black }}>
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]" />
            </div>

            {/* Header */}
            <div className="w-full max-w-4xl flex justify-between items-center mb-8 z-10">
                <div className="flex items-center gap-6">
                    {players.map((player, index) => (
                        <div
                            key={player.id}
                            className={`flex flex-col gap-2 px-5 py-3 rounded-2xl border transition-all duration-300 ${currentPlayerIndex === index
                                    ? `${player.bgColor} ${player.borderColor} scale-105 shadow-[0_0_20px_rgba(0,0,0,0.3)]`
                                    : 'bg-white/5 border-white/5 opacity-60'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full bg-black/20 ${player.color}`}>
                                    {player.avatar}
                                </div>
                                <div>
                                    <div className={`font-bold text-sm ${player.color}`}>{player.name}</div>
                                    <div className="text-xs font-medium" style={{ color: THEME.grayText }}>Symbole: {player.symbol}</div>
                                </div>
                                {currentPlayerIndex === index && !winner && !isQuestionModalOpen && (
                                    <div className="ml-2 flex items-center gap-1.5 text-xs font-mono text-white/80 bg-black/30 px-2 py-1 rounded-lg">
                                        <Timer className="w-3 h-3" />
                                        {turnTimeRemaining}s
                                    </div>
                                )}
                            </div>
                            {/* Chances Display */}
                            <div className="flex items-center gap-1 mt-1">
                                {Array.from({ length: MAX_CHANCES }).map((_, i) => (
                                    <Heart
                                        key={i}
                                        className={`w-3 h-3 ${i < player.chances ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors hover:text-white"
                    style={{ color: THEME.grayText }}
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Game Board Area */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-md">
                <div className="mb-8 text-center h-12 flex items-center justify-center">
                    {winner ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 px-6 py-3 rounded-full border border-white/20 backdrop-blur-md"
                            style={{ backgroundColor: THEME.gray2 }}
                        >
                            <Trophy className="w-6 h-6 text-yellow-400" />
                            <span className="text-xl font-bold text-white">
                                {winner === 'Draw' ? 'Match Nul !' : `Victoire de ${winner.name} !`}
                            </span>
                        </motion.div>
                    ) : (
                        <div className="text-lg font-medium flex items-center gap-2" style={{ color: THEME.grayText }}>
                            {isQuestionModalOpen ? (
                                <span className="text-purple-400 animate-pulse">Question en cours...</span>
                            ) : (
                                <>
                                    C'est au tour de <span className={`font-bold ${currentPlayer.color}`}>{currentPlayer.name}</span> de jouer
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-4 p-4 rounded-3xl backdrop-blur-sm border border-white/10 shadow-2xl" style={{ backgroundColor: THEME.gray2 }}>
                    {grid.map((cell, index) => (
                        <motion.button
                            key={index}
                            onClick={() => handleCellClick(index)}
                            disabled={!!cell || !!winner || isQuestionModalOpen}
                            whileHover={!cell && !winner && !isQuestionModalOpen ? { scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' } : {}}
                            whileTap={!cell && !winner && !isQuestionModalOpen ? { scale: 0.98 } : {}}
                            className={`w-24 h-24 sm:w-32 sm:h-32 rounded-2xl flex items-center justify-center text-5xl font-bold transition-all relative overflow-hidden ${cell ? 'bg-black/40 shadow-inner' : 'bg-white/5 hover:bg-white/10 border border-white/5'
                                } ${winningLine?.includes(index) ? 'ring-2 ring-yellow-400/80 shadow-[0_0_30px_rgba(250,204,21,0.2)]' : ''}`}
                        >
                            <AnimatePresence>
                                {cell === 'X' && (
                                    <motion.div
                                        initial={{ scale: 0, rotate: -45, opacity: 0 }}
                                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                        className="text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]"
                                    >
                                        <X className="w-12 h-12 sm:w-16 sm:h-16 stroke-[2.5]" />
                                    </motion.div>
                                )}
                                {cell === 'O' && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]"
                                    >
                                        <Circle className="w-10 h-10 sm:w-14 sm:h-14 stroke-[2.5]" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Question Modal */}
            <AnimatePresence>
                {isQuestionModalOpen && currentQuestion && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="border border-white/10 rounded-3xl p-8 w-full max-w-2xl shadow-2xl relative overflow-hidden"
                            style={{ backgroundColor: THEME.gray2 }}
                        >
                            {/* Background Glow */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 opacity-50" />

                            {/* Timer Bar */}
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-sm font-medium uppercase tracking-wider" style={{ color: THEME.grayText }}>Question pour {currentPlayer.name}</span>
                                <div className={`flex items-center gap-2 font-mono font-bold ${questionTimeRemaining <= 5 ? 'text-red-400' : 'text-white'}`}>
                                    <Clock className="w-4 h-4" />
                                    {questionTimeRemaining}s
                                </div>
                            </div>

                            <h3 className="text-xl sm:text-2xl font-serif font-medium mb-8 leading-relaxed" style={{ color: THEME.white }}>
                                {currentQuestion.question}
                            </h3>

                            <div className="grid grid-cols-1 gap-3 mb-6">
                                {currentQuestion.options.map((option, idx) => {
                                    const isSelected = selectedOption === option;
                                    const isCorrect = option === currentQuestion.correctAnswer;

                                    let buttonStyle = "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20";
                                    let icon = null;

                                    if (hasAnswered) {
                                        if (isCorrect) {
                                            buttonStyle = "bg-green-500/10 border-green-500/50 text-green-400";
                                            icon = <CheckCircle2 className="w-5 h-5 text-green-400" />;
                                        } else if (isSelected) {
                                            buttonStyle = "bg-red-500/10 border-red-500/50 text-red-400";
                                            icon = <XCircle className="w-5 h-5 text-red-400" />;
                                        } else {
                                            buttonStyle = "bg-white/5 border-white/5 opacity-40";
                                        }
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleOptionSelect(option)}
                                            disabled={hasAnswered}
                                            className={`p-5 rounded-xl border text-left transition-all font-medium flex items-center justify-between group ${buttonStyle}`}
                                            style={{ color: hasAnswered && (isCorrect || isSelected) ? undefined : THEME.white }}
                                        >
                                            <span>{option}</span>
                                            {icon}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Feedback & Explanation */}
                            <AnimatePresence>
                                {hasAnswered && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="border-t border-white/10 pt-6"
                                    >
                                        <div className={`flex items-center gap-2 mb-3 font-bold ${isCorrectAnswer ? 'text-green-400' : 'text-red-400'}`}>
                                            {isCorrectAnswer ? (
                                                <>
                                                    <CheckCircle2 className="w-5 h-5" />
                                                    Bonne réponse ! Case validée.
                                                </>
                                            ) : (
                                                <>
                                                    <HeartCrack className="w-5 h-5" />
                                                    Mauvaise réponse ! Une chance en moins.
                                                </>
                                            )}
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-4 text-sm leading-relaxed border border-white/5" style={{ color: THEME.grayText }}>
                                            <span className="font-medium block mb-1" style={{ color: THEME.white }}>Explication :</span>
                                            {currentQuestion.explanation}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
