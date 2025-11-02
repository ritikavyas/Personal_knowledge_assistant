import axios from 'axios';
import { ChatMessage } from '../types';

// Determine API base URL
// 1. Use VITE_API_URL if explicitly set (for Railway backend or custom deployments)
// 2. Otherwise, use localhost for local development
const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    // VITE_API_URL should point to Railway backend URL (e.g., https://your-app.railway.app/api)
    return import.meta.env.VITE_API_URL;
  }
  
  // Development: use localhost backend
  return 'http://localhost:3001/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 300000, // 5 minutes for document processing
});

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const documentAPI = {
  upload: async (files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('documents', file);
    });

    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/documents');
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  },
};

export const chatAPI = {
  sendMessage: async (message: string, conversationHistory: ChatMessage[] = []) => {
    const response = await api.post('/chat', {
      message,
      conversationHistory,
    });
    return response.data;
  },
};

export default api;
