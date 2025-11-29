'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '../../../components/layout/AuthLayout';
import { FormInput } from '../../../components/ui/FormInput';
import { PasswordInput } from '../../../components/ui/PasswordInput';
import { SubmitButton } from '../../../components/ui/SubmitButton';
import { FormError } from '../../../components/ui/FormError';
import { useAuthStore } from '../../../lib/store/authStore';

/**
 * Page de connexion (Client Component)
 */
export default function LoginClient() {
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
            router.push('/');
        } catch (error) {
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
