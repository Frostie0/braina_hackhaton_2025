'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '../../../components/layout/AuthLayout';
import { PasswordInput } from '../../../components/ui/PasswordInput';
import { useAuthStore } from '../../../lib/store/authStore';

/**
 * Page d'inscription accessible via /register
 */
export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, errors, clearErrors } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    try {
      await register({
        name: fullName,
        email,
        password,
        password_confirmation: confirmPassword,
      });
      // Redirection vers le dashboard après inscription réussie
      router.push('/');
    } catch (error) {
      // Les erreurs sont gérées par le store
      console.error('Register error:', error);
    }
  };

  const inputClasses = (hasError: boolean) => `w-full h-11 rounded-xl bg-gray-900/60 border px-4 text-white placeholder-gray-500 outline-none transition duration-300 ${hasError
      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30'
      : 'border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30'
    }`;

  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-white text-3xl font-semibold tracking-tight mb-2">
          Créer un compte
        </h1>
        <p className="text-gray-400 text-sm text-center">
          Rejoignez la communauté BRAINA pour commencer à apprendre
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Message d'erreur général */}
        {errors.general && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
          >
            {errors.general}
          </motion.div>
        )}

        {/* Champ Nom Complet */}
        <div>
          <label htmlFor="full-name" className="block text-gray-200 text-sm font-medium mb-2">
            Nom Complet
            <span className="text-red-500 ml-1">*</span>
          </label>
          <motion.input
            id="full-name"
            type="text"
            placeholder="Christan Denison Victor"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputClasses(!!errors.name)}
            required
            whileFocus={{ scale: 1.01 }}
          />
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-400"
            >
              ⚠ {errors.name}
            </motion.p>
          )}
        </div>

        {/* Champ Email */}
        <div>
          <label htmlFor="email" className="block text-gray-200 text-sm font-medium mb-2">
            Email
            <span className="text-red-500 ml-1">*</span>
          </label>
          <motion.input
            id="email"
            type="email"
            placeholder="exemple@domaine.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClasses(!!errors.email)}
            required
            whileFocus={{ scale: 1.01 }}
          />
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-400"
            >
              ⚠ {errors.email}
            </motion.p>
          )}
        </div>

        {/* Champ Mot de passe */}
        <PasswordInput
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Mot de passe"
          error={errors.password}
        />

        {/* Aide mot de passe */}
        <p className="text-xs text-gray-500 -mt-2">
          Au moins 8 caractères, 1 majuscule, 1 minuscule et 1 chiffre
        </p>

        {/* Champ Confirmer Mot de passe */}
        <PasswordInput
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          label="Confirmer le mot de passe"
          error={errors.confirmPassword}
        />

        {/* Bouton de soumission */}
        <motion.button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-semibold shadow-lg shadow-purple-500/30 transition duration-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={!isLoading ? { scale: 1.02, boxShadow: '0 8px 15px rgba(168, 85, 247, 0.4)' } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Inscription...
            </span>
          ) : (
            "S'inscrire"
          )}
        </motion.button>
      </form>

      {/* Lien Connexion */}
      <div className="mt-6 text-center text-sm text-gray-400">
        Déjà un compte ?{' '}
        <a href="/login" className="text-purple-400 hover:text-purple-300 transition duration-200">
          Connectez-vous
        </a>
      </div>
    </AuthLayout>
  );
}