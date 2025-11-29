'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '../../../components/layout/AuthLayout';
import { FormInput } from '../../../components/ui/FormInput';
import { PasswordInput } from '../../../components/ui/PasswordInput';
import { SubmitButton } from '../../../components/ui/SubmitButton';
import { FormError } from '../../../components/ui/FormError';
import { useAuthStore } from '../../../lib/store/authStore';

/**
 * Page d'inscription accessible via /register
 */
export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, errors, clearErrors } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    try {
      await register({
        name: fullName,
        email,
        password,
        password_confirmation: confirmPassword,
      });
      router.push('/');
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-white text-3xl font-semibold tracking-tight mb-2">
          Créer un compte
        </h1>
        <p className="text-gray-400 text-sm text-center">
          Rejoignez la communauté BRAINA pour commencer à apprendre
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Message d'erreur général */}
        <FormError error={errors.general} />

        {/* Champ Nom Complet */}
        <FormInput
          id="full-name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Christan Denison Victor"
          label="Nom Complet"
          error={errors.name}
        />

        {/* Champ Email */}
        <FormInput
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="exemple@domaine.com"
          label="Email"
          error={errors.email}
        />

        {/* Champ Mot de passe */}
        <PasswordInput
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Mot de passe"
          error={errors.password}
        />

        {/* Aide mot de passe */}
        <p className="text-xs text-gray-500 -mt-2">
          Au moins 8 caractères, 1 majuscule, 1 minuscule et 1 chiffre
        </p>

        {/* Champ Confirmer Mot de passe */}
        <PasswordInput
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          label="Confirmer le mot de passe"
          error={errors.confirmPassword}
        />

        {/* Bouton de soumission */}
        <SubmitButton isLoading={isLoading} loadingText="Inscription..." className="mt-6">
          S'inscrire
        </SubmitButton>
      </form>

      {/* Lien Connexion */}
      <div className="mt-6 text-center text-sm text-gray-400">
        Déjà un compte ?{' '}
        <a href="/login" className="text-purple-400 hover:text-purple-300 transition duration-200">
          Connectez-vous
        </a>
      </div>
    </AuthLayout>
  );
}