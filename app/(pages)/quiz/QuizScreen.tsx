'use client';

import React, { useState } from 'react';
import { X, Check, X as XIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors } from '@/lib/colors';

// Mock Data based on Quiz model
const MOCK_QUIZ = {
    title: "Histoire Médiévale",
    questions: [
        {
            id: '1',
            type: 'multiple_choice',
            question: "Quel traité a officialisé le partage de l'empire carolingien ?",
            options: ["Traité de Rome", "Traité de Versailles", "Traité de Verdun", "Traité de Paris"],
            correctAnswer: "Traité de Verdun",
            explanation: "Le Traité de Verdun, signé en 843, a divisé l'empire carolingien entre les petits-fils de Charlemagne."
        },
        {
            id: '2',
            type: 'multiple_choice',
            question: "Comment appelle-t-on les anciens esclaves qui ont été libérés ?",
            options: ["Les serfs", "Les affranchis", "Les vassaux", "Les citoyens"],
            correctAnswer: "Les affranchis",
            explanation: "Les affranchis sont des anciens esclaves qui ont obtenu leur liberté."
        },
        {
            id: '3',
            type: 'multiple_choice',
            question: "Qui a été sacré empereur en l'an 800 ?",
            options: ["Clovis", "Charlemagne", "Louis XIV", "Napoléon"],
            correctAnswer: "Charlemagne",
            explanation: "Charlemagne a été sacré empereur d'Occident par le pape Léon III à Rome le jour de Noël de l'an 800."
        },
        {
            id: '4',
            type: 'true_false',
            question: "La peste noire a ravagé l'Europe au XIVe siècle.",
            options: ["Vrai", "Faux"],
            correctAnswer: "Vrai",
            explanation: "La peste noire (1347-1352) a tué entre 30% et 50% de la population européenne."
        },
        {
            id: '5',
            type: 'multiple_choice',
            question: "Quelle guerre a opposé la France et l'Angleterre pendant plus de 100 ans ?",
            options: ["Guerre de Trente Ans", "Guerre de Cent Ans", "Guerre des Deux-Roses", "Guerre de Succession"],
            correctAnswer: "Guerre de Cent Ans",
            explanation: "La guerre de Cent Ans a opposé les royaumes de France et d'Angleterre de 1337 à 1453."
        }
    ]
};

export default function QuizScreen({ quizId }: { quizId: string }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [userAnswers, setUserAnswers] = useState<Array<{
        questionId: string;
        question: string;
        userAnswer: string;
        correctAnswer: string;
        isCorrect: boolean;
    }>>([]);

    const currentQuestion = MOCK_QUIZ.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / MOCK_QUIZ.questions.length) * 100;

    const handleOptionSelect = (option: string) => {
        if (!isSubmitted) {
            setSelectedOption(option);
        }
    };

    const handleSubmit = () => {
        if (!selectedOption) return;

        const isCorrect = selectedOption === currentQuestion.correctAnswer;
        setIsSubmitted(true);

        if (isCorrect) {
            setScore(score + 1);
        }

        setUserAnswers([...userAnswers, {
            questionId: currentQuestion.id,
            question: currentQuestion.question,
            userAnswer: selectedOption,
            correctAnswer: currentQuestion.correctAnswer,
            isCorrect
        }]);
    };

    const handleNext = () => {
        if (currentQuestionIndex < MOCK_QUIZ.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setIsSubmitted(false);
        } else {
            setShowResult(true);
        }
    };

    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    if (showResult) {
        const percentage = Math.round((score / MOCK_QUIZ.questions.length) * 100);

        return (
            <div
                className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
                style={{ backgroundColor: colors.white, color: colors.black }}
            >
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 max-w-3xl mx-auto w-full z-10">
                    <h1 className="text-2xl font-bold" style={{ color: colors.primary }}>Résultats du quiz</h1>
                    <button
                        onClick={() => window.location.reload()}
                        className="p-2 rounded-full transition-colors"
                        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    >
                        <X className="w-6 h-6" style={{ color: colors.grayText }} />
                    </button>
                </div>

                <div className="flex-1 max-w-3xl mx-auto w-full p-6 pt-24 pb-32 overflow-y-auto">
                    {/* Score Card */}
                    <div
                        className="rounded-3xl p-8 mb-8 flex items-center gap-8 relative overflow-hidden border"
                        style={{
                            backgroundColor: colors.gray2,
                            borderColor: `${colors.secondary}4D` // 30% opacity
                        }}
                    >
                        <div
                            className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"
                            style={{ backgroundColor: `${colors.secondary}1A` }} // 10% opacity
                        />

                        <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
                            {/* Circular Progress Background */}
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke={colors.gray}
                                    strokeWidth="12"
                                    fill="transparent"
                                />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke={colors.secondary}
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray={351.86}
                                    strokeDashoffset={351.86 - (351.86 * percentage) / 100}
                                    className="transition-all duration-1000 ease-out"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span className="absolute text-3xl font-bold" style={{ color: colors.primary }}>{percentage}%</span>
                        </div>

                        <div className="flex-1 z-10">
                            <h2 className="text-2xl font-bold mb-2" style={{ color: colors.primary }}>
                                {percentage >= 80 ? "Excellent travail !" :
                                    percentage >= 50 ? "Bien joué !" : "Continuez vos efforts !"}
                            </h2>
                            <p style={{ color: colors.grayText }}>
                                Vous avez obtenu {score} sur {MOCK_QUIZ.questions.length} bonnes réponses.
                            </p>
                        </div>
                    </div>

                    {/* Detailed Recap */}
                    <div className="space-y-4">
                        {userAnswers.map((answer, index) => (
                            <div
                                key={index}
                                className="border rounded-2xl p-6"
                                style={{
                                    backgroundColor: `${colors.gray2}80`, // 50% opacity
                                    borderColor: colors.gray
                                }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-lg font-semibold" style={{ color: colors.black }}>Question {index + 1}</h3>
                                    {answer.isCorrect ? (
                                        <div className="p-1.5 rounded-full" style={{ backgroundColor: `${colors.green}33` }}>
                                            <Check className="w-4 h-4" style={{ color: colors.green }} />
                                        </div>
                                    ) : (
                                        <div className="p-1.5 rounded-full" style={{ backgroundColor: `${colors.red}33` }}>
                                            <XIcon className="w-4 h-4" style={{ color: colors.red }} />
                                        </div>
                                    )}
                                </div>

                                <p className="mb-4 text-lg" style={{ color: colors.grayText }}>{answer.question}</p>

                                <div className="space-y-3">
                                    <div
                                        className="p-3 rounded-xl border"
                                        style={{
                                            backgroundColor: answer.isCorrect ? `${colors.green}1A` : `${colors.red}1A`,
                                            borderColor: answer.isCorrect ? `${colors.green}4D` : `${colors.red}4D`
                                        }}
                                    >
                                        <p className="text-sm mb-1" style={{ color: colors.grayText }}>Votre réponse :</p>
                                        <p className="font-medium" style={{ color: answer.isCorrect ? colors.green : colors.red }}>
                                            {answer.userAnswer}
                                        </p>
                                    </div>

                                    {!answer.isCorrect && (
                                        <div
                                            className="p-3 rounded-xl border"
                                            style={{
                                                backgroundColor: `${colors.green}1A`,
                                                borderColor: `${colors.green}4D`
                                            }}
                                        >
                                            <p className="text-sm mb-1" style={{ color: colors.grayText }}>Réponse correcte :</p>
                                            <p className="font-medium" style={{ color: colors.green }}>
                                                {answer.correctAnswer}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-4 mt-8 rounded-xl font-semibold text-lg transition-colors shadow-lg"
                        style={{
                            backgroundColor: colors.accent,
                            color: '#fff', // Assuming white text on accent
                            boxShadow: `0 10px 15px -3px ${colors.accent}33`
                        }}
                    >
                        Recommencer le quiz
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen flex flex-col relative overflow-hidden"
            style={{ backgroundColor: colors.white, color: colors.black }}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-6 max-w-3xl mx-auto w-full">
                <div className="flex items-center gap-4 flex-1">
                    <span className="font-medium text-lg" style={{ color: colors.grayText }}>
                        {currentQuestionIndex + 1}/{MOCK_QUIZ.questions.length}
                    </span>
                    <div className="h-2 flex-1 rounded-full overflow-hidden" style={{ backgroundColor: colors.gray2 }}>
                        <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: colors.secondary }}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>
                <button
                    className="p-2 rounded-full transition-colors ml-4"
                    style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                >
                    <X className="w-6 h-6" style={{ color: colors.grayText }} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full p-6 pb-32 overflow-y-auto">
                <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1"
                >
                    <h2 className="text-2xl md:text-3xl font-semibold leading-tight mb-12" style={{ color: colors.primary }}>
                        {currentQuestion.question}
                    </h2>

                    <div className="space-y-4">
                        {currentQuestion.options.map((option, index) => {
                            let buttonStyle = {};
                            let icon = null;
                            let textClass = "";

                            if (isSubmitted) {
                                if (option === currentQuestion.correctAnswer) {
                                    buttonStyle = {
                                        backgroundColor: `${colors.green}1A`,
                                        borderColor: `${colors.green}80`,
                                        color: colors.green
                                    };
                                    icon = <Check className="w-5 h-5" style={{ color: colors.green }} />;
                                } else if (option === selectedOption) {
                                    buttonStyle = {
                                        backgroundColor: `${colors.red}1A`,
                                        borderColor: `${colors.red}80`,
                                        color: colors.red
                                    };
                                    icon = <XIcon className="w-5 h-5" style={{ color: colors.red }} />;
                                } else {
                                    buttonStyle = {
                                        backgroundColor: `${colors.gray2}80`,
                                        borderColor: colors.gray,
                                        opacity: 0.5
                                    };
                                }
                            } else if (selectedOption === option) {
                                buttonStyle = {
                                    backgroundColor: `${colors.secondary}33`,
                                    borderColor: colors.secondary,
                                    color: colors.secondary
                                };
                            } else {
                                buttonStyle = {
                                    backgroundColor: `${colors.gray2}80`,
                                    borderColor: colors.gray
                                };
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleOptionSelect(option)}
                                    disabled={isSubmitted}
                                    className={`w-full p-4 rounded-xl border-2 text-left font-medium text-lg transition-all duration-200 flex items-center justify-between group hover:bg-opacity-80`}
                                    style={buttonStyle}
                                >
                                    <span>{option}</span>
                                    {icon}
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {/* Bottom Action / Feedback Sheet */}
            <AnimatePresence mode="wait">
                {!isSubmitted ? (
                    <div
                        className="fixed bottom-0 left-0 right-0 p-6 border-t"
                        style={{
                            backgroundColor: colors.white,
                            borderColor: `${colors.gray}80`
                        }}
                    >
                        <div className="max-w-3xl mx-auto">
                            <button
                                onClick={handleSubmit}
                                disabled={!selectedOption}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-[0.98]`}
                                style={{
                                    backgroundColor: selectedOption ? colors.accent : colors.gray2,
                                    color: selectedOption ? '#fff' : colors.gray,
                                    cursor: selectedOption ? 'pointer' : 'not-allowed',
                                    boxShadow: selectedOption ? `0 10px 15px -3px ${colors.accent}33` : 'none'
                                }}
                            >
                                Soumettre
                            </button>
                        </div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className={`fixed bottom-0 left-0 right-0 p-6 rounded-t-3xl shadow-2xl z-50 border-t backdrop-blur-md`}
                        style={{
                            backgroundColor: isCorrect ? `${colors.green}1A` : `${colors.red}1A`,
                            borderColor: isCorrect ? `${colors.green}33` : `${colors.red}33`
                        }}
                    >
                        <div className="max-w-3xl mx-auto">
                            <div className="mb-4">
                                <h3
                                    className="text-xl font-bold mb-2"
                                    style={{ color: isCorrect ? colors.green : colors.red }}
                                >
                                    {isCorrect ? 'Correct !' : 'Incorrect'}
                                </h3>
                                <p className="leading-relaxed" style={{ color: colors.grayText }}>
                                    {currentQuestion.explanation}
                                </p>
                            </div>
                            <button
                                onClick={handleNext}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-[0.98] text-white shadow-lg`}
                                style={{
                                    backgroundColor: isCorrect ? colors.green : colors.red,
                                    boxShadow: `0 10px 15px -3px ${isCorrect ? colors.green : colors.red}33`
                                }}
                            >
                                {currentQuestionIndex < MOCK_QUIZ.questions.length - 1 ? 'Continuer' : 'Voir les résultats'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}