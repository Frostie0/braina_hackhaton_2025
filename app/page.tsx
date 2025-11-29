import { Metadata } from 'next';
import Homepage from '@/components/pages/Homepage';

export const metadata: Metadata = {
  title: {
    absolute: 'Accueil | Braina',
  },
  description: 'Braina - L\'IA qui transforme vos notes en succès académique.',
};

export default function LandingPage() {
  return <Homepage />;
}