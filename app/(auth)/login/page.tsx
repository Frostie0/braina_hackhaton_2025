'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '../../../components/layout/AuthLayout';
import { PasswordInput } from '../../../components/ui/PasswordInput';
import { useAuthStore } from '../../../lib/store/authStore';

/**
 * Page de connexion accessible via /login
 */
export default function LoginPage() {
    const router = useRouter();
    const { login, isLoading, errors, clearErrors } = useAuthStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();

        try {
            await login({ email, password });
            // Redirection vers le dashboard après connexion réussie
            router.push('/');
        } catch (error) {
            // Les erreurs sont gérées par le store
            console.error('Login error:', error);
        }
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
                        className={`w-full h-11 rounded-xl bg-gray-900/60 border px-4 text-white placeholder-gray-500 outline-none transition duration-300 ${errors.email
                                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30'
                                : 'border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30'
                            }`}
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

                {/* Champ Mot de passe avec PasswordInput */}
                <PasswordInput
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    label="Mot de passe"
                    error={errors.password}
                />

                {/* Options (Souvenir et Mot de passe oublié) */}
                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-gray-400 text-sm select-none cursor-pointer">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-4 w-4 accent-purple-500 bg-gray-700 border-gray-600 rounded"
                        />
                        Se souvenir de moi
                    </label>
                    <a href="/forgot-password" className="text-purple-400 text-sm hover:text-purple-300 transition duration-200">
                        Mot de passe oublié ?
                    </a>
                </div>

                {/* Bouton de soumission */}
                <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-semibold shadow-lg shadow-purple-500/30 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={!isLoading ? { scale: 1.02, boxShadow: '0 8px 15px rgba(168, 85, 247, 0.4)' } : {}}
                    whileTap={!isLoading ? { scale: 0.98 } : {}}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Connexion...
                        </span>
                    ) : (
                        'Se connecter'
                    )}
                </motion.button>
            </form>

            {/* Lien Inscription */}
            <div className="mt-6 text-center text-sm text-gray-400">
                Pas de compte ?{' '}
                <a href="/register" className="text-purple-400 hover:text-purple-300 transition duration-200">
                    Créer un compte
                </a>
            </div>
        </AuthLayout>
    );
}
