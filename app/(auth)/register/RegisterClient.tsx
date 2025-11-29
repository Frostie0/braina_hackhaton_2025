'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '../../../components/layout/AuthLayout';
import { FormInput } from '../../../components/ui/FormInput';
import { PasswordInput } from '../../../components/ui/PasswordInput';
import { SubmitButton } from '../../../components/ui/SubmitButton';
import { FormError } from '../../../components/ui/FormError';
import axios from 'axios';
import { serverIp } from '@/lib/serverIp';
import { saveUserData, saveAuthTokens } from '@/lib/storage/userStorage';

/**
 * Page d'inscription (Client Component)
 * Utilise axios directement avec validation frontend
 */
export default function RegisterClient() {
    const router = useRouter();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
        general?: string;
    }>({});

    // Fonction de validation de l'email
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Fonction de validation du nom
    const validateName = (name: string): boolean => {
        return name.trim().length >= 3;
    };

    // Fonction de validation du mot de passe
    const validatePassword = (password: string): boolean => {
        // Au moins 6 caractères
        return password.length >= 6;
    };

    // Fonction de validation de confirmation de mot de passe
    const validateConfirmPassword = (password: string, confirmPassword: string): boolean => {
        return password === confirmPassword;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Réinitialiser les erreurs
        setErrors({});

        // Validation côté frontend
        const newErrors: {
            name?: string;
            email?: string;
            password?: string;
            confirmPassword?: string;
        } = {};

        // Validation du nom complet
        if (!fullName) {
            newErrors.name = 'Le nom complet est requis';
        } else if (!validateName(fullName)) {
            newErrors.name = 'Le nom doit contenir au moins 3 caractères';
        }

        // Validation de l'email
        if (!email) {
            newErrors.email = 'L\'email est requis';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Format d\'email invalide';
        }

        // Validation du mot de passe
        if (!password) {
            newErrors.password = 'Le mot de passe est requis';
        } else if (!validatePassword(password)) {
            newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        }

        // Validation de la confirmation du mot de passe
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
        } else if (!validateConfirmPassword(password, confirmPassword)) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }

        // Si des erreurs existent, ne pas envoyer la requête
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Envoyer la requête au backend via axios
        setIsLoading(true);
        try {
            const response = await axios.post(`${serverIp}/user/register`, {
                name: fullName.trim(),
                email: email.trim(),
                password: password,
                password_confirmation: confirmPassword,
            });

            // Succès - Sauvegarder les tokens et les données utilisateur
            console.log('✅ Inscription réussie:', response.data);

            if (response.status === 200 || response.status === 201) {
                const { newUser, access_token, refresh_token } = response.data;

                // Sauvegarder les tokens
                if (access_token && refresh_token) {
                    saveAuthTokens({ access_token, refresh_token });
                }

                // Sauvegarder les informations utilisateur
                if (newUser) {
                    saveUserData({
                        userId: newUser.userId,
                        name: newUser.name,
                        email: newUser.email,
                    });
                }

                // Naviguer vers le dashboard
                router.push('/dashboard');
            }

        } catch (error: any) {
            console.error('❌ Erreur d\'inscription:', error);

            // Gérer les erreurs du backend
            if (error.response) {
                // Le serveur a répondu avec un code d'erreur
                const status = error.response.status;
                const errorData = error.response.data;

                if (status === 409) {
                    setErrors({ general: 'Cet email est déjà utilisé' });
                } else if (status === 422) {
                    // Erreurs de validation du backend
                    setErrors({
                        general: errorData.message || 'Données invalides',
                        name: errorData.errors?.name,
                        email: errorData.errors?.email,
                        password: errorData.errors?.password,
                    });
                } else if (status === 500) {
                    setErrors({ general: 'Erreur serveur. Veuillez réessayer plus tard.' });
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
                    Créer un compte
                </h1>
                <p className="text-gray-400 text-sm text-center">
                    Rejoignez la communauté BRAINA pour commencer à apprendre
                </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Message d'erreur général */}
                <FormError error={errors.general} />

                {/* Champ Nom Complet */}
                <FormInput
                    id="full-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Christan Denison Victor"
                    label="Nom Complet"
                    error={errors.name}
                />

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
                <SubmitButton isLoading={isLoading} loadingText="Inscription..." className="mt-6">
                    S'inscrire
                </SubmitButton>
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
