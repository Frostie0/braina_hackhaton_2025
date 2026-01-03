'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Lock, Database, Users, Eye, FileText, Mail, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ConfidentialitePage() {
    const router = useRouter();

    const sections = [
        {
            id: 'introduction',
            icon: Shield,
            title: 'Introduction',
            content: (
                <div className="space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                        Braina s'engage à protéger votre vie privée et vos données personnelles. Cette politique de confidentialité explique quelles données nous collectons, comment nous les utilisons et quels sont vos droits.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                        En utilisant Braina, vous acceptez les pratiques décrites dans cette politique. Dernière mise à jour : Janvier 2026.
                    </p>
                </div>
            )
        },
        {
            id: 'donnees-collectees',
            icon: Database,
            title: 'Données collectées',
            content: (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-purple-400 font-medium mb-3">Données de compte</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-300">
                            <li>Nom d'affichage</li>
                            <li>Adresse e-mail</li>
                            <li>Photo de profil (si fournie)</li>
                            <li>Date de création du compte</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-purple-400 font-medium mb-3">Données d'apprentissage</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-300">
                            <li>Quiz créés et complétés</li>
                            <li>Résultats et scores obtenus</li>
                            <li>Réponses aux questions</li>
                            <li>Temps passé sur chaque question</li>
                            <li>Progression et statistiques (XP, niveau, ligue)</li>
                            <li>Historique des sessions d'étude</li>
                            <li>Séries consécutives (streaks)</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-purple-400 font-medium mb-3">Données de préférences</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-300">
                            <li>Préférences linguistiques</li>
                            <li>Thème d'affichage (clair/sombre)</li>
                            <li>Préférences de notifications</li>
                            <li>Paramètres de confidentialité</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-purple-400 font-medium mb-3">Données techniques</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-300">
                            <li>Adresse IP (pour les sessions multijoueur)</li>
                            <li>Informations sur l'appareil utilisé</li>
                            <li>Dates et heures de connexion</li>
                            <li>Identifiants de session Socket.IO</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-purple-400 font-medium mb-3">Contenu généré</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-300">
                            <li>Images téléchargées pour la génération de quiz</li>
                            <li>Texte extrait des images via Google Gemini AI</li>
                            <li>Quiz personnalisés créés</li>
                        </ul>
                    </div>
                </div>
            )
        },
        {
            id: 'utilisation',
            icon: Eye,
            title: 'Utilisation des données',
            content: (
                <div className="space-y-4">
                    <p className="text-gray-300 leading-relaxed">Nous utilisons vos données pour :</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                        <li>Fournir et améliorer nos services éducatifs</li>
                        <li>Personnaliser votre expérience d'apprentissage</li>
                        <li>Générer des quiz et flashcards adaptés à vos besoins</li>
                        <li>Suivre votre progression et afficher des statistiques</li>
                        <li>Permettre les fonctionnalités multijoueur en temps réel</li>
                        <li>Envoyer des notifications si vous les avez activées</li>
                        <li>Authentifier votre compte et sécuriser votre accès</li>
                        <li>Analyser l'utilisation de la plateforme pour l'améliorer</li>
                    </ul>
                </div>
            )
        },
        {
            id: 'services-tiers',
            icon: Users,
            title: 'Services tiers',
            content: (
                <div className="space-y-4">
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                        <h3 className="text-purple-400 font-medium mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Google Gemini AI
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Nous utilisons l'API Google Gemini AI pour extraire du texte à partir des images que vous téléchargez afin de générer des quiz. Les images sont traitées par Google selon leur propre politique de confidentialité.
                        </p>
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                        <h3 className="text-purple-400 font-medium mb-2">Socket.IO</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Pour les fonctionnalités multijoueur en temps réel, nous utilisons Socket.IO qui établit des connexions WebSocket. Votre adresse IP peut être visible pendant les sessions multijoueur.
                        </p>
                    </div>

                    <p className="text-gray-300 text-sm">
                        Nous ne vendons jamais vos données personnelles à des tiers.
                    </p>
                </div>
            )
        },
        {
            id: 'stockage',
            icon: Lock,
            title: 'Stockage et sécurité',
            content: (
                <div className="space-y-4">
                    <div>
                        <h3 className="text-purple-400 font-medium mb-3">Méthodes de stockage</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-300">
                            <li><strong>Stockage local (localStorage) :</strong> Tokens d'authentification, préférences de base</li>
                            <li><strong>Serveur backend :</strong> Données de compte, quiz, résultats, statistiques</li>
                            <li><strong>Sessions en temps réel :</strong> Connexions Socket.IO temporaires pour le multijoueur</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-purple-400 font-medium mb-3">Mesures de sécurité</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-300">
                            <li>Authentification par token JWT (access et refresh tokens)</li>
                            <li>Connexions HTTPS sécurisées</li>
                            <li>Rafraîchissement automatique des tokens expirés</li>
                            <li>Stockage sécurisé des mots de passe (hashage côté serveur)</li>
                        </ul>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                        <p className="text-yellow-200 text-sm leading-relaxed">
                            <strong>Note importante :</strong> Les tokens d'authentification sont stockés dans le localStorage de votre navigateur. Nous vous recommandons de ne pas utiliser d'appareils publics ou partagés pour accéder à votre compte.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'vos-droits',
            icon: FileText,
            title: 'Vos droits (RGPD)',
            content: (
                <div className="space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                        Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
                    </p>
                    <ul className="space-y-3">
                        <li className="flex gap-3">
                            <span className="text-purple-400 font-bold">•</span>
                            <div>
                                <strong className="text-white">Droit d'accès :</strong>
                                <span className="text-gray-300"> Obtenir une copie de vos données personnelles</span>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-purple-400 font-bold">•</span>
                            <div>
                                <strong className="text-white">Droit de rectification :</strong>
                                <span className="text-gray-300"> Corriger des données inexactes ou incomplètes</span>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-purple-400 font-bold">•</span>
                            <div>
                                <strong className="text-white">Droit à l'effacement :</strong>
                                <span className="text-gray-300"> Supprimer vos données (« droit à l'oubli »)</span>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-purple-400 font-bold">•</span>
                            <div>
                                <strong className="text-white">Droit à la portabilité :</strong>
                                <span className="text-gray-300"> Recevoir vos données dans un format structuré</span>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-purple-400 font-bold">•</span>
                            <div>
                                <strong className="text-white">Droit d'opposition :</strong>
                                <span className="text-gray-300"> Vous opposer au traitement de vos données</span>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-purple-400 font-bold">•</span>
                            <div>
                                <strong className="text-white">Droit de limitation :</strong>
                                <span className="text-gray-300"> Limiter le traitement dans certaines circonstances</span>
                            </div>
                        </li>
                    </ul>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 mt-6">
                        <p className="text-gray-300 text-sm">
                            Pour exercer ces droits, vous pouvez supprimer votre compte directement depuis les paramètres ou nous contacter à l'adresse ci-dessous.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'cookies',
            icon: Database,
            title: 'Cookies et technologies similaires',
            content: (
                <div className="space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                        Braina utilise le localStorage du navigateur pour stocker :
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                        <li>Vos tokens d'authentification (access_token, refresh_token)</li>
                        <li>Vos informations de profil de base (ID, nom, email)</li>
                        <li>Vos préférences d'interface</li>
                    </ul>
                    <p className="text-gray-300 leading-relaxed mt-4">
                        Ces données locales sont essentielles au fonctionnement de l'application et ne sont pas partagées avec des tiers. Elles restent sur votre appareil jusqu'à ce que vous vous déconnectiez ou supprimiez les données de votre navigateur.
                    </p>
                </div>
            )
        },
        {
            id: 'retention',
            icon: AlertTriangle,
            title: 'Conservation des données',
            content: (
                <div className="space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                        Nous conservons vos données aussi longtemps que votre compte est actif ou nécessaire pour vous fournir nos services.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                        <li><strong>Compte actif :</strong> Toutes les données sont conservées</li>
                        <li><strong>Suppression de compte :</strong> Vos données personnelles sont supprimées dans les 30 jours</li>
                        <li><strong>Données anonymisées :</strong> Les statistiques peuvent être conservées sous forme anonyme à des fins d'amélioration du service</li>
                    </ul>
                </div>
            )
        },
        {
            id: 'mineurs',
            icon: Shield,
            title: 'Protection des mineurs',
            content: (
                <div className="space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                        Braina est conçu comme un outil éducatif pouvant être utilisé par des étudiants de tous âges. Si vous avez moins de 16 ans, nous vous encourageons à utiliser la plateforme avec le consentement et sous la supervision de vos parents ou tuteurs légaux.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                        Si vous êtes parent ou tuteur et que vous découvrez que votre enfant nous a fourni des données personnelles sans votre consentement, veuillez nous contacter.
                    </p>
                </div>
            )
        },
        {
            id: 'modifications',
            icon: FileText,
            title: 'Modifications de la politique',
            content: (
                <div className="space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                        Nous pouvons mettre à jour cette politique de confidentialité périodiquement. Nous vous informerons de tout changement significatif par e-mail ou via une notification sur la plateforme.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                        La date de dernière mise à jour est indiquée en haut de cette page. Nous vous encourageons à consulter régulièrement cette politique.
                    </p>
                </div>
            )
        },
        {
            id: 'contact',
            icon: Mail,
            title: 'Nous contacter',
            content: (
                <div className="space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                        Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, vous pouvez nous contacter :
                    </p>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-3">
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-purple-400" />
                            <div>
                                <p className="text-sm text-gray-400">Email</p>
                                <p className="text-white font-medium">braina.ai.technologies@gmail.com</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-purple-400" />
                            <div>
                                <p className="text-sm text-gray-400">Délégué à la protection des données</p>
                                <p className="text-white font-medium">braina.ai.technologies@gmail.com</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        Nous nous engageons à répondre à vos demandes dans un délai de 30 jours maximum.
                    </p>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white p-4 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="mb-12">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white mb-6 inline-flex items-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Retour</span>
                    </button>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                <Shield className="w-8 h-8 text-purple-400" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-serif font-medium">Politique de confidentialité</h1>
                                <p className="text-gray-400 mt-2">Dernière mise à jour : Janvier 2026</p>
                            </div>
                        </div>
                    </motion.div>
                </header>

                {/* Table of Contents */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8"
                >
                    <h2 className="text-xl font-serif font-medium mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-purple-400" />
                        Sommaire
                    </h2>
                    <nav className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {sections.map((section) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className="text-sm text-gray-400 hover:text-purple-400 transition-colors py-2 px-3 rounded-lg hover:bg-white/5"
                            >
                                {section.title}
                            </a>
                        ))}
                    </nav>
                </motion.div>

                {/* Sections */}
                <div className="space-y-6">
                    {sections.map((section, index) => (
                        <motion.section
                            key={section.id}
                            id={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-8 scroll-mt-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-purple-500/10">
                                    <section.icon className="w-6 h-6 text-purple-400" />
                                </div>
                                <h2 className="text-2xl font-serif font-medium">{section.title}</h2>
                            </div>
                            <div className="prose prose-invert max-w-none">
                                {section.content}
                            </div>
                        </motion.section>
                    ))}
                </div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="mt-12 text-center text-gray-500 text-sm pb-8"
                >
                    <p>© 2026 Braina. Tous droits réservés.</p>
                    <p className="mt-2">
                        Cette politique de confidentialité est conforme au RGPD et aux lois applicables sur la protection des données.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
