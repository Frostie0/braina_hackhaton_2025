'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import QuizSlideCard from './QuizSlideCard';
import { Quiz, SortOrder, sortQuizzes } from '@/lib/data/quiz';

interface QuizFlatListProps {
    quizzes: Quiz[];
    title?: string;
}

const QuizFlatList: React.FC<QuizFlatListProps> = ({ quizzes, title = "Continuer l'apprentissage" }) => {
    const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Trier les quiz selon l'ordre sélectionné
    const sortedQuizzes = sortQuizzes(quizzes, sortOrder);

    // Options de tri
    const sortOptions = [
        { value: 'newest' as SortOrder, label: 'Plus récents' },
        { value: 'oldest' as SortOrder, label: 'Plus anciens' },
        { value: 'mastery-high' as SortOrder, label: 'Maîtrise élevée' },
        { value: 'mastery-low' as SortOrder, label: 'Maîtrise faible' },
    ];

    const handleSortChange = (newSort: SortOrder) => {
        setSortOrder(newSort);
        setIsDropdownOpen(false);
    };

    const currentSortLabel = sortOptions.find(opt => opt.value === sortOrder)?.label || 'Trier';

    // Vérifier si on peut défiler à gauche ou à droite
    const checkScrollability = () => {
        const container = scrollContainerRef.current;
        if (container) {
            setCanScrollLeft(container.scrollLeft > 0);
            setCanScrollRight(
                container.scrollLeft < container.scrollWidth - container.clientWidth - 10
            );
        }
    };

    // Fonction de défilement
    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = 400; // Défilement de 400px
            const newScrollLeft = direction === 'left'
                ? container.scrollLeft - scrollAmount
                : container.scrollLeft + scrollAmount;

            container.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    // Écouter les événements de scroll et de redimensionnement
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            checkScrollability();
            container.addEventListener('scroll', checkScrollability);
            window.addEventListener('resize', checkScrollability);

            return () => {
                container.removeEventListener('scroll', checkScrollability);
                window.removeEventListener('resize', checkScrollability);
            };
        }
    }, [sortedQuizzes]);

    return (
        <section className="mb-10">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">{title}</h2>

                <div className="flex items-center gap-2">
                    {/* Dropdown de tri */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm transition-colors"
                        >
                            <ArrowUpDown className="w-4 h-4" />
                            <span className="hidden sm:inline">{currentSortLabel}</span>
                        </button>

                        {/* Menu déroulant */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-xl border border-gray-600 z-10">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleSortChange(option.value)}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-600 transition-colors first:rounded-t-lg last:rounded-b-lg ${sortOrder === option.value ? 'bg-purple-600 text-white' : 'text-gray-300'
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bouton Ajouter */}
                    {/* <button className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors">
                        <Plus className="w-5 h-5" />
                    </button> */}
                </div>
            </div>

            {/* Conteneur avec boutons de navigation */}
            <div className="relative">
                {/* Bouton Gauche */}
                {canScrollLeft && (
                    <button
                        onClick={() => scroll('left')}
                        className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-gray-800/90 hover:bg-purple-600 text-white rounded-full shadow-lg transition-all duration-200 border border-gray-600"
                        aria-label="Défiler vers la gauche"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                )}

                {/* Bouton Droit */}
                {canScrollRight && (
                    <button
                        onClick={() => scroll('right')}
                        className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-gray-800/90 hover:bg-purple-600 text-white rounded-full shadow-lg transition-all duration-200 border border-gray-600"
                        aria-label="Défiler vers la droite"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                )}

                {/* Conteneur défilant horizontal */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto overflow-y-hidden pb-4 px-2 gap-5 scrollbar-hide snap-x snap-proximity"
                    style={{
                        WebkitOverflowScrolling: 'touch',
                        scrollBehavior: 'smooth'
                    }}
                >
                    {sortedQuizzes.map((quiz) => (
                        <div key={quiz.id} className="snap-start flex-shrink-0">
                            <QuizSlideCard
                                title={quiz.title}
                                date={quiz.date}
                                questions={quiz.questions}
                                masteryPercentage={quiz.masteryPercentage}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Styles pour cacher la barre de défilement et améliorer le défilement tactile */}
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                    touch-action: pan-x;  /* Améliore le défilement tactile horizontal */
                }
            `}</style>
        </section>
    );
};

export default QuizFlatList;
