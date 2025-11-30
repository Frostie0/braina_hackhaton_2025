"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { shuffle } from "@/lib/shuffle";
import { serverIp } from "@/lib/serverIp";
import QuizScreen from "@/app/(pages)/quiz/QuizScreen";
import FlashcardScreen from "@/app/(pages)/flashcard/flashcardScreen";
import TicTacToeMultiplayerScreen from "./TicTacToeMultiplayerScreen";
import ExamScreen from "./ExamScreen";

interface PlayConfig {
  mode: "quiz" | "flashcards" | "exam" | "multiplayer";
  quizId: string;
  questionsPerSession: number | "all";
  shuffleQuestions: boolean;
  roomCode?: string;
  isHost?: boolean;
  multiplayerConfig?: {
    questionsPerSession: number | "all";
    maxPlayers: number;
    timePerQuestion: number;
  };
}

interface PlayScreenProps {
  config: PlayConfig;
}
// Types basés sur le backend
interface BackendQuestion {
  type: "true_false" | "multiple_choice";
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

interface BackendQuiz {
  quizId: string;
  title: string;
  questions: BackendQuestion[];
  flashcards: BackendFlashcard[];
}

type QuizQuestionType = "true_false" | "multiple_choice";

interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuizData {
  title: string;
  questions: QuizQuestion[];
}

interface FlashcardData {
  flashcards: BackendFlashcard[];
}

type PlayData = QuizData | FlashcardData | null;

// Generate or retrieve user ID and name
const getUserId = (): string => {
  if (typeof window === "undefined") return "";
  let userId = localStorage.getItem("braina_user_id");
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("braina_user_id", userId);
  }
  return userId;
};

const getUserName = (): string => {
  if (typeof window === "undefined") return "";
  let userName = localStorage.getItem("braina_user_name");
  if (!userName) {
    userName = `Joueur${Math.floor(Math.random() * 1000)}`;
    localStorage.setItem("braina_user_name", userName);
  }
  return userName;
};

export default function PlayScreen({ config }: PlayScreenProps) {
  const router = useRouter();
  const [data, setData] = useState<PlayData>(null);
  const [loading, setLoading] = useState(true);
  const [userId] = useState(getUserId);
  const [userName] = useState(getUserName);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axios.get(
          `${serverIp}/quiz/getQuiz/${config.quizId}`
        );
        const backendQuiz: BackendQuiz | undefined = response.data?.quiz;

        if (!backendQuiz) {
          throw new Error("Quiz introuvable");
        }

        let processedData: QuizData | FlashcardData | null = null;

        // Préparer les questions au format attendu par QuizScreen
        const mappedQuestions = (backendQuiz.questions || []).map(
          (q, index) => ({
            id: String(index + 1),
            type: (q.type === "true_false"
              ? "true_false"
              : "multiple_choice") as QuizQuestionType,
            question: q.question,
            options:
              q.options && q.options.length > 0 ? q.options : ["Vrai", "Faux"],
            correctAnswer:
              typeof q.correctAnswer === "boolean"
                ? q.correctAnswer
                  ? "Vrai"
                  : "Faux"
                : String(q.correctAnswer),
            explanation: q.explanation,
          })
        );

        // Préparer les flashcards au format attendu par FlashcardScreen
        const mappedFlashcards = (backendQuiz.flashcards || []).map((f) => ({
          term: f.term,
          definition: f.definition,
          hint: f.hint,
          memoryTip: f.memoryTip,
        }));

        if (
          config.mode === "quiz" ||
          config.mode === "exam" ||
          config.mode === "multiplayer"
        ) {
          let questions = [...mappedQuestions];

          if (config.shuffleQuestions) {
            questions = shuffle(questions);
          }

          if (
            config.questionsPerSession !== "all" &&
            typeof config.questionsPerSession === "number" &&
            config.questionsPerSession < questions.length
          ) {
            questions = questions.slice(0, config.questionsPerSession);
          }

          processedData = {
            title: backendQuiz.title,
            questions,
          };
        }

        if (config.mode === "flashcards") {
          let flashcards = [...mappedFlashcards];

          if (config.shuffleQuestions) {
            flashcards = shuffle(flashcards);
          }

          if (
            config.questionsPerSession !== "all" &&
            typeof config.questionsPerSession === "number" &&
            config.questionsPerSession < flashcards.length
          ) {
            flashcards = flashcards.slice(0, config.questionsPerSession);
          }

          processedData = {
            flashcards,
          };
        }

        setData(processedData);
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        router.push("/dashboard");
      }
    };

    loadData();
  }, [config, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">
            Chargement du {config.mode}...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-serif font-medium mb-4">
            Contenu introuvable
          </h1>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-white text-black rounded-xl hover:bg-gray-200 transition-colors font-medium"
          >
            Retour au Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Redirection vers le bon composant selon le mode
  switch (config.mode) {
    case "quiz":
      if (!data || !("questions" in data)) {
        return null;
      }
      return <QuizScreen quiz={data} />;
    case "flashcards":
      if (!data || !("flashcards" in data)) {
        return null;
      }
      return <FlashcardScreen quiz={data} />;
    case "exam":
      if (!data || !("questions" in data)) {
        return null;
      }
      return <ExamScreen quiz={data} />;
    case "multiplayer":
      if (!data || !("questions" in data)) {
        return null;
      }
      return (
        <TicTacToeMultiplayerScreen
          quiz={data}
          roomCode={config.roomCode || ""}
          config={{
            questionsPerSession: config.questionsPerSession,
            maxPlayers: 5,
            timePerQuestion: 20,
            isHost: !!config.isHost,
          }}
        />
      );
    default:
      if (!data || !("questions" in data)) {
        return null;
      }
      return <QuizScreen quiz={data} />;
  }
}
