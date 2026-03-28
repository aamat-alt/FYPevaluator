import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Evaluate a new FYP idea
  evaluateIdea: async (idea, userId) => {
    try {
      const response = await api.post('/evaluate', {
        idea,
        user_id: userId,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's evaluation history
  getHistory: async (userId) => {
    try {
      const response = await api.get(`/history/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Find similar ideas
  findSimilarIdeas: async (idea) => {
    try {
      const response = await api.get('/ideas/similar', {
        params: { idea },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get global statistics
  getStats: async () => {
    try {
      const response = await api.get('/evaluations/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default api;
