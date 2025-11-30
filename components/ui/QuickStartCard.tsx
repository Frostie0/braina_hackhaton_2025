import React from 'react';
import { Zap } from 'lucide-react';
import { colors } from '@/lib/colors';

interface QuickStartCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  comingSoon?: boolean;
}

export const QuickStartCard: React.FC<QuickStartCardProps> = ({ icon: Icon, title, description, comingSoon = false }) => (
  <div className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300 group ${comingSoon
    ? 'bg-white/5 border-white/5 opacity-60 cursor-not-allowed'
    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 cursor-pointer'
    }`}>
    {/* Badge "Bientôt disponible" */}
    {comingSoon && (
      <div className="absolute top-4 right-4 bg-white/10 text-gray-400 text-[10px] font-medium px-2 py-1 rounded-full uppercase tracking-wider">
        Bientôt
      </div>
    )}

    <div
      className={`w-10 h-10 rounded-lg flex items-center justify-center mb-5 transition-colors ${comingSoon ? 'bg-white/5 text-gray-500' : 'text-white'}`}
      style={{ backgroundColor: comingSoon ? undefined : colors.accent }}
    >
      <Icon className="w-5 h-5" />
    </div>

    <h3 className="text-white font-serif text-lg font-medium mb-2">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </div>
);