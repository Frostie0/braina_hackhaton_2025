'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Bell, Shield, Eye, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const router = useRouter();

    const settingsSections = [
        {
            title: 'Profil',
            icon: User,
            items: [
                { label: 'Nom d\'affichage', value: 'Modifier', action: () => { } },
                { label: 'Email', value: 'exemple@email.com', action: () => { } },
                { label: 'Photo de profil', value: 'Changer', action: () => { } },
            ]
        },
        {
            title: 'Notifications',
            icon: Bell,
            items: [
                { label: 'Notifications push', value: 'Activées', action: () => { } },
                { label: 'Notifications par email', value: 'Désactivées', action: () => { } },
                { label: 'Rappels d\'étude', value: 'Activés', action: () => { } },
            ]
        },
        {
            title: 'Confidentialité',
            icon: Shield,
            items: [
                { label: 'Profil public', value: 'Désactivé', action: () => { } },
                { label: 'Données de progression', value: 'Privées', action: () => { } },
                { label: 'Politique de confidentialité', value: 'Voir', action: () => router.push('/confidentialite') },
            ]
        },
        {
            title: 'Préférences d\'affichage',
            icon: Eye,
            items: [
                { label: 'Thème', value: 'Sombre', action: () => { } },
                { label: 'Taille de police', value: 'Moyenne', action: () => { } },
            ]
        },
        {
            title: 'Appareils connectés',
            icon: Smartphone,
            items: [
                { label: 'Cet appareil', value: 'MacBook Pro', action: () => { } },
                { label: 'Gérer les sessions', value: 'Voir tout', action: () => { } },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white p-4 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-serif font-medium">Paramètres</h1>
                        <p className="text-gray-400 text-sm mt-1">Gérez vos préférences et votre compte</p>
                    </div>
                </header>

                {/* Settings Sections */}
                <div className="space-y-6">
                    {settingsSections.map((section, sectionIndex) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: sectionIndex * 0.1 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-purple-500/10">
                                    <section.icon className="w-5 h-5 text-purple-400" />
                                </div>
                                <h2 className="text-lg font-serif font-medium text-white">{section.title}</h2>
                            </div>

                            <div className="space-y-3">
                                {section.items.map((item, itemIndex) => (
                                    <div
                                        key={itemIndex}
                                        className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 hover:bg-white/5 px-3 rounded-lg transition-colors cursor-pointer"
                                        onClick={item.action}
                                    >
                                        <span className="text-sm text-gray-300">{item.label}</span>
                                        <span className="text-sm text-purple-400 font-medium">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Danger Zone */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className="mt-8 bg-red-500/5 border border-red-500/20 rounded-2xl p-6"
                >
                    <h2 className="text-lg font-serif font-medium text-red-400 mb-4">Zone de danger</h2>
                    <div className="space-y-3">
                        <button className="w-full py-3 px-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium">
                            Supprimer mon compte
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
