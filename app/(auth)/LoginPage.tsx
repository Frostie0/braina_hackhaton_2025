'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AuthLayout } from '../../components/layout/AuthLayout'; // Utiliser le layout créé

/**
 * Composant de la page de connexion (Login).
 */
export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password, rememberMe, action: 'Login' });
    // Ici irait la logique d'authentification réelle (Firebase, API, etc.)
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-white text-3xl font-semibold tracking-tight mb-2">
          Connexion
        </h1>
        <p className="text-gray-400 text-sm text-center">
          Entrez votre email et votre mot de passe pour vous connecter
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Champ Email */}
        <div>
          <label htmlFor="email" className="block text-gray-200 text-sm font-medium mb-2">
            Email
          </label>
          <motion.input
            id="email"
            type="email"
            placeholder="exemple@domaine.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 rounded-xl bg-gray-900/60 border border-gray-700 px-4 text-white placeholder-gray-500 outline-none transition duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
            required
            whileFocus={{ scale: 1.01 }}
          />
        </div>

        {/* Champ Mot de passe */}
        <div>
          <label htmlFor="password" className="block text-gray-200 text-sm font-medium mb-2">
            Mot de passe
          </label>
          <motion.input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-11 rounded-xl bg-gray-900/60 border border-gray-700 px-4 text-white placeholder-gray-500 outline-none transition duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
            required
            whileFocus={{ scale: 1.01 }}
          />
        </div>

        {/* Options (Souvenir et Mot de passe oublié) */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-gray-400 text-sm select-none cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              // Remplacement de l'émeraude par le pourpre pour la cohérence
              className="h-4 w-4 accent-purple-500 bg-gray-700 border-gray-600 rounded"
            />
            Se souvenir de moi
          </label>
          <a href="/auth/forgot-password" className="text-purple-400 text-sm hover:text-purple-300 transition duration-200">
            Mot de passe oublié ?
          </a>
        </div>

        {/* Bouton de soumission */}
        <motion.button
          type="submit"
          className="w-full h-11 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-semibold shadow-lg shadow-purple-500/30 transition duration-200"
          whileHover={{ scale: 1.02, boxShadow: '0 8px 15px rgba(168, 85, 247, 0.4)' }}
          whileTap={{ scale: 0.98 }}
        >
          Se connecter
        </motion.button>
      </form>

      {/* Lien Inscription */}
      <div className="mt-6 text-center text-sm text-gray-400">
        Pas de compte ?{' '}
        <a href="/auth/register" className="text-purple-400 hover:text-purple-300 transition duration-200">
          Créer un compte
        </a>
      </div>
    </AuthLayout>
  );
}