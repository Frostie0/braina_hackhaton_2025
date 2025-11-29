'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/api/axios.config';
import { AuthLayout } from '../../../components/layout/AuthLayout';
import { FormInput } from '../../../components/ui/FormInput';
import { PasswordInput } from '../../../components/ui/PasswordInput';
import { SubmitButton } from '../../../components/ui/SubmitButton';
import { FormError } from '../../../components/ui/FormError';
import axios from 'axios';
import { serverIp } from '@/lib/serverIp';
import { saveUserData, saveAuthTokens } from '@/lib/storage/userStorage';

/**
 * Page de connexion (Client Component)
 * Utilise axios directement avec validation frontend
 */
export default function LoginClient() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

    // Fonction de validation de l'email
    const validateEmail = (email: string): boolean => {
        // Regex pour vérifier le format de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Fonction de validation du mot de passe
    const validatePassword = (password: string): boolean => {
        // Au minimum 6 caractères
        return password.length >= 6;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Réinitialiser les erreurs
        setErrors({});

        // Validation côté frontend
        const newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = 'L\'email est requis';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Format d\'email invalide';
        }

        if (!password) {
            newErrors.password = 'Le mot de passe est requis';
        } else if (!validatePassword(password)) {
            newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        }

        // Si des erreurs existent, ne pas envoyer la requête
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Envoyer la requête au backend via axios
        setIsLoading(true);
        try {
            const response = await axios.post(`${serverIp}/user/login`, {
                email: email.trim(),
                password: password,
            });

            // Succès - Sauvegarder les tokens et les données utilisateur
            console.log('✅ Connexion réussie:', response.data);

            if (response.status === 200) {
                const { user, access_token, refresh_token } = response.data;

                // Sauvegarder les tokens
                if (access_token && refresh_token) {
                    saveAuthTokens({ access_token, refresh_token });
                }

                // Sauvegarder les informations utilisateur
                if (user) {
                    saveUserData({
                        userId: user.userId,
                        name: user.name,
                        email: user.email,
                    });
                }

                // Naviguer vers le dashboard
                router.push('/dashboard');
            }

        } catch (error: any) {
            console.error('❌ Erreur de connexion:', error);

            // Gérer les erreurs du backend
            if (error.response) {
                // Le serveur a répondu avec un code d'erreur
                const status = error.response.status;
                const errorData = error.response.data;

                if (status === 401) {
                    setErrors({ general: 'Email ou mot de passe incorrect' });
                } else if (status === 422) {
                    // Erreurs de validation du backend
                    setErrors({
                        general: errorData.message || 'Données invalides',
                        email: errorData.errors?.email,
                        password: errorData.errors?.password,
                    });
                } else if (status === 500) {
                    setErrors({ general: 'Erreur serveur. Veuillez réessayer plus tard.' });
                } else if (status == 404) {
                    setErrors({ general: 'Utilisateur non trouvé' });
                } else {
                    setErrors({ general: errorData.message || 'Une erreur est survenue' });
                }
            } else if (error.request) {
                // La requête a été envoyée mais pas de réponse reçue
                setErrors({ general: 'Impossible de contacter le serveur. Vérifiez votre connexion.' });
            } else {
                // Autre erreur
                setErrors({ general: 'Une erreur est survenue. Veuillez réessayer.' });
            }
        } finally {
            setIsLoading(false);
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
                <FormError error={errors.general} />

                {/* Champ Email */}
                <FormInput
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemple@domaine.com"
                    label="Email"
                    error={errors.email}
                />

                {/* Champ Mot de passe */}
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
                <SubmitButton isLoading={isLoading} loadingText="Connexion...">
                    Se connecter
                </SubmitButton>
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
