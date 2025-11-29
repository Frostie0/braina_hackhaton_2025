import { create } from 'zustand';
import { authService } from '../api/services';
import type { User, LoginCredentials, RegisterData } from '../api/types';

// Types pour les erreurs de validation
interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  general?: string;
}

// Interface du store auth
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  errors: ValidationErrors;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  validateEmail: (email: string) => boolean;
  validatePassword: (password: string) => boolean;
  validatePasswordMatch: (password: string, confirmPassword: string) => boolean;
  setError: (field: keyof ValidationErrors, message: string) => void;
  clearErrors: () => void;
  checkAuth: () => Promise<void>;
}

// Règles de validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;

/**
 * Store Zustand pour l'authentification
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  errors: {},

  /**
   * Connexion utilisateur
   */
  login: async (credentials: LoginCredentials) => {
    const { validateEmail, validatePassword, setError, clearErrors } = get();
    clearErrors();

    // Validation côté client
    let hasErrors = false;

    if (!validateEmail(credentials.email)) {
      setError('email', 'Email invalide');
      hasErrors = true;
    }

    if (!validatePassword(credentials.password)) {
      setError('password', 'Le mot de passe doit contenir au moins 8 caractères');
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    set({ isLoading: true });

    try {
      const tokens = await authService.login(credentials);
      const user = await authService.getMe();
      
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false,
        errors: {} 
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur de connexion';
      set({ 
        isLoading: false,
        errors: { general: errorMessage }
      });
      throw error;
    }
  },

  /**
   * Inscription utilisateur
   */
  register: async (data: RegisterData) => {
    const { validateEmail, validatePassword, validatePasswordMatch, setError, clearErrors } = get();
    clearErrors();

    // Validation côté client
    let hasErrors = false;

    if (!data.name || data.name.trim().length < 2) {
      setError('name', 'Le nom doit contenir au moins 2 caractères');
      hasErrors = true;
    }

    if (!validateEmail(data.email)) {
      setError('email', 'Email invalide');
      hasErrors = true;
    }

    if (!validatePassword(data.password)) {
      setError('password', 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre');
      hasErrors = true;
    }

    if (!validatePasswordMatch(data.password, data.password_confirmation)) {
      setError('confirmPassword', 'Les mots de passe ne correspondent pas');
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    set({ isLoading: true });

    try {
      const tokens = await authService.register(data);
      const user = await authService.getMe();
      
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false,
        errors: {} 
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur d\'inscription';
      const validationErrors = error.response?.data?.errors || {};
      
      set({ 
        isLoading: false,
        errors: { 
          general: errorMessage,
          ...validationErrors 
        }
      });
      throw error;
    }
  },

  /**
   * Déconnexion utilisateur
   */
  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        errors: {} 
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  /**
   * Valider l'email
   */
  validateEmail: (email: string): boolean => {
    return EMAIL_REGEX.test(email);
  },

  /**
   * Valider le mot de passe
   * Critères: Au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
   */
  validatePassword: (password: string): boolean => {
    if (password.length < PASSWORD_MIN_LENGTH) return false;
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    return hasUpperCase && hasLowerCase && hasNumber;
  },

  /**
   * Valider la correspondance des mots de passe
   */
  validatePasswordMatch: (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword && password.length > 0;
  },

  /**
   * Définir une erreur
   */
  setError: (field: keyof ValidationErrors, message: string) => {
    set((state) => ({
      errors: {
        ...state.errors,
        [field]: message,
      },
    }));
  },

  /**
   * Effacer toutes les erreurs
   */
  clearErrors: () => {
    set({ errors: {} });
  },

  /**
   * Vérifier l'authentification au chargement
   */
  checkAuth: async () => {
    if (!authService.isAuthenticated()) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    try {
      const user = await authService.getMe();
      set({ user, isAuthenticated: true });
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    }
  },
}));

export default useAuthStore;
