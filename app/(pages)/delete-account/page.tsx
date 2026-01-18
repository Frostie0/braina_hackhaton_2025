'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Mail, KeyRound, AlertTriangle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

import FormInput from '@/components/ui/FormInput';
import SubmitButton from '@/components/ui/SubmitButton';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

export default function DeleteAccountPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRequestDeletion = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Using direct axios call as requested
      // Assuming the endpoint structure based on standard conventions
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/auth/delete-account-request`, {
        email,
      });
      
      setStep('otp');
      setSuccess('Un code de vérification a été envoyé à votre adresse email.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la demande.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDeletion = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Using direct axios call as requested
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/auth/delete-account-confirm`, {
        email,
        otp,
      });

      setSuccess('Votre compte a été supprimé avec succès.');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Code invalide ou expiré.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <Link 
          href="/settings" 
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux paramètres
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-500" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
              Supprimer mon compte
            </h1>
            
            <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
              {step === 'email' 
                ? "Cette action est irréversible. Pour confirmer, veuillez entrer votre adresse email."
                : "Veuillez entrer le code de vérification reçu par email pour confirmer la suppression définitive."}
            </p>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-600 dark:text-green-400 flex items-center"
              >
                <CheckCircle2 className="w-4 h-4 mr-2 flex-shrink-0" />
                {success}
              </motion.div>
            )}

            {step === 'email' ? (
              <form onSubmit={handleRequestDeletion} className="space-y-6">
                <FormInput
                  id="email"
                  type="email"
                  label="Adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@email.com"
                  icon={Mail}
                  required
                />

                <SubmitButton
                  isLoading={isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
                >
                  Envoyer le code
                </SubmitButton>
              </form>
            ) : (
              <form onSubmit={handleConfirmDeletion} className="space-y-6">
                <FormInput
                  id="otp"
                  type="text"
                  label="Code de vérification"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  icon={KeyRound}
                  required
                  className="text-center tracking-widest text-lg"
                />

                <SubmitButton
                  isLoading={isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
                >
                  Confirmer la suppression
                </SubmitButton>

                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="w-full text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  Changer d'adresse email
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
