"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Users, Copy, Check, PlayCircle, LogOut, Link2 } from "lucide-react";
import serverIp from "@/lib/serverIp";
import { io, Socket } from "socket.io-client";
import axios from "axios";

type SocketGamePlayer = {
  userId: string;
  userName: string;
  isConnected: boolean;
};

type SocketGameState = {
  players?: SocketGamePlayer[];
};

// Construit l'URL de base du serveur (sans le suffixe /api/v1)
function getServerBaseUrl(httpUrl: string) {
  try {
    const url = new URL(httpUrl);
    // Retire le chemin /api/... si présent
    const cleanedPath = url.pathname.replace(/\/?api\/.*/i, "");
    url.pathname = cleanedPath.endsWith("/") ? cleanedPath : `${cleanedPath}/`;
    return url.origin + url.pathname.replace(/\/$/, "");
  } catch {
    return httpUrl.replace(/\/?api\/.*/i, "").replace(/\/$/, "");
  }
}

export default function WaitingRoomClient() {
  const router = useRouter();
  const params = useSearchParams();

  const initialQuizId = params.get("id") || "";
  const room = params.get("room") || "";
  const maxPlayers = Number(params.get("maxPlayers") || 2);
  const questions = Number(params.get("questions") || 10);
  const isHost = params.get("isHost") === "true";

  const [copied, setCopied] = useState(false);
  const [quizId, setQuizId] = useState(initialQuizId);
  const quizIdRef = useRef(initialQuizId);
  const [players, setPlayers] = useState<Array<{ id: string; name: string }>>(
    []
  );
  const [status, setStatus] = useState<
    "connecting" | "connected" | "error" | "closed"
  >("connecting");

  const socketRef = useRef<Socket | null>(null);

  const socketBase = useMemo(() => getServerBaseUrl(serverIp || "http://localhost:8000/api/v1"), []);

  // Helpers identités persistantes (alignées avec l'écran de jeu)
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

  // Fetch quizId from game room if missing
  useEffect(() => {
    const fetchQuizId = async () => {
      if (!quizId && room) {
        try {
          const response = await axios.get(`${serverIp}/game/${room}`);
          const gameQuizId = response.data?.quizId;
          if (gameQuizId) {
            setQuizId(gameQuizId);
            quizIdRef.current = gameQuizId;
          }
        } catch (error) {
          console.error("Failed to fetch quizId from game room:", error);
        }
      }
    };
    fetchQuizId();
  }, [room, quizId]);

  // Update ref when quizId changes
  useEffect(() => {
    quizIdRef.current = quizId;
  }, [quizId]);

  useEffect(() => {
    if (!room) return;

    console.log("🔗 Socket base:", socketBase);
    const socket = io(socketBase, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      setStatus("connected");
      // Identité persistante
      const userId = getUserId();
      const userName = getUserName();
      console.log(`📤 Joining game - Room: ${room}, User: ${userId} (${userName}), IsHost: ${isHost}`);
      socket.emit("join_game", { gameCode: room, userId, userName, isHost });
      // Demander l'état courant (players, state) après un petit délai pour s'assurer que join_game est traité
      setTimeout(() => {
        console.log(`📤 Requesting state for room: ${room}`);
        socket.emit("request_state", { gameCode: room });
      }, 300);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connect_error:", err);
      setStatus("error");
    });
    socket.on("error", (err) => {
      console.error("Socket error:", err);
      setStatus("error");
    });
    socket.on("disconnect", (reason) => {
      console.warn("Socket disconnected:", reason);
      setStatus("closed");
    });

    socket.on(
      "player_joined",
      (payload: { players: Array<{ userId: string; userName: string }> }) => {
        console.log("📥 player_joined event received:", payload);
        const mapped = (payload?.players || []).map((p) => ({
          id: p.userId,
          name: p.userName,
        }));
        console.log("👥 Players updated:", mapped);
        setPlayers(mapped);
      }
    );

    socket.on("game_state", (game: SocketGameState & { gameState?: string }) => {
      console.log("📥 game_state event received:", game);
      const mapped = (game?.players || [])
        .filter((p) => p.isConnected)
        .map((p) => ({ id: p.userId, name: p.userName }));
      console.log("👥 Players from game_state (connected only):", mapped);
      setPlayers(mapped);
      // Fallback navigation: si l'état passe à 'playing', naviguer tous ensemble
      if (game?.gameState === "playing") {
        console.log("🎮 Game state changed to 'playing', navigating...");
        const currentQuizId = quizIdRef.current;
        if (currentQuizId) {
          const query = new URLSearchParams({
            questions: String(questions),
            shuffle: "true",
            roomCode: room,
            isHost: String(isHost),
          }).toString();
          router.push(`/play/multiplayer/${currentQuizId}?${query}`);
        }
      }
    });

    socket.on("game_started", () => {
      // Navigation pour TOUS les clients (hôte et invités) au même moment
      const currentQuizId = quizIdRef.current;
      if (!currentQuizId) {
        console.error("Cannot start game: quizId is missing");
        return;
      }
      const query = new URLSearchParams({
        questions: String(questions),
        shuffle: "true",
        roomCode: room,
        isHost: String(isHost),
      }).toString();
      router.push(`/play/multiplayer/${currentQuizId}?${query}`);
    });

    socket.on("disconnect", () => setStatus("closed"));
    socket.on("connect_error", () => setStatus("error"));

    return () => {
      // Déconnecter proprement pour éviter les fuites et la navigation fantôme
      if (socketRef.current) {
        console.log("🔌 Disconnecting socket on unmount");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketBase, room, isHost]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(room);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { }
  };

  const handleShareLink = async () => {
    const base = `${window.location.origin}/waintroom?room=${encodeURIComponent(
      room
    )}`;
    const withId = quizId ? `${base}&id=${encodeURIComponent(quizId)}` : base;
    const joinUrl = `${withId}&maxPlayers=${maxPlayers}&questions=${questions}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Rejoindre la salle", url: joinUrl });
      } catch { }
    } else {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleStart = () => {
    if (!quizId) {
      console.error("Cannot start game: quizId is missing");
      return;
    }
    const query = new URLSearchParams({
      questions: String(questions),
      shuffle: "true",
      roomCode: room,
      isHost: String(isHost),
    }).toString();
    router.push(`/play/multiplayer/${quizId}?${query}`);
  };

  const handleLeave = () => {
    try {
      const userId = "host-temp";
      socketRef.current?.emit("leave_game", { gameCode: room, userId });
    } catch { }
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0B0B10] to-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Salle d&apos;attente</h1>
              <p className="text-gray-400 mt-1">
                Partagez le code pour inviter des joueurs.
              </p>
              <p className="text-gray-400 mt-1">
                Statut:{" "}
                <span
                  className={
                    status === "connected"
                      ? "text-emerald-400"
                      : status === "error"
                        ? "text-red-400"
                        : "text-yellow-400"
                  }
                >
                  {status}
                </span>
              </p>
            </div>
            <button
              onClick={handleLeave}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-sm"
            >
              <LogOut className="w-4 h-4" /> Quitter
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/30 border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <h2 className="font-medium">Code Salle</h2>
                </div>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-sm"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}{" "}
                  Copier
                </button>
              </div>
              <div className="text-3xl font-semibold tracking-widest text-center py-4 select-all">
                {room}
              </div>
              {/* <button
                onClick={handleShareLink}
                className="w-full mt-3 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white text-black hover:bg-gray-200"
              >
                <Link2 className="w-4 h-4" /> Partager le lien d&apos;invitation
              </button> */}
              <div className="mt-3 text-sm text-gray-400 text-center">
                Max joueurs: {maxPlayers}
              </div>
            </div>

            <div className="bg-black/30 border border-white/10 rounded-xl p-5">
              <h2 className="font-medium mb-4">Joueurs connectés</h2>
              <div className="space-y-3">
                {players.length === 0 && (
                  <div className="text-gray-400 text-sm">
                    En attente de joueurs...
                  </div>
                )}
                {players.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500" />
                      <div>
                        <div className="font-medium">
                          {p.name || `Joueur ${p.id}`}
                        </div>
                        <div className="text-xs text-gray-400">Prêt</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">#{p.id}</div>
                  </div>
                ))}
              </div>

              {isHost && (
                <button
                  onClick={() => {
                    try {
                      const connected = !!socketRef.current?.connected;
                      console.log("▶️ Start button clicked", { connected, room, quizId: quizIdRef.current });
                      socketRef.current?.emit("start_game", { gameCode: room });
                      // Fallback: si aucun event 'game_started' ne vient dans 1200ms, on navigue quand même côté hôte
                      const currentQuizId = quizIdRef.current;
                      if (currentQuizId) {
                        setTimeout(() => {
                          // Si on est encore sur la waiting room, on force la navigation
                          const query = new URLSearchParams({
                            questions: String(questions),
                            shuffle: "true",
                            roomCode: room,
                            isHost: String(isHost),
                          }).toString();
                          router.push(`/play/multiplayer/${currentQuizId}?${query}`);
                        }, 1200);
                      }
                    } catch { }
                  }}
                  className={`w-full mt-6 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition bg-white text-black hover:bg-gray-200`}
                >
                  <PlayCircle className="w-5 h-5" /> Démarrer la partie
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
