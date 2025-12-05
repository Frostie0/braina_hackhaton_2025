'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import serverIp from '@/lib/serverIp';
import ApplicationLogo from '@/components/ui/ApplicationLogo';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function ResetPasswordClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Récupérer le token depuis l'URL
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Rediriger si pas de token (optionnel, ou afficher une erreur)
    useEffect(() => {
        if (!token) {
            setError('Lien de réinitialisation invalide ou manquant.');
        }
    }, [token]);

    const validatePassword = (password: string): boolean => {
        return password.length >= 6;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!token) {
            setError('Token manquant. Veuillez utiliser le lien reçu par email.');
            return;
        }

        if (!password) {
            setError('Le mot de passe est requis');
            return;
        } else if (!validatePassword(password)) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`${serverIp}/user/reset-password`, {
                token,
                password,
                password_confirmation: confirmPassword
            });

            if (response.status === 200) {
                setIsSuccess(true);
                // Redirection automatique après quelques secondes
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            }
        } catch (error: any) {
            console.error('❌ Erreur reset password:', error);
            if (error.response) {
                const status = error.response.status;
                if (status === 400) setError('Le lien de réinitialisation est invalide ou a expiré.');
                else setError('Une erreur est survenue. Veuillez réessayer.');
            } else {
                setError('Impossible de contacter le serveur');
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
                    <h1 className="text-3xl font-serif font-medium text-white mb-2">Nouveau mot de passe</h1>
                    <p className="text-gray-400">Choisissez un mot de passe sécurisé</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    {isSuccess ? (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="text-xl font-medium text-white mb-2">Mot de passe modifié !</h3>
                            <p className="text-gray-400 mb-6">
                                Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion.
                            </p>
                            <Link href="/login" className="w-full py-3 px-4 bg-white text-black font-medium rounded-xl hover:bg-gray-200 transition-all inline-block">
                                Se connecter maintenant
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-300 ml-1">Nouveau mot de passe</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                                    placeholder="••••••••"
                                />
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
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !token}
                                className="w-full py-3 px-4 bg-white text-black font-medium rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
                            >
                                {isLoading ? 'Modification en cours...' : 'Modifier le mot de passe'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
