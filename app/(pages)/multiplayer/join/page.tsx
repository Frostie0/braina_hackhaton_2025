"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { KeyRound, Link2, Users, ArrowRight } from "lucide-react";

export default function JoinMultiplayerPage() {
  const router = useRouter();

  const [room, setRoom] = useState("");
  const [quizId, setQuizId] = useState("");
  const [paste, setPaste] = useState("");

  const isValid = useMemo(() => room.trim().length >= 4, [room]);

  const handleParse = () => {
    // Permet de coller directement un lien d'invitation et d'en extraire room et id
    try {
      const raw = paste.trim();
      if (!raw) return;
      const url = raw.startsWith("http") ? new URL(raw) : new URL(`https://x.y${raw.startsWith("/") ? raw : "/" + raw}`);
      const search = url.searchParams;
      const maybeRoom = search.get("room") || "";
      const maybeId = search.get("id") || "";
      if (maybeRoom) setRoom(maybeRoom.toUpperCase());
      if (maybeId) setQuizId(maybeId);
    } catch {}
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    const qp = new URLSearchParams({ room: room.toUpperCase(), isHost: "false" });
    if (quizId.trim()) qp.set("id", quizId.trim());
    router.push(`/waintroom?${qp.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0B0B10] to-black text-white">
      <div className="max-w-lg mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur"
        >
          <h1 className="text-2xl font-semibold">Rejoindre une partie</h1>
          <p className="text-gray-400 mt-1">Entrez le code de la salle fourni par l'hôte, ou collez directement le lien d'invitation.</p>

          <form onSubmit={handleJoin} className="mt-6 space-y-5">

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Code de la salle</label>
              <div className="flex items-center gap-2 bg-black/30 border border-white/10 rounded-xl px-3 py-2.5">
                <KeyRound className="w-4 h-4 text-gray-400" />
                <input
                  value={room}
                  onChange={(e) => setRoom(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  className="bg-transparent outline-none flex-1 text-lg tracking-widest placeholder:text-gray-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Le code contient généralement 6 caractères (lettres/chiffres).</p>
            </div>

            <button
              type="submit"
              disabled={!isValid}
              className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium ${
                isValid ? "bg-white text-black hover:bg-gray-200" : "bg-white/20 text-white/50 cursor-not-allowed"
              }`}
            >
              Rejoindre <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
