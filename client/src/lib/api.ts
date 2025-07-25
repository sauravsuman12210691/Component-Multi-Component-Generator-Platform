import axios from 'axios';

// ----------------------------
// Token Manager (if not yet defined globally)
// ----------------------------
export const tokenManager = {
  getToken: () => localStorage.getItem('token'),
  setToken: (token: string) => localStorage.setItem('token', token),
  removeToken: () => localStorage.removeItem('token'),
  isAuthenticated: () => !!localStorage.getItem('token'),
};

// ----------------------------
// Axios instance with auth
// ----------------------------
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Update if needed for deployment
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = tokenManager.getToken();
  if (token) {
    console.log(token)
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ----------------------------
// Types
// ----------------------------
export interface Session {
  _id: string;
  name: string;
  jsx: string;
  css: string;
  chatHistory: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface GenerateCodeRequest {
  prompt: string;
  sessionId: string;
  existingCode: {
    jsx: string;
    css: string;
  };
}

export interface GenerateCodeResponse {
  jsx: string;
  css: string;
  message: string;
}

// ----------------------------
// Session API
// ----------------------------
export const sessionAPI = {
  getSessions: async (): Promise<Session[]> => {
    const response = await axiosInstance.get('/session');
    return response.data;
  },

  getSession: async (id: string): Promise<Session> => {
    const response = await axiosInstance.get(`/session/${id}`);
    return response.data;
  },

  createSession: async (name?: string): Promise<Session> => {
    const response = await axiosInstance.post('/session', {
      name: name || `Session - ${new Date().toLocaleDateString()}`
    });
    return response.data;
  },

  updateSession: async (id: string, updates: Partial<Session>): Promise<Session> => {
    const response = await axiosInstance.patch(`/session/${id}`, updates);
    return response.data;
  },

  deleteSession: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/session/${id}`);
  },

  exportSession: async (id: string): Promise<Blob> => {
    const response = await axiosInstance.get(`/session/${id}/export`, {
      responseType: 'blob',
    });
    return response.data;
  }
};

// ----------------------------
// AI Generation API
// ----------------------------
export const aiAPI = {
  generateCode: async (request: GenerateCodeRequest): Promise<GenerateCodeResponse> => {
    const response = await axiosInstance.post('/ai/generate', request);
    return response.data;
  }
};
