import React from 'react';

interface RightPanelCardProps {
  title: string;
  description: string;
  emoji: string;
}

export const RightPanelCard: React.FC<RightPanelCardProps> = ({ title, description, emoji }) => (
  <div className="p-4 bg-white/5 rounded-xl mb-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-white font-serif font-medium text-base group-hover:text-purple-200 transition-colors">{title}</h3>
      <span className="text-2xl">{emoji}</span>
    </div>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </div>
);