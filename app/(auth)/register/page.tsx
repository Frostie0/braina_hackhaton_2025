import { Metadata } from 'next';
import RegisterClient from './RegisterClient';

export const metadata: Metadata = {
  title: 'Inscription',
  description: 'Créez un compte Braina gratuitement et commencez à apprendre plus intelligemment.',
};

export default function RegisterPage() {
  return <RegisterClient />;
}