import React from 'react';
import { Zap } from 'lucide-react';

interface QuickStartCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  comingSoon?: boolean;
}

export const QuickStartCard: React.FC<QuickStartCardProps> = ({ icon: Icon, title, description, comingSoon = false }) => (
  <div className={`relative flex flex-col p-6 bg-gray-800 rounded-xl shadow-lg transition-all duration-300 transform border border-gray-700/50 ${comingSoon ? 'opacity-75 cursor-not-allowed' : 'hover:bg-gray-700 hover:shadow-2xl hover:-translate-y-1 cursor-pointer'
    }`}>
    {/* Badge "Bientôt disponible" */}
    {comingSoon && (
      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
        Bientôt disponible
      </div>
    )}

    <div className="p-3 w-fit bg-purple-500/30 rounded-xl mb-4">
      <Icon className="w-7 h-7 text-purple-400" />
    </div>
    <h3 className="text-white font-extrabold text-xl mb-1">{title}</h3>
    <p className="text-gray-400 text-sm leading-snug">{description}</p>
  </div>
);