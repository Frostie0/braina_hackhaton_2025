'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { serverIp } from '@/lib/serverIp';
import { saveUserData, saveAuthTokens } from '@/lib/storage/userStorage';
import ApplicationLogo from '@/components/ui/ApplicationLogo';

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

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateName = (name: string): boolean => {
        return name.trim().length >= 3;
    };

    const validatePassword = (password: string): boolean => {
        return password.length >= 6;
    };

    const validateConfirmPassword = (password: string, confirmPassword: string): boolean => {
        return password === confirmPassword;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const newErrors: {
            name?: string;
            email?: string;
            password?: string;
            confirmPassword?: string;
        } = {};

        if (!fullName) newErrors.name = 'Le nom complet est requis';
        else if (!validateName(fullName)) newErrors.name = 'Le nom doit contenir au moins 3 caractères';

        if (!email) newErrors.email = 'L\'email est requis';
        else if (!validateEmail(email)) newErrors.email = 'Format d\'email invalide';

        if (!password) newErrors.password = 'Le mot de passe est requis';
        else if (!validatePassword(password)) newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';

        if (!confirmPassword) newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
        else if (!validateConfirmPassword(password, confirmPassword)) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`${serverIp}/user/register`, {
                name: fullName.trim(),
                email: email.trim(),
                password: password,
                password_confirmation: confirmPassword,
            });

            if (response.status === 200 || response.status === 201) {
                const { newUser, access_token, refresh_token } = response.data;
                if (access_token && refresh_token) saveAuthTokens({ access_token, refresh_token });
                if (newUser) saveUserData({ userId: newUser.userId, name: newUser.name, email: newUser.email });
                router.push('/dashboard');
            }

        } catch (error: any) {
            console.error('❌ Erreur d\'inscription:', error);
            if (error.response) {
                const status = error.response.status;
                const errorData = error.response.data;
                if (status === 409) setErrors({ general: 'Cet email est déjà utilisé' });
                else if (status === 422) {
                    setErrors({
                        general: errorData.message || 'Données invalides',
                        name: errorData.errors?.name,
                        email: errorData.errors?.email,
                        password: errorData.errors?.password,
                    });
                } else setErrors({ general: 'Une erreur est survenue' });
            } else {
                setErrors({ general: 'Impossible de contacter le serveur' });
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
                    <Link href="/" className="inline-flex items-center justify-center mb-8 hover:opacity-80 transition-opacity">
                        <ApplicationLogo size={40} />
                    </Link>
                    <h1 className="text-3xl font-serif font-medium text-white mb-2">Créer un compte</h1>
                    <p className="text-gray-400">Rejoignez Braina pour commencer à apprendre</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {errors.general && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                {errors.general}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-300 ml-1">Nom complet</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                                placeholder="Jean Dupont"
                            />
                            {errors.name && <p className="text-xs text-red-400 ml-1">{errors.name}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                                placeholder="nom@exemple.com"
                            />
                            {errors.email && <p className="text-xs text-red-400 ml-1">{errors.email}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-300 ml-1">Mot de passe</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="text-xs text-red-400 ml-1">{errors.password}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-300 ml-1">Confirmer le mot de passe</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                                placeholder="••••••••"
                            />
                            {errors.confirmPassword && <p className="text-xs text-red-400 ml-1">{errors.confirmPassword}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 bg-white text-black font-medium rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4"
                        >
                            {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-center text-gray-500 text-sm">
                    Déjà un compte ?{' '}
                    <Link href="/login" className="text-white hover:underline underline-offset-4">
                        Connectez-vous
                    </Link>
                </p>
            </div>
        </div>
    );
}
