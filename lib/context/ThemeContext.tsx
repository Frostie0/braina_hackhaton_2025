'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { colors } from '@/lib/colors';

type ThemeMode = 'light' | 'dark';

// Explicitly define the Theme interface to avoid inference issues
export interface Theme {
    white: string;
    black: string;
    gray: string;
    gray2: string;
    accent: string;
    green: string;
    red: string;
    yellow: string;
    blue: string;
    blackbg: string;
    whitebg: string;
    textDark: string;
    textLight: string;
    transparent: string;
    // Dynamic properties
    background: string;
    cardBg: string;
    text: string;
    textSecondary: string;
}

interface ThemeContextType {
    theme: Theme;
    mode: ThemeMode;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Default to dark mode and force it
    const [mode, setMode] = useState<ThemeMode>('dark');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Force dark mode
        setMode('dark');
        document.documentElement.classList.add('dark');
    }, []);

    const toggleTheme = () => {
        // Disabled: Always keep dark mode
        setMode('dark');
        document.documentElement.classList.add('dark');
    };

    // Construct the active theme object based on the mode
    const activeTheme: Theme = {
        ...colors,
        // Overrides based on mode - ALWAYS DARK
        background: colors.blackbg,
        cardBg: colors.gray2,
        text: colors.textDark,
        textSecondary: colors.gray,
    };

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <ThemeContext.Provider value={{ theme: activeTheme, mode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
