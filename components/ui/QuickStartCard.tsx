import React from 'react';
import { Zap } from 'lucide-react';

interface QuickStartCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

export const QuickStartCard: React.FC<QuickStartCardProps> = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col p-6 bg-gray-800 rounded-xl shadow-lg hover:bg-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-700/50">
    <div className="p-3 w-fit bg-purple-500/30 rounded-xl mb-4">
      <Icon className="w-7 h-7 text-purple-400" />
    </div>
    <h3 className="text-white font-extrabold text-xl mb-1">{title}</h3>
    <p className="text-gray-400 text-sm leading-snug">{description}</p>
  </div>
);