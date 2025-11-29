import React from 'react';

interface RightPanelCardProps {
  title: string;
  description: string;
  emoji: string;
}

export const RightPanelCard: React.FC<RightPanelCardProps> = ({ title, description, emoji }) => (
  <div className="p-4 bg-gray-800 rounded-xl mb-4 shadow-md hover:bg-gray-700 transition-colors cursor-pointer border-l-4 border-transparent hover:border-purple-500">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-white font-bold text-base">{title}</h3>
      <span className="text-3xl">{emoji}</span>
    </div>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);