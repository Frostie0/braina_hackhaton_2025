'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { serverIp } from '@/lib/serverIp';
import ApplicationLogo from '@/components/ui/ApplicationLogo';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordClient() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email) {
            setError('L\'email est requis');
            return;
        } else if (!validateEmail(email)) {
            setError('Format d\'email invalide');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`${serverIp}/user/forgot-password`, {
                email: email.trim(),
            });

            if (response.status === 200) {
                setIsSubmitted(true);
            }
        } catch (error: any) {
            console.error('❌ Erreur forgot password:', error);
            if (error.response) {
                const status = error.response.status;
                if (status === 404) setError('Aucun compte associé à cet email');
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
                    <h1 className="text-3xl font-serif font-medium text-white mb-2">Mot de passe oublié ?</h1>
                    <p className="text-gray-400">Entrez votre email pour recevoir les instructions</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    {isSubmitted ? (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium text-white mb-2">Email envoyé !</h3>
                            <p className="text-gray-400 mb-6">
                                Si un compte existe avec l'adresse <strong>{email}</strong>, vous recevrez un lien de réinitialisation.
                            </p>
                            <Link href="/login" className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour à la connexion
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
                                <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                                    placeholder="nom@exemple.com"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 px-4 bg-white text-black font-medium rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
                            >
                                {isLoading ? 'Envoi en cours...' : 'Envoyer le lien'}
                            </button>

                            <div className="text-center mt-4">
                                <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center">
                                    <ArrowLeft className="w-3 h-3 mr-1" />
                                    Retour à la connexion
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
