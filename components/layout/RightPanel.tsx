import React from 'react';
import { RightPanelCard } from '../ui/RightPanelCard';

export const RightPanel: React.FC = () => {
  return (
    // Sur grand écran (lg:), affiché comme barre latérale fixe (w-72, flex-col).
    // Sur petit écran, il est masqué ici (hidden), mais nous allons le rendre dans le main content
    // pour qu'il s'affiche en bas de la page sur mobile.
    <aside className="w-72 bg-gray-800 p-6 border-l border-gray-700 flex-shrink-0 hidden lg:flex flex-col">
      <h2 className="text-lg font-bold text-gray-200 mb-4">Actions & Status</h2>
      <RightPanelCard
        title="Join the competition"
        description="Earn 100 XP to join a league."
        emoji="🏆"
      />
      <RightPanelCard
        title="Invite your friends"
        description="Learning together is double the progress and double the fun!"
        emoji="✉️"
      />
      <RightPanelCard
        title="Feedback"
        description="Share your thoughts to help us improve"
        emoji="💡"
      />
    </aside>
  );
};

// Composant pour affichage Mobile (sera utilisé dans app/page.tsx)
export const RightPanelMobile: React.FC = () => {
    return (
        <div className="lg:hidden mt-8 pt-6 border-t border-gray-700">
            <h2 className="text-xl font-bold text-gray-200 mb-4">Actions & Status</h2>
            <RightPanelCard
                title="Join the competition"
                description="Earn 100 XP to join a league."
                emoji="🏆"
            />
            <RightPanelCard
                title="Invite your friends"
                description="Learning together is double the progress and double the fun!"
                emoji="✉️"
            />
            <RightPanelCard
                title="Feedback"
                description="Share your thoughts to help us improve"
                emoji="💡"
            />
        </div>
    );
}