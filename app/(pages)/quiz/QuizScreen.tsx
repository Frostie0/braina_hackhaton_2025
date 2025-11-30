"use client";

import React, { useState } from "react";
import { X, Check, X as XIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { colors } from "@/lib/colors";
import { useRouter } from "next/navigation";

interface QuizData {
  title: string;
  questions: Array<{
    id: string;
    type: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }>;
}

export default function QuizScreen({ quiz }: { quiz: QuizData }) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<
    Array<{
      questionId: string;
      question: string;
      userAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
    }>
  >([]);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

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

    setUserAnswers([
      ...userAnswers,
      {
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        userAnswer: selectedOption,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect,
      },
    ]);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setShowResult(true);
    }
  };

  const isCorrect = selectedOption === currentQuestion.correctAnswer;

  if (showResult) {
    const percentage = Math.round((score / quiz.questions.length) * 100);

    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
        style={{ backgroundColor: colors.black, color: colors.white }}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 max-w-3xl mx-auto w-full z-10">
          <h1 className="text-2xl font-bold" style={{ color: colors.white }}>
            Résultats du quiz
          </h1>
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full transition-colors"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <X className="w-6 h-6" style={{ color: colors.white }} />
          </button>
        </div>

        <div className="flex-1 max-w-3xl mx-auto w-full p-6 pt-24 pb-32 overflow-y-auto">
          {/* Score Card */}
          <div
            className="rounded-3xl p-8 mb-8 flex items-center gap-8 relative overflow-hidden border"
            style={{
              backgroundColor: colors.gray2,
              borderColor: "rgba(255,255,255,0.1)",
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
                  stroke="rgba(255,255,255,0.1)"
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
              <span
                className="absolute text-3xl font-bold"
                style={{ color: colors.white }}
              >
                {percentage}%
              </span>
            </div>

            <div className="flex-1 z-10">
              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: colors.white }}
              >
                {percentage >= 80
                  ? "Excellent travail !"
                  : percentage >= 50
                  ? "Bien joué !"
                  : "Continuez vos efforts !"}
              </h2>
              <p style={{ color: colors.grayText }}>
                Vous avez obtenu {score} sur {quiz.questions.length} bonnes
                réponses.
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
                  backgroundColor: colors.gray2,
                  borderColor: "rgba(255,255,255,0.1)",
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: colors.white }}
                  >
                    Question {index + 1}
                  </h3>
                  {answer.isCorrect ? (
                    <div
                      className="p-1.5 rounded-full"
                      style={{ backgroundColor: `${colors.green}33` }}
                    >
                      <Check
                        className="w-4 h-4"
                        style={{ color: colors.green }}
                      />
                    </div>
                  ) : (
                    <div
                      className="p-1.5 rounded-full"
                      style={{ backgroundColor: `${colors.red}33` }}
                    >
                      <XIcon
                        className="w-4 h-4"
                        style={{ color: colors.red }}
                      />
                    </div>
                  )}
                </div>

                <p className="mb-4 text-lg" style={{ color: colors.grayText }}>
                  {answer.question}
                </p>

                <div className="space-y-3">
                  <div
                    className="p-3 rounded-xl border"
                    style={{
                      backgroundColor: answer.isCorrect
                        ? `${colors.green}1A`
                        : `${colors.red}1A`,
                      borderColor: answer.isCorrect
                        ? `${colors.green}4D`
                        : `${colors.red}4D`,
                    }}
                  >
                    <p
                      className="text-sm mb-1"
                      style={{ color: colors.grayText }}
                    >
                      Votre réponse :
                    </p>
                    <p
                      className="font-medium"
                      style={{
                        color: answer.isCorrect ? colors.green : colors.red,
                      }}
                    >
                      {answer.userAnswer}
                    </p>
                  </div>

                  {!answer.isCorrect && (
                    <div
                      className="p-3 rounded-xl border"
                      style={{
                        backgroundColor: `${colors.green}1A`,
                        borderColor: `${colors.green}4D`,
                      }}
                    >
                      <p
                        className="text-sm mb-1"
                        style={{ color: colors.grayText }}
                      >
                        Réponse correcte :
                      </p>
                      <p
                        className="font-medium"
                        style={{ color: colors.green }}
                      >
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
              color: "#fff",
              boxShadow: `0 10px 15px -3px ${colors.accent}33`,
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
      style={{ backgroundColor: colors.black, color: colors.white }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-4 flex-1">
          <span className="font-medium text-lg" style={{ color: colors.white }}>
            {currentQuestionIndex + 1}/{quiz.questions.length}
          </span>
          <div
            className="h-2 flex-1 rounded-full overflow-hidden"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          >
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
          onClick={() => router.back()}
          className="p-2 rounded-full transition-colors ml-4"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        >
          <X className="w-6 h-6" style={{ color: colors.white }} />
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
          <h2
            className="text-2xl md:text-3xl font-semibold leading-tight mb-12"
            style={{ color: colors.white }}
          >
            {currentQuestion.question}
          </h2>

          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => {
              let buttonStyle = {};
              let icon = null;

              if (isSubmitted) {
                if (option === currentQuestion.correctAnswer) {
                  buttonStyle = {
                    backgroundColor: `${colors.green}1A`,
                    borderColor: `${colors.green}80`,
                    color: colors.green,
                  };
                  icon = (
                    <Check
                      className="w-5 h-5"
                      style={{ color: colors.green }}
                    />
                  );
                } else if (option === selectedOption) {
                  buttonStyle = {
                    backgroundColor: `${colors.red}1A`,
                    borderColor: `${colors.red}80`,
                    color: colors.red,
                  };
                  icon = (
                    <XIcon className="w-5 h-5" style={{ color: colors.red }} />
                  );
                } else {
                  buttonStyle = {
                    backgroundColor: colors.gray2,
                    borderColor: "rgba(255,255,255,0.1)",
                    opacity: 0.5,
                    color: colors.grayText,
                  };
                }
              } else if (selectedOption === option) {
                buttonStyle = {
                  backgroundColor: `${colors.secondary}33`,
                  borderColor: colors.secondary,
                  color: colors.secondary,
                };
              } else {
                buttonStyle = {
                  backgroundColor: colors.gray2,
                  borderColor: "rgba(255,255,255,0.1)",
                  color: colors.white,
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
              backgroundColor: colors.black,
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            <div className="max-w-3xl mx-auto">
              <button
                onClick={handleSubmit}
                disabled={!selectedOption}
                className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all transform active:scale-[0.98]`}
                style={{
                  backgroundColor: selectedOption
                    ? colors.accent
                    : colors.gray2,
                  cursor: selectedOption ? "pointer" : "not-allowed",
                  boxShadow: selectedOption
                    ? `0 10px 15px -3px ${colors.accent}33`
                    : "none",
                  opacity: selectedOption ? 1 : 0.5,
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
              backgroundColor: isCorrect
                ? `${colors.green}1A`
                : `${colors.red}1A`,
              borderColor: isCorrect ? `${colors.green}33` : `${colors.red}33`,
            }}
          >
            <div className="max-w-3xl mx-auto">
              <div className="mb-4">
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: isCorrect ? colors.green : colors.red }}
                >
                  {isCorrect ? "Correct !" : "Incorrect"}
                </h3>
                <p className="leading-relaxed" style={{ color: colors.white }}>
                  {currentQuestion.explanation}
                </p>
              </div>
              <button
                onClick={handleNext}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-[0.98] text-white shadow-lg`}
                style={{
                  backgroundColor: isCorrect ? colors.green : colors.red,
                  boxShadow: `0 10px 15px -3px ${
                    isCorrect ? colors.green : colors.red
                  }33`,
                }}
              >
                {currentQuestionIndex < quiz.questions.length - 1
                  ? "Continuer"
                  : "Voir les résultats"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
