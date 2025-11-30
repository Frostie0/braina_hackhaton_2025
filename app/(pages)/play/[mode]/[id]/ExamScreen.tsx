'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, ChevronRight, ChevronLeft, FileText, Send, AlertTriangle, Save } from 'lucide-react';
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
    subject?: string;
}

interface ExamScreenProps {
    quiz: QuizData;
    config?: any;
}

const EXAM_DURATION = 60 * 180; // 3 hours (180 minutes) as per model

export default function ExamScreen({ quiz, config }: ExamScreenProps) {
    const router = useRouter();

    // State
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeRemaining, setTimeRemaining] = useState(EXAM_DURATION);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

    const totalQuestions = quiz.questions.length;

    // Timer Logic
    useEffect(() => {
        if (isSubmitted) return;

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
    }, [isSubmitted]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
    };

    const handleOptionSelect = (questionId: string, option: string) => {
        if (isSubmitted) return;
        setAnswers(prev => ({
            ...prev,
            [questionId]: option
        }));
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        setShowConfirmSubmit(false);
    };

    const calculateScore = () => {
        let correct = 0;
        quiz.questions.forEach(q => {
            if (answers[q.id] === q.correctAnswer) correct++;
        });
        return Math.round((correct / totalQuestions) * 20); // Score sur 20
    };

    const getGrade = (score: number) => {
        if (score >= 18) return { label: 'Excellent', color: 'text-green-600', stamp: 'border-green-600 text-green-600' };
        if (score >= 14) return { label: 'Très Bien', color: 'text-blue-600', stamp: 'border-blue-600 text-blue-600' };
        if (score >= 10) return { label: 'Passable', color: 'text-orange-600', stamp: 'border-orange-600 text-orange-600' };
        return { label: 'Insuffisant', color: 'text-red-600', stamp: 'border-red-600 text-red-600' };
    };

    // Render Results Screen
    if (isSubmitted) {
        const score = calculateScore();
        const grade = getGrade(score);
        const correctCount = quiz.questions.filter(q => answers[q.id] === q.correctAnswer).length;
        const incorrectCount = totalQuestions - correctCount;
        const percentage = Math.round((correctCount / totalQuestions) * 100);

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 font-sans">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden"
                >
                    {/* Header Result - Gradient */}
                    <div className="relative bg-purple-500 p-8 text-white overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex-1">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <h1 className="text-3xl lg:text-4xl font-bold">Résultats de l'Examen</h1>
                                    </div>
                                    <p className="text-white/90 text-lg font-medium">{quiz.title}</p>
                                    <p className="text-white/70 text-sm mt-2">
                                        Complété le {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </motion.div>
                            </div>

                            {/* 3D Score Badge */}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 15 }}
                                className="relative"
                            >
                                <div className={`relative bg-white rounded-2xl p-6 shadow-2xl ${grade.stamp.replace('border-', 'ring-4 ring-').replace('text-', '')} ring-opacity-50`}>
                                    <div className="text-center">
                                        <div className="text-5xl font-black text-gray-800">
                                            {score}
                                        </div>
                                        <div className="text-2xl font-bold text-gray-400">/20</div>
                                        <div className={`mt-2 text-sm font-bold uppercase tracking-wider ${grade.color}`}>
                                            {grade.label}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Statistics Section */}
                    <div className="bg-gradient-to-br from-gray-50 to-white p-6 border-b border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Circular Progress */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center justify-center"
                            >
                                <div className="relative w-32 h-32">
                                    <svg className="transform -rotate-90 w-32 h-32">
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="none"
                                            className="text-gray-200"
                                        />
                                        <motion.circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="none"
                                            strokeLinecap="round"
                                            className={score >= 14 ? 'text-green-500' : score >= 10 ? 'text-orange-500' : 'text-red-500'}
                                            initial={{ strokeDasharray: "0 352" }}
                                            animate={{ strokeDasharray: `${percentage * 3.52} 352` }}
                                            transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gray-800">{percentage}%</div>
                                            <div className="text-xs text-gray-500">Réussite</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Correct/Incorrect Stats */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="flex flex-col gap-3"
                            >
                                <div className="flex items-center gap-3 bg-green-50 rounded-xl p-4 border border-green-200">
                                    <div className="p-2 bg-green-500 rounded-lg">
                                        <CheckCircle2 className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-green-700">{correctCount}</div>
                                        <div className="text-sm text-green-600">Correctes</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-red-50 rounded-xl p-4 border border-red-200">
                                    <div className="p-2 bg-red-500 rounded-lg">
                                        <XCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-red-700">{incorrectCount}</div>
                                        <div className="text-sm text-red-600">Incorrectes</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Time & Questions */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="flex flex-col gap-3"
                            >
                                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="w-5 h-5 text-blue-600" />
                                        <div className="text-sm font-medium text-blue-700">Temps écoulé</div>
                                    </div>
                                    <div className="text-2xl font-bold text-blue-800">
                                        {formatTime(EXAM_DURATION - timeRemaining)}
                                    </div>
                                </div>
                                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText className="w-5 h-5 text-purple-600" />
                                        <div className="text-sm font-medium text-purple-700">Questions</div>
                                    </div>
                                    <div className="text-2xl font-bold text-purple-800">
                                        {totalQuestions}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Content Result - Question Cards */}
                    <div className="p-6 lg:p-8 overflow-y-auto max-h-[50vh] bg-gray-50">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-indigo-600 rounded-full"></div>
                            Détail des réponses
                        </h2>
                        <div className="space-y-4">
                            {quiz.questions.map((q, idx) => {
                                const userAnswer = answers[q.id];
                                const isCorrect = userAnswer === q.correctAnswer;

                                return (
                                    <motion.div
                                        key={q.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.8 + idx * 0.1 }}
                                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200"
                                    >
                                        <div className="p-5">
                                            <div className="flex items-start gap-4">
                                                {/* Question Number Badge */}
                                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${isCorrect ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-rose-600'
                                                    }`}>
                                                    {idx + 1}
                                                </div>

                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900 mb-3 leading-relaxed">{q.question}</p>

                                                    {/* Answer Section */}
                                                    <div className="space-y-2 mb-3">
                                                        <div className="flex items-start gap-2">
                                                            <span className="text-sm text-gray-500 font-medium min-w-[100px]">Votre réponse:</span>
                                                            <span className={`text-sm font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                                                {userAnswer || 'Aucune réponse'}
                                                            </span>
                                                        </div>
                                                        {!isCorrect && (
                                                            <div className="flex items-start gap-2">
                                                                <span className="text-sm text-gray-500 font-medium min-w-[100px]">Bonne réponse:</span>
                                                                <span className="text-sm font-semibold text-green-700">{q.correctAnswer}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Explanation */}
                                                    <div className="border rounded-lg p-3 border-blue-400">
                                                        <div className="flex gap-2">
                                                            <div className="text-blue-600 mt-0.5">💡</div>
                                                            <p className="text-sm text-gray-700 leading-relaxed">
                                                                {q.explanation}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Status Icon */}
                                                {isCorrect ? (
                                                    <CheckCircle2 className="flex-shrink-0 text-green-500 w-7 h-7" />
                                                ) : (
                                                    <XCircle className="flex-shrink-0 text-red-500 w-7 h-7" />
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer Result */}
                    <div className="bg-white border-t border-gray-200 p-6 flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                            Score final : <span className="font-bold text-gray-800">{score}/20</span>
                        </div>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Retour au Tableau de bord
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Render Exam Interface
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4 font-serif text-gray-900">

            {/* Top Bar (Floating) */}
            <div className="fixed top-0 left-0 right-0 bg-gray-900 text-white z-50 shadow-md px-6 py-3 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-medium text-sm hidden sm:block">Mode Examen</span>
                </div>

                <div className={`flex items-center gap-2 font-mono text-lg font-bold ${timeRemaining < 300 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                    <Clock className="w-5 h-5" />
                    {formatTime(timeRemaining)}
                </div>

                <button
                    onClick={() => setShowConfirmSubmit(true)}
                    className="px-4 py-2 bg-white text-gray-900 hover:bg-gray-100 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                >
                    <span>Rendre</span>
                    <Send className="w-4 h-4" />
                </button>
            </div>

            {/* Paper Container */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-[210mm] bg-white shadow-2xl mt-16 mb-12 min-h-[297mm] relative text-black"
                style={{
                    padding: '20mm',
                    fontFamily: '"Times New Roman", Times, serif'
                }}
            >
                {/* Official Header */}
                <div className="border-b-2 border-black pb-4 mb-6 text-center">
                    <h1 className="font-bold text-base uppercase leading-tight mb-1">
                        MINISTÈRE DE L'ÉDUCATION NATIONALE ET DE LA FORMATION PROFESSIONNELLE (MENFP)
                    </h1>
                    <h2 className="font-bold text-sm uppercase mb-1">
                        FILIERE D'ENSEIGNEMENT GÉNÉRAL
                    </h2>
                    <h2 className="font-bold text-sm uppercase mb-2">
                        EXAMENS DE FIN D'ÉTUDES SECONDAIRES
                    </h2>
                    <h1 className="font-bold text-xl uppercase mb-2">
                        {quiz.subject || quiz.title}
                    </h1>
                    <div className="font-bold text-sm uppercase mb-2">
                        SÉRIES : (SMP-SVT)
                    </div>
                    <div className="font-bold text-sm uppercase">
                        TEXTE MODÈLE
                    </div>
                </div>

                {/* Consignes */}
                <div className="mb-6 text-sm leading-relaxed">
                    <p className="font-bold italic mb-1">Consignes :</p>
                    <ol className="list-decimal list-inside space-y-0.5 italic text-black font-medium">
                        <li>L'usage de la calculatrice programmable est formellement interdit.</li>
                        <li>Tout gadget électronique (Tél., tablette, iPad, montre intelligente) est formellement interdit dans la salle d'examen.</li>
                        <li>Le silence est obligatoire dans la salle, il crée de meilleures conditions de travail.</li>
                        <li>Les deux parties de l'épreuve sont obligatoires.</li>
                    </ol>
                    <div className="text-right font-bold mt-4">
                        Durée de l'épreuve : 3 heures
                    </div>
                </div>

                <div className="w-full h-0.5 bg-black mb-8"></div>

                {/* Exam Content - Two Columns Layout for larger screens */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">

                    {/* Left Column - Part 1 */}
                    <div>
                        <h3 className="font-bold underline mb-1 uppercase text-sm">
                            A-PREMIÈRE PARTIE : {quiz.subject?.includes('Histoire') ? 'Histoire Nationale' : 'Connaissances Générales'} (60%)
                        </h3>
                        <p className="text-sm font-bold mb-4">
                            les candidats répondent aux questions des deux textes
                        </p>

                        {/* Textes historiques placeholder if subject is history */}
                        {quiz.subject?.includes('Histoire') && (
                            <div className="mb-4">
                                <h4 className="font-bold text-sm mb-2">Textes historiques</h4>
                                <div className="text-xs text-justify mb-4">
                                    <p className="font-bold mb-1">Texte 1</p>
                                    <p className="italic">
                                        (Texte généré dynamiquement ou espace réservé pour le texte source...)
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            {quiz.questions.slice(0, Math.ceil(totalQuestions / 2)).map((q, idx) => (
                                <div key={q.id} className="break-inside-avoid">
                                    <div className="flex gap-2 mb-2">
                                        <span className="font-bold">{idx + 1}-</span>
                                        <p className="text-justify text-sm leading-relaxed">
                                            {q.question}
                                        </p>
                                    </div>
                                    <div className="pl-4 space-y-2.5 mt-3">
                                        {q.options.map((option, optIdx) => (
                                            <label
                                                key={optIdx}
                                                className={`flex items-start gap-3 cursor-pointer group px-3 py-2.5 rounded-md transition-all duration-200 ${answers[q.id] === option
                                                    ? 'bg-gray-100 shadow-sm'
                                                    : 'hover:bg-gray-50 hover:shadow-sm'
                                                    }`}
                                            >
                                                <div className="relative mt-0.5">
                                                    <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-200 ${answers[q.id] === option
                                                        ? 'border-black bg-black shadow-md'
                                                        : 'border-gray-400 group-hover:border-gray-600 group-hover:shadow-sm'
                                                        }`}>
                                                        {answers[q.id] === option && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                                                className="w-2.5 h-2.5 bg-white rounded-full"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                <input
                                                    type="radio"
                                                    name={`q-${q.id}`}
                                                    className="hidden"
                                                    onChange={() => handleOptionSelect(q.id, option)}
                                                    checked={answers[q.id] === option}
                                                />
                                                <span className={`text-sm leading-relaxed flex-1 transition-colors ${answers[q.id] === option ? 'font-medium text-black' : 'text-gray-700'
                                                    }`}>
                                                    {option}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Part 2 */}
                    <div>
                        <h3 className="font-bold underline mb-4 uppercase text-sm">
                            DEUXIEME PARTIE (40%)
                            <br />
                            {quiz.subject?.includes('Histoire') ? 'Histoire Universelle et Géographie Générale' : 'Analyse et Réflexion'}
                        </h3>

                        <div className="space-y-6">
                            {quiz.questions.slice(Math.ceil(totalQuestions / 2)).map((q, idx) => (
                                <div key={q.id} className="break-inside-avoid">
                                    <div className="flex gap-2 mb-2">
                                        <span className="font-bold">{Math.ceil(totalQuestions / 2) + idx + 1}-</span>
                                        <p className="text-justify text-sm leading-relaxed">
                                            {q.question}
                                        </p>
                                    </div>
                                    <div className="pl-4 space-y-2.5 mt-3">
                                        {q.options.map((option, optIdx) => (
                                            <label
                                                key={optIdx}
                                                className={`flex items-start gap-3 cursor-pointer group px-3 py-2.5 rounded-md transition-all duration-200 ${answers[q.id] === option
                                                    ? 'bg-gray-100 shadow-sm'
                                                    : 'hover:bg-gray-50 hover:shadow-sm'
                                                    }`}
                                            >
                                                <div className="relative mt-0.5">
                                                    <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-200 ${answers[q.id] === option
                                                        ? 'border-black bg-black shadow-md'
                                                        : 'border-gray-400 group-hover:border-gray-600 group-hover:shadow-sm'
                                                        }`}>
                                                        {answers[q.id] === option && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                                                className="w-2.5 h-2.5 bg-white rounded-full"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                <input
                                                    type="radio"
                                                    name={`q-${q.id}`}
                                                    className="hidden"
                                                    onChange={() => handleOptionSelect(q.id, option)}
                                                    checked={answers[q.id] === option}
                                                />
                                                <span className={`text-sm leading-relaxed flex-1 transition-colors ${answers[q.id] === option ? 'font-medium text-black' : 'text-gray-700'
                                                    }`}>
                                                    {option}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </motion.div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {showConfirmSubmit && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl font-sans"
                        >
                            <div className="flex items-center gap-3 text-amber-500 mb-4">
                                <AlertTriangle className="w-8 h-8" />
                                <h3 className="text-xl font-bold text-gray-800">Rendre la copie ?</h3>
                            </div>
                            <p className="text-gray-600 mb-6">
                                Vous avez répondu à {Object.keys(answers).length} sur {totalQuestions} questions.
                                Une fois rendu, vous ne pourrez plus modifier vos réponses.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowConfirmSubmit(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                                >
                                    Relire
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 rounded-lg font-medium"
                                >
                                    Confirmer et Rendre
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
