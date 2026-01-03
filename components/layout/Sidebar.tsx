'use client';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import serverIp from '@/lib/serverIp';
import { getUserId } from '@/lib/storage/userStorage';
import { Home, Zap, MessageSquare, Award, Folder, Plus, ChevronDown, Bell, Search, BookOpen, X, Globe, User, Settings, Upload, CreditCard, LifeBuoy, LogOut, TrendingUp, Sun, Moon } from 'lucide-react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import ApplicationLogo from '@/components/ui/ApplicationLogo';
import { useTheme } from '@/lib/context/ThemeContext';

// Interfaces
interface User {
    _id: string;
    userId: string;
    name: string;
    email: string;
    profile?: string;
}

interface NavItem {
    icon: React.ElementType;
    label: string;
}

const mainNavItems: NavItem[] = [
    { icon: Home, label: 'Accueil' },
    { icon: Zap, label: 'Générer' },
    { icon: TrendingUp, label: 'Analytics' },
];

const profileMenuItems: NavItem[] = [
    { icon: Settings, label: 'Paramètres' },
    { icon: Globe, label: 'Langue' },
    { icon: LogOut, label: 'Déconnexion' },
];

// Sous-composant pour un élément de la barre latérale
const SidebarItem: React.FC<{ icon: React.ElementType; label: string; isActive?: boolean; onClick?: () => void }> = ({ icon: Icon, label, isActive, onClick }) => {
    const { theme } = useTheme();
    return (
        <div
            onClick={onClick}
            className={`relative flex items-center px-4 py-2.5 mx-2 rounded-lg cursor-pointer transition-all duration-200 group ${
                isActive ? 'shadow-lg shadow-purple-500/10' : 'hover:bg-white/5'
            }`}
            style={{
                backgroundColor: isActive ? 'rgba(147, 51, 234, 0.15)' : 'transparent',
                color: isActive ? theme.white : theme.gray
            }}
        >
            {/* Bordure gauche pour le lien actif */}
            {isActive && (
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                    style={{ backgroundColor: theme.accent }}
                />
            )}
            <Icon
                className={`w-5 h-5 mr-3 transition-all duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}
                style={{ color: isActive ? theme.accent : theme.gray }}
            />
            <span className={`text-sm font-medium tracking-wide transition-colors ${isActive ? 'text-white' : ''}`}>
                {label}
            </span>
        </div>
    );
};

const ProfileMenuItem: React.FC<{ icon: React.ElementType; label: string; onClick?: () => void; isDanger?: boolean }> = ({ icon: Icon, label, onClick, isDanger }) => {
    const { theme } = useTheme();
    return (
        <div
            className={`flex items-center px-4 py-2.5 mx-1 my-0.5 rounded-lg cursor-pointer transition-all duration-200 group ${
                isDanger ? 'hover:bg-red-500/10' : 'hover:bg-white/10'
            }`}
            onClick={onClick}
        >
            <Icon className={`w-4 h-4 mr-3 transition-colors ${
                isDanger ? 'text-red-400 group-hover:text-red-300' : 'text-gray-400 group-hover:text-purple-400'
            }`} />
            <span className={`text-sm font-medium transition-colors ${
                isDanger ? 'text-red-400 group-hover:text-red-300' : 'text-gray-300 group-hover:text-white'
            }`}>{label}</span>
        </div>
    );
};

const dropdownVariants: Variants = {
    hidden: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.2 } },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
};

const ProfileDropdownMenu: React.FC<{ onNavigate: (path: string) => void; onLogout: () => void }> = ({ onNavigate, onLogout }) => {
    const { theme } = useTheme();

    const handleMenuClick = (label: string) => {
        switch (label) {
            case 'Paramètres':
                onNavigate('/settings');
                break;
            case 'Langue':
                onNavigate('/language');
                break;
            case 'Déconnexion':
                onLogout();
                break;
            default:
                break;
        }
    };

    return (
        <motion.div
            className="absolute bottom-[85px] left-2 right-2 border rounded-xl shadow-2xl overflow-hidden z-20 backdrop-blur-xl"
            style={{ backgroundColor: 'rgba(26, 26, 26, 0.95)', borderColor: theme.gray2 }}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
        >
            <div className="py-2">
                {profileMenuItems.map((item, index) => (
                    <React.Fragment key={item.label}>
                        <ProfileMenuItem
                            icon={item.icon}
                            label={item.label}
                            isDanger={item.label === 'Déconnexion'}
                            onClick={() => handleMenuClick(item.label)}
                        />
                        {index === profileMenuItems.length - 2 && (
                            <div className="h-px mx-2 my-1" style={{ backgroundColor: theme.gray2 }} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </motion.div>
    );
};

// Header de la Sidebar
const SidebarHeader: React.FC<{ onToggle?: () => void }> = ({ onToggle }) => {
    const { theme } = useTheme();
    return (
        <div className="relative">
            <div className="flex items-center justify-between px-6 py-6 border-b" style={{ borderColor: theme.gray2 }}>
                <ApplicationLogo size={52} />
                <button
                    onClick={onToggle}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 lg:hidden transition-all duration-200 hover:rotate-90"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
            {/* Gradient decoratif */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        </div>
    );
};

// Les variantes de Framer Motion pour la sidebar
const sidebarVariants: Variants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
};

interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    isDesktop: boolean;
}

// Composant UserProfileFooter
const UserProfileFooter: React.FC<{ onClick: () => void; isMenuOpen: boolean; user: User | null; isLoading: boolean }> = ({ onClick, isMenuOpen, user, isLoading }) => {
    const { theme } = useTheme();

    // Get initials
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="relative border-t pt-4" style={{ borderColor: theme.gray2 }}>
            {/* Gradient decoratif */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

            <div
                className="flex items-center p-3 mx-2 mb-4 rounded-xl hover:bg-white/5 cursor-pointer transition-all duration-200 group border border-transparent hover:border-white/10"
                onClick={onClick}
            >
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mr-3 shadow-lg shadow-purple-900/30 group-hover:shadow-purple-500/40 transition-shadow ring-2 ring-purple-500/20">
                    <span className="text-sm font-bold text-white">
                        {isLoading ? '...' : user ? getInitials(user.name) : 'G'}
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate group-hover:text-purple-200 transition-colors" style={{ color: theme.text }}>
                        {isLoading ? (
                            'Chargement...'
                        ) : user ? (
                            user.name
                        ) : (
                            'Invité'
                        )}
                    </p>
                    <p className="text-xs truncate font-medium" style={{ color: theme.gray }}>Compte & paramètres</p>
                </div>
                <motion.div
                    animate={{ rotate: isMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                    className="flex-shrink-0"
                >
                    <ChevronDown className="w-4 h-4 group-hover:text-purple-400 transition-colors" style={{ color: theme.gray }} />
                </motion.div>
            </div>
        </div>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen, isDesktop }) => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const { theme } = useTheme();

    // Helper function to check if a nav item is active
    const isNavItemActive = (label: string): boolean => {
        switch (label) {
            case 'Accueil':
                return pathname === '/dashboard';
            case 'Générer':
                return pathname === '/generate-quiz' || pathname === '/generate-exam';
            case 'Analytics':
                return pathname?.includes('/analytics') || false;
            case 'Rejoindre une partie':
                return pathname === '/multiplayer/join' || pathname?.includes('/waintroom') || false;
            default:
                return false;
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = getUserId();
                if (userId) {
                    const response = await axios.get(`${serverIp}/user/getUser/${userId}`);
                    if (response.status === 200) {
                        setUser(response.data.user);
                    }
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setIsLoadingUser(false);
            }
        };

        fetchUserData();
    }, []);

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(prev => !prev);
    };

    const handleNavigate = (path: string) => {
        router.push(path);
        setIsProfileMenuOpen(false);
        if (!isDesktop) setIsSidebarOpen(false);
    };

    const handleLogout = () => {
        // Clear storage
        localStorage.clear();
        sessionStorage.clear();

        // Redirect to homepage
        router.push('/');
        setIsProfileMenuOpen(false);
    };

    const sidebarContent = (
        <div className="flex flex-col h-full border-r" style={{ backgroundColor: theme.background, borderColor: theme.gray2 }}>
            {/* Header */}
            <SidebarHeader onToggle={() => setIsSidebarOpen(false)} />

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-2">
                <nav className="space-y-0.5">
                    {mainNavItems.map((item) => (
                        <SidebarItem
                            key={item.label}
                            icon={item.icon}
                            label={item.label}
                            isActive={isNavItemActive(item.label)}
                            onClick={() => {
                                if (item.label === 'Accueil') router.push('/dashboard');
                                else if (item.label === 'Générer') router.push('/generate-quiz');
                                else if (item.label === 'Analytics') router.push('/analytics');
                                if (!isDesktop) setIsSidebarOpen(false);
                            }}
                        />
                    ))}
                    {/* Lien pour rejoindre une partie multijoueur */}
                    <SidebarItem
                        icon={BookOpen}
                        label="Rejoindre une partie"
                        isActive={isNavItemActive('Rejoindre une partie')}
                        onClick={() => {
                            router.push('/multiplayer/join');
                            if (!isDesktop) setIsSidebarOpen(false);
                        }}
                    />
                </nav>
            </div>

            {/* Footer Profil */}
            <div className="relative mt-auto">

                <AnimatePresence>
                    {isProfileMenuOpen && <ProfileDropdownMenu onNavigate={handleNavigate} onLogout={handleLogout} />}
                </AnimatePresence>
                <UserProfileFooter
                    onClick={toggleProfileMenu}
                    isMenuOpen={isProfileMenuOpen}
                    user={user}
                    isLoading={isLoadingUser}
                />
            </div>
        </div>
    );

    if (isDesktop) {
        return (
            <aside className="w-64 flex-shrink-0 h-full">
                {sidebarContent}
            </aside>
        );
    }

    return (
        <motion.aside
            className="w-64 flex-shrink-0 h-full fixed top-0 left-0 z-50"
            initial="closed"
            animate={isSidebarOpen ? "open" : "closed"}
            variants={sidebarVariants}
        >
            {sidebarContent}
        </motion.aside>
    );
}