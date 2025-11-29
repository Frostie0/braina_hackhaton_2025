import axiosInstance from '../axios.config';
import { API_ENDPOINTS } from '../endpoints';
import type { 
  LoginCredentials, 
  RegisterData, 
  AuthTokens, 
  User, 
  ApiResponse 
} from '../types';

/**
 * Service d'authentification
 * Gère toutes les opérations liées à l'authentification
 */
export const authService = {
  /**
   * Connexion utilisateur
   */
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    const response = await axiosInstance.post<ApiResponse<AuthTokens>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    
    // Sauvegarder les tokens
    if (typeof window !== 'undefined' && response.data.data) {
      localStorage.setItem('access_token', response.data.data.access_token);
      localStorage.setItem('refresh_token', response.data.data.refresh_token);
    }
    
    return response.data.data;
  },

  /**
   * Inscription utilisateur
   */
  async register(data: RegisterData): Promise<AuthTokens> {
    const response = await axiosInstance.post<ApiResponse<AuthTokens>>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    
    // Sauvegarder les tokens
    if (typeof window !== 'undefined' && response.data.data) {
      localStorage.setItem('access_token', response.data.data.access_token);
      localStorage.setItem('refresh_token', response.data.data.refresh_token);
    }
    
    return response.data.data;
  },

  /**
   * Déconnexion utilisateur
   */
  async logout(): Promise<void> {
    try {
      await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      // Nettoyer les tokens même si la requête échoue
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
  },

  /**
   * Récupérer les informations de l'utilisateur connecté
   */
  async getMe(): Promise<User> {
    const response = await axiosInstance.get<ApiResponse<User>>(
      API_ENDPOINTS.AUTH.ME
    );
    return response.data.data;
  },

  /**
   * Rafraîchir le token d'accès
   */
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await axiosInstance.post<ApiResponse<AuthTokens>>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refresh_token: refreshToken }
    );
    
    // Sauvegarder le nouveau token
    if (typeof window !== 'undefined' && response.data.data) {
      localStorage.setItem('access_token', response.data.data.access_token);
    }
    
    return response.data.data;
  },

  /**
   * Demander la réinitialisation du mot de passe
   */
  async forgotPassword(email: string): Promise<void> {
    await axiosInstance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  /**
   * Réinitialiser le mot de passe
   */
  async resetPassword(token: string, password: string, passwordConfirmation: string): Promise<void> {
    await axiosInstance.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      password,
      password_confirmation: passwordConfirmation,
    });
  },

  /**
   * Vérifier si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('access_token');
  },

  /**
   * Récupérer le token d'accès
   */
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  },
};

export default authService;
