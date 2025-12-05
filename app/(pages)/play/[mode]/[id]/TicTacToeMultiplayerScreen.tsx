"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Clock,
  Trophy,
  Circle,
  User,
  CheckCircle2,
  XCircle,
  Timer,
  Heart,
  HeartCrack,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import serverIp from "@/lib/serverIp";

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
  symbol: "X" | "O";
  score: number;
  avatar: React.ReactNode;
  color: string;
  borderColor: string;
  bgColor: string;
}

interface TicTacToeMultiplayerScreenProps {
  quiz: QuizData;
  quizId: string;
  roomCode: string;
  config: {
    questionsPerSession: number | "all";
    maxPlayers: number;
    timePerQuestion: number;
    isHost?: boolean;
  };
}

type GridCell = "X" | "O" | null;

const TURN_DURATION = 15; // Seconds to choose a cell


// Colors from lib/colors.js
const THEME = {
  black: "#0f172a",
  gray2: "#1E293B",
  grayText: "#C9CDD3",
  white: "#FAFAFA",
  red: "#EF4444",
  green: "#10B981",
  blue: "#6366F1",
};

export default function TicTacToeMultiplayerScreen({
  quiz,
  quizId,
  roomCode,
  config,
}: TicTacToeMultiplayerScreenProps) {
  const router = useRouter();

  // Game State
  const [grid, setGrid] = useState<GridCell[]>(Array(9).fill(null));
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [winner, setWinner] = useState<Player | "Draw" | null>(null);
  const [turnTimeRemaining, setTurnTimeRemaining] = useState(TURN_DURATION);

  // Question State
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedGridIndex, setSelectedGridIndex] = useState<number | null>(
    null
  );
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState(
    config.timePerQuestion
  );
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);

  // Players
  const [players, setPlayers] = useState<Player[]>([
    {
      id: "1",
      name: "Vous",
      symbol: "X",
      score: 0,
      avatar: <User className="w-5 h-5" />,
      color: "text-blue-400",
      borderColor: "border-blue-500/50",
      bgColor: "bg-blue-500/10",

    },
    {
      id: "2",
      name: "Adversaire",
      symbol: "O",
      score: 0,
      avatar: <User className="w-5 h-5" />,
      color: "text-red-400",
      borderColor: "border-red-500/50",
      bgColor: "bg-red-500/10",

    },
  ]);

  const currentPlayer = players[currentPlayerIndex];

  // Etat serveur TicTacToe
  const [serverTurn, setServerTurn] = useState<"X" | "O">("X");
  const [symbolsMap, setSymbolsMap] = useState<Record<string, "X" | "O">>({});
  const [turnStart, setTurnStart] = useState<number>(Date.now());
  const [serverTurnDuration, setServerTurnDuration] = useState<number>(TURN_DURATION);
  const [myUserId] = useState(() => {
    if (typeof window === "undefined") return "";
    let userId = localStorage.getItem("braina_user_id");
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      localStorage.setItem("braina_user_id", userId);
    }
    return userId;
  });
  const [mySocketId, setMySocketId] = useState<string>("");
  const mySymbol = useMemo(() => {
    const byUser = symbolsMap[myUserId] as "X" | "O" | undefined;
    if (byUser) return byUser;
    if (mySocketId) {
      return symbolsMap[mySocketId] as "X" | "O" | undefined;
    }
    return undefined;
  }, [symbolsMap, myUserId, mySocketId]);

  // Socket.IO
  const socketRef = useRef<Socket | null>(null);
  // Audio
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ensureAudio = () => {
    if (!audioCtxRef.current) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      } catch { }
    }
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Resume audio on first interaction
  useEffect(() => {
    const resumeAudio = () => {
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    };
    window.addEventListener('click', resumeAudio);
    window.addEventListener('keydown', resumeAudio);
    return () => {
      window.removeEventListener('click', resumeAudio);
      window.removeEventListener('keydown', resumeAudio);
    };
  }, []);
  const playBeep = (freq = 440, durationMs = 120, type: OscillatorType = "sine", volume = 0.2) => {
    const ctx = ensureAudio();
    if (!ctx) return;
    console.log("🔊 Playing beep:", { freq, durationMs, volume });
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.value = volume;
    o.connect(g); g.connect(ctx.destination);
    const now = ctx.currentTime;
    o.start(now);
    g.gain.setValueAtTime(volume, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);
    o.stop(now + durationMs / 1000);
  };

  const getServerBaseUrl = (httpUrl: string) => {
    try {
      const url = new URL(httpUrl);
      const cleanedPath = url.pathname.replace(/\/?api\/.*/i, "");
      url.pathname = cleanedPath.endsWith("/")
        ? cleanedPath
        : `${cleanedPath}/`;
      return url.origin + url.pathname.replace(/\/$/, "");
    } catch {
      return httpUrl.replace(/\/?api\/.*/i, "").replace(/\/$/, "");
    }
  };
  const socketBase = useMemo(() => getServerBaseUrl(serverIp || ""), []);

  const getUserId = (): string => {
    if (typeof window === "undefined") return "";
    let userId = localStorage.getItem("braina_user_id");
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
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

  // Connexion et abonnement aux événements
  useEffect(() => {
    if (!roomCode) return;
    const socket = io(socketBase, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      const userId = getUserId();
      const userName = getUserName();
      setMySocketId(socket.id ?? "");
      console.log("🔌 Connected to socket", { socketId: socket.id, userId, userName, roomCode });

      // Rejoindre la partie et demander l'état courant
      const timePerTurn = typeof config?.timePerQuestion === 'number' ? config.timePerQuestion : TURN_DURATION;
      socket.emit("join_game", { gameCode: roomCode, userId, userName, timePerTurn });
      socket.emit("request_state", { gameCode: roomCode });
    });

    // Ecoute de l'état minimal du morpion
    socket.on(
      "ttt_state",
      (s: {
        grid: GridCell[];
        currentTurn: "X" | "O";
        symbols: Record<string, "X" | "O">;
        winner: { userId: string; symbol: "X" | "O" } | "Draw" | null;
        turnStart: number;
        turnDuration?: number;
      }) => {
        const prevTurn = serverTurn;
        setGrid(s.grid as GridCell[]);
        setServerTurn(s.currentTurn);
        setSymbolsMap(s.symbols || {});
        setTurnStart(s.turnStart || Date.now());
        const dur = typeof s.turnDuration === 'number' ? s.turnDuration : TURN_DURATION;
        setServerTurnDuration(dur);
        const remain = Math.max(0, dur - Math.floor((Date.now() - (s.turnStart || Date.now())) / 1000));
        setTurnTimeRemaining(remain);
        setCurrentPlayerIndex(s.currentTurn === "X" ? 0 : 1);
        // Son léger quand le tour change
        if (prevTurn && prevTurn !== s.currentTurn) {
          playBeep(650, 90, "sine", 0.05);
        }
      }
    );

    socket.on(
      "ttt_gameover",
      (payload: { winner: { userId: string; symbol: "X" | "O" } | "Draw" }) => {
        if (payload.winner === "Draw") {
          setWinner("Draw");
          playBeep(380, 250, "triangle", 0.08);
        } else {
          const w = payload.winner;
          // Attribuer l'affichage de la victoire du point de vue local
          setWinner(w.userId === myUserId ? players[0] : players[1]);
          if (w.userId === myUserId) {
            playBeep(880, 180, "sine", 0.08);
            setTimeout(() => playBeep(1320, 220, "sine", 0.08), 120);
          } else {
            playBeep(240, 260, "sawtooth", 0.06);
          }
        }
      }
    );

    return () => {
      // Déconnecter proprement lors du démontage du composant
      if (socketRef.current) {
        console.log("🔌 Disconnecting TicTacToe socket on unmount");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketBase, roomCode]);

  // Décompte synchronisé avec le serveur (affichage)
  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - turnStart) / 1000);
      const remain = Math.max(0, serverTurnDuration - elapsed);
      setTurnTimeRemaining(remain);
    }, 1000);
    return () => clearInterval(timer);
  }, [turnStart, serverTurnDuration]);

  // Increment play count when game ends
  useEffect(() => {
    const incrementPlayCount = async () => {
      if (winner) {
        try {
          const userId = getUserId();
          if (userId) {
            await axios.post(`${serverIp}/quiz/incrementPlayed`, {
              quizId: quizId,
              userId: userId,
            });
          }
        } catch (error) {
          console.error("Failed to increment play count:", error);
        }
      }
    };

    incrementPlayCount();
  }, [winner, quizId]);



  const handleCellClick = (index: number) => {
    console.log("🖱️ Cell clicked:", index);
    console.log("   Grid[index]:", grid[index]);
    console.log("   Winner:", winner);
    console.log("   IsQuestionModalOpen:", isQuestionModalOpen);
    console.log("   MySymbol:", mySymbol);
    console.log("   ServerTurn:", serverTurn);

    // Etat simple: on laisse le serveur arbitrer (occupation/ordre de tour)
    if (grid[index] || winner) {
      console.log("❌ Click ignored: invalid state");
      return;
    }
    // Ouvrir la question: le joueur doit répondre correctement pour jouer
    const randomQuestion =
      quiz.questions[Math.floor(Math.random() * quiz.questions.length)];
    setCurrentQuestion(randomQuestion);
    setSelectedGridIndex(index);
    setSelectedOption(null);
    setHasAnswered(false);
    playBeep(520, 90, "square", 0.05);
    // Timer question basé sur le temps restant du tour serveur
    const elapsed = Math.floor((Date.now() - turnStart) / 1000);
    const remain = Math.max(0, serverTurnDuration - elapsed);
    setQuestionTimeRemaining(remain);
    setIsQuestionModalOpen(true);
  };

  const handleOptionSelect = (option: string) => {
    if (hasAnswered || !currentQuestion) return;

    setSelectedOption(option);
    const correct = option === currentQuestion.correctAnswer;
    setHasAnswered(true);
    setIsCorrectAnswer(correct);

    // Si bonne réponse -> on joue le coup
    if (correct && selectedGridIndex !== null) {
      try {
        socketRef.current?.emit("make_move", {
          gameCode: roomCode,
          userId: myUserId,
          index: selectedGridIndex,
        });
        console.log("📤 make_move emitted (correct answer)", { index: selectedGridIndex });
      } catch (e) {
        console.warn("Failed to emit make_move", e);
      }
      playBeep(900, 140, "sine", 0.07);
    }
    // Si mauvaise réponse -> passer immédiatement le tour côté serveur
    else {
      try {
        socketRef.current?.emit("answer_fail", { gameCode: roomCode, userId: myUserId });
        console.log("📤 answer_fail emitted");
      } catch { }
      playBeep(220, 160, "triangle", 0.07);
    }

    // Laisser le temps de lire le feedback
    setTimeout(() => {
      setIsQuestionModalOpen(false);
      setCurrentQuestion(null);
    }, 2000);
  };

  // Timer de la question: si le temps expire, considérer comme faux et fermer sans jouer
  useEffect(() => {
    if (!isQuestionModalOpen || hasAnswered) return;
    if (questionTimeRemaining <= 0) return;
    const timer = setInterval(() => {
      setQuestionTimeRemaining((prev) => {
        if (prev <= 1) {
          // Temps écoulé -> pas de coup joué, passer le tour
          setHasAnswered(true);
          setIsCorrectAnswer(false);
          try { socketRef.current?.emit("answer_fail", { gameCode: roomCode, userId: myUserId }); } catch { }
          playBeep(260, 160, "sawtooth", 0.06);
          setIsQuestionModalOpen(false);
          setCurrentQuestion(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isQuestionModalOpen, hasAnswered, questionTimeRemaining]);

  return (
    <div
      className="min-h-screen flex flex-col items-center p-4 relative overflow-hidden font-sans"
      style={{ backgroundColor: THEME.black }}
    >
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
                ? `${player.borderColor} scale-105 shadow-[0_0_40px_rgba(79,70,229,0.2)] bg-white/10`
                : "bg-white/5 border-white/5 opacity-70"
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full bg-black/30 ring-1 ring-white/10 ${player.color}`}>
                  {player.avatar}
                </div>
                <div>
                  <div className={`font-bold text-sm ${player.color}`}>
                    {player.name}
                  </div>
                  <div
                    className="flex items-center gap-2 mt-0.5 text-xs font-medium"
                    style={{ color: THEME.grayText }}
                  >
                    <span>Symbole:</span>
                    {player.symbol === "X" ? (
                      <X className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-red-400" />
                    )}
                  </div>
                </div>
                {currentPlayerIndex === index &&
                  !winner &&
                  !isQuestionModalOpen && (
                    <div className="ml-auto flex items-center gap-2">
                      <Clock className="w-4 h-4 text-white/50" />
                      <span className={`font-mono font-bold text-lg ${turnTimeRemaining <= 5 ? "text-red-400 animate-pulse" : "text-white"
                        }`}>
                        {turnTimeRemaining}s
                      </span>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors hover:text-white hover:scale-105 active:scale-95"
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
                {winner === "Draw"
                  ? "Match Nul !"
                  : `Victoire de ${winner.name} !`}
              </span>
            </motion.div>
          ) : (
            <div
              className="text-lg font-medium flex items-center gap-2"
              style={{ color: THEME.grayText }}
            >
              {isQuestionModalOpen ? (
                <span className="text-purple-400 animate-pulse">
                  Question en cours...
                </span>
              ) : mySymbol && mySymbol === serverTurn ? (
                <span className="font-bold text-green-400">C&apos;est votre tour</span>
              ) : (
                <>
                  C&apos;est au tour de{" "}
                  <span className={`font-bold ${currentPlayer.color}`}>
                    {currentPlayer.name}
                  </span>{" "}
                  de jouer
                </>
              )}
            </div>
          )}
        </div>

        <div
          className="grid grid-cols-3 gap-4 p-4 rounded-3xl backdrop-blur-sm border border-white/10 shadow-2xl bg-gradient-to-br from-slate-900/50 via-slate-800/40 to-slate-900/30"
          style={{ backgroundColor: THEME.gray2 }}
        >
          {grid.map((cell, index) => (
            <motion.button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={!!cell || !!winner || isQuestionModalOpen || !mySymbol || mySymbol !== serverTurn}
              whileHover={
                !cell && !winner && !isQuestionModalOpen
                  ? { scale: 1.05, boxShadow: "0 0 18px rgba(59,130,246,0.25)" }
                  : {}
              }
              whileTap={
                !cell && !winner && !isQuestionModalOpen ? { scale: 0.96 } : {}
              }
              className={`w-24 h-24 sm:w-32 sm:h-32 rounded-2xl flex items-center justify-center text-5xl font-bold transition-all relative overflow-hidden ${cell
                ? "bg-black/40 shadow-inner ring-1 ring-white/10"
                : "bg-white/5 hover:bg-white/10 border border-white/5 ring-1 ring-white/10"
                }`}
            >
              <AnimatePresence>
                {cell === "X" && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1, filter: "drop-shadow(0 0 12px rgba(59,130,246,0.6))" }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className="text-blue-400"
                  >
                    <X className="w-12 h-12 sm:w-16 sm:h-16 stroke-[2.5]" />
                  </motion.div>
                )}
                {cell === "O" && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, filter: "drop-shadow(0 0 12px rgba(248,113,113,0.6))" }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className="text-red-400"
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
        {
          isQuestionModalOpen && currentQuestion && (
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
                className="border border-white/10 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative overflow-hidden"
                style={{ backgroundColor: THEME.gray2 }}
              >
                {/* Background Glow */}
                {/* Background Glow removed */}

                {/* Timer Bar */}
                <div className="flex items-center justify-between mb-6">
                  <span
                    className="text-sm font-medium uppercase tracking-wider"
                    style={{ color: THEME.grayText }}
                  >
                    Question pour {currentPlayer.name}
                  </span>
                  <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-lg border border-white/5">
                    <Clock className="w-4 h-4 text-white/50" />
                    <span className={`font-mono font-bold text-xl ${questionTimeRemaining <= 5 ? "text-red-400 animate-pulse" : "text-white"
                      }`}>
                      {questionTimeRemaining}s
                    </span>
                  </div>
                </div>

                <h3
                  className="text-lg sm:text-xl font-serif font-medium mb-4 leading-relaxed"
                  style={{ color: THEME.white }}
                >
                  {currentQuestion.question}
                </h3>

                <div className="grid grid-cols-1 gap-3 mb-6">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOption === option;
                    const isCorrect = option === currentQuestion.correctAnswer;

                    let buttonStyle =
                      "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20";
                    let icon = null;

                    if (hasAnswered) {
                      if (isCorrect) {
                        buttonStyle =
                          "bg-green-500/10 border-green-500/50 text-green-400";
                        icon = (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        );
                      } else if (isSelected) {
                        buttonStyle =
                          "bg-red-500/10 border-red-500/50 text-red-400";
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
                        className={`p-3 rounded-xl border text-left transition-all font-medium flex items-center justify-between group ${buttonStyle} hover:scale-[1.01] active:scale-[0.99]`}
                        style={{
                          color:
                            hasAnswered && (isCorrect || isSelected)
                              ? undefined
                              : THEME.white,
                        }}
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
                      animate={{ opacity: 1, height: "auto" }}
                      className="border-t border-white/10 pt-6"
                    >
                      <div
                        className={`flex items-center gap-2 mb-3 font-bold ${isCorrectAnswer ? "text-green-400" : "text-red-400"
                          }`}
                      >
                        {isCorrectAnswer ? (
                          <>
                            <CheckCircle2 className="w-5 h-5" />
                            Bonne réponse ! Case validée.
                          </>
                        ) : (
                          <>
                            <HeartCrack className="w-5 h-5" />
                            Mauvaise réponse !
                          </>
                        )}
                      </div>
                      <div
                        className="bg-white/5 rounded-xl p-4 text-sm leading-relaxed border border-white/5"
                        style={{ color: THEME.grayText }}
                      >
                        <span
                          className="font-medium block mb-1"
                          style={{ color: THEME.white }}
                        >
                          Explication :
                        </span>
                        {currentQuestion.explanation}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )
        }
      </AnimatePresence>
    </div >
  );
}
