import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Configuration de base
// IMPORTANT: Changez cette URL pour pointer vers votre backend
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

// Créer l'instance Axios
const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 30000, // 30 secondes
  headers: {
    'Content-Type': 'application/json',
  },
  // Permet l'envoi/réception de cookies pour l'authentification
  withCredentials: true,
});

// Intercepteur de requête
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Ajouter le token d'authentification si disponible
    // Note: Le token n'est PAS ajouté pour les routes login/register
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    // Ne pas ajouter le token pour les endpoints d'authentification publics
    const isAuthEndpoint = config.url?.includes('/auth/login') || 
                          config.url?.includes('/auth/register');
    
    if (token && config.headers && !isAuthEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log pour le développement
    if (process.env.NODE_ENV === 'development') {
      console.log('📤 API Request:', config.method?.toUpperCase(), config.url);
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Intercepteur de réponse
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Gestion spéciale pour login/register : sauvegarder automatiquement les tokens
    const isLoginOrRegister = response.config.url?.includes('/auth/login') || 
                             response.config.url?.includes('/auth/register');
    
    if (isLoginOrRegister && typeof window !== 'undefined') {
      const responseData = response.data;
      
      // Support de différentes structures de réponse backend
      const tokens = responseData.data || responseData;
      
      if (tokens.access_token) {
        localStorage.setItem('access_token', tokens.access_token);
      }
      
      if (tokens.refresh_token) {
        localStorage.setItem('refresh_token', tokens.refresh_token);
      }
      
      // Sauvegarder l'utilisateur si présent
      if (tokens.user) {
        localStorage.setItem('user', JSON.stringify(tokens.user));
      }
    }

    // Log pour le développement
    if (process.env.NODE_ENV === 'development') {
      console.log('📥 API Response:', response.config.url, response.status);
    }
    
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Gestion de l'erreur 401 (Non autorisé)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tentative de rafraîchissement du token
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
        
        if (refreshToken) {
          const response = await axios.post(`${baseURL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          // Support de différentes structures de réponse
          const responseData = response.data;
          const access_token = responseData.access_token || responseData.data?.access_token;
          
          if (typeof window !== 'undefined' && access_token) {
            localStorage.setItem('access_token', access_token);
          }

          // Réessayer la requête originale avec le nouveau token
          if (originalRequest.headers && access_token) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Si le rafraîchissement échoue, rediriger vers la page de connexion
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    // Log des erreurs
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    return Promise.reject(error);
  }
);

export default axiosInstance;

