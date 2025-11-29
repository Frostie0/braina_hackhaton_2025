'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SubmitButtonProps {
    isLoading: boolean;
    loadingText?: string;
    children: React.ReactNode;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

/**
 * Composant SubmitButton réutilisable avec état de chargement
 */
export const SubmitButton: React.FC<SubmitButtonProps> = ({
    isLoading,
    loadingText = 'Chargement...',
    children,
    className = '',
    onClick,
}) => {
    const baseClasses = `w-full h-11 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-semibold shadow-lg shadow-purple-500/30 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`;

    return (
        <motion.button
            type="submit"
            disabled={isLoading}
            className={baseClasses}
            onClick={onClick}
            whileHover={!isLoading ? { scale: 1.02, boxShadow: '0 8px 15px rgba(168, 85, 247, 0.4)' } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
        >
            {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {loadingText}
                </span>
            ) : (
                children
            )}
        </motion.button>
    );
};

export default SubmitButton;
