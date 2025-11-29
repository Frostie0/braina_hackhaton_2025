import { Metadata } from 'next';
import FlashcardScreen from './flashcardScreen';

export const metadata: Metadata = {
    title: 'Flashcards - Braina',
    description: 'Révisez avec nos flashcards interactives.',
};

const MOCK_DATA = {
    flashcards: [
        {
            term: "Affranchis",
            definition: "Anciens esclaves qui ont été libérés.",
            memoryTip: "Affranchi = Libre"
        },
        {
            term: "Lotharingie",
            definition: "Royaume attribué à Lothaire Ier par le traité de Verdun en 843.",
            memoryTip: "Lotharingie vient de Lothaire"
        },
        {
            term: "Serfs",
            definition: "Paysans attachés à la terre de leur seigneur, non libres.",
            memoryTip: "Serf ressemble à Serviteur"
        }
    ]
};

export default function FlashcardPage() {
    return <FlashcardScreen quiz={MOCK_DATA} />;
}