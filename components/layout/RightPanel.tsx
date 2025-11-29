import React from 'react';
import { RightPanelCard } from '../ui/RightPanelCard';

export const RightPanel: React.FC = () => {
  return (
    // Sur grand écran (lg:), affiché comme barre latérale fixe (w-72, flex-col).
    // Sur petit écran, il est masqué ici (hidden), mais nous allons le rendre dans le main content
    // pour qu'il s'affiche en bas de la page sur mobile.
    <aside className="w-80 bg-black p-8 border-l border-white/10 flex-shrink-0 hidden lg:flex flex-col">
      <h2 className="text-lg font-serif font-medium text-white mb-6">Actions & Statut</h2>
      <RightPanelCard
        title="Rejoindre la compétition"
        description="Gagnez 100 XP pour rejoindre une ligue."
        emoji="🏆"
      />
      <RightPanelCard
        title="Inviter des amis"
        description="Apprendre ensemble, c'est doubler le plaisir !"
        emoji="✉️"
      />
      <RightPanelCard
        title="Feedback"
        description="Partagez vos idées pour nous aider à nous améliorer."
        emoji="💡"
      />
    </aside>
  );
};

// Composant pour affichage Mobile (sera utilisé dans app/page.tsx)
export const RightPanelMobile: React.FC = () => {
  return (
    <div className="lg:hidden mt-12 pt-8 border-t border-white/10">
      <h2 className="text-xl font-serif font-medium text-white mb-6">Actions & Statut</h2>
      <RightPanelCard
        title="Rejoindre la compétition"
        description="Gagnez 100 XP pour rejoindre une ligue."
        emoji="🏆"
      />
      <RightPanelCard
        title="Inviter des amis"
        description="Apprendre ensemble, c'est doubler le plaisir !"
        emoji="✉️"
      />
      <RightPanelCard
        title="Feedback"
        description="Partagez vos idées pour nous aider à nous améliorer."
        emoji="💡"
      />
    </div>
  );
}