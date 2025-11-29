import axiosInstance from '../axios.config';
import { API_ENDPOINTS } from '../endpoints';
import type { 
  Quiz, 
  QuizSubmission, 
  QuizResult, 
  ApiResponse, 
  PaginatedResponse 
} from '../types';

/**
 * Service Quiz
 * Gère toutes les opérations liées aux quiz
 */
export const quizService = {
  /**
   * Récupérer la liste des quiz
   */
  async getQuizzes(page = 1, perPage = 10): Promise<PaginatedResponse<Quiz>> {
    const response = await axiosInstance.get<PaginatedResponse<Quiz>>(
      API_ENDPOINTS.QUIZ.LIST,
      { params: { page, per_page: perPage } }
    );
    return response.data;
  },

  /**
   * Récupérer un quiz par son ID
   */
  async getQuizById(id: string): Promise<Quiz> {
    const response = await axiosInstance.get<ApiResponse<Quiz>>(
      API_ENDPOINTS.QUIZ.GET(id)
    );
    return response.data.data;
  },

  /**
   * Créer un nouveau quiz
   */
  async createQuiz(quizData: Partial<Quiz>): Promise<Quiz> {
    const response = await axiosInstance.post<ApiResponse<Quiz>>(
      API_ENDPOINTS.QUIZ.CREATE,
      quizData
    );
    return response.data.data;
  },

  /**
   * Mettre à jour un quiz
   */
  async updateQuiz(id: string, quizData: Partial<Quiz>): Promise<Quiz> {
    const response = await axiosInstance.put<ApiResponse<Quiz>>(
      API_ENDPOINTS.QUIZ.UPDATE(id),
      quizData
    );
    return response.data.data;
  },

  /**
   * Supprimer un quiz
   */
  async deleteQuiz(id: string): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.QUIZ.DELETE(id));
  },

  /**
   * Démarrer un quiz
   */
  async startQuiz(id: string): Promise<{ session_id: string; started_at: string }> {
    const response = await axiosInstance.post<ApiResponse<{ session_id: string; started_at: string }>>(
      API_ENDPOINTS.QUIZ.START(id)
    );
    return response.data.data;
  },

  /**
   * Soumettre les réponses d'un quiz
   */
  async submitQuiz(submission: QuizSubmission): Promise<QuizResult> {
    const response = await axiosInstance.post<ApiResponse<QuizResult>>(
      API_ENDPOINTS.QUIZ.SUBMIT(submission.quiz_id),
      submission
    );
    return response.data.data;
  },

  /**
   * Récupérer les résultats d'un quiz
   */
  async getQuizResults(quizId: string): Promise<QuizResult[]> {
    const response = await axiosInstance.get<ApiResponse<QuizResult[]>>(
      API_ENDPOINTS.QUIZ.RESULTS(quizId)
    );
    return response.data.data;
  },

  /**
   * Récupérer mes quiz
   */
  async getMyQuizzes(): Promise<Quiz[]> {
    const response = await axiosInstance.get<ApiResponse<Quiz[]>>(
      API_ENDPOINTS.QUIZ.MY_QUIZ
    );
    return response.data.data;
  },

  /**
   * Récupérer les quiz récents
   */
  async getRecentQuizzes(): Promise<Quiz[]> {
    const response = await axiosInstance.get<ApiResponse<Quiz[]>>(
      API_ENDPOINTS.QUIZ.RECENT
    );
    return response.data.data;
  },
};

export default quizService;
