'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Option {
    label: string;
    value: string;
    icon?: React.ReactNode;
}

interface OptionSelectorProps {
    title: string;
    options: Option[];
    selectedValue: string;
    onSelect: (value: string) => void;
    // Permet de choisir entre un affichage en ligne (par défaut) ou sur plusieurs lignes (wrap)
    layout?: 'inline' | 'wrap';
}

/**
 * Composant réutilisable pour sélectionner une option parmi un groupe (e.g., Difficulté, Format).
 */
export const OptionSelector: React.FC<OptionSelectorProps> = ({
    title,
    options,
    selectedValue,
    onSelect,
    layout = 'inline'
}) => {
    const containerClasses = layout === 'inline'
        ? "flex flex-wrap gap-2"
        : "grid grid-cols-2 sm:grid-cols-3 gap-3"; // Utilisation d'une grille pour les formats

    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
            <div className={containerClasses}>
                {options.map((option) => {
                    const isSelected = selectedValue === option.value;

                    const buttonClasses = isSelected
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30 border-purple-600'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700/70 border-gray-700';

                    return (
                        <motion.button
                            key={option.value}
                            type="button"
                            onClick={() => onSelect(option.value)}
                            className={`flex items-center justify-center py-2 px-4 rounded-xl border transition-all duration-200 text-sm font-medium whitespace-nowrap ${buttonClasses}`}
                            whileTap={{ scale: 0.95 }}
                        >
                            {option.icon && <span className="mr-2">{option.icon}</span>}
                            {option.label}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};