"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import serverIp from "@/lib/serverIp";
import { saveUserData, saveAuthTokens } from "@/lib/storage/userStorage";
import ApplicationLogo from "@/components/ui/ApplicationLogo";
import { useAuth } from "@/lib/context/AuthContext";

export default function LoginClient() {
  const router = useRouter();
  const { refreshFromStorage } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: { email?: string; password?: string } = {};

    if (!email) newErrors.email = "L'email est requis";
    else if (!validateEmail(email)) newErrors.email = "Format d'email invalide";

    if (!password) newErrors.password = "Le mot de passe est requis";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${serverIp}/user/login`, {
        email: email.trim(),
        password: password,
      });

      if (response.status === 200) {
        const { user, access_token, refresh_token } = response.data;
        if (access_token && refresh_token)
          saveAuthTokens({ access_token, refresh_token });
        if (user)
          saveUserData({
            userId: user.userId,
            name: user.name,
            email: user.email,
          });
        // Met à jour le AuthContext depuis localStorage avant de rediriger
        refreshFromStorage();
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("❌ Erreur de connexion:", error);
      if (error.response) {
        const status = error.response.status;
        if (status === 401)
          setErrors({ general: "Email ou mot de passe incorrect" });
        else if (status === 404)
          setErrors({ general: "Utilisateur non trouvé" });
        else setErrors({ general: "Une erreur est survenue" });
      } else {
        setErrors({ general: "Impossible de contacter le serveur" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center mb-8 hover:opacity-80 transition-opacity"
          >
            <ApplicationLogo size={40} />
          </Link>
          <h1 className="text-3xl font-serif font-medium text-white mb-2">
            Bon retour
          </h1>
          <p className="text-gray-400">Heureux de vous revoir parmi nous</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.general && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {errors.general}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300 ml-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                placeholder="nom@exemple.com"
              />
              {errors.email && (
                <p className="text-xs text-red-400 ml-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300 ml-1">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 ml-1">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-gray-300 transition-colors">
                <input
                  type="checkbox"
                  className="rounded border-gray-700 bg-gray-800 text-purple-500 focus:ring-purple-500/20"
                />
                Se souvenir de moi
              </label>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Mot de passe oublié ?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-white text-black font-medium rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-gray-500 text-sm">
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            className="text-white hover:underline underline-offset-4"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
