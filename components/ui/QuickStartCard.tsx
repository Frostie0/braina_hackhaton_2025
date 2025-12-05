import React from 'react';
import { Zap } from 'lucide-react';
import { useTheme } from '@/lib/context/ThemeContext';

interface QuickStartCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  comingSoon?: boolean;
}

export const QuickStartCard: React.FC<QuickStartCardProps> = ({ icon: Icon, title, description, comingSoon = false }) => {
  const { theme } = useTheme();
  return (
    <div className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300 group ${comingSoon
      ? 'opacity-60 cursor-not-allowed'
      : 'cursor-pointer'
      }`}
      style={{
        backgroundColor: theme.cardBg,
        borderColor: theme.gray2,
        // Hover effect needs to be handled via CSS or state if complex, but simple style prop works for static
      }}
    >
      {/* Badge "Bientôt disponible" */}
      {comingSoon && (
        <div className="absolute top-4 right-4 bg-white/10 text-gray-400 text-[10px] font-medium px-2 py-1 rounded-full uppercase tracking-wider">
          Bientôt
        </div>
      )}

      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center mb-5 transition-colors`}
        style={{ backgroundColor: comingSoon ? 'rgba(255,255,255,0.05)' : theme.accent, color: comingSoon ? theme.gray : theme.white }}
      >
        <Icon className="w-5 h-5" />
      </div>

      <h3 className="font-serif text-lg font-medium mb-2" style={{ color: theme.text }}>{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: theme.gray }}>{description}</p>
    </div>
  );
};