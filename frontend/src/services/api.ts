import axios from 'axios';
import { ChatMessage } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
